import express from "express";
import db from "@repo/db";
import { SigninSchema, SignupSchema } from "./zod";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "./middlewares";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
const app = express();

dotenv.config()
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const result = SignupSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("valid inputs weren't provided");
  }
  try {
    const { name, email, phone, password,pin } = result.data;
    const hashedPassword =await bcrypt.hash(password,10)
    const data = await db.user.create({
      data: {
        email,
        name,
        phone,
        password:hashedPassword,
        pin
      },
    });
    const balance = await db.balance.create({
      data: {
        userId: data.id,
        amount: 10000,
      },
    });
    res
      .status(201)
      .json({ message: "user created succesfully", data, balance });
  } catch (error) {
    console.log(error);
    res.status(500).json("error while creating user.");
  }
});

app.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    return res.json("valid inputs weren't provided");
  }
  try {
    const { phone, password } = result.data;
    const user = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if(!user){
      return
    }
    const passwordMatch =await bcrypt.compare(password,user.password)
    if(!passwordMatch){
      return res.json("password doesn't match")
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json("succesfully signed in");
  } catch (error) {
    console.log(error);
  }
});
app.use(AuthMiddleware);
app.get("/personalInfo", async (req, res) => {
  try {
    //@ts-ignore
    const user = req.user;
    if (!user) {
      return res.json("unAuthorized user.");
    }

    const balance = await db.balance.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!balance) {
      return;
    }
    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: balance.amount,
      pin: user.pin
    };
    res.status(200).json({ message: "logged in user's info", payload });
  } catch (error) {
    console.log(error);
  }
});

app.get("/users/allusers", async (req, res) => {
  try {


    const payload = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        Balance: true,
      },
    });
    res.status(200).json({
      message: "here is the list of users available in the db.",
      payload,
    });
  } catch (error) {
    console.log(error);
    res.json("unauthorised access.");
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.json("cant find the user");
    }
    const payload = {
      id: user?.id,
      name: user?.name,
      phone: user.phone,
    };
    res
      .status(200)
      .json({ message: "this should go to page with transfer form", payload });
  } catch (error) {}
});

app.get("/history", async (req, res) => {
  //@ts-ignore
  const user = req.user;
  try {
    const payload = await db.peerTransfer.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
    });
    return res.json({ message: "transaction history", payload });
  } catch (error) {
    console.log("error in getting transaction history", error);

    return res.json("error in getting transaction history");
  }
});
app.listen(process.env.PORT, () => {
  console.log(`primary backend is listening on port ${process.env.PORT}`);
});
