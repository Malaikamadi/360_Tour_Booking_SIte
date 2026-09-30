"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Target,
  ListChecks,
  Users2,
  FileCheck2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const Timeline3Day: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const days = [
    {
      dayNumber: 1,
      name: "Day 1",
      title: "Introduction",
      subtitle: "Vision, Mandate & Governance Alignment",
      tag: "Initiation & Buy-in",
      themeColor: "from-blue-600 to-teal-700",
      accent: "text-blue-600",
      bgLight: "bg-blue-50/50",
      border: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      objective:
        "Introduce the NHIH and HOS mandate, align leadership expectations, and establish formal TWG working commitments.",
      activities: [
        "NHIH presents the NHIH/HOS vision, mandate and current health data domains",
        "Review current national data policies and strategic intelligence priorities",
        "Establish discovery scope and identify programme focal persons",
        "Confirm executive attendance and nominate representatives to the Health Intelligence TWG",
      ],
      participants: [
        "Directorate Directors & Programme Managers",
        "Chief Medical Officer / Deputy CMO delegates",
        "Programme M&E Leads & Data Officers",
        "NHIH Discovery & Strategy Team",
      ],
      expectedOutput: [
        "Signed TWG participation endorsement",
        "Confirmed 3-day discovery schedule and participant roster",
        "Agreed scope of systems, tools and data domains to be reviewed",
      ],
    },
    {
      dayNumber: 2,
      name: "Day 2",
      title: "Data Source Discovery & Roadmap",
      subtitle: "System Audits, Bottlenecks & Integration Scoping",
      tag: "Deep Technical Discovery",
      themeColor: "from-teal-600 to-cyan-700",
      accent: "text-teal-600",
      bgLight: "bg-teal-50/50",
      border: "border-teal-200",
      badgeColor: "bg-teal-100 text-teal-800",
      objective:
        "Thoroughly map all data sources, analyze reporting chains, diagnose data-quality hurdles, and co-design a draft integration roadmap.",
      activities: [
        "Review existing data currently accessible in HOS / NHIH lakehouse",
        "Identify data sources that are not yet integrated (spreadsheets, offline registries, siloed software)",
        "Identify recurring data-quality issues (delays, duplications, incompleteness, transmission losses)",
        "Map reporting lines from Peripheral Health Units (PHUs) through District Health Medical Teams (DHMT) to HQ",
        "Develop an initial integration roadmap with prioritized target milestones",
        "Document the initial issue list and high-impact value cases",
      ],
      participants: [
        "Database Administrators & HIS Specialists",
        "District M&E Focal Persons & Surveillance Officers",
        "Programmatic Data Collectors & Clerks",
        "NHIH Systems Architects & Integration Engineers",
      ],
      expectedOutput: [
        "Catalog of verified and unintegrated data sources with ownership metadata",
        "Documented operational issue list and data quality bottleneck matrix",
        "Draft Integration Roadmap linking programme feeds to HOS lakehouse",
      ],
    },
    {
      dayNumber: 3,
      name: "Day 3",
      title: "Visit & Consolidation",
      subtitle: "Validation, Decision-Maker Mapping & Action Cadence",
      tag: "Consolidation & Commitment",
      themeColor: "from-orange-600 to-amber-700",
      accent: "text-orange-600",
      bgLight: "bg-orange-50/50",
      border: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800",
      objective:
        "Consolidate all findings, validate the decision-maker map, agree upon the final integration roadmap, and establish recurring follow-up cadences.",
      activities: [
        "Consolidate and review Day 2 findings with programme executives",
        "Validate the decision-maker map (who needs which signals, at what frequency, for which clinical/logistical decisions)",
        "Review and sign off the issue/value-case log with designated priority ratings",
        "Agree on the final integration roadmap milestones and technical prerequisites",
        "Agree on the follow-up cadence, bi-weekly TWG check-ins, and data-sharing protocols",
      ],
      participants: [
        "Programme Leadership & Key Decision-Makers",
        "Directorate of Policy, Planning & Information (DPPI) Executive Team",
        "NHIH Technical Leadership",
        "Key Health Sector Development Partners (WHO, UNICEF, Global Fund where relevant)",
      ],
      expectedOutput: [
        "Validated Decision-Maker Map detailing critical operational KPIs",
        "Agreed and approved Issue / Value-Case Action Plan",
        "Formalized roadmap and scheduled bi-weekly follow-up review cadence",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop Horizontal Tabs / Nav */}
      <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
        {days.map((day) => {
          const isSelected = selectedDay === day.dayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-white border-teal-600 shadow-xl shadow-teal-900/10 ring-2 ring-teal-500/20"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${day.badgeColor}`}
                >
                  {day.name}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {day.tag}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-teal-700 transition-colors">
                {day.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {day.subtitle}
              </p>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Selector Buttons */}
      <div className="lg:hidden flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setSelectedDay(day.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
              selectedDay === day.dayNumber
                ? "bg-[#0A192F] text-teal-400 border-slate-800 shadow"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {day.name} — {day.title}
          </button>
        ))}
      </div>

      {/* Selected Day Full Card */}
      {days
        .filter((d) => d.dayNumber === selectedDay)
        .map((day) => (
          <div
            key={day.dayNumber}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            {/* Header banner */}
            <div className="bg-[#0A192F] text-white p-6 sm:p-8 border-b border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wide">
                      {day.name} of 3
                    </span>
                    <span className="text-xs text-slate-400">
                      Standard 360° Discovery Engagement Cycle
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {day.title}
                  </h3>
                  <p className="text-sm text-teal-300 font-medium">
                    {day.subtitle}
                  </p>
                </div>

                <div className="bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 max-w-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Primary Objective</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {day.objective}
                  </p>
                </div>
              </div>
            </div>

            {/* Day Details Grid: Activities, Participants, Output */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Activities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <ListChecks className="w-4 h-4" />
                  </div>
                  <span>Planned Activities</span>
                </div>
                <ul className="space-y-3">
                  {day.activities.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Participants */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <span>Key Participants</span>
                </div>
                <ul className="space-y-3">
                  {day.participants.map((part, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      <span>{part}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Output */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <span>Expected Outputs</span>
                </div>
                <ul className="space-y-3">
                  {day.expectedOutput.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
