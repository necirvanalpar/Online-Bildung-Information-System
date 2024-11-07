"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (response.ok) {
      setMessage("gut...");
      router.push("/");
    } else {
      setMessage("Geçersiz anahtar.");
    }
  };

  return (
    <div>
      <h1>RFID login</h1>
      <input
        type="text"
        placeholder="Dein key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button onClick={handleLogin}>login</button>
      <p>{message}</p>
    </div>
  );
}
