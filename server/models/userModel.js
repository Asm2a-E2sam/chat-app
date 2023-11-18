const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "User Must Have name"],
            minLength: 3,
            maxLength: 60,
            unique:true
        },
        email: {
            type: String,
            required: [true, "User Must have Email"],
            validate: [validator.isEmail, "Please Provide A valid Email"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            minLength: 6,
            required: [true, "password"],
        }
    },
    {
        timestamps: true,
        collection: "users",
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model("users", userSchema);
module.exports = User;
