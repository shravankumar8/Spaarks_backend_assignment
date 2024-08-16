import { locationSchema } from "../utils/schema";
import { Restaurant } from "../database/dbconnect";
import { objectFormatter } from "../utils/functions";

export const nearby = async (req:any, res:any) => {
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
  } catch (err) {
    console.error("Error performing geospatial query:", err);
  }
};