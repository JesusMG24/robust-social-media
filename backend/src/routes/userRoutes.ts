import { Router } from "express";
import { getUserPosts } from "../controllers/userControllers";

const router = Router();

router.get("/:userid/posts", getUserPosts);

export default router;
