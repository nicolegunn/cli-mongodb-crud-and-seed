import mongoose from "mongoose";
import { auctionCategories } from "../constants.js";

const itemSchema = mongoose.Schema({
  category: { type: String, enum: auctionCategories },
  title: { type: String },
  description: { type: String },
  start_price: { type: Number, min: [0, "Start price must be a positive number"] },
  reserve_price: { type: Number, min: [0, "Reserve Price must be a positive number"] },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
