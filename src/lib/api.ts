import { apiBaseUrl } from "./env";

export class ApiError extends Error {
  readonly status: number;
  readonly detail: string | undefined;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string | null,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = { method, headers };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, init);
  } catch {
    throw new ApiError(0, "Network error. Please check your connection and try again.");
  }

  if (response.status === 204) return undefined as T;

  let payload: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : undefined;
    throw new ApiError(response.status, detail ?? `Request failed (${response.status})`, detail);
  }

  return payload as T;
}

// ---------------------------------------------------------------------------
// Types shared with the FastAPI backend
// ---------------------------------------------------------------------------

export type BackendCourse = {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  format: string;
  price: number;
  summary: string;
  overview: string;
  curriculum: {
    title: string;
    description: string;
    duration: string;
    lessons: { key: string; title: string; duration: string; type: string }[];
    assignment: string;
    project?: string;
  }[];
  tools: string[];
  published: boolean;
};

export type BackendBatch = {
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
  price: number;
  courses?: { title?: string } | null;
};

export type Certificate = {
  id: string;
  learner_name: string;
  course_title: string;
  course_slug?: string;
  issued_on: string;
  status: string;
};

export type PaymentOrder = {
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
};

export type CreatedOrder = {
  order_id: string;
  payment_session_id: string;
  amount: number;
  course_title: string;
  cashfree_mode: string;
};

export type Enrolment = {
  id?: string;
  user_email: string;
  batch_id: string;
  course_slug: string;
  payment_order_id?: string;
  amount: number;
  status: string;
  enrolled_at?: string;
  courses?: { title?: string } | null;
  batches?: { name?: string; start_date?: string; status?: string } | null;
};

export type LearnerNotification = {
  id?: string;
  title: string;
  body: string;
  read: boolean;
  created_at?: string;
};

export type LearnerProfile = {
  id: string;
  email: string;
  name: string;
  enrolments: Enrolment[];
  notifications: LearnerNotification[];
};

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course_slug?: string;
  batch_id?: string;
  source?: string;
  message: string;
  status: string;
  assigned_counsellor?: string;
  follow_up_at?: string;
  notes?: string;
  created_at: string;
};

export type AdminStats = {
  total_leads: number;
  leads_by_status: Record<string, number>;
  top_courses: { course_slug: string; count: number }[];
  total_orders: number;
  paid_revenue: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

export const publicApi = {
  health: () => request<{ status: string }>("GET", "/health"),
  courses: () => request<BackendCourse[]>("GET", "/api/courses"),
  course: (slug: string) => request<BackendCourse>("GET", `/api/courses/${slug}`),
  batches: () => request<BackendBatch[]>("GET", "/api/batches"),
  certificate: (id: string) => request<Certificate>("GET", `/api/certificates/${id}`),
  createLead: (lead: {
    name: string;
    email: string;
    phone?: string;
    course_slug?: string;
    batch_id?: string;
    source?: string;
    message: string;
  }) =>
    request<{ id: string; status: string }>("POST", "/api/leads", {
      source: "website",
      ...lead,
    }),
  createOrder: (order: {
    batch_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  }) => request<CreatedOrder>("POST", "/api/payments/orders", order),
  order: (orderId: string) => request<PaymentOrder>("GET", `/api/payments/orders/${orderId}`),
};

// ---------------------------------------------------------------------------
// Learner endpoints (Supabase JWT in Authorization header)
// ---------------------------------------------------------------------------

export type LessonProgress = {
  lesson_key: string;
  module_index: number;
  lesson_index: number;
  completed: boolean;
  completed_at?: string;
};

export const learnerApi = {
  me: (token: string) =>
    request<LearnerProfile>("GET", "/api/learner/me", undefined, token),
  progress: (courseSlug: string, token: string) =>
    request<LessonProgress[]>(
      "GET",
      `/api/learner/progress?course_slug=${encodeURIComponent(courseSlug)}`,
      undefined,
      token,
    ),
  saveProgress: (
    payload: {
      course_slug: string;
      module_index: number;
      lesson_index: number;
      completed: boolean;
    },
    token: string,
  ) => request<{ status: string }>("POST", "/api/learner/progress", payload, token),
};