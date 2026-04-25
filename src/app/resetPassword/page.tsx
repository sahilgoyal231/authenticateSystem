"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const onResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/users/resetPassword", { token, newPassword });
      toast.success("Password reset successfully");
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.log("Reset password failed", error.message);
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-4">{loading ? "Processing..." : "Reset Password"}</h1>
      <hr className="w-1/4 mb-4" />

      {success ? (
        <div className="flex flex-col items-center">
          <p className="text-green-500 text-xl mb-4">Password reset successful!</p>
          <Link href="/login" className="underline text-blue-500">
            Go to Login
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <label htmlFor="newPassword" className="mb-2">New Password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-500 text-black w-64"
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <button
            onClick={onResetPassword}
            disabled={loading || newPassword.length === 0}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-500 disabled:opacity-50"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
