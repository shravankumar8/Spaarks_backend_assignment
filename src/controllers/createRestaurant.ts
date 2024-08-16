import { Restaurant } from "../database/dbconnect";
import { restaurantSchema } from "../utils/schema";

export const createRestaurant = async (req: any, res: any) => {
  const inputData = req.body;
  // const { name, address, grades, cuisine, borough } = req.body;
  try {
    const validationResult = restaurantSchema.safeParse(inputData);
      if (validationResult.success) {
        // if the user sent paload is valid storing logic is performed here
        const validData = validationResult.data;
        let id = Math.floor(Math.random() * 9999999999);
        const existUser = await Restaurant.findOne({ restaurant_id: id });
        if (existUser) {
          id = Math.floor(Math.random() * 9999999999);
        }
        req.body.restaurant_id = id;

        const newRes = await Restaurant.create(req.body);
        await newRes.save();
        res.status(200).json({
          message: "Restaurant data is valid",
          data: validData,
          id: newRes.restaurant_id,
        });
      } else {
        // If validation fails
        const errors = validationResult.error.format();
        res.status(400).json({ message: "Invalid input", errors });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "internal server error"});
      
  }

};