import { Router } from "express";
import { getPosts, publishPost } from "../controllers/postControllers";
import { auth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getPosts);
router.post("/", auth, requireAuth, publishPost);

export default router;
