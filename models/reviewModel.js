import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user."],
        },

        tmdbId: {
            type: String,
            required: [true, "A TMDB ID is required."],
            min: [1, "Invalid TMDB ID."],
        },

        rating: {
            type: Number,
            required: [true, "Please provide a rating."],
            min: [1, "Rating must be at least 1."],
            max: [10, "Rating cannot be greater than 10."],
        },

        review: {
            type: String,
            required: [true, "Please write a review."],
            trim: true,
            minlength: [10, "Review must be at least 10 characters long."],
            maxlength: [1000, "Review cannot exceed 1000 characters."],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent the same user from reviewing the same movie twice
reviewSchema.index(
    { user: 1, tmdbId: 1 },
    { unique: true }
);

reviewSchema.pre(/^find/, function () {
    this.select("-__v");
});

reviewSchema.pre(/^find/, function () {
    this.populate({
        path: "user",
        select: "name email",
    })
})

export default mongoose.model("Review", reviewSchema);