"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Database,
  Filter,
  Search,
  Check,
  X,
  RefreshCw,
  LogOut,
  ChevronRight,
  Plus,
  Building,
  UserCheck,
  ExternalLink,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  loginUser,
  fetchCurrentUser,
  logoutUser,
  fetchDashboardStats,
  fetchCalendarEvents,
  fetchEngagements,
  fetchEngagementDetail,
  updateEngagementMilestones,
  addEngagementAssessment,
  addEngagementDataSource,
  addEngagementChallenge,
  addEngagementIssue,
  updateBookingStatus,
  rescheduleBooking,
  fetchProgrammes,
  DashboardStats,
  CalendarEvent,
  EngagementSummary,
  Programme,
} from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>("admin@nhih.gov.sl");
  const [loginPassword, setLoginPassword] = useState<string>("Admin123!");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<"engagements" | "calendar" | "dossier" | "programmes">("engagements");

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programmeFilter, setProgrammeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Engagement for Dossier view
  const [selectedEngagementId, setSelectedEngagementId] = useState<number | null>(null);
  const [engagementDetail, setEngagementDetail] = useState<any | null>(null);
  const [dossierLoading, setDossierLoading] = useState<boolean>(false);

  // Modals state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState<string>("");
  const [newStartTime, setNewStartTime] = useState<string>("09:30");
  const [newEndTime, setNewEndTime] = useState<string>("12:30");

  const [findingsModalOpen, setFindingsModalOpen] = useState<boolean>(false);
  const [findingsText, setFindingsText] = useState<string>("");
  const [recommendationsText, setRecommendationsText] = useState<string>("");

  const [dataSourceModalOpen, setDataSourceModalOpen] = useState<boolean>(false);
  const [dsName, setDsName] = useState<string>("");
  const [dsSystemType, setDsSystemType] = useState<string>("DHIS2");
  const [dsFrequency, setDsFrequency] = useState<string>("Monthly");
  const [dsIntegrationStatus, setDsIntegrationStatus] = useState<string>("not_integrated");

  const [challengeModalOpen, setChallengeModalOpen] = useState<boolean>(false);
  const [chTitle, setChTitle] = useState<string>("");
  const [chDescription, setChDescription] = useState<string>("");
  const [chSeverity, setChSeverity] = useState<string>("medium");

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Check initial authentication
  useEffect(() => {
    async function checkAuth() {
      const user = await fetchCurrentUser();
      if (user) {
        setCurrentUser(user);
        loadAllData();
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      setCurrentUser(res.user || { full_name: "NHIH Staff", role: "nhih_admin" });
      loadAllData();
    } catch (err: any) {
      setAuthError(err.message || "Failed to log in.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, engs, cal, progs] = await Promise.all([
        fetchDashboardStats().catch(() => null),
        fetchEngagements().catch(() => []),
        fetchCalendarEvents().catch(() => []),
        fetchProgrammes().catch(() => []),
      ]);
      if (s) setStats(s);
      setEngagements(engs);
      setCalendarEvents(cal);
      setProgrammes(progs);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Dossier for single engagement
  const openDossier = async (engagementId: number) => {
    setSelectedEngagementId(engagementId);
    setActiveTab("dossier");
    setDossierLoading(true);
    try {
      const data = await fetchEngagementDetail(engagementId);
      setEngagementDetail(data);
    } catch (err) {
      console.error("Failed to load engagement detail:", err);
    } finally {
      setDossierLoading(false);
    }
  };

  // Milestone toggling
  const handleMilestoneUpdate = async (dayField: string, value: boolean, notesField?: string, notesVal?: string) => {
    if (!selectedEngagementId) return;
    try {
      const payload: any = { [dayField]: value };
      if (notesField && notesVal !== undefined) payload[notesField] = notesVal;

      await updateEngagementMilestones(selectedEngagementId, payload);
      // Reload detail
      const updated = await fetchEngagementDetail(selectedEngagementId);
      setEngagementDetail(updated);
      showSuccess("Milestone status updated successfully.");
      // Refresh list
      fetchEngagements().then(setEngagements);
    } catch (err: any) {
      alert(err.message || "Failed to update milestone.");
    }
  };

  // Status updates (Approve / Reject)
  const handleBookingStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      showSuccess(`Booking status changed to ${newStatus}.`);
      loadAllData();
      if (selectedEngagementId) {
        fetchEngagementDetail(selectedEngagementId).then(setEngagementDetail);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    }
  };

  // Reschedule submission
  const handleRescheduleSubmit = async () => {
    if (!rescheduleBookingId || !newDate) return;
    try {
      await rescheduleBooking(rescheduleBookingId, newDate, newStartTime, newEndTime);
      setRescheduleModalOpen(false);
      showSuccess("Booking rescheduled successfully.");
      loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to reschedule booking.");
    }
  };

  // Findings submission
  const handleSaveFindings = async () => {
    if (!selectedEngagementId) return;
    try {
      await addEngagementAssessment(selectedEngagementId, {
        assessment_type: "Discovery Findings & Governance Review",
        findings: findingsText,
        recommendations: recommendationsText,
      });
      setFindingsModalOpen(false);
      setFindingsText("");
      setRecommendationsText("");
      showSuccess("Findings recorded successfully.");
      const updated = await fetchEngagementDetail(selectedEngagementId);
      setEngagementDetail(updated);
    } catch (err: any) {
      alert(err.message || "Failed to save findings.");
    }
  };

  // Data source submission
  const handleSaveDataSource = async () => {
    if (!selectedEngagementId || !dsName) return;
    try {
      await addEngagementDataSource(selectedEngagementId, {
        name: dsName,
        system_type: dsSystemType,
        data_frequency: dsFrequency,
        integration_status: dsIntegrationStatus,
      });
      setDataSourceModalOpen(false);
      setDsName("");
      showSuccess("Data source registered.");
      const updated = await fetchEngagementDetail(selectedEngagementId);
      setEngagementDetail(updated);
    } catch (err: any) {
      alert(err.message || "Failed to add data source.");
    }
  };

  // Challenge submission
  const handleSaveChallenge = async () => {
    if (!selectedEngagementId || !chTitle) return;
    try {
      await addEngagementChallenge(selectedEngagementId, {
        title: chTitle,
        description: chDescription,
        severity: chSeverity,
      });
      setChallengeModalOpen(false);
      setChTitle("");
      setChDescription("");
      showSuccess("Operational challenge logged.");
      const updated = await fetchEngagementDetail(selectedEngagementId);
      setEngagementDetail(updated);
    } catch (err: any) {
      alert(err.message || "Failed to save challenge.");
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Filtered engagements
  const filteredEngagements = engagements.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (programmeFilter !== "all" && e.programme_id.toString() !== programmeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.programme_name?.toLowerCase().includes(q);
      const matchRef = e.booking_reference?.toLowerCase().includes(q);
      if (!matchName && !matchRef) return false;
    }
    return true;
  });

  // =========================================================================
  // VIEW: AUTHENTICATION LOGIN MODAL (When not logged in)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen py-16 px-4 bg-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0A192F] text-teal-400 flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              NHIH Operations Portal
            </h1>
            <p className="text-xs text-slate-500">
              National Health Information Hub • Directorate of Policy, Planning & Information
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
            >
              {authLoading ? "Authenticating..." : "Sign In to Operations Portal"}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">
              1-Click Demo Credentials:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("admin@nhih.gov.sl");
                  setLoginPassword("Admin123!");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 text-xs text-slate-700 font-medium"
              >
                Admin (admin@nhih.gov.sl)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("staff@nhih.gov.sl");
                  setLoginPassword("Staff123!");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 text-xs text-slate-700 font-medium"
              >
                Staff (staff@nhih.gov.sl)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED INTERNAL OPERATIONS DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-teal-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  NHIH Operations & Discovery Dashboard
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold uppercase">
                  {currentUser.role || "Staff"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Logged in as <strong>{currentUser.full_name || currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/intelligence"
              className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-2 rounded-xl font-semibold border border-teal-200"
            >
              <span>Intelligence Feed</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 px-3 py-2 rounded-xl font-medium border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Toast Success Message */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* ===================================================================
            DASHBOARD SUMMARY KPI CARDS
        ==================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Upcoming */}
          <div className="card-institutional p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Upcoming
            </span>
            <div className="text-2xl font-black text-slate-900">
              {stats?.upcoming_engagements ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Scheduled visits</span>
          </div>

          {/* Card 2: Pending */}
          <div className="card-institutional p-4 rounded-2xl border border-amber-200 bg-amber-50/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Pending Requests
            </span>
            <div className="text-2xl font-black text-amber-900">
              {stats?.pending_requests ?? 0}
            </div>
            <span className="text-[11px] text-amber-700 mt-1 block">Awaiting approval</span>
          </div>

          {/* Card 3: Completed */}
          <div className="card-institutional p-4 rounded-2xl border border-teal-200 bg-teal-50/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Completed
            </span>
            <div className="text-2xl font-black text-teal-900">
              {stats?.completed_engagements ?? 0}
            </div>
            <span className="text-[11px] text-teal-700 mt-1 block">3-Day cycles done</span>
          </div>

          {/* Card 4: In Progress */}
          <div className="card-institutional p-4 rounded-2xl border border-blue-200 bg-blue-50/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              In Progress
            </span>
            <div className="text-2xl font-black text-blue-900">
              {stats?.engagements_in_progress ?? 0}
            </div>
            <span className="text-[11px] text-blue-700 mt-1 block">Active discovery</span>
          </div>

          {/* Card 5: Stakeholder Groups */}
          <div className="card-institutional p-4 rounded-2xl border border-purple-200 bg-purple-50/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
              Stakeholders
            </span>
            <div className="text-2xl font-black text-purple-900">
              {stats?.stakeholder_groups_engaged ?? 4}
            </div>
            <span className="text-[11px] text-purple-700 mt-1 block">Groups engaged</span>
          </div>

          {/* Card 6: Outstanding Issues */}
          <div className="card-institutional p-4 rounded-2xl border border-rose-200 bg-rose-50/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
              Outstanding Issues
            </span>
            <div className="text-2xl font-black text-rose-900">
              {stats?.outstanding_issues ?? 0}
            </div>
            <span className="text-[11px] text-rose-700 mt-1 block">Gaps identified</span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("engagements")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "engagements"
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All Bookings & Engagements
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "calendar"
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Calendar Schedule
          </button>
          {selectedEngagementId && (
            <button
              onClick={() => setActiveTab("dossier")}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === "dossier"
                  ? "border-teal-600 text-teal-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Engagement Dossier #{selectedEngagementId}
            </button>
          )}
        </div>

        {/* ===================================================================
            TAB 1: ALL BOOKINGS & ENGAGEMENTS TABLE
        ==================================================================== */}
        {activeTab === "engagements" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programme or ref..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <select
                  value={programmeFilter}
                  onChange={(e) => setProgrammeFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="all">All Programmes</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right text-xs text-slate-500 self-center">
                Showing {filteredEngagements.length} of {engagements.length} records
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Programme / Directorate</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">3-Day Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEngagements.map((eng) => (
                    <tr key={eng.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {eng.booking_reference || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {eng.programme_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {eng.requested_date ? (
                          <div>
                            <span className="block font-medium">{eng.requested_date}</span>
                            <span className="text-[11px] text-slate-400">
                              {eng.start_time} - {eng.end_time}
                            </span>
                          </div>
                        ) : (
                          "Unscheduled"
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              eng.day1_complete
                                ? "bg-teal-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                            title="Day 1 Introduction"
                          >
                            D1
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              eng.day2_complete
                                ? "bg-teal-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                            title="Day 2 Discovery"
                          >
                            D2
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              eng.day3_complete
                                ? "bg-teal-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                            title="Day 3 Consolidation"
                          >
                            D3
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={eng.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {eng.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleBookingStatusChange(eng.id, "confirmed")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openDossier(eng.id)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold"
                        >
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEngagements.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No engagements match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: CALENDAR VIEW
        ==================================================================== */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Engagement Calendar & Room Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Confirmed and pending visits across DPPI conference suites and virtual rooms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calendarEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="card-institutional p-5 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-700">
                      {evt.booking_reference}
                    </span>
                    <StatusBadge status={evt.status} size="sm" />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {evt.programme_name}
                    </h4>
                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.start_time} - {evt.end_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {evt.engagement_id && (
                    <button
                      type="button"
                      onClick={() => evt.engagement_id && openDossier(evt.engagement_id)}
                      className="w-full text-center py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      Inspect Dossier
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: DETAILED ENGAGEMENT DOSSIER (Milestone tracker, findings logger)
        ==================================================================== */}
        {activeTab === "dossier" && (
          <div className="space-y-6">
            {dossierLoading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-medium">Loading engagement dossier...</span>
              </div>
            ) : engagementDetail ? (
              <div className="space-y-6">
                {/* Dossier Header */}
                <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs uppercase font-bold">
                        Engagement Dossier #{engagementDetail.id}
                      </span>
                      <StatusBadge status={engagementDetail.status} size="sm" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {engagementDetail.programme?.name}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Type: <strong>{engagementDetail.engagement_type}</strong> | Contact:{" "}
                      <strong>{engagementDetail.programme?.contact_person}</strong> (
                      {engagementDetail.programme?.contact_email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFindingsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Record Findings</span>
                    </button>
                    <button
                      onClick={() => setDataSourceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Data Source</span>
                    </button>
                    <button
                      onClick={() => setChallengeModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Challenge</span>
                    </button>
                  </div>
                </div>

                {/* 3-Day Milestone Completion Controls */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3-Day Engagement Cycle Milestones (Staff Verification)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Day 1 Milestone */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        engagementDetail.day1_complete
                          ? "bg-teal-50/50 border-teal-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">DAY 1: Introduction</span>
                        <input
                          type="checkbox"
                          checked={engagementDetail.day1_complete}
                          onChange={(e) =>
                            handleMilestoneUpdate("day1_complete", e.target.checked)
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        Vision, mandate and TWG participation confirmed.
                      </p>
                      <textarea
                        rows={2}
                        defaultValue={engagementDetail.day1_notes || ""}
                        onBlur={(e) =>
                          handleMilestoneUpdate("day1_complete", engagementDetail.day1_complete, "day1_notes", e.target.value)
                        }
                        placeholder="Day 1 notes & attendees..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Day 2 Milestone */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        engagementDetail.day2_complete
                          ? "bg-teal-50/50 border-teal-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">DAY 2: Discovery</span>
                        <input
                          type="checkbox"
                          checked={engagementDetail.day2_complete}
                          onChange={(e) =>
                            handleMilestoneUpdate("day2_complete", e.target.checked)
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        Data sources mapped, bottlenecks and issues logged.
                      </p>
                      <textarea
                        rows={2}
                        defaultValue={engagementDetail.day2_notes || ""}
                        onBlur={(e) =>
                          handleMilestoneUpdate("day2_complete", engagementDetail.day2_complete, "day2_notes", e.target.value)
                        }
                        placeholder="Day 2 discovery notes..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Day 3 Milestone */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        engagementDetail.day3_complete
                          ? "bg-teal-50/50 border-teal-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">DAY 3: Consolidation</span>
                        <input
                          type="checkbox"
                          checked={engagementDetail.day3_complete}
                          onChange={(e) =>
                            handleMilestoneUpdate("day3_complete", e.target.checked)
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        Roadmap signed off, follow-up cadence established.
                      </p>
                      <textarea
                        rows={2}
                        defaultValue={engagementDetail.day3_notes || ""}
                        onBlur={(e) =>
                          handleMilestoneUpdate("day3_complete", engagementDetail.day3_complete, "day3_notes", e.target.value)
                        }
                        placeholder="Day 3 consolidation notes..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid: Mapped Data Sources & Operational Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Sources */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-teal-600" />
                        <h4 className="text-sm font-bold text-slate-900">
                          Discovered Data Sources ({engagementDetail.data_sources?.length || 0})
                        </h4>
                      </div>
                      <button
                        onClick={() => setDataSourceModalOpen(true)}
                        className="text-xs text-teal-700 hover:underline font-semibold"
                      >
                        + Add Source
                      </button>
                    </div>

                    <div className="space-y-2">
                      {engagementDetail.data_sources?.map((ds: any) => (
                        <div key={ds.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{ds.name}</span>
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {ds.system_type}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Frequency: {ds.data_frequency || "Periodic"}</span>
                            <span className="font-semibold text-teal-700">{ds.integration_status}</span>
                          </div>
                        </div>
                      ))}
                      {(!engagementDetail.data_sources || engagementDetail.data_sources.length === 0) && (
                        <p className="text-xs text-slate-400 italic">No data sources mapped yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Operational Challenges */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <h4 className="text-sm font-bold text-slate-900">
                          Operational Challenges ({engagementDetail.operational_challenges?.length || 0})
                        </h4>
                      </div>
                      <button
                        onClick={() => setChallengeModalOpen(true)}
                        className="text-xs text-rose-700 hover:underline font-semibold"
                      >
                        + Log Challenge
                      </button>
                    </div>

                    <div className="space-y-2">
                      {engagementDetail.operational_challenges?.map((ch: any) => (
                        <div key={ch.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{ch.title}</span>
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                              {ch.severity}
                            </span>
                          </div>
                          {ch.description && (
                            <p className="mt-1 text-[11px] text-slate-600 leading-tight">
                              {ch.description}
                            </p>
                          )}
                        </div>
                      ))}
                      {(!engagementDetail.operational_challenges || engagementDetail.operational_challenges.length === 0) && (
                        <p className="text-xs text-slate-400 italic">No challenges logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recorded Assessments / Findings */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Formal Assessments & Recommendations
                      </h4>
                    </div>
                    <button
                      onClick={() => setFindingsModalOpen(true)}
                      className="text-xs text-teal-700 hover:underline font-semibold"
                    >
                      + Record New Findings
                    </button>
                  </div>

                  <div className="space-y-3">
                    {engagementDetail.assessments?.map((a: any) => (
                      <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>Assessed by {a.assessed_by} on {a.assessed_date}</span>
                          <span className="font-semibold text-slate-700">{a.assessment_type}</span>
                        </div>
                        {a.findings && (
                          <div>
                            <strong className="text-slate-800 block mb-0.5">Key Findings:</strong>
                            <p className="text-slate-600 leading-relaxed">{a.findings}</p>
                          </div>
                        )}
                        {a.recommendations && (
                          <div className="pt-2 border-t border-slate-200">
                            <strong className="text-teal-900 block mb-0.5">Strategic Recommendations:</strong>
                            <p className="text-teal-800 leading-relaxed">{a.recommendations}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!engagementDetail.assessments || engagementDetail.assessments.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No formal findings recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL: RECORD FINDINGS
      ====================================================================== */}
      {findingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Record Formal Findings & Recommendations
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Operational Findings</label>
                <textarea
                  rows={3}
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  placeholder="Document data architecture, completeness, offline latency..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Integration Recommendations</label>
                <textarea
                  rows={3}
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  placeholder="Recommended API connectors, MFL alignment, TWG action items..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFindingsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFindings}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Save Findings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD DATA SOURCE
      ====================================================================== */}
      {dataSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Register Data Source</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Name *</label>
                <input
                  type="text"
                  value={dsName}
                  onChange={(e) => setDsName(e.target.value)}
                  placeholder="e.g. DHIS2 Routine Malaria Tracker"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">System Type</label>
                <select
                  value={dsSystemType}
                  onChange={(e) => setDsSystemType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="DHIS2">DHIS2 Module</option>
                  <option value="mSupply">mSupply Warehouse</option>
                  <option value="e-IDSR">e-IDSR Alert System</option>
                  <option value="iHRIS">iHRIS Registry</option>
                  <option value="Excel">Excel / Spreadsheet</option>
                  <option value="Paper">Paper Register / Tally Card</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                <select
                  value={dsFrequency}
                  onChange={(e) => setDsFrequency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="Real-time">Real-time</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDataSourceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDataSource}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Save Source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LOG CHALLENGE
      ====================================================================== */}
      {challengeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Log Operational Challenge</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Challenge Title *</label>
                <input
                  type="text"
                  value={chTitle}
                  onChange={(e) => setChTitle(e.target.value)}
                  placeholder="e.g. Delayed transmission in remote chiefdoms"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity</label>
                <select
                  value={chSeverity}
                  onChange={(e) => setChSeverity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={chDescription}
                  onChange={(e) => setChDescription(e.target.value)}
                  placeholder="Operational impact..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setChallengeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChallenge}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Log Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
