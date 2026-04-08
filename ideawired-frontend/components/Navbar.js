"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Communities", href: "/communities" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserId(localStorage.getItem("userId") || "");
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
    setIsAuthenticated(Boolean(token));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl text-white shadow-lg shadow-slate-950/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black">
            I
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              IdeaWired
            </p>
            <p className="text-xs text-slate-400">Thoughtful articles and communities</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              Admin
            </Link>
          )}

          {isAuthenticated && userId ? (
            <Link
              href={`/profile/${userId}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/profile")
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{username || "Member"}</p>
                <p className="text-xs text-slate-400">Signed in</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}