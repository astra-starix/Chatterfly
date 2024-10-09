import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password, confirmPassword, gender } = req.body;
  let validUser;
  validUser = await User.findOne({ email, username });
  if (validUser) {
    return next(errorHandler(400, "User already exists"));
  }
  if (password !== confirmPassword) {
    return next(errorHandler(400, "Password aren't matched"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const maleAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const femaleAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    gender,
    avatar: gender === "male" ? maleAvatar : femaleAvatar,
  });
  try {
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    await newUser.save();
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      _id: validUser._id,
      email: validUser.email,
      username: validUser.username,
      password: validUser.password,
      avatar: validUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      messgae: "Logged out Successfully",
    });
  } catch (error) {
    next(error);
  }
};
