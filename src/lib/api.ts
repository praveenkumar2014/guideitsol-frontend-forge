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

export interface UpiIntentPayload {
  batch_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  note?: string;
}

export interface UpiIntentResponse {
  order_id: string;
  reference: string;
  amount: number;
  course_title: string;
  status: string;
}

export interface CatalogCourseRow {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  format: string;
  price: number | string;
  summary: string;
  overview: string;
  curriculum?: Array<Record<string, unknown>>;
  tools?: string[];
  published?: boolean;
  updated_at?: string;
}

export interface CatalogBatchRow {
  id: string;
  course_slug: string;
  name: string;
  start_date: string;
  end_date: string;
  days: string;
  time: string;
  seats: number;
  available: number;
  mode: string;
  instructor: string;
  status: string;
  price: number | string;
  updated_at?: string;
  courses?: { title?: string } | null;
}

export interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_on: string;
  read_time: string;
  category: string;
  image: string;
  content: string[] | unknown;
  published?: boolean;
}

export interface AdminPaymentRow {
  order_id: string;
  course_slug: string;
  batch_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  payment_method?: string;
  reference?: string | null;
  status: string;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at?: string;
}

export interface SchemaTable {
  name: string;
  rows: number;
}

/**
 * API base URL resolution.
 *
 * - In the browser: same-origin relative paths ("") by default, so the host
 *   that served the page proxies /api/* to the FastAPI service. A configured
 *   VITE_PUBLIC_API_BASE_URL is honoured unless it points at localhost (which
 *   would break every visitor's browser).
 * - During SSR: fetch needs an absolute URL. Use VITE_PUBLIC_API_BASE_URL when
 *   it is absolute, otherwise VITE_SSR_API_BASE_URL, otherwise the local API.
 */
const CONFIGURED_API_BASE =
  (import.meta.env.VITE_PUBLIC_API_BASE_URL as string | undefined) ||
  (import.meta.env.PUBLIC_API_BASE_URL as string | undefined) ||
  "";
const SSR_API_BASE =
  (import.meta.env.VITE_SSR_API_BASE_URL as string | undefined) || "http://localhost:8000";

function resolveApiBase(): string {
  if (typeof window === "undefined") {
    return (CONFIGURED_API_BASE || SSR_API_BASE).replace(/\/$/, "");
  }
  const usable = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(CONFIGURED_API_BASE)
    ? ""
    : CONFIGURED_API_BASE;
  return usable.replace(/\/$/, "");
}

export const API_BASE = resolveApiBase();

