"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { ChevronDown, Menu, X, LogOut, User } from "lucide-react";
import NavbarSkeleton from "./skeleton/NavarSkeleton";
import SearchBar from "./SearchBar";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  coins: number;
  totalScore: number;
  image: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await axiosInstance.get("/api/user/me");
        setUserDetail(response.data.user);
      } catch (err) {
        console.error(err);
        setError("Unable to get user detail");
      }
    };
    if (status === "authenticated") {
      getUserDetail();
    } else {
      setUserDetail(null);
    }
  }, [status]);

  if (status === "loading") return <NavbarSkeleton />;
  if (error) return <div className="p-4 text-red-500 font-semibold">{error}</div>;

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-black bg-opacity-80 border-b border-cyan-700 shadow-lg">
      <div className="container mx-auto max-w-7xl px-6 md:px-5">
        {/* Top Row */}
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-3xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 via-indigo-600 to-cyan-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
            aria-label="Homepage"
          >
            Think
            <span className="text-yellow-400 drop-shadow-lg select-none ml-1">Lix</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="w-full max-w-lg">
              <SearchBar />
            </div>
          </div>

          {/* Desktop nav and profile */}
          <div className="hidden md:flex items-center space-x-10 text-cyan-300 font-semibold select-none">

            <Link href="/fields" className="hover:text-pink-400 transition-colors duration-300">Fields</Link>
            <Link href="/quizzes" className="hover:text-pink-400 transition-colors duration-300">Quizzes</Link>
            <Link href="/dashboard" className="hover:text-pink-400 transition-colors duration-300">Dashboard</Link>
            <Link href="/leaderboard" className="hover:text-pink-400 transition-colors duration-300">Leaderboard</Link>

            {userDetail && (
              <div
                className="flex items-center text-yellow-400 font-bold cursor-default select-none justify-center"
                title="Your total coins"
                aria-label="User coins"
              >
                🪙{userDetail.coins}
              </div>
            )}

            {/* Profile Dropdown */}
            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                  className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-md"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center ring-2 ring-indigo-300 shadow-lg overflow-hidden group-hover:scale-110 transition-transform border border-white">
                    {userDetail?.image ? (
                      <img
                        src={userDetail.image}
                        alt={`${userDetail.name}'s profile photo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-white uppercase">
                        {userDetail?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <ChevronDown size={18} className="text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                </button>

                {isProfileDropdownOpen && (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute right-0 mt-3 w-56 bg-black bg-opacity-90 border border-cyan-600 rounded-2xl shadow-2xl py-2 text-cyan-300 z-50"
                  >
                    <div className="px-5 py-3 border-b border-cyan-700 text-sm select-text">
                      Signed in as<br />
                      <span className="font-semibold truncate block max-w-full text-white">{session.user.email}</span>
                    </div>
                    <Link
                      href="/profile"
                      role="menuitem"
                      className="flex items-center gap-2 px-5 py-3 hover:bg-cyan-900 rounded-lg transition-colors duration-200"
                      tabIndex={0}
                    >
                      <User size={16} /> View Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      role="menuitem"
                      className="flex items-center gap-2 w-full px-5 py-3 text-red-500 hover:bg-red-900 hover:text-white rounded-b-lg border-t border-red-600 transition-colors duration-200 font-semibold text-left focus:outline-none cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => signIn()}
                  className="px-5 py-2 text-cyan-300 border-2 border-cyan-300 rounded-lg font-semibold hover:bg-cyan-400 hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                >
                  Login
                </button>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-4">
            {userDetail && (
              <span className="text-yellow-400 font-bold select-none">🪙{userDetail.coins}</span>
            )}
            <button
              aria-label="Toggle mobile menu"
              onClick={toggleMobileMenu}
              className="text-cyan-300 hover:text-pink-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-md border-t border-cyan-700 shadow-lg">
            <div className="px-4 py-5 space-y-1">
              <div className="w-full">
                <SearchBar />
              </div>
              <Link href="/fields" className="block px-3 py-3 rounded-md text-cyan-300 font-semibold hover:bg-cyan-700 transition">
                Fields
              </Link>
              <Link href="/quizzes" className="block px-3 py-3 rounded-md text-cyan-300 font-semibold hover:bg-cyan-700 transition">
                Quizzes
              </Link>
              <Link href="/dashboard" className="block px-3 py-3 rounded-md text-cyan-300 font-semibold hover:bg-cyan-700 transition">
                Dashboard
              </Link>
              <Link href="/leaderboard" className="block px-3 py-3 rounded-md text-cyan-300 font-semibold hover:bg-cyan-700 transition">
                Leaderboard
              </Link>
              <Link href="/profile" className="block px-3 py-3 rounded-md text-cyan-300 font-semibold hover:bg-cyan-700 transition">
                Profile
              </Link>

              {status === "authenticated" ? (
                <button
                  onClick={() => signOut()}
                  className="w-full px-5 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                >
                  <LogOut size={18} className="inline-block mr-2" /> Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transition"
                  >
                    Login
                  </button>
                  <Link
                    href="/auth/register"
                    className="block text-center w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-xl transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
