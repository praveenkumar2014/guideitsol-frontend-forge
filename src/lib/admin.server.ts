// Admin server functions. These run only on the server and proxy the GUIDESOFT
// FastAPI admin endpoints. The admin key is kept in an httpOnly cookie and
// never shipped to the browser bundle.
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { apiBaseUrl } from "./env";
import type {
  AdminStats,
  BackendBatch,
  Certificate,
  Enrolment,
  LeadRecord,
  Paginated,
  PaymentOrder,
} from "./api";

const ADMIN_COOKIE = "guidesoft_admin";
const SESSION_DAYS = 14;

function adminHeaders(key: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Admin-Key": key,
  };
}

async function adminFetch(key: string, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: { ...adminHeaders(key), ...(init?.headers ?? {}) },
  });
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function unauthorized(message = "Admin session expired. Please sign in again.") {
  return new ApiError(message);
}

class ApiError extends Error {}

export function getAdminKey(): string {
  return getCookie(ADMIN_COOKIE) ?? "";
}

export const isAdminAuthenticated = createServerFn({ method: "GET" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    const key = getAdminKey();
    if (!key) return false;
    try {
      const response = await adminFetch(key, "/api/admin/stats");
      return response.ok;
    } catch {
      return false;
    }
  });

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    const { key } = data;
    if (!key || key.length < 8) {
      throw new ApiError("Please enter the admin access key.");
    }
    const response = await adminFetch(key, "/api/admin/stats");
    if (!response.ok) {
      throw new ApiError("Invalid admin access key.");
    }
    setCookie(ADMIN_COOKIE, key, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return (await readJson(response)) as AdminStats;
  });

export const logoutAdmin = createServerFn({ method: "POST" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    deleteCookie(ADMIN_COOKIE, { path: "/" });
    return { ok: true };
  });

export const adminGetStats = createServerFn({ method: "GET" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, "/api/admin/stats");
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as AdminStats;
  });

export const adminListLeads = createServerFn({ method: "GET" })
  .validator(
    (data: { search?: string; lead_status?: string; page?: number; page_size?: number }) =>
      data,
  )
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const params = new URLSearchParams();
    if (data.search) params.set("search", data.search);
    if (data.lead_status) params.set("lead_status", data.lead_status);
    params.set("page", String(data.page ?? 1));
    params.set("page_size", String(data.page_size ?? 20));
    const response = await adminFetch(key, `/api/admin/leads?${params.toString()}`);
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as Paginated<LeadRecord>;
  });

export const adminUpdateLead = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; body: Partial<LeadRecord> }) => data,
  )
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, `/api/admin/leads/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data.body),
    });
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as LeadRecord;
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, `/api/admin/leads/${data.id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw unauthorized();
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .validator(
    (data: { search?: string; order_status?: string; page?: number; page_size?: number }) =>
      data,
  )
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const params = new URLSearchParams();
    if (data.search) params.set("search", data.search);
    if (data.order_status) params.set("order_status", data.order_status);
    params.set("page", String(data.page ?? 1));
    params.set("page_size", String(data.page_size ?? 20));
    const response = await adminFetch(key, `/api/admin/orders?${params.toString()}`);
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as Paginated<PaymentOrder>;
  });

export const adminListBatches = createServerFn({ method: "GET" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, "/api/admin/batches");
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as BackendBatch[];
  });

export const adminUpdateBatch = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; body: Record<string, string | number> }) => data,
  )
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, `/api/admin/batches/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data.body),
    });
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as BackendBatch;
  });

export const adminListCertificates = createServerFn({ method: "GET" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, "/api/admin/certificates");
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as Certificate[];
  });

export const adminIssueCertificate = createServerFn({ method: "POST" })
  .validator(
    (data: { learner_name: string; course_title: string; course_slug?: string; issued_on: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, "/api/admin/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as Certificate;
  });

export const adminDeleteCertificate = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, `/api/admin/certificates/${data.id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw unauthorized();
    return { ok: true };
  });

export const adminListEnrolments = createServerFn({ method: "GET" })
  .validator((data: Record<string, never>) => data)
  .handler(async () => {
    const key = getAdminKey();
    if (!key) throw unauthorized();
    const response = await adminFetch(key, "/api/admin/enrolments");
    if (!response.ok) throw unauthorized();
    return (await readJson(response)) as Enrolment[];
  });