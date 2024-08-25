import express from "express";
import restaurantsRouter from "./routes/restaurant";
import restaurantsFind from "./routes/restaurantsFind";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userAuth } from "./middlewares";
import { genToken } from "./controllers/genToken";
import swaggerDocument from "./docs/swagger.json";
import  { Response , Request  } from "express";
import swaggerUi from "swagger-ui-express";

// setting up the env file
dotenv.config();

// creating an app instance
const app = express();
const dbUrl = process.env.DB_URL;


// configure the app to use body parser 
app.use(express.json());
//router 



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/restaurants/find", restaurantsFind);
app.use("/restaurants", userAuth, restaurantsRouter);
app.get("/genToken",genToken)
app.get("/health",(req:Request,res:Response)=>{
  res.json({message:"server is running succesfully"})
})


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

  // irrelevant route
app.get("/*",(req:Request,res:Response)=>{
  try {
    res.status(404).json({message:"the route you requested does not exist"})
  } catch (error) {
    console.log(`error in GET /* route : ${error}`)
      res.status(401).json({message:"internal server error"})
  }
})
  // listening for requests
app.listen(process.env.port ||3000, () => {
  console.log("app listening on http://localhost:3000");
});
