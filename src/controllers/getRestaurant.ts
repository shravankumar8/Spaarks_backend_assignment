import { Restaurant } from "../database/dbschema";
import { objectFormatter } from "../utils/functions";

export const getRestaurant=async (req:any, res:any) => {
  const { id } = req.params;
try {
  const restaurantData = await Restaurant.findOne(
    {
      restaurant_id: id,
    },
    { _id: 0, restaurant_id: 0 }
  );
  if (!restaurantData) {
    res.json({ message: "restaurant not found" });
    return;
  }
  let obj = [];
  obj.push(restaurantData);
  const resObj = objectFormatter(obj);
  res.json({ message: "data Fetched succesfully", restaurantData: resObj });
} catch (error) {
  console.error(`Error in GET restaurant  method: ${error}`);
  // throw error; // Propagate the error to be handled in the route
  return {
    status: 500,
    success: false,
    message: "Internal server error",
  };
}

};
