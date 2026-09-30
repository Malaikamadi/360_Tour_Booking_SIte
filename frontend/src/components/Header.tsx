"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Layers,
  FileCheck,
  Search,
  Shield,
  Menu,
  X,
  Database,
  ArrowRight,
} from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Why The Tour", href: "/#why" },
    { label: "3-Day Cycle", href: "/#cycle" },
    { label: "What We Discuss", href: "/#topics" },
    { label: "Preparation Guide", href: "/prepare" },
    { label: "Check Status", href: "/lookup" },
    { label: "Intelligence Layer", href: "/intelligence" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Ministry Banner */}
      <div className="bg-[#070e1b] py-1.5 px-4 border-b border-slate-800/80 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-200 tracking-wide">
              REPUBLIC OF SIERRA LEONE
            </span>
            <span className="text-slate-500">•</span>
            <span>Ministry of Health</span>
            <span className="text-slate-500">•</span>
            <span>Directorate of Policy, Planning & Information (DPPI)</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>National Health Information Hub (NHIH)</span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-400 font-mono text-[10px]">HOS INTELLIGENCE LAYER</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Portal Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-700 flex items-center justify-center p-0.5 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A192F] rounded-[10px] flex items-center justify-center">
                <Database className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  NHIH 360° Discovery Tour
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-950/80 text-teal-400 border border-teal-700/50 px-2 py-0.5 rounded">
                  Official Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Ministry of Health • Stakeholder Engagement Architecture
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-teal-400 bg-slate-800/80"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
              title="Internal staff and admin operations workspace"
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Operations Portal</span>
            </Link>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a 360° Engagement</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/book"
              className="bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070e1b] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-teal-400 py-2 border-b border-slate-800/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm py-2.5 rounded-lg"
            >
              Book a 360° Engagement
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-teal-400" />
              <span>NHIH Operations Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
