import React from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Database,
  Layers,
  FileCheck2,
  Cpu,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Building2,
  Compass,
  Sparkles,
  ArrowDown,
  FileSpreadsheet,
  EyeOff,
  Crosshair,
} from "lucide-react";
import { DataFlowVisual } from "@/components/DataFlowVisual";
import { Timeline3Day } from "@/components/Timeline3Day";
import { FrameworkSteps } from "@/components/FrameworkSteps";
import { DiscussionTopics } from "@/components/DiscussionTopics";

export default function HomePage() {
  const preparationItems = [
    { label: "Current data sources", detail: "List databases, modules, forms, or registries your team actively uses." },
    { label: "Systems & tools used", detail: "e.g., DHIS2, mSupply, bespoke web apps, Excel workbooks, or paper registers." },
    { label: "Reporting processes", detail: "Deadlines, validation chains, and transmission flows from PHU to HQ." },
    { label: "Data ownership", detail: "Who is designated as the primary data custodian within your directorate." },
    { label: "Data access & permissions", detail: "Who can view, export, edit, or authorize data releases." },
    { label: "Existing dashboards & reports", detail: "Routine monthly, quarterly or donor bulletins generated." },
    { label: "Data-quality challenges", detail: "Known delays, duplication, incomplete submissions, or inconsistencies." },
    { label: "Operational challenges", detail: "Bottlenecks impacting staff time, supply delivery, or clinical monitoring." },
    { label: "Existing integrations", detail: "Any established automated syncs, webhooks, or manual CSV uploads." },
    { label: "Priority use cases", detail: "Decisions your leadership wishes they could make faster with better data." },
  ];

  const journeySteps = [
    { title: "Engagement", subtitle: "Structured 3-day discovery with programme leadership and data teams." },
    { title: "Data Sources Mapped", subtitle: "Comprehensive catalog of all active digital and physical registries." },
    { title: "Operational Findings", subtitle: "Documented reporting bottlenecks, facility latency, and data ownership." },
    { title: "Issue / Value-Case Log", subtitle: "Prioritized matrix of high-value interventions and systemic gaps." },
    { title: "Integration Roadmap", subtitle: "Phased technical milestones to connect programme feeds to NHIH lakehouse." },
    { title: "NHIH Operational Dashboard", subtitle: "Real-time unified views giving leadership cross-programme visibility." },
    { title: "Intelligence Layer", subtitle: "Analytical signals and grounded reasoning without speculative AI claims." },
    { title: "Decision Support", subtitle: "Actionable operational recommendations for stock, health workforce and response." },
  ];

  return (
    <div className="flex flex-col">
      {/* =====================================================================
          HERO SECTION
      ====================================================================== */}
      <section className="relative hero-gradient text-white pt-16 pb-24 overflow-hidden border-b border-slate-800">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span className="font-semibold text-teal-300">NHIH 360° Discovery Tour</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">DPPI / Ministry of Health, Sierra Leone</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Building a clearer picture of how health data works across{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                Sierra Leone.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
              The National Health Information Hub is engaging directorates, programmes, units and
              agencies to understand how health data is generated, managed, shared and used — and
              where better integration can strengthen operational decision-making.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold text-sm px-7 py-4 rounded-xl shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a 360° Engagement</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 text-sm font-semibold px-6 py-4 rounded-xl transition-all"
              >
                <span>Learn About the Tour</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Trust line */}
            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Non-Technical & Directorate-Friendly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Integrates with HOS Lakehouse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero Burdensome Paperwork</span>
              </div>
            </div>
          </div>

          {/* Visual: Data Sources → Discovery → Trusted Data → Intelligence → Decisions */}
          <div className="mt-14 max-w-5xl mx-auto">
            <DataFlowVisual />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: WHY THE 360° TOUR?
      ====================================================================== */}
      <section id="why" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
              Understanding the Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why the 360° Discovery Tour?
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Health data currently comes from different systems, tools and processes. The 360° Discovery
              Tour helps NHIH understand these systems and workflows before building deeper intelligence
              and integration.
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-institutional p-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-1">
                  Challenge 01
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  DATA IS FRAGMENTED
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  “Data may exist across DHIS2, mSupply, Excel, registers and other systems.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Different programmes use custom tools tailored to their vertical requirements without a unified link.
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-institutional p-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                  <EyeOff className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest mb-1">
                  Challenge 02
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  VISIBILITY IS LIMITED
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  “Important operational information may not be visible across programmes in one shared view.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Supply chain managers and clinical leads rarely have a synchronized perspective on facility stock vs disease spikes.
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-institutional p-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <Crosshair className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest mb-1">
                  Challenge 03
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  DECISIONS NEED CONTEXT
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  “Understanding how data is generated and used helps explain what is happening and where action is needed.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Raw numbers alone cannot reveal operational bottlenecks without knowing the field context and reporting workflows.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: WHAT IS THE 360° DISCOVERY TOUR?
      ====================================================================== */}
      <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              The Initiative
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What is the 360° Discovery Tour?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              “The 360° Discovery Tour is a structured engagement designed to understand each
              programme’s data sources, workflows, decision-making processes, reporting requirements
              and operational challenges.”
            </p>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              The engagement model is being applied across stakeholder groups to ensure that
              directorates, disease programmes, logistics agencies, and units co-design the future of
              national health intelligence together.
            </p>
          </div>

          {/* 5 Major Steps */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                The 5-Step Engagement Framework
              </h3>
              <span className="text-xs text-slate-500">Systematic sector-wide approach</span>
            </div>
            <FrameworkSteps />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: THE THREE-DAY ENGAGEMENT
      ====================================================================== */}
      <section id="cycle" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
              Engagement Lifecycle
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Three-Day Engagement Cycle
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Every participating directorate or programme progresses through a structured 3-day cycle.
              This provides adequate time for high-level governance alignment, technical database mapping,
              and executive consolidation.
            </p>
          </div>

          <Timeline3Day />
        </div>
      </section>

      {/* =====================================================================
          SECTION: WHAT WILL WE DISCUSS?
      ====================================================================== */}
      <section id="topics" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
              Technical & Operational Scope
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Will We Discuss?
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Our dialogue focuses on six practical operational dimensions. You do not need to prepare
              complex presentation slides — our discovery facilitators guide the session interactively.
            </p>
          </div>

          <DiscussionTopics />
        </div>
      </section>

      {/* =====================================================================
          SECTION: WHAT SHOULD YOU PREPARE?
      ====================================================================== */}
      <section id="prepare" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A192F] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-4">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider inline-block">
                  Preparation Advice
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  What Should You Prepare?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Programmes do <strong className="text-white">not</strong> need to prepare a complicated
                  presentation or formal slide deck.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Simply bring your team and be ready to discuss your daily workflows, the systems you use,
                  the data you trust, and where integration can save hours of manual reconciliation.
                </p>

                <div className="pt-4">
                  <Link
                    href="/prepare"
                    className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#0A192F] font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    <span>Prepare for Your Engagement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-[#070e1b]/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
                    Be Ready to Discuss:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {preparationItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5"
                      >
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                            {item.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: WHAT HAPPENS AFTER THE TOUR?
      ====================================================================== */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              Value & Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Happens After the Tour?
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              The 360° Discovery Tour is not an isolated exercise. It feeds directly into the trusted data
              foundation used by the <strong className="text-slate-900">NHIH / HOS Intelligence Layer</strong>.
            </p>
          </div>

          {/* Journey Flow Vertical/Grid */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {journeySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="card-institutional p-5 rounded-2xl border border-slate-200 flex flex-col justify-between relative group hover:border-teal-500/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-full bg-[#0A192F] text-teal-300 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {idx < journeySteps.length - 1 && (
                        <span className="text-[10px] font-mono text-slate-400">Step →</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1 tracking-tight group-hover:text-teal-700 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                    <span>Phase 0{idx + 1}</span>
                    <CheckCircle className="w-3 h-3 text-teal-600" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs text-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-teal-950">
                    Trusted Data Foundation
                  </strong>
                  <span className="text-teal-800">
                    Your discovery outcomes directly feed the NHIH Operational Dashboard and Intelligence Layer.
                  </span>
                </div>
              </div>
              <Link
                href="/intelligence"
                className="font-bold text-teal-800 hover:text-teal-950 underline underline-offset-4 shrink-0"
              >
                Inspect Intelligence Architecture →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          HOMEPAGE FINAL CTA
      ====================================================================== */}
      <section className="py-20 bg-gradient-to-br from-[#070e1b] via-[#0A192F] to-[#102341] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mx-auto text-teal-400 shadow-lg shadow-teal-500/10">
            <Calendar className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Ready to begin your 360° Discovery Engagement?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            “Help us understand your data, workflows and operational needs.”
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-orange-600/30 transition-all hover:scale-[1.02]"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Your Engagement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/prepare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm px-6 py-4 rounded-xl transition-all"
            >
              <span>Download Preparation Brief</span>
            </Link>
          </div>

          <p className="text-xs text-slate-400 pt-4">
            National Health Information Hub • Directorate of Policy, Planning & Information (DPPI)
          </p>
        </div>
      </section>
    </div>
  );
}
