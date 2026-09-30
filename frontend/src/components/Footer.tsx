import React from "react";
import Link from "next/link";
import { Database, Shield, ExternalLink, Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070e1b] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Organization Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-tight">
                  NHIH 360° Discovery Tour
                </h3>
                <p className="text-xs text-slate-400">
                  National Health Information Hub • Sierra Leone
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              A structured stakeholder engagement initiative led by the Directorate of Policy, Planning
              and Information (DPPI), Ministry of Health, Sierra Leone. Transforming fragmented health
              data into a unified intelligence foundation for operational decision-making.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>5th Floor Youyi Building, Brookfields, Freetown, Sierra Leone</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>dppi@mohs.gov.sl / info@nhih.gov.sl</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>+232 (0) 76 100 200 / +232 (0) 78 200 300</span>
              </div>
            </div>
          </div>

          {/* Column 2: The Engagement */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              The Initiative
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/#why" className="hover:text-teal-300 transition-colors">
                  Why The 360° Tour?
                </Link>
              </li>
              <li>
                <Link href="/#framework" className="hover:text-teal-300 transition-colors">
                  5-Step Framework
                </Link>
              </li>
              <li>
                <Link href="/#cycle" className="hover:text-teal-300 transition-colors">
                  3-Day Engagement Cycle
                </Link>
              </li>
              <li>
                <Link href="/#topics" className="hover:text-teal-300 transition-colors">
                  Key Discussion Topics
                </Link>
              </li>
              <li>
                <Link href="/prepare" className="hover:text-teal-300 transition-colors">
                  Preparation Guide & Checklist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programme Actions */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Programme Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/book" className="hover:text-orange-300 transition-colors font-medium text-slate-200">
                  Book a 360° Engagement
                </Link>
              </li>
              <li>
                <Link href="/lookup" className="hover:text-teal-300 transition-colors">
                  Check Booking Status
                </Link>
              </li>
              <li>
                <Link href="/prepare" className="hover:text-teal-300 transition-colors">
                  Self-Readiness Assessment
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                  <span>NHIH Staff Operations</span>
                  <Shield className="w-3 h-3 text-teal-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Intelligence Layer */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/intelligence" className="hover:text-teal-300 transition-colors">
                  HOS Intelligence Layer
                </Link>
              </li>
              <li>
                <Link href="/intelligence#facts" className="hover:text-teal-300 transition-colors">
                  Layer A: Operational Facts
                </Link>
              </li>
              <li>
                <Link href="/intelligence#signals" className="hover:text-teal-300 transition-colors">
                  Layer B: Analytical Signals
                </Link>
              </li>
              <li>
                <Link href="/intelligence#reasoning" className="hover:text-teal-300 transition-colors">
                  Layer C: AI Reasoning Preparation
                </Link>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Backend OpenAPI Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>
              Official Digital Portal • National Health Information Hub (NHIH) • Government of Sierra Leone
            </span>
          </div>
          <div>
            <span>© 2026 Directorate of Policy, Planning & Information (DPPI). All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
