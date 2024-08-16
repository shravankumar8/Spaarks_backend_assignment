  import mongoose from "mongoose";

  const gradeSchema = new mongoose.Schema(
    {
      date: {
        type: Date,
        required: true,
      },
      grade: {
        type: String,
        required: false,
      },
      score: {
        type: Number,
        required: true,
      },
    },
    { _id: false }
  );

  const addressSchema = new mongoose.Schema({
    building: {
      type: String,
      required: true,
    },
    coord: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
  },{_id:false});

  const restaurantSchema = new mongoose.Schema({
    restaurant_id: {
  type: String,
      required: true,
      unique: true, // Ensure this field is unique
    },
    description:{
      type:String
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    grades: {
      type: [gradeSchema],
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    borough: {
      type: String,
      required: true,
    },
  },{ versionKey: false });

  const Restaurant = mongoose.model("Restaurant", restaurantSchema);
  const DeletedRestaurants = mongoose.model("DeletedRestaurants", restaurantSchema);

  export  { DeletedRestaurants ,Restaurant};
      