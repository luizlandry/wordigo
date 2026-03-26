"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type User = {
  userName: string;
  userImageSrc: string;
  points: number;
};

export const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">🏆 Leaderboard</h1>

      {users.map((user, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow"
        >
          <div className="flex items-center gap-x-3">
            <span className="font-bold">#{index + 1}</span>
            <Image
              src={user.userImageSrc}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>{user.userName}</span>
          </div>

          <span className="font-bold">
             {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
};