"use client";

import { useState } from "react";
import { fetchAPI } from "../../lib/api";
import { useRouter } from "next/navigation";

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
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}