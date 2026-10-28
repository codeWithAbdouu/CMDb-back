import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Build MongoDB connection string
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"));

// Server port
const port = process.env.PORT || 8000;

// Start Express server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});