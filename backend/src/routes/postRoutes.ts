import { Router } from "express";
import {
  getPosts,
  publishPost,
  updatePost,
  deletePost,
} from "../controllers/postControllers";
import { auth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getPosts);
router.post("/", auth, requireAuth, publishPost);
router.put("/", auth, requireAuth, updatePost);
router.delete("/:id", auth, requireAuth, deletePost);

export default router;
