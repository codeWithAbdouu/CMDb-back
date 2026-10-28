import { z } from "zod";

export const createFavoriteValidation = z.object({
    tmdbId: z.string().trim().min(1, "TMDB ID is required"),
});

export const updateFavoriteValidation = z.object({
    tmdbId: z.string().trim().min(1, "TMDB ID is required"),
}).partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
);