"use client";

import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

interface LeaderboardProps {
  users: Pick<User, "id" | "name" | "image" | "totalScore" | "coins">[];
}

const RankBadge = ({ rank }: { rank: number }) => {
  let style = "bg-gray-200 text-gray-800";

  if (rank === 1) style = "bg-yellow-500 text-white font-bold shadow-lg shadow-yellow-500/50";
  if (rank === 2) style = "bg-slate-400 text-white font-bold shadow-lg shadow-slate-400/50";
  if (rank === 3) style = "bg-amber-800 text-white font-bold shadow-lg shadow-amber-800/50";

  return (
    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${style}`}>
      {rank}
    </div>
  );
};

export default function LeaderBoard({ users }: LeaderboardProps) {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-600">Loading Leaderboard...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied 🔒</h2>
          <p className="text-gray-700">You must be logged in to view the Leaderboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 sm:p-8 pt-40">
      <header className="text-center mb-10 pt-20">
        <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tight">
          🏆 Top 15 Achievers Leaderboard 🏆
        </h1>
        <p className="text-gray-100 mt-2 text-lg">
          See the best players based on Total Score.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-10 gap-2 p-4 font-semibold text-sm text-gray-600 border-b border-gray-200 bg-indigo-50 sticky top-0 z-10">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-1 text-center">Avatar</div>
            <div className="col-span-4 pl-4">Name</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Coins</div>
          </div>

          {/* Users */}
          <div className="divide-y divide-gray-100">
            {users.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.id === currentUserId;
              const rowStyle = isCurrentUser
                ? "bg-indigo-100 border-l-4 border-indigo-600 hover:bg-indigo-200 transition duration-150 ease-in-out"
                : "hover:bg-indigo-100 transition duration-150 ease-in-out";

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-10 items-center gap-2 p-4 ${rowStyle}`}
                >
                  <div className="col-span-1 flex justify-center">
                    <RankBadge rank={rank} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name ?? ""}
                        className="w-10 h-10 rounded-full border"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  <div className="col-span-4 pl-4 font-medium text-gray-900 truncate">
                    {user.name || "Anonymous"}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs font-bold text-indigo-700">(You)</span>
                    )}
                  </div>
                  <div className="col-span-2 text-center font-semibold text-green-600">
                    {user.totalScore.toLocaleString()}
                  </div>
                  <div className="col-span-2 text-center text-yellow-600 font-medium">
                    🪙 {user.coins.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {users.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUserId;

            return (
              <div
                key={user.id}
                className={`bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between ${
                  isCurrentUser ? "border-l-4 border-indigo-600" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={rank} />
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name ?? ""}
                      className="w-12 h-12 rounded-full border"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.name || "Anonymous"}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs font-bold text-indigo-700">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Score:{" "}
                      <span className="text-green-600 font-semibold">
                        {user.totalScore.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end float-end mt-2 sm:mt-0 text-yellow-600 font-bold text-lg">
                  🪙 {user.coins.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
