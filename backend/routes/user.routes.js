import express from "express";
import { isAuthenticate } from "../middleware/verifyToken.js";
import { getUserForSidebar } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/", isAuthenticate, getUserForSidebar);
export default router;
