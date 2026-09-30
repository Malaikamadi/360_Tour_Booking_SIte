/**
 * NHIH 360° Discovery Tour - Frontend API Client
 * Ministry of Health, Sierra Leone — DPPI
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Programme {
  id: number;
  name: string;
  programme_type: "directorate" | "programme" | "unit" | "agency";
  description?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
}

export interface Space {
  id: number;
  name: string;
  location?: string;
  capacity?: number;
  is_active: boolean;
}

export interface AvailabilityRequest {
  requested_date: string;
  start_time: string;
  end_time: string;
  space_id?: number | null;
}

export interface AvailabilityResponse {
  available: boolean;
  requested_date: string;
  start_time: string;
  end_time: string;
  conflicts: Array<{
    booking_reference: string;
    start_time: string;
    end_time: string;
    programme: string;
  }>;
  alternative_slots: Array<{
    date: string;
    start_time: string;
    end_time: string;
  }>;
}

export interface BookingPayload {
  programme_id: number;
  engagement_type: string;
  requested_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  participant_count: number;
  space_id?: number | null;
  additional_requirements?: string;
}

export interface BookingResult {
  id: number;
  booking_reference: string;
  programme_id: number;
  programme_name?: string;
  engagement_id?: number;
  engagement_type: string;
  requested_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  participant_count: number;
  status: "pending" | "confirmed" | "rescheduled" | "completed" | "cancelled";
  additional_requirements?: string;
  created_at: string;
}

export interface DashboardStats {
  upcoming_engagements: number;
  pending_requests: number;
  completed_engagements: number;
  engagements_in_progress: number;
  stakeholder_groups_engaged: number;
  outstanding_issues: number;
  total_data_sources: number;
  unintegrated_data_sources: number;
  total_challenges: number;
  critical_challenges: number;
}

export interface CalendarEvent {
  id: number;
  booking_reference: string;
  title: string;
  programme_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  contact_person: string;
  status: string;
  participant_count: number;
  engagement_id?: number | null;
}

export interface EngagementSummary {
  id: number;
  programme_id: number;
  programme_name: string;
  programme_type: string;
  engagement_type: string;
  status: string;
  day1_complete: boolean;
  day2_complete: boolean;
  day3_complete: boolean;
  day1_notes?: string;
  day2_notes?: string;
  day3_notes?: string;
  summary?: string;
  data_sources_count: number;
  challenges_count: number;
  issues_count: number;
  booking_reference?: string;
  requested_date?: string;
  start_time?: string;
  end_time?: string;
  contact_person?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("nhih_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---------------------------------------------------------------------------
// Public API Calls
// ---------------------------------------------------------------------------
export async function fetchProgrammes(): Promise<Programme[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/programmes/?active_only=true`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load programmes");
    return await res.json();
  } catch (err) {
    console.error("fetchProgrammes error:", err);
    // Return standard MoH fallback if network temporarily unavailable
    return [
      { id: 1, name: "Directorate of Policy, Planning & Information (DPPI)", programme_type: "directorate", is_active: true },
      { id: 2, name: "National Malaria Control Programme (NMCP)", programme_type: "programme", is_active: true },
      { id: 3, name: "Expanded Programme on Immunization (EPI)", programme_type: "programme", is_active: true },
      { id: 4, name: "Directorate of Reproductive & Child Health (RCH)", programme_type: "directorate", is_active: true },
      { id: 5, name: "Directorate of Disease Prevention and Control (DPC)", programme_type: "directorate", is_active: true },
      { id: 6, name: "Pharmacy and Supplies Directorate (PSD)", programme_type: "directorate", is_active: true },
      { id: 7, name: "Human Resources for Health Directorate (HRH)", programme_type: "directorate", is_active: true },
      { id: 8, name: "National HIV/AIDS Secretariat (NAS)", programme_type: "agency", is_active: true },
      { id: 9, name: "National Public Health Agency (NPHA)", programme_type: "agency", is_active: true },
      { id: 10, name: "National Medical Supplies Agency (NMSA)", programme_type: "agency", is_active: true },
    ];
  }
}

export async function fetchSpaces(): Promise<Space[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/spaces/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch spaces");
    return await res.json();
  } catch (err) {
    return [
      { id: 1, name: "NHIH Intelligence War Room", location: "5th Floor Youyi Building", capacity: 16, is_active: true },
      { id: 2, name: "DPPI Strategic Boardroom", location: "Ground Floor DPPI Annexe", capacity: 24, is_active: true },
      { id: 3, name: "MoH Executive Conference Suite", location: "4th Floor Youyi Building", capacity: 35, is_active: true },
      { id: 4, name: "NHIH Virtual Engagement Suite (Teams)", location: "Virtual / Teams HD", capacity: 100, is_active: true },
    ];
  }
}

export async function checkAvailability(req: AvailabilityRequest): Promise<AvailabilityResponse> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/check-availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || "Failed to verify slot availability.");
  }
  return await res.json();
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error(errorData.detail?.message || "This time slot is unavailable due to a scheduling conflict.");
    }
    throw new Error(errorData.detail || "Unable to complete booking. Please verify all fields.");
  }
  return await res.json();
}

export async function lookupBookingByReference(reference: string): Promise<BookingResult> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/reference/${encodeURIComponent(reference.trim())}`);
  if (!res.ok) {
    throw new Error("Booking not found. Please double-check your reference code.");
  }
  return await res.json();
}

// ---------------------------------------------------------------------------
// Operations & Staff API Calls
// ---------------------------------------------------------------------------
export async function loginUser(email: string, password: string): Promise<{ token: string; user?: any }> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Invalid email or password.");
  }

  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("nhih_token", data.access_token);
  }

  // Fetch me
  const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  const meData = meRes.ok ? await meRes.json() : null;

  return { token: data.access_token, user: meData };
}

export async function fetchCurrentUser(): Promise<any | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("nhih_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("nhih_token");
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load dashboard metrics");
  return await res.json();
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/calendar`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load calendar events");
  return await res.json();
}

export async function fetchEngagements(statusFilter?: string, programmeId?: number): Promise<EngagementSummary[]> {
  let url = `${API_BASE_URL}/api/engagements/?`;
  if (statusFilter && statusFilter !== "all") url += `status=${encodeURIComponent(statusFilter)}&`;
  if (programmeId) url += `programme_id=${programmeId}&`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to load engagements");
  return await res.json();
}

export async function fetchEngagementDetail(id: number): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load engagement dossier");
  return await res.json();
}

export async function updateEngagementMilestones(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}/milestones`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update milestone progress");
  return await res.json();
}

export async function addEngagementAssessment(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}/assessments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save findings");
  return await res.json();
}

export async function addEngagementDataSource(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}/data-sources`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add data source");
  return await res.json();
}

export async function addEngagementChallenge(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}/challenges`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to record challenge");
  return await res.json();
}

export async function addEngagementIssue(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/engagements/${id}/issues`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to log issue/value case");
  return await res.json();
}

export async function updateBookingStatus(id: number, status: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status?new_status=${encodeURIComponent(status)}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to update booking status");
  return await res.json();
}

export async function rescheduleBooking(id: number, newDate: string, startTime: string, endTime: string): Promise<any> {
  const res = await fetch(
    `${API_BASE_URL}/api/bookings/${id}/reschedule?new_date=${newDate}&new_start_time=${startTime}&new_end_time=${endTime}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || "Failed to reschedule booking. Slot may be occupied.");
  }
  return await res.json();
}

// ---------------------------------------------------------------------------
// Intelligence Layer Integration Calls
// ---------------------------------------------------------------------------
export async function fetchIntelligenceFacts(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/intelligence/facts`);
  if (!res.ok) throw new Error("Failed to load intelligence facts");
  return await res.json();
}

export async function fetchIntelligenceSignals(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/intelligence/signals`);
  if (!res.ok) throw new Error("Failed to load analytical signals");
  return await res.json();
}

export async function fetchIntelligenceBundle(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/intelligence/export`);
  if (!res.ok) throw new Error("Failed to export intelligence bundle");
  return await res.json();
}
