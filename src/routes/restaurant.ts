import express from "express";
import Restaurant from "../database/dbconnect";
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
  address: addressSchema, // If you want a single address object, use `addressSchema`
  name: z.string(),
  grades: z.array(gradeSchema).optional(), // Optional field if no grades are provided
  cuisine: z.string(),
  borough: z.string(),
});

router.post("/", async (req: any, res: any) => {
  const { name, address, grades, cuisine, borough } = req.body;
  const inputData = req.body;
  const validationResult = restaurantSchema.safeParse(inputData);
  if (validationResult.success) {
    // if the user sent paload is valid storing logic is performed here
    const validData = validationResult.data;
    const id = Math.floor(Math.random() * 99999999);
    req.body.restaurant_id = id;
    console.log(id);

    const newRes = await Restaurant.create(req.body);
    await newRes.save();
    res.status(200).json({
      message: "Restaurant data is valid",
      data: validData,
      id: newRes._id,
    });
  } else {
    // If validation fails
    const errors = validationResult.error.format();
    res.status(400).json({ message: "Invalid input", errors });
  }
});
router.get("/get", () => {});
router.get("/get", () => {});
router.get("/get", () => {});
export default router;
