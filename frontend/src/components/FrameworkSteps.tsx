import React from "react";
import { Compass, HelpCircle, CalendarCheck, Users, FileCheck } from "lucide-react";

export const FrameworkSteps: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Map the Ministry",
      subtitle: "Directorates, Units & Agencies",
      description:
        "NHIH systematically catalogs every directorate, vertical disease programme, logistics agency, and partner body across the health sector.",
      icon: Compass,
      color: "from-blue-600 to-indigo-700",
      accent: "text-blue-600",
    },
    {
      step: 2,
      title: "Prepare the Questions",
      subtitle: "Structured Inquiry Framework",
      description:
        "Standardized discovery checklists are customized to each programme's operational domain without creating burdensome paperwork.",
      icon: HelpCircle,
      color: "from-teal-600 to-emerald-700",
      accent: "text-teal-600",
    },
    {
      step: 3,
      title: "Schedule the Visit",
      subtitle: "Dedicated 3-Day Engagement",
      description:
        "Programmes reserve their preferred time window using this portal, locking dates to assemble key data officers and leadership.",
      icon: CalendarCheck,
      color: "from-orange-600 to-amber-700",
      accent: "text-orange-600",
    },
    {
      step: 4,
      title: "Join the TWG",
      subtitle: "Health Intelligence TWG",
      description:
        "Designated focal persons join the Ministry Technical Working Group to maintain ongoing data governance and integration standards.",
      icon: Users,
      color: "from-purple-600 to-indigo-700",
      accent: "text-purple-600",
    },
    {
      step: 5,
      title: "Consolidate Findings",
      subtitle: "HOS Intelligence Feed",
      description:
        "Discovery insights are synthesized into integration roadmaps, verified data source catalogs, and operational dashboard signals.",
      icon: FileCheck,
      color: "from-emerald-600 to-teal-800",
      accent: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {steps.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.step}
            className="card-institutional p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-teal-300 font-mono text-xs font-bold flex items-center justify-center">
                  0{s.step}
                </span>
                <div className={`p-2 rounded-xl bg-slate-100 ${s.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
                {s.title}
              </h4>
              <p className="text-[11px] font-semibold text-teal-700 mb-2">
                {s.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {s.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Step {s.step} of 5
            </div>
          </div>
        );
      })}
    </div>
  );
};
