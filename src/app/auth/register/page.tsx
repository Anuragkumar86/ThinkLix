"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/register", form);
      const data = res.data;

      if (res.status !== 200) {
        setError(data.error || "Something went wrong");
        toast.error(data.error || "Something went wrong", { duration: 5000 });
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result?.error || "Some error occurred");
      } else {
        toast.success("Register Success", { duration: 6000 });
        router.push("/");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Unexpected error");
        toast.error(err.response?.data?.message || "Unexpected error");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 pt-20">
      <div className="flex w-full max-w-6xl h-[100%] rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Register Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-12 bg-gray-900/70 backdrop-blur-xl rounded-l-3xl shadow-2xl text-gray-200 border border-gray-800">
          <h2 className="text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500">
            Create Account
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Fill in the details to join our community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl px-4 py-3 pr-10 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition shadow-inner"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-pink-500 hover:via-indigo-500 hover:to-purple-500 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition-all focus:ring-2 focus:ring-indigo-400"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-8 flex flex-col gap-4 items-center">
            <span className="text-gray-400 text-sm">OR</span>
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl shadow border bg-gray-800 hover:bg-gray-700 transition w-full cursor-pointer text-gray-200 font-semibold"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-indigo-400 underline"
            >
              Login
            </a>
          </p>
        </div>

        {/* Right Thoughts Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-tr from-purple-700 via-indigo-800 to-pink-700 p-10">
          <div className="text-center px-6">
            <h3 className="text-3xl font-bold text-white mb-4">Thoughts for Life</h3>
            <p className="text-gray-200 text-lg">
              “Every new beginning is an opportunity to learn, grow, and
              embrace the unknown with courage.”
            </p>
            <p className="text-gray-300 mt-4 italic">
              — Step forward and embrace your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
