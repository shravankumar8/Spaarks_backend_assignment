import express from "express";
import { Restaurant } from "../database/dbconnect";
import { z } from "zod";

// Initialize the router
export const router = express.Router();

// Define the schema for validating the location data
const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0).optional(), 
  minimumDistance: z.number().min(0).optional(), 
  maximumDistance: z.number().min(0).optional(), 
});

router.use(express.json()); // Middleware to parse JSON bodies
// a function which formatt output restaurantData maps through and calculates the average , grades etc
function objectFormatter(results: any) {
  let processedRecords: any[] = [];
  results.map((item: any) => {
    let gradeScore: any[] = [];

    item.grades.map((item: any) => {
      gradeScore.push(item.score);
    });
    let obj = {
      name: item.name,
      address: item.address,
      borough: item.borough,
      cuisine: item.cuisine,
      highestRating: Math.max(...gradeScore),
      lowestRating: Math.min(...gradeScore),
      totalRating: gradeScore.length,
      averageRating: gradeScore.reduce((a, b) => a + b, 0) / gradeScore.length,
    };
    processedRecords.push(obj);
  });
  return processedRecords;
}
// nearby route returns the restaurants near by a specifix point 
router.get("/nearby", async (req, res) => {
  const data = locationSchema.parse(req.body);
  const { latitude, longitude, radius } = data;
  // Validate request body
  try {
    // fetching using geospatial queries
    const results = await Restaurant.find(
      {
        "address.coord": {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Longitude first, then Latitude
            },
            $maxDistance: radius, // 5 miles in meters
          },
        },
      },
      { _id: 0, restaurant_id: 0 }
    );
    // responses to user if no data is found
    if (results.length < 1) {
      res.json({
        message: "reataurants not found",
        restaurantData: results,
      });
    }
  //  formats the output
    const processedRecords = objectFormatter(results);

    res.json({
      message: "lost of restauran",
      restaurantData: processedRecords,
    });
    console.log(results);
  } catch (err) {
    console.error("Error performing geospatial query:", err);
  }
});

router.get("/between", async (req, res) => {
  // The logic is straightforward:
  // 1. First, we fetch all records within the maximum radius (maxRadius).
  // 2. Then, we fetch all records within the minimum radius (minRadius).
  // 3. Finally, we subtract the minRadius records from the maxRadius records
  //    using the `filter` and `some` functions, which gives us the records
  //    that fall within the desired range (between minRadius and maxRadius).

  const data = locationSchema.parse(req.body);

  const { latitude, longitude, minimumDistance, maximumDistance } = data;
  try {
    const maxRadiusData = await Restaurant.find(
      {
        "address.coord": {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Longitude first, then Latitude
            },
            $maxDistance: maximumDistance, // 5 miles in meters
          },
        },
      },
      { _id: 0 }
    );
    const minRadiusData = await Restaurant.find(
      {
        "address.coord": {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Longitude first, then Latitude
            },
            $maxDistance: minimumDistance, // 5 miles in meters
          },
        },
      },
      { _id: 0 }
    );
    // response if no restaurants are found
    if (maxRadiusData.length < 1) {
      res.json({
        message: "reataurants not found",
        restaurantData: maxRadiusData,
      });
      return;
    }
// the main subractions happens here from minData is removed from maxData
    const finalArray = maxRadiusData.filter(
      (obj1) =>
        !minRadiusData.some((obj2) => obj2.restaurant_id === obj1.restaurant_id)
    );

    const processedRecords = objectFormatter(finalArray);

    res.json({
      message: "records from range",
      restaurantData: processedRecords,
    });
  } catch (error: any) {
    console.log("error", error);

    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
