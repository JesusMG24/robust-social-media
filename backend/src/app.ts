import express from "express";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { auth } from "./middleware/auth";

const app = express();
app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Express with TypeScript");
});

// One protected test route
const requireAuth: express.RequestHandler = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
};

app.get("/api/protected", auth, requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
