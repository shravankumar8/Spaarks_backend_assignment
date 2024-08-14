import express from "express";
const app = express();
const port = 3000;
import restaurantsRouter from "./routes/restaurant";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
app.use(express.json());
app.use("/restaurants", restaurantsRouter);


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
    process.exit(1); // Exit the process with a failure code
  });

app.listen(3000, () => {
  console.log("app listening on http://localhost:3000");
});
