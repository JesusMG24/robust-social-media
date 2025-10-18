"use client";

import { useState } from "react";

export default function HeaderNav() {
  const [tab, setTab] = useState<"forYou" | "following">("forYou");

  return (
    <nav className="w-full flex text-sm">
      <button
        className="w-1/2 flex flex-col items-center"
        onClick={() => setTab("forYou")}
      >
        <div>
          <p
            className={`text-gray-500 h-10 flex items-center ${
              tab === "forYou" ? "text-white font-bold" : ""
            }`}
          >
            For you
          </p>
          <div
            className={`h-1 rounded-full ${
              tab === "forYou" ? "bg-sky-500" : ""
            }`}
          ></div>
        </div>
      </button>
      <button
        className="w-1/2 flex justify-center"
        onClick={() => setTab("following")}
      >
        <div>
          <p
            className={`text-gray-500 h-10 flex items-center ${
              tab === "following" ? "text-white font-bold" : ""
            }`}
          >
            Following
          </p>
          <div
            className={`h-1 rounded-full ${
              tab === "following" ? "bg-sky-500" : ""
            }`}
          ></div>
        </div>
      </button>
    </nav>
  );
}
