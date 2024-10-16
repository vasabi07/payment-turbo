
import jwt from "jsonwebtoken";
import db from "@repo/db"
import express from "express"
import dotenv from "dotenv"
dotenv.config()
export const AuthMiddleware = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json("No token provided");
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  
      if (!decoded) {
        return res.status(401).json("Unauthorized: Invalid token");
      }
  
      const user = await db.user.findUnique({
        where: {
          //@ts-ignore
          id: decoded.userId,
        },
      });
  
      if (!user) {
        return res.status(404).json("User doesn't exist");
      }
  
      //@ts-ignore
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json("Token expired");
      }
      return res.status(401).json("Unauthorized: Invalid token");
    }
  };