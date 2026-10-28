import {readFileSync} from "fs";
import {fileURLToPath} from "url";
import {dirname} from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import Favorite from "../models/favoriteModel.js";
import Watchlist from "../models/watchlistModel.js";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({path: "./config.env"});

// Database connection
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(async () => {
    console.log("DB connection successful!");
});

// READ JSON FILES

const categories = JSON.parse(
    readFileSync(`${__dirname}/data/categories.json`, "utf-8"),
);

const orders = JSON.parse(
    readFileSync(`${__dirname}/data/orders.json`, "utf-8"),
);

const products = JSON.parse(
    readFileSync(`${__dirname}/data/products.json`, "utf-8"),
);

const reviews = JSON.parse(
    readFileSync(`${__dirname}/data/reviews.json`, "utf-8"),
);

const users = JSON.parse(
    readFileSync(`${__dirname}/data/users.json`, "utf-8"),
);

// IMPORT DATA

const importData = async () => {
    try {

        await User.create(users);

        await Review.create(reviews);

        console.log("✅ Data successfully imported!");
    } catch (err) {
        console.error("❌ Import Error:", err);
    }

    process.exit();
};

// DELETE DATA

const deleteData = async () => {
    try {
        await Review.deleteMany();

        await User.deleteMany();

        console.log("🗑️ Data successfully deleted!");
    } catch (err) {
        console.error("❌ Delete Error:", err);
    }

    process.exit();
};

// COMMANDS

if (process.argv[2] === "--import") {
    importData();
}

if (process.argv[2] === "--delete") {
    deleteData();
}