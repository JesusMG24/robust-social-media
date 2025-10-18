"use client";

import { useEffect, useState } from "react";

interface Post {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: string;
  author_id: number;
  avatar_url: string;
}

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ul className="w-full flex flex-col">
      {posts.map((post: Post) => (
        <li key={post.id} className="border-t border-gray-600 p-4">
          {post.content}
        </li>
      ))}
    </ul>
  );
}
