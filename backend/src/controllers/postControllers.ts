import { Request, Response } from "express";
import pool from "../db/pool";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const limit = Number.parseInt(String(req.query.limit ?? "10"), 10);
    const offset = Number.parseInt(String(req.query.offset ?? "0"), 10);

    const { rows } = await pool.query(
      `SELECT
      p.id, p.content, p.created_at, p.updated_at,
      u.username AS author, u.id AS author_id, u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const mapped = rows.map((r) => ({
      ...r,
      avatar_url: `${process.env.BASE_URL}${r.avatar_url}`,
    }));

    res.json(mapped);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /posts failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body || {};

    const inserted = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id",
      [req.user?.id, title, content],
    );

    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
      u.username AS author, u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $1`,
      [inserted.rows[0].id],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /posts failed:", error);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id, title, content } = req.body || {};

    const updated = await pool.query(
      `UPDATE posts
      SET title = $1, content = $2, updated_at = now()
      WHERE id = $3 AND user_id = $4
      RETURNING id`,
      [title, content, id, req.user?.id],
    );

    if (updated.rowCount === 0) {
      return res.status(403).json({ error: "Not allowed or post not found" });
    }

    const { rows } = await pool.query(
      `SELECT p.id, p.content, p.created_at,
      u.username AS author, u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $1`,
      [id],
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deleted = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [id, req.user?.id],
    );

    if (deleted.rowCount === 0)
      return res.status(404).json({ error: "Not allowed or post not found" });
    return res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
