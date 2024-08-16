import { Restaurant } from "../database/dbconnect";
import { DeletedRestaurants } from "../database/dbconnect";

export const deleteRestaurant =async (req:any, res:any) => {
  const id = req.params.id;
  try {
    // Fetch the restaurant data by restaurant_id
    const restaurantData = await Restaurant.findOne({ restaurant_id: id });

    if (restaurantData) {
      // Create and save a new entry in DeletedRestaurants
      try {
        const deletedRestaurant = await DeletedRestaurants.create(
          restaurantData.toObject()
        );
      } catch (error) {
        console.error(error);
      }

      const deleteResult = await Restaurant.deleteOne({ restaurant_id: id });

      res.json({ message: "restaurant deleted successfully", deleteResult });
    } else {
      res.status(404).json({ message: "restaurant not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
