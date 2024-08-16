import express from "express";
import restaurantsRouter from "./routes/restaurant";
import restaurantsFind from "./routes/restaurantsFind";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userAuth } from "./middlewares";
import { genToken } from "./controllers/genToken";
const port = 3000;
const app = express();
const dbUrl = process.env.DB_URL;
dotenv.config();
app.use(express.json());
//router 
app.use("/restaurants/find", restaurantsFind);
app.use("/restaurants", userAuth, restaurantsRouter);
app.get("/genToken",genToken)

if (!dbUrl) {
  throw new Error("DB_URL environment variable is not defined");
}

mongoose.connect(dbUrl).then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });

app.listen(port, () => {
  console.log("app listening on http://localhost:3000");
});
