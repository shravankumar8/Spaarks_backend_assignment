import { locationSchema } from "../utils/schema";
import { Restaurant } from "../database/dbschema";
import { objectFormatter } from "../utils/functions";
import { Request, Response } from "express";
import { z } from "zod";
export const nearby = async (req:Request, res:Response) => {
  try {
    // Validate request body with Zod schema
    const data = locationSchema.parse(req.body);

    const { latitude, longitude, radius } = data;
    // Fetching using geospatial queries
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
    // response incase where no restaurants are found
    if (results.length < 1) {
      return res.json({
        message: "Restaurants not in the given location",
        restaurantData: results,
      });
    }
    //  formats the output
    const processedRecords = objectFormatter(results);

    res.json({
      message: "Succesfuly Fetched the restaurants in the given location",
      restaurantData: processedRecords,
    });
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return res.status(400).json({
        message: "Input validation error",
        errors: error.errors, // Provide detailed validation errors
      });
    }

    console.error(`Error in getNearby method: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};