import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, password, confirmPassword, gender } = req.body;
  let validUser
  validUser = await User.findOne({email});
  if (validUser) {
    return res.status(400).json({
      success: false,
      message: "User already exist",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Password doesn't match",
    });
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
    res.cookie("access_token", token, {httpOnly: true}).status(200).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
    });
  } catch (error) {
    console.log("Error");
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
export const login = (req, res) => {};
export const logout = (req, res) => {};
