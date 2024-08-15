import express from "express";
import { Restaurant } from "../database/dbconnect";
import { DeletedRestaurants } from "../database/dbconnect";
import restaurantsNearby from './restaurantsFind'
export const router = express.Router();
import { date, z } from "zod";

const gradeSchema = z.object({
  date: z.string(),
  grade: z.string(),
  score: z.number(),
});

const addressSchema = z.object({
  building: z.string(),
  coord: z.array(z.number()).length(2), // Example for coordinates (latitude, longitude)
  street: z.string(),
  zipcode: z.string(),
});

const restaurantSchema = z.object({
  //zod schema for input validation
  description:z.string().optional(),
  address: addressSchema,
  name: z.string().min(2).max(50),
  grades: z.array(gradeSchema).optional(),
  cuisine: z.string(),
  borough: z.string(),
});
const partialRestaurantSchema = restaurantSchema.partial();

router.post("/", async (req: any, res: any) => {
  // const { name, address, grades, cuisine, borough } = req.body;
  const inputData = req.body;
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
    console.log(id);

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
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const inputData = req.body;
  try {
    // Validate the input data using the partial schema
    const validationResult = partialRestaurantSchema.safeParse(inputData);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Restaurant data is invalid",
        errors: validationResult.error.errors, // Include validation errors if needed
      });
    }

    // Update the restaurant document
    const { id } = req.params; // Assuming id is from URL params or req.body
    const updateResult = await Restaurant.updateOne(
      { restaurant_id: id },
      { $set: inputData }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (updateResult.modifiedCount > 0) {
      return res.status(200).json({
        message: "Restaurant updated successfully",
      });
    }

    // If no documents were modified
    return res.json({
      message: "No changes made to the restaurant",
    });
  } catch (error) {
    res.status(505).json({ message: "internal server error" });
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

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
  let gradeScore:any[]=[]
  restaurantData.grades.map((item=>{
gradeScore.push(item.score);
  }))    
  console.log("highest raring",)

  let resObj = {
    name: restaurantData.name,
    address: restaurantData.address,
    borough: restaurantData.address,
    cuisine: restaurantData.cuisine,
    highestRating: Math.max(...gradeScore),
    lowestRating: Math.min(...gradeScore),
    averageRating : gradeScore.reduce((a, b) => a + b, 0) / gradeScore.length


  };
  res.json({ message: "data Fetched succesfully", restaurantData: resObj });
});

router.delete("/:id", async (req, res) => {
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
});

export default router;
