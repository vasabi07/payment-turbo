import express from "express";
import { transactionSchema } from "./zod";
import db from "@repo/db";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const client = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
client.on("error", (err) => {
  console.log("error in redis-client", err);
});

app.post("/transfer", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "token is missing." });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
  if (!decoded) {
    return res.json("error in authentication");
  }
  const senderId = decoded.userId;
  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    console.log("Zod validation errors:", result.error.errors); // Log the validation errors
    return res.status(400).json({
      message: "Invalid request object.",
      errors: result.error.errors,
    });
  }
  try {
    const { receiverId, amount } = result.data;
    const sender = await db.balance.findUnique({
      where: {
        userId: senderId,
      },
    });
    if (!sender) {
      return res.json("invalid senderId.");
    }
    if (amount > sender.amount) {
      return res.json("in-suffiecient balance.");
    }
    
    const p2p = await db.peerTransfer.create({
      data:{
       senderId: senderId,
       receiverId: parseInt(receiverId),
       amount: amount,
       status: "Processing",
       timestamp: new Date()
   }
   
   })
   const data = {
    senderId,
    receiverId,
    amount,
    p2pId: p2p.id
  };
    const response = await client.lPush("transfer", JSON.stringify(data));
    console.log("Number of elements in the list after push:", response); // Should be > 0
  
    console.log("pushed to the redis queue");
    res.status(200).json({message: "pushed to the redis queue",p2p});
  } catch (error) {
    console.log(error);
  }
});

const startRedis = async () => {
  try {
    await client.connect();
    console.log("connected to redis client.");
    app.listen(process.env.PORT, () => {
      console.log(`transaction server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startRedis();
