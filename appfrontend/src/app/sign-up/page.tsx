import React from "react";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center flex-col my-25">
      <div className="justify-center items-center border border-gray-300 rounded w-100">
        <div className="flex justify-center flex-col m-10">
          <h1 className="text-2xl font-semibold">Register</h1>
          <h2 className="text-gray-500 font-light pb-5">Create an account to get started</h2>

          <div className="flex flex-col gap-4 pb-2">
            <div>
              <h2 className="font-medium">Email</h2>
              <input
                type="text"
                className="border border-gray-400 rounded w-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            
            <div>
              <h2 className="font-medium">Password</h2>
              <input
                type="password"
                className="border border-gray-400 rounded w-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <h2 className="font-medium">Confirm Password</h2>
              <input 
                type="password"
                className="border border-gray-400 rounded w-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          <button
            className="w-full bg-blue-400 text-white rounded-md px-4 py-2 mt-2
            hover:bg-blue-500 hover:cursor-pointer transition-all duration-100"
          >
            Register
          </button>

          <label className="flex justify-center items-center p-2 gap-1 text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </label>
        </div>
      </div>
    </div>
  );
}
