"use client";
import * as React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TechHire
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="/about" className="text-sm text-gray-500 hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}