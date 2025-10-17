import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import pool from "../db/pool";

const SESSION_TTL_HOURS: number = Number(process.env.SESSION_TTL_HOURS) || 24;

const COOKIE_NAME = "sid";
const COOKIE_OPTIONS = {
  httpOnly: true as const,
  path: "/" as const,
  sameSite: (process.env.COOKIE_SAMESITE as "lax" | "strict" | "none") || "lax",
  secure: String(process.env.COOKIE_SECURE || "").toLowerCase() === "true",
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ||
  `${SESSION_TTL_HOURS}h`;

export const Register = async (req: Request, res: Response) => {
  try {
    const username: string = (req.body?.username || "").trim().slice(0, 32);
    const password: string = req.body?.password || "";

    // Check if user already in database
    const exists = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );
    if (exists.rowCount) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into database
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, passwordHash],
    );
    return res.status(201).json({ message: "Register done", username });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Register failed:", error);
    res.status(500).json({ error: "Register failed" });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const username: string = (req.body?.username || "").trim().slice(0, 32);
    const password: string = req.body?.password || "";

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Find user
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username],
    );
    const user = result.rows[0];

    // Verify password
    const valid =
      user && user.password_hash
        ? await bcrypt.compare(password, user.password_hash)
        : false;

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { sub: String(user.id), username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // httpOnly cookie with the JWT
    res.cookie(COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + SESSION_TTL_HOURS * 3600_000),
    });

    // Return safe user fields only
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const Logout = async (_req: Request, res: Response) => {
  try {
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Logout failed:", error);
  } finally {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.status(204).end();
  }
};
