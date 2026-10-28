import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
favoriteSchema.index(
    {user: 1, tmdbId: 1},
    {unique: true}
);

favoriteSchema.pre(/^find/, function () {
    this.select("-__v");
});

favoriteSchema.pre(/^find/, function () {
    this.populate({
        path: "user",
        select: "name email",
    })
})

export default mongoose.model("Favorite", favoriteSchema);