import express from "express";
import { nearby } from "../controllers/nearby";
import { between } from "../controllers/between";
export const router = express.Router();

// Initialize the router
//Get restaurant based on Latitude and longitude with specified radius, nearest to farthest
router.get("/nearby", nearby);
//.Get request based on Latitude and longitude with specified radius range
router.get("/between", between );
export default router;
