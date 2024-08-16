import { Restaurant } from "../database/dbconnect";
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
    const resObj =  objectFormatter(obj);
    res.json({ message: "data Fetched succesfully", restaurantData: resObj });
} catch (error) {
  console.log(error)
  res.status(500).json({message:"internal server error"})
}

};
