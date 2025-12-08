// components/navbar/Navbar.tsx
"use client";

import { Link, useLocation } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const path = location.pathname;

  // Dynamic link logic
  const dynamicLink =
    path === "/certificates"
      ? { path: "/educational-tour", label: "Educational Tour" }
      : { path: "/certificates", label: "Certificates" };

  return (
    <nav
      className="
        fixed left-1/2 -translate-x-1/2
        w-full
        z-10
        backdrop-blur-sm 
        bg-background/50 
        border-b border-foreground/20 
        shadow-lg 
        px-6 md:px-12 py-4 
        flex items-center justify-between
      "
    >
      {/* Brand */}
      <Link to="/" className="text-xl font-bold tracking-wide text-white">
        Hanseo
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
        <Link to="/" className="hover:text-white transition">
          Home
        </Link>

        <Link to={dynamicLink.path} className="hover:text-white transition">
          {dynamicLink.label}
        </Link>
      </div>

      {/* Mobile Burger Menu */}
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="p-2 rounded-lg bg-transparent">
            <Menu className="w-6 h-6 text-white" />
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            className="
              w-40 
              m-2 
              mt-4
              bg-muted/25 
              backdrop-blur-sm
              border border-white/30 
              text-white 
              rounded-xl
            "
          >
            <div className="flex flex-col gap-3 py-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="hover:text-white/80 transition"
              >
                Home
              </Link>

              <Link
                to={dynamicLink.path}
                onClick={() => setOpen(false)}
                className="hover:text-white/80 transition"
              >
                {dynamicLink.label}
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
