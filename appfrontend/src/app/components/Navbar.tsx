"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, initials, logout } = useAuth();
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number } | null>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const links = [
    { name: "Home", href: "/" },
    { name: "Job Board", href: "/job-board" },
    { name: "Application Tracker", href: "/tracker" },
  ];

  // Update underline when pathname changes
  useEffect(() => {
    const activeIndex = links.findIndex((link) => link.href === pathname);
    const activeLink = linksRef.current[activeIndex];
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement?.getBoundingClientRect();
      setUnderlineStyle({
        left: rect.left - (parentRect?.left || 0),
        width: rect.width,
      });
    } else {
      setUnderlineStyle(null);
    }
  }, [pathname]);

  // Close profile menu on outside click / ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!openMenu) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <nav className="bg-white border-b border-gray-300 w-full top-0 left-0">
      <div className="flex justify-between items-center px-6 md:px-12 h-[65px] relative">
        {/* Logo */}
        <Link href="/" className="flex flex-row gap-2 justify-center items-center">
          <Image
            src="/appLogo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-3xl font-semibold tracking-tight">TechHire</h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-1 pl-10 justify-start items-center gap-10 h-full relative">
          {links.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              ref={(el) => {
                linksRef.current[i] = el;
              }}
              className={`relative group h-full flex items-center font-semibold transition-colors duration-200 ${
                pathname === link.href ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {link.name}
              {/* Hover underline */}
              <span className="absolute bottom-0 left-0 h-0.5 bg-blue-400 rounded-full w-0 group-hover:w-full transition-all duration-200" />
            </Link>
          ))}

          {/* Sliding underline */}
          {underlineStyle && (
            <span
              className="absolute bottom-0 h-0.5 bg-blue-400 rounded-full transition-all duration-400 ease-in-out"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          )}
        </div>

        {/* Right side: Login or Profile */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-4">
          {!user ? (
            <Link
              href="/login"
              className="font-semibold text-white bg-blue-400 rounded-xl py-2 px-4 transition-all duration-200 hover:bg-blue-500"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={openMenu}
                className="flex items-center gap-2"
              >
                <span className="h-9 w-9 rounded-lg bg-blue-400 text-white font-bold grid place-items-center">
                  {initials}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-600 transition-transform ${openMenu ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-2"
                >
                  <MenuItem href="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem href="/report">
                    Report Issues
                  </MenuItem>
                  <MenuItem href="/support">
                    Support
                  </MenuItem>
                  <MenuItem href="/settings">
                    Settings
                  </MenuItem>
                  <div className="my-1 h-px bg-gray-200" />
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MenuItem({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-50"
      role="menuitem"
    >
      {icon ? <span className="w-4 text-center">{icon}</span> : null}
      {children}
    </Link>
  );
}
