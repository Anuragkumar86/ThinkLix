"use client";

import axiosInstance from "@/lib/axiosInstance";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface user extends User {
  accounts: {
    provider: string;
  }[];
}

export default function MyProfilePage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<user>();
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await axios.get("/api/user/me");
        setUser(response.data.user);
      } catch {
        setError("Unable to get the user data");
      }
    };
    if (status === "authenticated") getuser();
  }, [session, status]);

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    try {
      await axiosInstance.post("/api/user/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully!");
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update password. Please try again.";
        toast.error(message);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  if (status === "loading")
    return (
      <div className="text-gray-400 text-center mt-20 text-2xl font-bold tracking-wide animate-pulse">
        Checking session...
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-fuchsia-700 via-indigo-900 to-gray-900">
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-fuchsia-600 shadow-xl text-center space-y-6">
          <p className="text-pink-400 font-bold text-xl mb-2">
            You must be logged in to view this page.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-block px-8 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-2xl shadow-lg font-semibold text-lg hover:scale-105 hover:bg-gradient-to-l transition"
          >
            Login
          </Link>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-fuchsia-700 via-indigo-900 to-gray-900">
        <div className="bg-white/10 px-8 py-12 rounded-3xl border border-pink-600 shadow-xl text-2xl font-bold text-pink-400">
          {error}
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="text-gray-400 text-center mt-24 text-2xl font-bold">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-fuchsia-900 via-violet-900 to-indigo-900 py-8 md:py-20 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto bg-white/10 shadow-2xl rounded-3xl border-2 border-violet-600/60 p-7 md:p-12 backdrop-blur-2xl space-y-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent from-fuchsia-400 via-pink-400 to-yellow-400 bg-gradient-to-br bg-clip-text drop-shadow-xl text-center pb-4">
          My Profile
        </h1>

        <div className="flex flex-col md:flex-row gap-10 md:gap-8">
          {/* Profile Identity Card */}
          <div className="basis-[320px] flex-shrink-0 w-full md:w-auto">
            <div className="bg-white/20 border-2 border-fuchsia-400/40 shadow-lg rounded-2xl p-7 flex flex-col items-center backdrop-blur-lg">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-md ring-4 ring-fuchsia-400/70 bg-black/20">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-5xl font-extrabold">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
              </div>
              <h2 className="mt-7 text-2xl font-bold text-white bg-clip-text">
                {user.name}
              </h2>
              <div className="mt-7 flex flex-col gap-2 w-full">
                {user.accounts &&
                user.accounts[0]?.provider === "google" ? (
                  <Link
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-white px-6 py-2 rounded-xl bg-blue-600 hover:to-indigo-500 transition duration-300 hover:scale-105"
                  >
                    Manage Password
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full text-center px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 font-bold text-white shadow-md hover:from-yellow-400 hover:to-pink-400 transition duration-300 hover:scale-105"
                    aria-label="Change password"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Info panel */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-7">
            {/* Email */}
            <div className="flex flex-col bg-white/20 p-6 rounded-2xl border-2 border-indigo-600/50 shadow-md min-w-0 break-all">
              <p className="font-semibold text-sm text-white mb-2">Email</p>
              <div className="w-full overflow-x-auto hide-scrollbar">
                <span className="text-yellow-300 font-medium whitespace-pre-line break-all block">
                  {user.email}
                </span>
              </div>
            </div>
            {/* Role */}
            <div className="flex flex-col bg-white/20 p-6 rounded-2xl border-2 border-pink-600/40 shadow-md">
              <p className="font-semibold text-sm text-white mb-2">Role</p>
              <span className="text-yellow-300 font-medium capitalize">{user.role}</span>
            </div>
            {/* Joined */}
            <div className="flex flex-col bg-white/20 p-6 rounded-2xl border-2 border-yellow-400/40 shadow-md">
              <p className="font-semibold text-sm text-white mb-2">
                Joined Date
              </p>
              <span className="text-yellow-300 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            {/* Coins */}
            <div className="flex flex-col bg-white/20 p-6 rounded-2xl border-2 border-fuchsia-300/40 shadow-md">
              <p className="font-semibold text-sm text-white mb-2">
                Total Coins
              </p>
              <span className="block text-2xl font-bold text-yellow-300">
                🪙 {user.coins}
              </span>
            </div>
            {/* Score */}
            <div className="flex flex-col bg-white/20 p-6 rounded-2xl border-2 border-indigo-400/40 shadow-md">
              <p className="font-semibold text-sm text-white mb-2">
                Total Score
              </p>
              <span className="block text-xl font-bold text-yellow-400">{user.totalScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/10 border-2 border-fuchsia-500/50 p-8 w-full max-w-md rounded-3xl backdrop-blur-xl shadow-2xl relative">
            <button
              onClick={() => setShowPasswordForm(false)}
              className="absolute top-3 right-3 text-xl text-pink-200 hover:text-pink-400 transition"
              aria-label="Close password form"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent mb-7">
              Change Password
            </h2>
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-indigo-300 font-semibold mb-2"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-900 border border-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-indigo-300 font-semibold mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-900 border border-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-indigo-300 font-semibold mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-900 border border-indigo-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition text-white placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 font-bold text-lg text-white hover:from-indigo-500 hover:to-fuchsia-500 transition hover:scale-105"
                aria-label="Update password"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
