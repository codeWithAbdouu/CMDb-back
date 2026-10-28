import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tmdbId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {createdAt: true, updatedAt: false},
    }
);

// Prevent the same user from adding the same title twice
watchlistSchema.index(
    {user: 1, tmdbId: 1},
    {unique: true}
);

watchlistSchema.pre(/^find/, function () {
    this.select("-__v");
});

watchlistSchema.pre(/^find/, function () {
    this.populate({
        path: "user",
        select: "name email",
    })
})

export default mongoose.model("Watchlist", watchlistSchema);
