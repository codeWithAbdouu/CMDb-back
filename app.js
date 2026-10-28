import express from "express";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ES Modules replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log requests in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Parse incoming JSON requests
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Custom middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware 👋");
    next();
});

// Add request timestamp
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174", "https://cmdbb.vercel.app/"],
        credentials: true,
    }),
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);

// Handle undefined routes (404)
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;