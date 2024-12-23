import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.routes.js";
import messageRoute from "./routes/messages.routes.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());
app.use(cookieParser);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
