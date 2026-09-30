"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Mail,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Shield,
  Download,
} from "lucide-react";
import { lookupBookingByReference, BookingResult } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

function LookupContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [reference, setReference] = useState<string>(initialRef);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (refCode?: string) => {
    const queryCode = refCode || reference;
    if (!queryCode.trim()) {
      setErrorMsg("Please enter a booking reference code.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setBooking(null);

    try {
      const res = await lookupBookingByReference(queryCode.trim());
      setBooking(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Booking reference not found. Please verify the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Status Tracking
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Check Engagement Booking Status
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Enter your NHIH booking reference number (e.g. NHIH-7A2F-89B1) to verify schedule
            confirmation and review tour milestones.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-md mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="Enter Reference (e.g. NHIH-7A2F-89B1)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              <span>{loading ? "Searching..." : "Track Booking"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Links */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Sample records to test:</span>
            <button
              type="button"
              onClick={() => {
                setReference("NHIH-7A2F-89B1");
                handleSearch("NHIH-7A2F-89B1");
              }}
              className="font-mono text-teal-700 hover:underline"
            >
              NHIH-7A2F-89B1 (NMCP)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setReference("NHIH-3C4D-99E2");
                handleSearch("NHIH-3C4D-99E2");
              }}
              className="font-mono text-teal-700 hover:underline"
            >
              NHIH-3C4D-99E2 (PSD)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setReference("NHIH-5E8A-12C4");
                handleSearch("NHIH-5E8A-12C4");
              }}
              className="font-mono text-teal-700 hover:underline"
            >
              NHIH-5E8A-12C4 (EPI)
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 mb-6">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Reference Notice</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Booking Result Card */}
        {booking && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 block">
                  Booking Reference
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-white">
                  {booking.booking_reference}
                </span>
                <span className="block text-xs text-slate-300 mt-0.5">
                  {booking.programme_name || "Ministry Directorate"}
                </span>
              </div>

              <div>
                <StatusBadge status={booking.status} size="lg" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Scheduled Date
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {booking.requested_date}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Time Window
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {booking.start_time} - {booking.end_time}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Assigned Venue
                  </span>
                  <span className="font-semibold text-slate-800">
                    {booking.location || "NHIH Intelligence War Room"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Confirmed Attendees
                  </span>
                  <span className="font-semibold text-slate-800">
                    {booking.participant_count} Officers
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Focal Contact
                  </span>
                  <span className="font-semibold text-slate-800">
                    {booking.contact_person}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Contact Email
                  </span>
                  <span className="font-semibold text-slate-800">
                    {booking.contact_email}
                  </span>
                </div>
              </div>
            </div>

            {/* Preparation notice */}
            <div className="p-6 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <strong className="block text-slate-900 font-semibold">
                    Have you prepared your data sources checklist?
                  </strong>
                  <span className="text-slate-500">
                    Review the 10 discussion items before your visit.
                  </span>
                </div>
              </div>

              <Link
                href="/prepare"
                className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-900 shrink-0"
              >
                <span>Read Preparation Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LookupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading lookup...</div>}>
      <LookupContent />
    </Suspense>
  );
}
