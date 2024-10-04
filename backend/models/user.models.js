import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
