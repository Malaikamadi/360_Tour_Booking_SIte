"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckSquare,
  Square,
  Download,
  Calendar,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Printer,
  ChevronRight,
  Info,
} from "lucide-react";

export default function PreparePage() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
  });

  const checklist = [
    {
      title: "Current Data Sources Identified",
      summary: "Make a simple list of primary databases, registers, forms, and modules your team uses.",
      details: "Examples: DHIS2 routine forms, mSupply stock cards, paper tally sheets, or community survey logs.",
      lead: "M&E Officers / Data Clerks",
    },
    {
      title: "Systems & Tools Listed",
      summary: "Document software versions, hosting locations, or physical file cabinets holding records.",
      details: "Note if systems are local, cloud-hosted by partners, or operated completely offline.",
      lead: "HIS Specialists / Database Admins",
    },
    {
      title: "Reporting Processes & Timelines Mapped",
      summary: "Understand the reporting hierarchy from Peripheral Health Units (PHUs) through DHMT to Ministry HQ.",
      details: "Who signs off on monthly aggregates? What are the monthly deadlines?",
      lead: "Programme Manager / Clinical Lead",
    },
    {
      title: "Data Ownership Clarified",
      summary: "Identify who is officially designated as the data owner and accountable authority.",
      details: "Clear data ownership accelerates governance sign-offs during TWG sessions.",
      lead: "Directorate Leadership",
    },
    {
      title: "Data Access & Permissions Understood",
      summary: "Know who currently has login rights, export privileges, or access restrictions.",
      details: "Are permissions role-based? Can district officers view historical trends?",
      lead: "System Administrator",
    },
    {
      title: "Existing Dashboards & Reports Assembled",
      summary: "Gather examples of standard monthly bulletins, PowerPoint briefings, or donor reports.",
      details: "Helps NHIH understand which visual representations your leadership actually relies on.",
      lead: "M&E Unit / Reporting Officer",
    },
    {
      title: "Data-Quality Challenges Documented",
      summary: "List recurring issues: transmission delays, facility stock-out discrepancies, or duplicate IDs.",
      details: "Be candid about quality challenges — discovery is a collaborative, non-punitive audit.",
      lead: "Field Supervisors / Data Officers",
    },
    {
      title: "Operational Challenges Articulated",
      summary: "Identify bottlenecks where lack of timely data hinders clinical or logistical execution.",
      details: "e.g., vaccine stockouts before outreach campaigns, or unnotified disease outbreaks.",
      lead: "Programme Manager / Operations Lead",
    },
    {
      title: "Existing Integrations Checked",
      summary: "Note any automated API feeds, scheduled CSV imports, or manual copy-pasting between systems.",
      details: "Identifies quick-win opportunities to eliminate double data-entry burden.",
      lead: "Technical Staff / IT Officers",
    },
    {
      title: "Priority Use Cases Defined",
      summary: "Formulate top decisions you wish could be supported with real-time health intelligence.",
      details: "What single dashboard view would save your directorate the most time each week?",
      lead: "Director / Senior Technical Advisors",
    },
  ];

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Directorate Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Prepare for Your 360° Engagement
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            You do <strong>not</strong> need to prepare a formal slide deck or complex presentation.
            Use this interactive checklist to prepare your core team for a productive session.
          </p>
        </div>

        {/* Readiness Score Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Programme Readiness Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {progressPercent}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({completedCount} of {checklist.length} topics prepared)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Briefing Slip</span>
              </button>

              <Link
                href="/book"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Engagement</span>
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Checklist Cards */}
        <div className="space-y-3 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
            The 10 Discussion Areas Checklist:
          </h2>

          {checklist.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                  isChecked
                    ? "bg-white border-teal-500/70 shadow-xs"
                    : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  aria-label={`Toggle ${item.title}`}
                  className="mt-0.5 text-teal-600 focus:outline-none"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-teal-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isChecked ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {idx + 1}. {item.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Lead: {item.lead}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    {item.summary}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 italic">
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Directorate FAQ */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 mb-8">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Info className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Frequently Asked Questions for Directorate Leads
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
            <div className="pt-2">
              <strong className="text-slate-900 block text-xs mb-1">
                Do we need to compile a full formal PowerPoint presentation?
              </strong>
              <span>
                No. NHIH discovery facilitators will guide the session through structured dialogue.
                Having access to your database or paper registers during Day 2 is sufficient.
              </span>
            </div>

            <div className="pt-3">
              <strong className="text-slate-900 block text-xs mb-1">
                Who should attend from our team?
              </strong>
              <span>
                Day 1 requires the Directorate Director or Programme Manager along with key focal leads.
                Day 2 requires data managers, M&E officers, and system administrators.
                Day 3 brings leadership back together to validate the roadmap.
              </span>
            </div>

            <div className="pt-3">
              <strong className="text-slate-900 block text-xs mb-1">
                Where will the 360° sessions take place?
              </strong>
              <span>
                Sessions can take place in the NHIH Intelligence War Room (5th Floor Youyi Building),
                at your directorate's boardroom, or virtually via Microsoft Teams.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-[#0A192F] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              Ready to schedule your visit?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Select your directorate and pick your preferred 3-day time window.
            </p>
          </div>

          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all shrink-0"
          >
            <span>Book a 360° Engagement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
