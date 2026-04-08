"use client";

import { useState } from "react";
import { fetchAPI } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    const data = await fetchAPI("/auth/register", "POST", form);

    if (data._id) {
      alert("Registration successful ✅");
      router.push("/login");
    } else {
      alert(data.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-136px)] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              IdeaWired
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Register</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create your account to publish and follow communities.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Username</span>
              <input
                name="username"
                placeholder="Your name"
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <button
              onClick={handleRegister}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}