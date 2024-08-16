import express from "express";
const app = express();
const port = 3000;
import restaurantsRouter from "./routes/restaurant";
import restaurantsFind from "./routes/restaurantsFind";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userAuth } from "./middlewares";
import jwt from "jsonwebtoken";
dotenv.config();
app.use(express.json());
app.use("/restaurants/find", restaurantsFind);
app.use("/restaurants", userAuth, restaurantsRouter);

app.get("/genToken",(req,res)=>{
  const {userId,email}=req.body
  try {
    const token = jwt.sign({ userId, email }, "secret");
    res.json({"message":"token generated succesfully",token})
    console.log(token);
    
  } catch (error) {
    console.log("errpr",error)
  }
})

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL environment variable is not defined");
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });

app.listen(3000, () => {
  console.log("app listening on http://localhost:3000");
});
