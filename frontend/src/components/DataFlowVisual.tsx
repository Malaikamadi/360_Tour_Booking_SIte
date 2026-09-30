"use client";

import React, { useState } from "react";
import { Database, Search, ShieldCheck, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

export const DataFlowVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 0,
      title: "Data Sources",
      subtitle: "Fragmented Ecosystem",
      icon: Database,
      badge: "Sources",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      bgLight: "bg-blue-950/40 border-blue-800/60",
      description: "DHIS2, mSupply, e-IDSR, iHRIS, paper registers, and localized spreadsheets.",
    },
    {
      id: 1,
      title: "Discovery",
      subtitle: "360° Engagement",
      icon: Search,
      badge: "The Tour",
      color: "from-teal-500 to-emerald-600",
      accent: "text-teal-400",
      bgLight: "bg-teal-950/40 border-teal-700/60",
      description: "Direct directorate engagement, workflow interviews, bottleneck diagnosis & TWG alignment.",
    },
    {
      id: 2,
      title: "Trusted Data",
      subtitle: "Standardized Grounding",
      icon: ShieldCheck,
      badge: "Foundation",
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400",
      bgLight: "bg-cyan-950/40 border-cyan-800/60",
      description: "Master Facility List reconciliation, verified schemas, and documented data ownership.",
    },
    {
      id: 3,
      title: "Intelligence",
      subtitle: "HOS Analytical Layer",
      icon: Cpu,
      badge: "Signals",
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-400",
      bgLight: "bg-purple-950/40 border-purple-800/60",
      description: "Automated indicators, cross-programme correlation, and grounded AI reasoning context.",
    },
    {
      id: 4,
      title: "Decisions",
      subtitle: "Operational Action",
      icon: CheckCircle2,
      badge: "Outcome",
      color: "from-orange-500 to-amber-600",
      accent: "text-orange-400",
      bgLight: "bg-orange-950/40 border-orange-800/60",
      description: "Stock replenishment, clinical interventions, policy adjustment & resource optimization.",
    },
  ];

  return (
    <div className="w-full bg-[#0A192F]/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
            NHIH / HOS Architecture Pathway
          </span>
          <h3 className="text-white font-semibold text-lg">
            From Siloed Systems to Operational Intelligence
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          Click any step to inspect the data lifecycle
        </div>
      </div>

      {/* Pathway Chain */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <div key={step.id} className="relative flex flex-col">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex flex-col justify-between h-full group ${
                  isSelected
                    ? `${step.bgLight} border-teal-500/80 shadow-lg shadow-teal-950/40 scale-[1.02]`
                    : "bg-[#070e1b]/80 border-slate-800 hover:border-slate-700 hover:bg-[#070e1b]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${step.color} text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-teal-900/60 border-teal-600 text-teal-300"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    Step 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm tracking-tight mb-0.5 group-hover:text-teal-300 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {step.subtitle}
                  </p>
                </div>
              </button>

              {/* Connecting arrow on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Description Box */}
      <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 shrink-0">
            <span className="font-mono text-xs font-bold">
              0{activeStep + 1}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
              {steps[activeStep].title} — {steps[activeStep].subtitle}
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              {steps[activeStep].description}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
          Integrated into <strong className="text-white font-medium">HOS Intelligence Layer</strong>
        </div>
      </div>
    </div>
  );
};
