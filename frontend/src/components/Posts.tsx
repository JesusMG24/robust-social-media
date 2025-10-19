"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/Post";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
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
        <li key={post.id} className="border-t border-gray-700 p-4 flex gap-2">
          <img src={post.avatar_url} className="h-10 w-10 rounded-full" />
          <div>
            <p>{post.author}</p>
            <p>{post.content}</p>
          </div>
        </li>
      ))}
      {loading && (
        <li className="flex w-full justify-center p-4">
          <div className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-gray-400 rounded-full"></div>
        </li>
      )}
    </ul>
  );
}
