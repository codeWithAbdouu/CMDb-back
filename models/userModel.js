import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        wishlist: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Watchlist",
            },
        ],

        favorites: [

            {
                type: mongoose.Schema.ObjectId,
                ref: "Favorite",
            },
        ],

        Reviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Review",
            },
        ],

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: 'password are not the same'
            }
        },

        passwordChangedAt: Date,

        passwordResetToken: String,

        passwordResetExpires: Date,

        isActive: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Save password change date
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return;

    this.passwordChangedAt = Date.now() - 1000;
});

// Hide inactive users
userSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}});
});

// Compare passwords
userSchema.methods.comparePassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

export default mongoose.model("User", userSchema);
