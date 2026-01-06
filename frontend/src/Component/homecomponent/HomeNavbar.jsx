import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function HomeNavbar() {
  return (
    <header className="w-full poppins sticky top-0 left-0 z-50 bg-[#0d1117]/70 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 text-slate-200">

        {/* Logo */}
        <h1 className="text-4xl font-semibold tracking-wide">
          Quick Bills
        </h1>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-slate-300 hover:text-white transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <Link to="/Login">
          <button className="px-4 py-2 rounded-md border border-white/20 text-slate-200 hover:bg-white/10 transition">
            Login
          </button>
        </Link>

      </nav>
    </header>
  );
}
