"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Code2,
  FileJson,
} from "lucide-react";
import {
  fetchIntelligenceFacts,
  fetchIntelligenceSignals,
  fetchIntelligenceBundle,
} from "@/lib/api";

export default function IntelligencePage() {
  const [activeLayer, setActiveLayer] = useState<"facts" | "signals" | "reasoning" | "bundle">("signals");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    loadLayerData(activeLayer);
  }, [activeLayer]);

  const loadLayerData = async (layer: "facts" | "signals" | "reasoning" | "bundle") => {
    setLoading(true);
    try {
      let res;
      if (layer === "facts") res = await fetchIntelligenceFacts();
      else if (layer === "signals") res = await fetchIntelligenceSignals();
      else if (layer === "bundle") res = await fetchIntelligenceBundle();
      else {
        const full = await fetchIntelligenceBundle();
        res = full.reasoning_layer;
      }
      setData(res);
    } catch (err) {
      console.error("Failed to load intelligence layer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEndpoint = (path: string) => {
    navigator.clipboard.writeText(`${API_BASE_URL}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadJsonBundle = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `NHIH_HOS_Integration_${activeLayer}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const layersInfo = [
    {
      id: "facts",
      badge: "Layer A",
      title: "Operational Facts",
      endpoint: "/api/intelligence/facts",
      description:
        "Deterministic, verified registry of health information systems, programmes, and reporting flows across Sierra Leone Ministry of Health.",
      icon: Database,
      accent: "text-blue-500",
    },
    {
      id: "signals",
      badge: "Layer B",
      title: "Analytical Signals",
      endpoint: "/api/intelligence/signals",
      description:
        "Deterministic computations, coverage percentages, and system fragmentation indices without speculative text.",
      icon: Cpu,
      accent: "text-teal-400",
    },
    {
      id: "reasoning",
      badge: "Layer C",
      title: "AI Reasoning Context",
      endpoint: "/api/intelligence/reasoning-context",
      description:
        "Strictly factual, structured JSON payload prepared for consumption by the external NHIH / HOS Intelligence Layer engine. Enforces truth-in-data.",
      icon: ShieldCheck,
      accent: "text-purple-400",
    },
    {
      id: "bundle",
      badge: "Complete API",
      title: "Unified HOS Export",
      endpoint: "/api/intelligence/export",
      description:
        "Complete interoperability package combining Layers A, B, and C for automated consumption by the NHIH Operational Dashboard.",
      icon: Layers,
      accent: "text-orange-400",
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-[#0A192F] text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="badge-tag bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] uppercase font-bold">
                API Boundary Architecture
              </span>
              <span className="text-xs text-slate-400">
                HOS / NHIH Lakehouse Integration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              NHIH Operational Dashboard & Intelligence Layer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The 360° Discovery Portal exposes a clean REST API boundary that feeds directly into the
              existing National Health Information Hub (NHIH) Intelligence Layer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleCopyEndpoint(layersInfo.find((l) => l.id === activeLayer)?.endpoint || "/api/intelligence/signals")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "API URL Copied" : "Copy Endpoint URL"}</span>
            </button>

            <button
              onClick={downloadJsonBundle}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Payload</span>
            </button>
          </div>
        </div>

        {/* Conceptual Architecture Flow Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Separation of Concerns Principle
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The portal strictly avoids generating unsupported AI conclusions. It serves as the
                verified data collection and signal computation boundary.
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
              360° Portal → API → Database → NHIH HOS → Intelligence Layer
            </span>
          </div>

          {/* 4 Layer Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {layersInfo.map((layer) => {
              const Icon = layer.icon;
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? "bg-[#0A192F] text-white border-slate-900 shadow-xl ring-2 ring-teal-500/30 scale-[1.01]"
                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          isSelected ? "bg-slate-800 text-teal-400" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {layer.badge}
                      </span>
                      <Icon className={`w-4 h-4 ${layer.accent}`} />
                    </div>

                    <h3 className="font-bold text-sm mb-1">{layer.title}</h3>
                    <p
                      className={`text-xs leading-relaxed line-clamp-3 ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {layer.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/40 text-[10px] font-mono text-teal-500">
                    {layer.endpoint}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live JSON Data Viewer */}
        <div className="bg-[#070e1b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-teal-400" />
              <span className="font-mono text-teal-300">
                {layersInfo.find((l) => l.id === activeLayer)?.endpoint}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Live Backend Response</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadLayerData(activeLayer)}
                className="hover:text-white flex items-center gap-1 font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Re-query</span>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-x-auto max-h-[500px]">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                <span>Querying API Layer...</span>
              </div>
            ) : data ? (
              <pre className="font-mono text-xs text-teal-300/90 leading-relaxed">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No data received from backend.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
