import express from "express";
export const router = express.Router();
import { createRestaurant } from "../controllers/createRestaurant";
import { updateRestaurant } from "../controllers/updateRestaurant";
import { getRestaurant } from "../controllers/getRestaurant";
import { deleteRestaurant } from "../controllers/deleteRestaurant";



router.post("/", createRestaurant);//route  to create a restaurant
router.put("/:id", updateRestaurant);//route  to update the data of  a restaurant
router.get("/:id", getRestaurant);//route to get the restaurant data
router.delete("/:id", deleteRestaurant);//route to delete a restaurant



export default router;
