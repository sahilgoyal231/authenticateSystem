"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    try {
      setLoading(true);
      await axios.post("/api/users/forgotPassword", { email });
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      console.log("Forgot password failed", error.message);
      toast.error(error.response?.data?.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-4">{loading ? "Processing..." : "Forgot Password"}</h1>
      <hr className="w-1/4 mb-4" />
      <p className="text-gray-500 mb-6 text-center max-w-sm">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <label htmlFor="email" className="mb-2">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-500 text-black w-64"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button
        onClick={onSubmit}
        disabled={loading || email.length === 0}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-500 disabled:opacity-50"
      >
        Send Reset Link
      </button>

      <Link href="/login" className="mt-4 underline text-sm text-blue-500">
        Back to Login
      </Link>
    </div>
  );
}
