import { z } from "zod";
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0).optional(),
  minimumDistance: z.number().min(0).optional(),
  maximumDistance: z.number().min(0).optional(),
});

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

export const restaurantSchema = z.object({
  //zod schema for input validation
  description: z.string().optional(),
  address: addressSchema,
  name: z.string().min(2).max(50),
  grades: z.array(gradeSchema).optional(),
  cuisine: z.string(),
  borough: z.string(),
});
export const partialRestaurantSchema = restaurantSchema.partial();
