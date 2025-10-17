import { Request, Response } from "express";
import pool from "../db/pool";

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userid = Number(req.params.userid);
    if (Number.isNaN(userid)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const limit = Number.parseInt(String(req.query.limit ?? "10"), 10);
    const offset = Number.parseInt(String(req.query.offset ?? "0"), 10);

    const { rows } = await pool.query(
      `SELECT
         p.id, p.content, p.created_at, p.updated_at,
         u.username AS author, u.id AS author_id, u.avatar_url
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE u.id = $1
       ORDER BY p.created_at DESC, p.id DESC
       LIMIT $2 OFFSET $3`,
      [userid, limit, offset],
    );

    const mapped = rows.map((r) => ({
      ...r,
      avatar_url: `${process.env.BASE_URL}${r.avatar_url}`,
    }));

    return res.json(mapped);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};
