
import { z } from "zod";

// Signup
export const signupValidation = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name cannot exceed 100 characters"),

        email: z
            .string()
            .trim()
            .email("Please provide a valid email")
            .transform((email) => email.toLowerCase()),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),

        passwordConfirm: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

// Login
export const loginValidation = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email")
        .transform((email) => email.toLowerCase()),

    password: z.string().min(1, "Password is required"),
});

// Update profile
export const updateUserValidation = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name cannot exceed 100 characters")
            .optional(),

        email: z
            .string()
            .trim()
            .email("Please provide a valid email")
            .transform((email) => email.toLowerCase())
            .optional(),

        bio: z
            .string()
            .trim()
            .max(300, "Bio cannot exceed 300 characters")
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });

// Forgot password
export const forgotPasswordValidation = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email")
        .transform((email) => email.toLowerCase()),
});

// Reset password
export const resetPasswordValidation = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),

        passwordConfirm: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

// Update password while logged in
export const updatePasswordValidation = z
    .object({
        passwordCurrent: z.string().min(1, "Current password is required"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),

        passwordConfirm: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });
