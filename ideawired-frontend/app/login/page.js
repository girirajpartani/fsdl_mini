"use client";
import { useState } from "react";
import { fetchAPI } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const data = await fetchAPI("/auth/login", "POST", {
      email,
      password,
    });

    if(!data.token) {
      alert("Login failed");
      return;
    }
    
    localStorage.setItem("token", data.token);
    if (data.user?._id) {
      localStorage.setItem("userId", data.user._id);
    }
    if (data.user?.username) {
      localStorage.setItem("username", data.user.username);
    }
    if (data.user?.role) {
      localStorage.setItem("role", data.user.role);
    }
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-136px)] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              IdeaWired
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Access your feed and community updates.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
              <input
                placeholder="••••••••"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              New here?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}