"use client";
import { useState } from "react";
import { fetchAPI } from "../../lib/api";
import { useRouter } from "next/navigation";

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
    router.push("/");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}