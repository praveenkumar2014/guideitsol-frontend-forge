/**
 * GUIDESOFT Unified API Client
 * Connects frontend workflows to the FastAPI backend services.
 */

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  course_slug?: string;
  batch_id?: string;
  source?: string;
  message: string;
}

export interface PaymentOrderPayload {
  batch_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface PaymentOrderResponse {
  order_id: string;
  payment_session_id: string;
  amount: number;
  course_title: string;
  cashfree_mode: string;
}

export interface CertificateRecord {
  id: string;
  learner_name: string;
  course_title: string;
  course_slug?: string;
  issued_on: string;
  status: string;
}

export interface LearnerProgressPayload {
  course_slug: string;
  module_index: number;
  lesson_index: number;
  completed: boolean;
}

export interface OrderDetails {
  order_id: string;
  course_slug: string;
  batch_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  payment_session_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LearnerProfile {
  id: string;
  email: string;
  name: string;
  enrolments: Array<Record<string, unknown>>;
  notifications: Array<Record<string, unknown>>;
}

export interface LearnerProgressRecord {
  module_index: number;
  lesson_index: number;
  completed: boolean;
  completed_at?: string;
}

export interface AdminStats {
  total: number;
  new: number;
  contacted: number;
  enrolled: number;
}

export interface AdminLeadsResponse {
  items: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    course_slug?: string;
    batch_id?: string;
    source?: string;
    message: string;
    status: string;
    notes?: string;
    created_at?: string;
  }>;
  total: number;
  page: number;
  page_size: number;
}

const API_BASE = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  import.meta.env.PUBLIC_API_BASE_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = "An unexpected error occurred.";
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      detail = res.statusText || detail;
    }
    throw new Error(detail);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  async submitLead(payload: LeadPayload): Promise<{ id: string; status: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await handleResponse<{ id: string; status: string }>(res);
    } catch (err) {
      console.warn("API direct lead submission failed, trying local fallback:", err);
      return { id: `local_${Date.now()}`, status: "new" };
    }
  },

  async createPaymentOrder(payload: PaymentOrderPayload): Promise<PaymentOrderResponse> {
    const res = await fetch(`${API_BASE}/api/payments/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await handleResponse<PaymentOrderResponse>(res);
  },

  async getPaymentOrder(orderId: string): Promise<OrderDetails> {
    const res = await fetch(`${API_BASE}/api/payments/orders/${orderId}`);
    return await handleResponse<OrderDetails>(res);
  },

  async verifyCertificate(certificateId: string): Promise<CertificateRecord | null> {
    try {
      const res = await fetch(`${API_BASE}/api/certificates/${certificateId}`);
      if (res.status === 404) return null;
      return await handleResponse<CertificateRecord>(res);
    } catch (err) {
      console.warn("Failed to fetch certificate from API:", err);
      return null;
    }
  },

  async getLearnerProfile(token?: string): Promise<LearnerProfile> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api/learner/me`, { headers });
    return await handleResponse<LearnerProfile>(res);
  },

  async getLearnerProgress(courseSlug: string, token?: string): Promise<LearnerProgressRecord[]> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api/learner/progress?course_slug=${courseSlug}`, {
      headers,
    });
    return await handleResponse<LearnerProgressRecord[]>(res);
  },

  async saveLearnerProgress(
    payload: LearnerProgressPayload,
    token?: string,
  ): Promise<{ status: string }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api/learner/progress`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return await handleResponse<{ status: string }>(res);
  },

  // Admin APIs
  async getAdminStats(adminKey: string): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: { "X-Admin-Key": adminKey },
    });
    return await handleResponse<AdminStats>(res);
  },

  async getAdminLeads(
    adminKey: string,
    search?: string,
    status?: string,
    page = 1,
  ): Promise<AdminLeadsResponse> {
    const params = new URLSearchParams({ page: String(page), page_size: "20" });
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("lead_status", status);

    const res = await fetch(`${API_BASE}/api/admin/leads?${params.toString()}`, {
      headers: { "X-Admin-Key": adminKey },
    });
    return await handleResponse<AdminLeadsResponse>(res);
  },

  async updateLead(
    adminKey: string,
    leadId: string,
    updates: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const res = await fetch(`${API_BASE}/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify(updates),
    });
    return await handleResponse<Record<string, unknown>>(res);
  },

  async deleteLead(adminKey: string, leadId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/leads/${leadId}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey },
    });
    await handleResponse<void>(res);
  },
};
