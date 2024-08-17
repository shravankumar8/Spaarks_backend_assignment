import { z } from "zod";
import { Restaurant } from "../database/dbschema";
import { objectFormatter } from "../utils/functions";
import { locationSchema } from "../utils/schema";

export const between =async (req:any, res:any) => {
  // The logic is straightforward:
  // 1. First, we fetch all records within the maximum radius (maxRadius).
  // 2. Then, we fetch all records within the minimum radius (minRadius).
  // 3. Finally, we subtract the minRadius records from the maxRadius records
  //    using the `filter` and `some` functions, which gives us the records
  //    that fall within the desired range (between minRadius and maxRadius).

  
  try {
    const data = locationSchema.parse(req.body);
    const { latitude, longitude, minimumDistance, maximumDistance } = data;
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
              coordinates: [longitude, latitude],
            },
            $maxDistance: minimumDistance,
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
}