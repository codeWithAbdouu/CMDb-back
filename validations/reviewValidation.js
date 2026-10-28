import { z } from "zod";

export const createReviewValidation = z.object({
    tmdbId: z.string().trim().min(1, "TMDB ID is required"),

    rating: z.number()
        .min(1, "Rating must be at least 1")
        .max(10, "Rating cannot exceed 10"),

    review: z.string()
        .trim()
        .min(10, "Review must be at least 10 characters long")
        .max(1000, "Review cannot exceed 1000 characters"),
});

export const updateReviewValidation = z.object({
    tmdbId: z.string().trim().min(1, "TMDB ID is required").optional(),

    rating: z.number()
        .min(1, "Rating must be at least 1")
        .max(10, "Rating cannot exceed 10")
        .optional(),

    review: z.string()
        .trim()
        .min(10, "Review must be at least 10 characters long")
        .max(1000, "Review cannot exceed 1000 characters")
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);