"use client"

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage(){

  const router = useRouter();
  const [data, setData] = React.useState("nothing")

  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("Logout successful")
      router.push("/login")

    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  const getUserDetails = async () =>{
    const res = await axios.get('/api/users/myData');
    console.log(res.data);
    setData(res.data.data._id);
  }

  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Profile page</p>
      <h2 className="p-2 rounded bg-teal-500">{data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
      onClick={logout}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-3 py-2 px-4 rounded">
        Logout
      </button>
      <button
      onClick={getUserDetails}
      className="bg-violet-500 hover:bg-violet-700 text-white font-bold mt-3 py-2 px-4 rounded">
        getUserDetails
      </button>
    </div>
  )
}