"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#", label: "Thesis" },
  { href: "#", label: "Data" },
  { href: "#", label: "Stories" },
  { href: "#", label: "Sources" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8 h-14 flex items-center justify-between">
        <a href="#" className={`font-bold text-sm sm:text-base flex items-center gap-2 ${scrolled ? "text-yc-dark" : "text-white"}`}>
          <span className="w-6 h-6 rounded bg-[#FF6600] flex items-center justify-center text-white text-xs font-bold">Y</span>
          Demo Day Heat
        </a>
        <button
          className={`md:hidden p-2 rounded-md ${scrolled ? "text-yc-dark" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}
