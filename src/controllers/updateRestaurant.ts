import { Restaurant } from "../database/dbconnect";
import { partialRestaurantSchema } from "../utils/schema";

export const updateRestaurant= async (req:any, res:any) => {
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
}