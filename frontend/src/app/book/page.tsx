"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  CalendarPlus,
  RefreshCw,
  Building,
  Check,
  Share2,
} from "lucide-react";
import {
  fetchProgrammes,
  fetchSpaces,
  checkAvailability,
  submitBooking,
  Programme,
  Space,
  AvailabilityResponse,
  BookingResult,
} from "@/lib/api";

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Options
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  // Form State
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number | "">("");
  const [engagementType, setEngagementType] = useState<string>("full_360");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredStartTime, setPreferredStartTime] = useState<string>("09:30");
  const [expectedDurationHours, setExpectedDurationHours] = useState<number>(3);
  const [calculatedEndTime, setCalculatedEndTime] = useState<string>("12:30");
  const [participantCount, setParticipantCount] = useState<number>(8);
  const [contactPerson, setContactPerson] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [locationPreference, setLocationPreference] = useState<string>("NHIH Intelligence War Room");
  const [spaceId, setSpaceId] = useState<number | null>(null);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>("");

  // Availability State
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResponse | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState<boolean>(false);

  // Booking Result
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResult | null>(null);

  // Calculate default date (3 business days ahead)
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    // If weekend, push to Monday
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    setPreferredDate(d.toISOString().split("T")[0]);
  }, []);

  // Calculate end time automatically based on duration
  useEffect(() => {
    if (!preferredStartTime) return;
    const [hours, minutes] = preferredStartTime.split(":").map(Number);
    const endH = Math.min(hours + expectedDurationHours, 17);
    const endHStr = endH.toString().padStart(2, "0");
    const endMStr = (minutes || 0).toString().padStart(2, "0");
    setCalculatedEndTime(`${endHStr}:${endMStr}`);
    // Reset availability when date or time changes
    setAvailabilityChecked(false);
    setAvailabilityResult(null);
  }, [preferredStartTime, expectedDurationHours, preferredDate]);

  // Load programmes and spaces from backend
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [progs, sps] = await Promise.all([fetchProgrammes(), fetchSpaces()]);
        setProgrammes(progs);
        setSpaces(sps);
        if (progs.length > 0 && !selectedProgrammeId) {
          // Pre-select first
          setSelectedProgrammeId(progs[0].id);
          if (progs[0].contact_person) setContactPerson(progs[0].contact_person);
          if (progs[0].contact_email) setContactEmail(progs[0].contact_email);
          if (progs[0].contact_phone) setContactPhone(progs[0].contact_phone);
        }
      } catch (err: any) {
        console.error("Failed to load initial booking data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update contact person defaults when programme selection changes
  const handleProgrammeChange = (progId: number) => {
    setSelectedProgrammeId(progId);
    const prog = programmes.find((p) => p.id === progId);
    if (prog) {
      if (prog.contact_person) setContactPerson(prog.contact_person);
      if (prog.contact_email) setContactEmail(prog.contact_email);
      if (prog.contact_phone) setContactPhone(prog.contact_phone);
    }
  };

  // Run Availability Check
  const runAvailabilityCheck = async () => {
    if (!preferredDate || !preferredStartTime) {
      setErrorMsg("Please select a valid date and start time first.");
      return;
    }
    setErrorMsg(null);
    setCheckingAvailability(true);
    try {
      const res = await checkAvailability({
        requested_date: preferredDate,
        start_time: `${preferredStartTime}:00`,
        end_time: `${calculatedEndTime}:00`,
        space_id: spaceId,
      });
      setAvailabilityResult(res);
      setAvailabilityChecked(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to query backend availability.");
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Handle final submission to backend (with DB-level advisory locking)
  const handleConfirmBooking = async () => {
    if (!selectedProgrammeId) {
      setErrorMsg("Please select a programme.");
      return;
    }
    if (!contactPerson || !contactEmail) {
      setErrorMsg("Please provide primary contact name and email.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        programme_id: Number(selectedProgrammeId),
        engagement_type: engagementType,
        requested_date: preferredDate,
        start_time: `${preferredStartTime}:00`,
        end_time: `${calculatedEndTime}:00`,
        location: locationPreference,
        contact_person: contactPerson,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        participant_count: Number(participantCount),
        space_id: spaceId,
        additional_requirements: additionalRequirements,
      };

      const result = await submitBooking(payload);
      setConfirmedBooking(result);
      setCurrentStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || "Conflict detected: This slot was booked simultaneously. Please select another time.");
      // Move back to Step 3 so user can see alternative slots
      setCurrentStep(3);
      runAvailabilityCheck();
    } finally {
      setLoading(false);
    }
  };

  // Generate .ICS Calendar File
  const downloadIcsCalendar = () => {
    if (!confirmedBooking) return;
    const progName = selectedProgramme?.name || "MoH Programme";
    const dateStr = confirmedBooking.requested_date.replace(/-/g, "");
    const startStr = confirmedBooking.start_time.replace(/:/g, "").slice(0, 6);
    const endStr = confirmedBooking.end_time.replace(/:/g, "").slice(0, 6);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NHIH Sierra Leone//360 Discovery Tour//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${confirmedBooking.booking_reference}@nhih.gov.sl`,
      `DTSTAMP:${dateStr}T${startStr}Z`,
      `DTSTART:${dateStr}T${startStr}`,
      `DTEND:${dateStr}T${endStr}`,
      `SUMMARY:NHIH 360° Discovery Tour: ${progName}`,
      `DESCRIPTION:360° Discovery Engagement with the National Health Information Hub (NHIH / DPPI).\\nReference: ${confirmedBooking.booking_reference}\\nContact: ${confirmedBooking.contact_person}`,
      `LOCATION:${confirmedBooking.location || "NHIH Intelligence War Room, Youyi Building"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${confirmedBooking.booking_reference}_360_Tour.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Print Slip
  const printConfirmation = () => {
    window.print();
  };

  const selectedProgramme = programmes.find((p) => p.id === Number(selectedProgrammeId));

  const steps = [
    { num: 1, label: "Programme" },
    { num: 2, label: "Details" },
    { num: 3, label: "Availability" },
    { num: 4, label: "Review" },
    { num: 5, label: "Confirmed" },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Official Booking Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule a 360° Discovery Engagement
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Reserve dedicated time with the National Health Information Hub (NHIH) discovery team to
            review your programme's data landscape and workflows.
          </p>
        </div>

        {/* Wizard Steps Stepper Bar */}
        <div className="mb-10 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 w-full -z-0" />
            {steps.map((s) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isPast
                        ? "bg-teal-600 text-white"
                        : isCurrent
                        ? "bg-[#0A192F] text-teal-400 ring-4 ring-teal-500/20"
                        : "bg-white text-slate-400 border-2 border-slate-300"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      isCurrent ? "text-slate-900" : isPast ? "text-teal-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Scheduling Notice</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Wizard Step Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 relative">
          {/* =================================================================
              STEP 1: SELECT PROGRAMME
          ================================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Step 01 of 04
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Select Directorate, Programme or Agency
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the Ministry entity that will be participating in the 360° Discovery Tour.
                  This list is dynamically populated from the central MoH registry.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Directorate / Programme / Unit / Agency *
                  </label>
                  <select
                    value={selectedProgrammeId}
                    onChange={(e) => handleProgrammeChange(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium"
                  >
                    <option value="" disabled>
                      Select an organisation...
                    </option>
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} [{p.programme_type.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProgramme && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {selectedProgramme.name}
                      </span>
                      <span className="badge-tag bg-teal-100 text-teal-800 uppercase text-[10px]">
                        {selectedProgramme.programme_type}
                      </span>
                    </div>
                    {selectedProgramme.description && (
                      <p className="text-slate-600 leading-relaxed">
                        {selectedProgramme.description}
                      </p>
                    )}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-4 text-slate-500">
                      {selectedProgramme.contact_person && (
                        <span>Focal Lead: <strong>{selectedProgramme.contact_person}</strong></span>
                      )}
                      {selectedProgramme.contact_email && (
                        <span>Email: <strong>{selectedProgramme.contact_email}</strong></span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  disabled={!selectedProgrammeId}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all"
                >
                  <span>Continue to Engagement Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 2: ENGAGEMENT DETAILS
          ================================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Step 02 of 04
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Engagement Details & Timing
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify your preferred time window, attendance size, and venue preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Engagement Type */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Engagement Type *
                  </label>
                  <select
                    value={engagementType}
                    onChange={(e) => setEngagementType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="full_360">Full 360° Discovery Cycle (3-Day Process)</option>
                    <option value="data_discovery">Focused Data Source Discovery Session</option>
                    <option value="twg_session">Health Intelligence TWG Integration Session</option>
                    <option value="follow_up">Roadmap Validation Follow-up</option>
                  </select>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Lead time: At least 2 business days recommended
                  </span>
                </div>

                {/* Preferred Start Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Start Time *
                  </label>
                  <select
                    value={preferredStartTime}
                    onChange={(e) => setPreferredStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="08:30">08:30 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Expected Duration (Hours)
                  </label>
                  <select
                    value={expectedDurationHours}
                    onChange={(e) => setExpectedDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={2}>2 Hours (Introductory Briefing)</option>
                    <option value={3}>3 Hours (Standard Discovery Session)</option>
                    <option value={4}>4 Hours (Half Day Technical Mapping)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Calculated end time: <strong>{calculatedEndTime}</strong>
                  </span>
                </div>

                {/* Participant Count */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Recommended: 4 to 12 core officers
                  </span>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Full name & title"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. name@mohs.gov.sl"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+232 76 ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Location Preference */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location Preference
                  </label>
                  <select
                    value={locationPreference}
                    onChange={(e) => {
                      setLocationPreference(e.target.value);
                      const sp = spaces.find((s) => s.name === e.target.value);
                      setSpaceId(sp ? sp.id : null);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="NHIH Intelligence War Room">NHIH Intelligence War Room (5th Floor Youyi Bldg)</option>
                    <option value="DPPI Strategic Boardroom">DPPI Strategic Boardroom (Brookfields)</option>
                    <option value="MoH Executive Conference Suite">MoH Executive Conference Suite (4th Floor Youyi Bldg)</option>
                    <option value="Virtual Engagement (Teams / WebEx)">Virtual Engagement (Microsoft Teams)</option>
                  </select>
                </div>

                {/* Additional Requirements */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Additional Requirements or Special Considerations
                  </label>
                  <textarea
                    rows={2}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="Specific databases to review (DHIS2, mSupply, etc.), partner attendees (WHO/UNICEF), or projection equipment requirements."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Programme</span>
                </button>

                <button
                  type="button"
                  disabled={!contactPerson || !contactEmail || !preferredDate}
                  onClick={() => {
                    setCurrentStep(3);
                    runAvailabilityCheck();
                  }}
                  className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all"
                >
                  <span>Check Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 3: AVAILABILITY CHECK
          ================================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Step 03 of 04
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Slot Availability Verification
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Querying the NHIH booking database to prevent scheduling conflicts and double bookings.
                </p>
              </div>

              {/* Slot Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Requested Date & Time
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {preferredDate} from {preferredStartTime} to {calculatedEndTime}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Location
                  </span>
                  <span className="font-semibold text-slate-800">
                    {locationPreference}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={runAvailabilityCheck}
                  disabled={checkingAvailability}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-semibold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingAvailability ? "animate-spin" : ""}`} />
                  <span>Re-check Slot</span>
                </button>
              </div>

              {/* Live Availability Outcome */}
              {checkingAvailability ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto mb-2" />
                  <span className="text-xs text-slate-600 font-medium">
                    Verifying calendar constraints & database concurrency locks...
                  </span>
                </div>
              ) : availabilityResult ? (
                <div>
                  {availabilityResult.available ? (
                    /* GREEN: AVAILABLE */
                    <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm sm:text-base text-emerald-900 block">
                            Available
                          </span>
                          <span className="text-xs text-emerald-700">
                            The requested date and time slot is open and available for reservation.
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          PostgreSQL transaction-level concurrency locking will protect this slot during confirmation.
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* RED: OCCUPIED */
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-sm sm:text-base text-rose-900 block">
                              This time slot is unavailable.
                            </span>
                            <span className="text-xs text-rose-700">
                              Another engagement is already scheduled during this window.
                            </span>
                          </div>
                        </div>

                        {availabilityResult.conflicts.length > 0 && (
                          <div className="pt-2 text-xs text-rose-800">
                            <strong>Conflicting booking:</strong>{" "}
                            {availabilityResult.conflicts[0].programme} (
                            {availabilityResult.conflicts[0].start_time} -{" "}
                            {availabilityResult.conflicts[0].end_time})
                          </div>
                        )}
                      </div>

                      {/* Alternative Available Slots */}
                      {availabilityResult.alternative_slots.length > 0 && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                            Suggested Available Alternative Slots:
                          </span>
                          <p className="text-xs text-slate-500 mb-3">
                            Click any alternative below to automatically adopt the recommended date and time:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availabilityResult.alternative_slots.map((alt, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setPreferredDate(alt.date);
                                  setPreferredStartTime(alt.start_time.slice(0, 5));
                                  runAvailabilityCheck();
                                }}
                                className="p-3 text-left rounded-xl bg-white border border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-xs group"
                              >
                                <div className="font-bold text-slate-900 group-hover:text-teal-800">
                                  {alt.date}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {alt.start_time.slice(0, 5)} - {alt.end_time.slice(0, 5)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Adjust Details</span>
                </button>

                <button
                  type="button"
                  disabled={!availabilityResult?.available || checkingAvailability}
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all"
                >
                  <span>Proceed to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 4: REVIEW
          ================================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Step 04 of 04
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Review & Confirm Engagement
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Please verify your engagement parameters before submitting to the NHIH registry.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                <div className="p-4 sm:p-5 flex items-center justify-between bg-slate-100/70">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Participating Entity
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {selectedProgramme?.name}
                    </span>
                  </div>
                  <span className="badge-tag bg-teal-100 text-teal-900 uppercase">
                    {selectedProgramme?.programme_type}
                  </span>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Engagement Type
                    </span>
                    <span className="font-semibold text-slate-800">
                      {engagementType === "full_360"
                        ? "Full 360° Discovery (3-Day Process)"
                        : engagementType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Scheduled Date & Time
                    </span>
                    <span className="font-semibold text-slate-800">
                      {preferredDate} ({preferredStartTime} — {calculatedEndTime})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Location / Space
                    </span>
                    <span className="font-semibold text-slate-800">
                      {locationPreference}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Expected Participants
                    </span>
                    <span className="font-semibold text-slate-800">
                      {participantCount} participants
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Contact Person
                    </span>
                    <span className="font-semibold text-slate-800">
                      {contactPerson} ({contactEmail})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {contactPhone || "Not provided"}
                    </span>
                  </div>
                </div>

                {additionalRequirements && (
                  <div className="p-4 sm:p-5 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                      Additional Requirements
                    </span>
                    <span className="text-slate-700 italic">
                      "{additionalRequirements}"
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Backend Double-Booking Guard:</strong> Upon clicking Confirm, the system
                  verifies database locks. If a simultaneous submission occurs, you will be notified
                  instantly.
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Availability</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmBooking}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Locking Slot & Confirming...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Engagement</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 5: CONFIRMATION
          ================================================================== */}
          {currentStep === 5 && confirmedBooking && (
            <div className="space-y-8 text-center sm:text-left">
              {/* Success Badge */}
              <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-emerald-950">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="badge-tag bg-emerald-200 text-emerald-900 uppercase text-[10px]">
                    Booking Registered
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                    Your 360° Engagement has been scheduled.
                  </h2>
                  <p className="text-xs text-emerald-800">
                    A confirmation record has been generated and synced with the NHIH operational registry.
                  </p>
                </div>
              </div>

              {/* Official Booking Slip */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-md text-left relative overflow-hidden">
                <div className="border-b border-slate-200 pb-4 mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                      Booking Reference
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                      {confirmedBooking.booking_reference}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                      Initial Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Pending Verification</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Programme</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {confirmedBooking.programme_name || selectedProgramme?.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Engagement Type</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.engagement_type === "full_360"
                        ? "Full 360° Discovery Tour"
                        : confirmedBooking.engagement_type}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.requested_date} ({confirmedBooking.start_time} - {confirmedBooking.end_time})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.location || locationPreference}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Person</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.contact_person}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Email</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.contact_email}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>DPPI • National Health Information Hub</span>
                  <span>Ministry of Health, Sierra Leone</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadIcsCalendar}
                  className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-slate-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-400" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={printConfirmation}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download Confirmation Slip</span>
                </button>

                <Link
                  href={`/lookup?ref=${confirmedBooking.booking_reference}`}
                  className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-semibold text-xs px-5 py-3 rounded-xl transition-all"
                >
                  <span>Track Status Online</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold px-4 py-3"
                >
                  <span>Return Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
