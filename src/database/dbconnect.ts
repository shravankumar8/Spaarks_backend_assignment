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
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
    