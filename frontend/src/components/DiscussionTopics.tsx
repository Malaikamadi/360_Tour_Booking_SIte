import React from "react";
import {
  FileText,
  Server,
  GitBranch,
  AlertTriangle,
  Lightbulb,
  Workflow,
  CheckCircle2,
} from "lucide-react";

export const DiscussionTopics: React.FC = () => {
  const topics = [
    {
      number: "01",
      title: "Your Data",
      question: "What data does your programme currently collect?",
      description:
        "Health service statistics, disease surveillance aggregates, clinical case records, population demographics, or inventory levels.",
      icon: FileText,
      accent: "text-blue-600",
      bgLight: "bg-blue-50/70 border-blue-200/80",
      bulletPoints: ["Data definitions & indicators", "Collection tools & forms", "Historical depth"],
    },
    {
      number: "02",
      title: "Your Systems",
      question: "Where does the data live?",
      description:
        "Whether inside DHIS2 instances, mSupply warehouses, standalone Excel workbooks, physical registries, or partner-hosted databases.",
      icon: Server,
      accent: "text-teal-600",
      bgLight: "bg-teal-50/70 border-teal-200/80",
      bulletPoints: ["Platform versions & hosting", "Server & access reliability", "Export & backup capabilities"],
    },
    {
      number: "03",
      title: "Your Workflow",
      question: "How is data entered, updated and reported?",
      description:
        "The step-by-step reporting lines from peripheral health units (PHUs) and community health workers through district teams up to Ministry HQ.",
      icon: GitBranch,
      accent: "text-purple-600",
      bgLight: "bg-purple-50/70 border-purple-200/80",
      bulletPoints: ["Reporting deadlines & cadences", "Validation & review steps", "Data transmission channels"],
    },
    {
      number: "04",
      title: "Data Quality",
      question: "What gaps, duplication, errors or quality challenges exist?",
      description:
        "Identification of transmission delays, facility non-reporting, discordant counts across registers, and paper tally discrepancies.",
      icon: AlertTriangle,
      accent: "text-amber-600",
      bgLight: "bg-amber-50/70 border-amber-200/80",
      bulletPoints: ["Late submissions from districts", "Duplicate client/facility records", "Missing denominator data"],
    },
    {
      number: "05",
      title: "Decision-Making",
      question: "Who uses the data and what decisions does it support?",
      description:
        "Understanding which directors, programme managers, clinical leads, and development partners consult the numbers to allocate resources.",
      icon: Lightbulb,
      accent: "text-orange-600",
      bgLight: "bg-orange-50/70 border-orange-200/80",
      bulletPoints: ["Operational vs strategic uses", "Stock reorder triggers", "Epidemic threshold alerts"],
    },
    {
      number: "06",
      title: "Integration",
      question: "What systems or data sources could benefit from integration?",
      description:
        "Mapping cross-programme opportunities to link clinical outcomes with supply chain availability, workforce deployment, and budgeting.",
      icon: Workflow,
      accent: "text-emerald-600",
      bgLight: "bg-emerald-50/70 border-emerald-200/80",
      bulletPoints: ["Master Facility List alignment", "Automated API connectors", "Cross-domain correlations"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.number}
            className={`card-institutional p-6 rounded-2xl border flex flex-col justify-between group ${t.bgLight}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/80 shadow-xs">
                  Area {t.number}
                </span>
                <div className={`p-2 rounded-xl bg-white shadow-xs ${t.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                {t.title}
              </h4>
              <p className="text-xs font-semibold text-slate-700 italic mb-3">
                “{t.question}”
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Discussion Focus:
              </span>
              <ul className="space-y-1.5">
                {t.bulletPoints.map((bp, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