function adminHeaders(adminKey?: string, token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminKey) headers["X-Admin-Key"] = adminKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  return await handleResponse<T>(res);
}

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

  // -------------------------------------------------------------------------
  // Dynamic catalogue hydration (headless CMS)
  // -------------------------------------------------------------------------
  async getCourses(): Promise<CatalogCourseRow[]> {
    return await fetchJson<CatalogCourseRow[]>("/api/courses");
  },

  async getBatches(): Promise<CatalogBatchRow[]> {
    return await fetchJson<CatalogBatchRow[]>("/api/batches");
  },

  async getBlogPosts(): Promise<BlogPostRow[]> {
    return await fetchJson<BlogPostRow[]>("/api/blog");
  },

  // -------------------------------------------------------------------------
  // UPI / GPay direct payment intents
  // -------------------------------------------------------------------------
  async createUpiIntent(payload: UpiIntentPayload): Promise<UpiIntentResponse> {
    const res = await fetch(`${API_BASE}/api/payments/upi-intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await handleResponse<UpiIntentResponse>(res);
  },

  // -------------------------------------------------------------------------
  // Admin: payment reconciliation
  // -------------------------------------------------------------------------
  async getAdminPayments(
    adminKey: string,
    options: { status?: string; search?: string; page?: number } = {},
    token?: string,
  ): Promise<{ items: AdminPaymentRow[]; total: number; page: number; page_size: number }> {
    const params = new URLSearchParams({ page: String(options.page ?? 1), page_size: "25" });
    if (options.status && options.status !== "all") params.append("payment_status", options.status);
    if (options.search) params.append("search", options.search);
    return await fetchJson(`/api/admin/payments?${params.toString()}`, {
      headers: adminHeaders(adminKey, token),
    });
  },

  async verifyAdminPayment(
    adminKey: string,
    orderId: string,
    token?: string,
  ): Promise<AdminPaymentRow> {
    return await fetchJson<AdminPaymentRow>(`/api/admin/payments/${orderId}/verify`, {
      method: "POST",
      headers: adminHeaders(adminKey, token),
    });
  },

  async rejectAdminPayment(
    adminKey: string,
    orderId: string,
    token?: string,
  ): Promise<AdminPaymentRow> {
    return await fetchJson<AdminPaymentRow>(`/api/admin/payments/${orderId}/reject`, {
      method: "POST",
      headers: adminHeaders(adminKey, token),
    });
  },

  // -------------------------------------------------------------------------
  // Admin: live catalogue CRUD
  // -------------------------------------------------------------------------
  async upsertCourse(
    adminKey: string,
    course: Partial<CatalogCourseRow> & { slug: string; title: string; category: string },
    token?: string,
  ): Promise<CatalogCourseRow> {
    return await fetchJson<CatalogCourseRow>("/api/admin/courses", {
      method: "POST",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(course),
    });
  },

  async updateCourse(
    adminKey: string,
    slug: string,
    updates: Record<string, unknown>,
    token?: string,
  ): Promise<CatalogCourseRow> {
    return await fetchJson<CatalogCourseRow>(`/api/admin/courses/${slug}`, {
      method: "PATCH",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(updates),
    });
  },

  async deleteCourse(adminKey: string, slug: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/courses/${slug}`, {
      method: "DELETE",
      headers: adminHeaders(adminKey, token),
    });
    await handleResponse<void>(res);
  },

  async upsertBatch(
    adminKey: string,
    batch: Record<string, unknown> & { id: string; course_slug: string; name: string },
    token?: string,
  ): Promise<CatalogBatchRow> {
    return await fetchJson<CatalogBatchRow>("/api/admin/batches", {
      method: "POST",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(batch),
    });
  },

  async updateBatch(
    adminKey: string,
    batchId: string,
    updates: Record<string, unknown>,
    token?: string,
  ): Promise<CatalogBatchRow> {
    return await fetchJson<CatalogBatchRow>(`/api/admin/batches/${batchId}`, {
      method: "PATCH",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(updates),
    });
  },

  async deleteBatch(adminKey: string, batchId: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/batches/${batchId}`, {
      method: "DELETE",
      headers: adminHeaders(adminKey, token),
    });
    await handleResponse<void>(res);
  },

  async upsertBlogPost(
    adminKey: string,
    post: Record<string, unknown> & { slug: string; title: string },
    token?: string,
  ): Promise<BlogPostRow> {
    return await fetchJson<BlogPostRow>("/api/admin/blog", {
      method: "POST",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(post),
    });
  },

  async updateBlogPost(
    adminKey: string,
    slug: string,
    updates: Record<string, unknown>,
    token?: string,
  ): Promise<BlogPostRow> {
    return await fetchJson<BlogPostRow>(`/api/admin/blog/${slug}`, {
      method: "PATCH",
      headers: adminHeaders(adminKey, token),
      body: JSON.stringify(updates),
    });
  },

  async deleteBlogPost(adminKey: string, slug: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/blog/${slug}`, {
      method: "DELETE",
      headers: adminHeaders(adminKey, token),
    });
    await handleResponse<void>(res);
  },

  // -------------------------------------------------------------------------
  // Admin: schema & role viewer
  // -------------------------------------------------------------------------
  async getAdminSchema(
    adminKey: string,
    token?: string,
  ): Promise<{ tables: SchemaTable[]; role_permissions: Record<string, string[]> }> {
    return await fetchJson("/api/admin/schema", { headers: adminHeaders(adminKey, token) });
  },
};
