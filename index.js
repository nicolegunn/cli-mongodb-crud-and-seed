import dotenv from "dotenv";
import mongoose from "mongoose";
import Item from "./models/items.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const seedDataPath = path.resolve(__dirname, "data", "seedData.json");
const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.error("Database Connection Error:", err);
  });

const closeDB = () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log("Connection Successfully Closed");
    })
    .catch((err) => {
      console.error("Error On Closing:", err);
    });
};

// Add Single Item
const addItem = (item) => {
  Item.create(item)
    .then((newItem) => {
      if (newItem) {
        console.info("New Item Added:", newItem);
      } else {
        console.warn("Warning: Item was not added. Please check the input.");
      }
      closeDB();
    })
    .catch((err) => {
      console.error("Error Adding Item:", err.message);
      closeDB();
    });
};

// Find Item/s
const findItems = (item_name) => {
  // Make case insensitive
  const search = new RegExp(item_name, "i");
  Item.find({
    $or: [{ category: search }, { title: search }, { description: search }],
  })
    .then((items) => {
      console.info(items);
      console.info(`${items.length} matches`);
      closeDB();
    })
    .catch((err) => {
      console.error("Error Finding Items:", err.message);
      closeDB();
    });
};

// Update Item
const updateItem = (_id, item) => {
  Item.updateOne({ _id }, item)
    .then((result) => {
      if (result.nModified > 0) {
        console.info("Item Updated");
      } else {
        console.warn("No items were updated. Please check the item ID.");
      }
      closeDB();
    })
    .catch((err) => {
      console.error("Error Updating Item:", err.message);
      closeDB();
    });
};

//Remove Item
const removeItem = (_id) => {
  Item.deleteOne({ _id })
    .then((result) => {
      if (result.deletedCount > 0) {
        console.info("Item Removed");
      } else {
        console.warn("No items were removed. Please check the item ID.");
      }
      closeDB();
    })
    .catch((err) => {
      console.error("Error Removing Item:", err.message);
      closeDB();
    });
};

//List Items
const listItems = () => {
  Item.find()
    .then((items) => {
      console.info(items);
      console.info(`${items.length} items`);
      closeDB();
    })
    .catch((err) => {
      console.error("Error Listing Items:", err);
      closeDB();
    });
};

const seedItems = () => {
  Item.insertMany(seedData)
    .then((items) => {
      console.info(`${items.length} items added`);
      closeDB();
    })
    .catch((err) => {
      console.error("Error Seeding Items:", err.message);
      closeDB();
    });
};

// Export All Methods
export { addItem, findItems, updateItem, removeItem, listItems, seedItems };
