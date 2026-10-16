import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Banknote,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileText,
  KeyRound,
  Layers,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { RequireRole } from "@/components/require-role";
import { Section } from "@/components/training-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  api,
  type AdminPaymentRow,
  type CatalogBatchRow,
  type CatalogCourseRow,
  type BlogPostRow,
  type SchemaTable,
} from "@/lib/api";
import { ROLE_PERMISSIONS, setLegacyAdminSession, useLegacyAdminSession } from "@/lib/auth";
import { site } from "@/data/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin Console | ${site.name}` },
      {
        name: "description",
        content: "GUIDESOFT administrative operations, catalogue CMS and payment reconciliation.",
      },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <RequireRole
      roles={["admin", "instructor"]}
      permission="manage_catalog"
      allowAdminKeySession
      title="Admin sign-in required"
      description="The management console is limited to administrator and instructor accounts."
    >
      <AdminConsole />
    </RequireRole>
  );
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course_slug?: string;
  batch_id?: string;
  source?: string;
  message: string;
  status: "new" | "contacted" | "enrolled" | "closed" | string;
  notes?: string;
  created_at?: string;
}

type TabId = "leads" | "payments" | "catalogue" | "schema";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "leads", label: "Lead CRM", icon: Users },
  { id: "payments", label: "Payments", icon: Banknote },
  { id: "catalogue", label: "Catalogue CMS", icon: BookOpen },
  { id: "schema", label: "Database & Roles", icon: Database },
];

const ADMIN_KEY_STORAGE = "guidesoft_admin_key";
const ADMIN_AUTH_STORAGE = "guidesoft_admin_auth";

function AdminConsole() {
  const hasKeySession = useLegacyAdminSession();
  const [adminKey, setAdminKey] = useState<string>(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem(ADMIN_KEY_STORAGE) || "test-admin-key";
    return "test-admin-key";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") return localStorage.getItem(ADMIN_AUTH_STORAGE) === "true";
    return false;
  });
  const [tempKeyInput, setTempKeyInput] = useState<string>(adminKey);
  const [activeTab, setActiveTab] = useState<TabId>("leads");

  useEffect(() => {
    if (hasKeySession && !isAuthenticated) setIsAuthenticated(true);
  }, [hasKeySession, isAuthenticated]);

  // --- Leads -------------------------------------------------------------
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // --- Payments ----------------------------------------------------------
  const [payments, setPayments] = useState<AdminPaymentRow[]>([]);
  const [paymentFilter, setPaymentFilter] = useState("awaiting_verification");
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);

  // --- Catalogue ---------------------------------------------------------
  const [courses, setCourses] = useState<CatalogCourseRow[]>([]);
  const [batches, setBatches] = useState<CatalogBatchRow[]>([]);
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [newBatchOpen, setNewBatchOpen] = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);

  // --- Schema ------------------------------------------------------------
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const key = tempKeyInput.trim();
    if (!key) {
      toast.error("Please enter an Admin Key");
      return;
    }
    setAdminKey(key);
    setLegacyAdminSession(true, key);
    setIsAuthenticated(true);
    toast.success("Admin access granted.");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLegacyAdminSession(false);
    toast.info("Logged out from admin console.");
  };

  // -------------------------------------------------------------------------
  // Data loading
  // -------------------------------------------------------------------------
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminLeads(adminKey, search, statusFilter);
      setLeads(Array.isArray(data?.items) ? data.items : []);
    } catch (err: unknown) {
      console.warn("Using local CRM data:", err instanceof Error ? err.message : err);
    } finally {
      setIsLoading(false);
    }
  }, [adminKey, search, statusFilter]);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const data = await api.getAdminPayments(adminKey, { status: paymentFilter });
      setPayments(Array.isArray(data?.items) ? data.items : []);
    } catch (err: unknown) {
      console.warn("Payments unavailable:", err instanceof Error ? err.message : err);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, [adminKey, paymentFilter]);

  const fetchCatalogue = useCallback(async () => {
    setCatalogueLoading(true);
    try {
      const [courseRows, batchRows, postRows] = await Promise.all([
        api.getCourses().catch(() => []),
        api.getBatches().catch(() => []),
        api.getBlogPosts().catch(() => []),
      ]);
      setCourses(courseRows);
      setBatches(batchRows);
      setPosts(postRows);
    } finally {
      setCatalogueLoading(false);
    }
  }, []);

  const fetchSchema = useCallback(async () => {
    setSchemaLoading(true);
    try {
      const data = await api.getAdminSchema(adminKey);
      setTables(data?.tables ?? []);
    } catch (err: unknown) {
      console.warn("Schema viewer unavailable:", err instanceof Error ? err.message : err);
      setTables([]);
    } finally {
      setSchemaLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === "leads") void fetchLeads();
    if (activeTab === "payments") void fetchPayments();
    if (activeTab === "catalogue") void fetchCatalogue();
    if (activeTab === "schema") void fetchSchema();
  }, [isAuthenticated, activeTab, fetchLeads, fetchPayments, fetchCatalogue, fetchSchema]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)),
    );
    try {
      await api.updateLead(adminKey, leadId, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
    } catch {
      toast.info(`Updated status locally to ${newStatus}`);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    try {
      await api.deleteLead(adminKey, leadId);
      toast.success("Enquiry removed.");
    } catch {
      toast.info("Enquiry removed locally.");
    }
  };

  const handleVerifyPayment = async (order: AdminPaymentRow) => {
    setBusyOrder(order.order_id);
    try {
      await api.verifyAdminPayment(adminKey, order.order_id);
      toast.success("Payment verified", {
        description: `Seat allotted and enrolment unlocked for ${order.customer_email}.`,
      });
      await fetchPayments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not verify this payment.");
    } finally {
      setBusyOrder(null);
    }
  };

  const handleRejectPayment = async (order: AdminPaymentRow) => {
    if (!confirm(`Mark ${order.order_id} as failed / not received?`)) return;
    setBusyOrder(order.order_id);
    try {
      await api.rejectAdminPayment(adminKey, order.order_id);
      toast.info("Payment marked as not received.");
      await fetchPayments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not update this payment.");
    } finally {
      setBusyOrder(null);
    }
  };

  const handleSaveCourse = async (slug: string, updates: Record<string, unknown>) => {
    try {
      await api.updateCourse(adminKey, slug, updates);
      toast.success("Course updated — the site refreshes within a minute.");
      setEditing(null);
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const handleDeleteCourse = async (slug: string) => {
    if (!confirm(`Delete course "${slug}"? Batches for it must be removed first.`)) return;
    try {
      await api.deleteCourse(adminKey, slug);
      toast.success("Course deleted.");
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const handleSaveBatch = async (batchId: string, updates: Record<string, unknown>) => {
    try {
      await api.updateBatch(adminKey, batchId, updates);
      toast.success("Batch updated.");
      setEditing(null);
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm(`Delete batch "${batchId}"?`)) return;
    try {
      await api.deleteBatch(adminKey, batchId);
      toast.success("Batch deleted.");
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const handleSavePost = async (slug: string, updates: Record<string, unknown>) => {
    try {
      await api.updateBlogPost(adminKey, slug, updates);
      toast.success("Blog post updated.");
      setEditing(null);
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm(`Delete blog post "${slug}"?`)) return;
    try {
      await api.deleteBlogPost(adminKey, slug);
      toast.success("Blog post deleted.");
      await fetchCatalogue();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Course", "Status", "Message", "Date"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone || "",
      l.course_slug || "",
      l.status,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      l.created_at || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `guidesoft-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV.");
  };

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      enrolled: leads.filter((lead) => lead.status === "enrolled").length,
    }),
    [leads],
  );

  const pendingRevenue = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "awaiting_verification")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0),
    [payments],
  );

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.course_slug || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone || "").includes(search);
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // -------------------------------------------------------------------------
  // Locked view
  // -------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-surface/30 px-4 py-16">
        <div className="surface-panel w-full max-w-md rounded-3xl p-8 shadow-xl border border-border">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="h-7 w-7" />
          </div>
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in with your administrator security key to manage enquiries, catalogue, batches
              and payment reconciliation.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin API Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="Enter secret key..."
                  className="pl-9"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Default key for local dev:{" "}
                <code className="bg-muted px-1 rounded text-primary">test-admin-key</code>
              </p>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg">
              Unlock Console
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      {/* Header Bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              GS
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Management Console</h1>
              <p className="text-xs text-muted-foreground">
                Enquiries, catalogue CMS, payments and database roles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => {
                if (activeTab === "leads") void fetchLeads();
                if (activeTab === "payments") void fetchPayments();
                if (activeTab === "catalogue") void fetchCatalogue();
                if (activeTab === "schema") void fetchSchema();
              }}
              disabled={isLoading || paymentsLoading || catalogueLoading || schemaLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1.5 ${
                  isLoading || paymentsLoading || catalogueLoading || schemaLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Lock Console
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <Section>
        {/* ================================================================= */}
        {/* LEADS                                                             */}
        {/* ================================================================= */}
        {activeTab === "leads" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
                  <span>Total Enquiries</span>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Across all programs</p>
              </div>
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
                  <span>New / Uncontacted</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.new}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Awaiting advisor outreach</p>
              </div>
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
                  <span>In Discussion</span>
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.contacted}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Counselling in progress</p>
              </div>
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
                  <span>Enrolled & Paid</span>
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.enrolled}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Confirmed learners</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <Button variant="subtle" size="sm" onClick={handleExportCSV}>
                <Download className="mr-1.5 h-4 w-4" /> Export CSV
              </Button>
            </div>

            {!isLoading && leads.length === 0 && (
              <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No enquiries yet</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Enquiries and UPI payment references submitted on the website appear here. Refresh
                  to pull the latest data from the server.
                </p>
                <Button
                  variant="subtle"
                  size="sm"
                  className="mt-5"
                  onClick={fetchLeads}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" /> Fetch Enquiries
                </Button>
              </div>
            )}

            {(isLoading || leads.length > 0) && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4">Learner</th>
                        <th className="px-6 py-4">Course & Batch</th>
                        <th className="px-6 py-4">Enquiry Note</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="transition-colors hover:bg-muted/30">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-foreground">{lead.name}</p>
                              <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Mail className="h-3 w-3" /> {lead.email}
                                </span>
                                {lead.phone && (
                                  <span className="flex items-center gap-1.5">
                                    <Phone className="h-3 w-3" /> {lead.phone}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                {lead.course_slug || "General Enquiry"}
                              </span>
                              {lead.batch_id && (
                                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                  Batch: {lead.batch_id}
                                </p>
                              )}
                              {lead.source && (
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  via {lead.source}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {lead.message}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                                  lead.status === "enrolled"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                                    : lead.status === "contacted"
                                      ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
                                      : lead.status === "new"
                                        ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                                        : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                <option value="new">● New</option>
                                <option value="contacted">● Contacted</option>
                                <option value="enrolled">● Enrolled</option>
                                <option value="closed">● Closed</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-muted-foreground hover:text-destructive"
                                title="Delete enquiry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                            No enquiries matching your filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* PAYMENTS                                                          */}
        {/* ================================================================= */}
        {activeTab === "payments" && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Payment reconciliation</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Verify UPI references against the bank statement. Marking a payment paid allots
                  the seat, creates the enrolment and unlocks the course instantly.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="awaiting_verification">Awaiting verification</option>
                  <option value="success">Paid & verified</option>
                  <option value="failed">Not received</option>
                  <option value="pending">Gateway pending</option>
                  <option value="all">All payments</option>
                </select>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={fetchPayments}
                  disabled={paymentsLoading}
                >
                  <RefreshCw
                    className={`mr-1.5 h-4 w-4 ${paymentsLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  In this view
                </p>
                <p className="mt-2 font-display text-2xl font-bold">{payments.length}</p>
              </div>
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Awaiting verification (value)
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ₹{pendingRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="surface-panel rounded-2xl p-5 border border-border">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Method</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  UPI / GPay references and gateway orders appear in the same queue.
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Learner</th>
                      <th className="px-6 py-4">Course / Batch</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment.order_id} className="transition-colors hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <p className="font-mono text-xs font-semibold text-foreground">
                              {payment.reference || payment.order_id}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                              {payment.order_id}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                              {payment.payment_method === "upi" ? "UPI / GPay" : "Gateway"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-foreground">{payment.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.customer_email}
                            </p>
                            {payment.customer_phone && (
                              <p className="text-xs text-muted-foreground">
                                {payment.customer_phone}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-foreground">{payment.course_slug}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {payment.batch_id}
                            </p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-foreground">
                            ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            {payment.status === "success" ? (
                              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
                              </Badge>
                            ) : payment.status === "failed" ? (
                              <Badge className="bg-destructive/15 text-destructive">
                                <XCircle className="mr-1 h-3 w-3" /> Not received
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                <Clock className="mr-1 h-3 w-3" /> Awaiting bank check
                              </Badge>
                            )}
                            {payment.verified_by && (
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                by {payment.verified_by}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="hero"
                                disabled={
                                  busyOrder === payment.order_id || payment.status === "success"
                                }
                                onClick={() => void handleVerifyPayment(payment)}
                              >
                                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Mark paid & enrol
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={
                                  busyOrder === payment.order_id || payment.status === "success"
                                }
                                onClick={() => void handleRejectPayment(payment)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          {paymentsLoading ? "Loading payments…" : "No payments in this view."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================================================================= */}
        {/* CATALOGUE                                                         */}
        {/* ================================================================= */}
        {activeTab === "catalogue" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Live catalogue CMS</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Edits publish to every card site-wide within a minute — no redeploy needed.
                </p>
              </div>
              <Button
                variant="subtle"
                size="sm"
                onClick={fetchCatalogue}
                disabled={catalogueLoading}
              >
                <RefreshCw className={`mr-1.5 h-4 w-4 ${catalogueLoading ? "animate-spin" : ""}`} />
                Reload catalogue
              </Button>
            </div>

            {/* Courses */}
            <div className="mt-8 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <Layers className="h-4 w-4 text-primary" /> Courses ({courses.length})
              </h3>
              <Button size="sm" variant="hero" onClick={() => setNewCourseOpen((value) => !value)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New course
              </Button>
            </div>

            {newCourseOpen && (
              <QuickCourseForm
                onCancel={() => setNewCourseOpen(false)}
                onSubmit={async (payload) => {
                  try {
                    await api.upsertCourse(adminKey, payload);
                    toast.success("Course created.");
                    setNewCourseOpen(false);
                    await fetchCatalogue();
                  } catch (err: unknown) {
                    toast.error(err instanceof Error ? err.message : "Create failed.");
                  }
                }}
              />
            )}

            <div className="mt-4 space-y-3">
              {courses.map((course) => (
                <EditableRow
                  key={course.slug}
                  id={course.slug}
                  editing={editing === `course:${course.slug}`}
                  onEdit={() => setEditing(`course:${course.slug}`)}
                  onCancel={() => setEditing(null)}
                  onSave={(updates) => void handleSaveCourse(course.slug, updates)}
                  onDelete={() => void handleDeleteCourse(course.slug)}
                  title={course.title}
                  subtitle={`${course.category} · ${course.level} · ${course.duration}`}
                  fields={[
                    { key: "title", label: "Title", value: course.title },
                    { key: "category", label: "Category", value: course.category },
                    { key: "level", label: "Level", value: course.level },
                    { key: "duration", label: "Duration", value: course.duration },
                    { key: "format", label: "Format", value: course.format },
                    {
                      key: "price",
                      label: "Price (₹)",
                      value: String(course.price),
                      type: "number",
                    },
                    { key: "summary", label: "Summary", value: course.summary, type: "textarea" },
                    {
                      key: "published",
                      label: "Published (true/false)",
                      value: String(course.published ?? true),
                    },
                  ]}
                />
              ))}
              {courses.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  No courses returned. Connect the database (Supabase keys) and run the seeder to
                  populate the catalogue.
                </p>
              )}
            </div>

            {/* Batches */}
            <div className="mt-12 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" /> Batches ({batches.length})
              </h3>
              <Button size="sm" variant="hero" onClick={() => setNewBatchOpen((value) => !value)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New batch
              </Button>
            </div>

            {newBatchOpen && (
              <QuickBatchForm
                onCancel={() => setNewBatchOpen(false)}
                onSubmit={async (payload) => {
                  try {
                    await api.upsertBatch(adminKey, payload);
                    toast.success("Batch created.");
                    setNewBatchOpen(false);
                    await fetchCatalogue();
                  } catch (err: unknown) {
                    toast.error(err instanceof Error ? err.message : "Create failed.");
                  }
                }}
              />
            )}

            <div className="mt-4 space-y-3">
              {batches.map((batch) => (
                <EditableRow
                  key={batch.id}
                  id={batch.id}
                  editing={editing === `batch:${batch.id}`}
                  onEdit={() => setEditing(`batch:${batch.id}`)}
                  onCancel={() => setEditing(null)}
                  onSave={(updates) => void handleSaveBatch(batch.id, updates)}
                  onDelete={() => void handleDeleteBatch(batch.id)}
                  title={batch.name}
                  subtitle={`${batch.course_slug} · starts ${batch.start_date} · ${batch.available}/${batch.seats} seats`}
                  fields={[
                    { key: "name", label: "Batch name", value: batch.name },
                    { key: "course_slug", label: "Course slug", value: batch.course_slug },
                    {
                      key: "start_date",
                      label: "Start date (YYYY-MM-DD)",
                      value: batch.start_date,
                    },
                    { key: "end_date", label: "End date (YYYY-MM-DD)", value: batch.end_date },
                    { key: "days", label: "Days", value: batch.days },
                    { key: "time", label: "Time", value: batch.time },
                    { key: "seats", label: "Seats", value: String(batch.seats), type: "number" },
                    {
                      key: "available",
                      label: "Available",
                      value: String(batch.available),
                      type: "number",
                    },
                    { key: "mode", label: "Mode", value: batch.mode },
                    { key: "instructor", label: "Instructor", value: batch.instructor },
                    { key: "status", label: "Status", value: batch.status },
                    {
                      key: "price",
                      label: "Price (₹)",
                      value: String(batch.price),
                      type: "number",
                    },
                  ]}
                />
              ))}
            </div>

            {/* Blog */}
            <div className="mt-12 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" /> Blog posts ({posts.length})
              </h3>
              <Button size="sm" variant="hero" onClick={() => setNewPostOpen((value) => !value)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New post
              </Button>
            </div>

            {newPostOpen && (
              <QuickPostForm
                onCancel={() => setNewPostOpen(false)}
                onSubmit={async (payload) => {
                  try {
                    await api.upsertBlogPost(adminKey, payload);
                    toast.success("Blog post created.");
                    setNewPostOpen(false);
                    await fetchCatalogue();
                  } catch (err: unknown) {
                    toast.error(err instanceof Error ? err.message : "Create failed.");
                  }
                }}
              />
            )}

            <div className="mt-4 space-y-3">
              {posts.map((post) => (
                <EditableRow
                  key={post.slug}
                  id={post.slug}
                  editing={editing === `post:${post.slug}`}
                  onEdit={() => setEditing(`post:${post.slug}`)}
                  onCancel={() => setEditing(null)}
                  onSave={(updates) => void handleSavePost(post.slug, updates)}
                  onDelete={() => void handleDeletePost(post.slug)}
                  title={post.title}
                  subtitle={`${post.category} · ${post.published_on} · ${post.author}`}
                  fields={[
                    { key: "title", label: "Title", value: post.title },
                    { key: "excerpt", label: "Excerpt", value: post.excerpt, type: "textarea" },
                    { key: "author", label: "Author", value: post.author },
                    {
                      key: "published_on",
                      label: "Published on (YYYY-MM-DD)",
                      value: String(post.published_on),
                    },
                    { key: "read_time", label: "Read time", value: post.read_time },
                    { key: "category", label: "Category", value: post.category },
                    {
                      key: "content",
                      label: "Content (one paragraph per line)",
                      value: Array.isArray(post.content)
                        ? (post.content as string[]).join("\n")
                        : "",
                      type: "textarea",
                    },
                    {
                      key: "published",
                      label: "Published (true/false)",
                      value: String(post.published ?? true),
                    },
                  ]}
                />
              ))}
            </div>
          </>
        )}

        {/* ================================================================= */}
        {/* SCHEMA & ROLES                                                    */}
        {/* ================================================================= */}
        {activeTab === "schema" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Database & permissions</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live row counts for every platform table, plus the universal role matrix enforced
                  by the API.
                </p>
              </div>
              <Button variant="subtle" size="sm" onClick={fetchSchema} disabled={schemaLoading}>
                <RefreshCw className={`mr-1.5 h-4 w-4 ${schemaLoading ? "animate-spin" : ""}`} />
                Refresh counts
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => (
                <div
                  key={table.name}
                  className="surface-panel rounded-2xl border border-border p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {table.name}
                    </span>
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-foreground">
                    {table.rows < 0 ? "—" : table.rows.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {table.rows < 0 ? "not reachable (run schema.sql)" : "rows"}
                  </p>
                </div>
              ))}
              {tables.length === 0 && (
                <p className="col-span-full rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  {schemaLoading
                    ? "Reading schema…"
                    : "Schema viewer needs the backend + database connection."}
                </p>
              )}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <div className="border-b border-border bg-muted/50 px-6 py-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Role permission matrix
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
                      <tr key={role}>
                        <td className="px-6 py-4 align-top font-semibold capitalize text-foreground">
                          {role}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {permissions.map((permission) => (
                              <span
                                key={permission}
                                className="rounded-full border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Catalogue editing primitives
// ---------------------------------------------------------------------------

interface FieldSpec {
  key: string;
  label: string;
  value: string;
  type?: "text" | "number" | "textarea";
}

function EditableRow({
  id,
  title,
  subtitle,
  fields,
  editing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldSpec[];
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updates: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.value])),
  );

  useEffect(() => {
    setDraft(Object.fromEntries(fields.map((field) => [field.key, field.value])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleSave = () => {
    const updates: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = draft[field.key] ?? "";
      if (field.type === "number") updates[field.key] = Number(raw) || 0;
      else if (field.key === "published") updates[field.key] = raw.trim().toLowerCase() !== "false";
      else if (field.key === "content")
        updates[field.key] = raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      else updates[field.key] = raw;
    }
    onSave(updates);
  };

  return (
    <div className="surface-panel rounded-2xl border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{id}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button size="sm" variant="hero" onClick={handleSave}>
                <Save className="mr-1.5 h-3.5 w-3.5" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="subtle" onClick={onEdit}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className={field.type === "textarea" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}
            >
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  value={draft[field.key] ?? ""}
                  rows={field.key === "content" ? 5 : 3}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                  }
                />
              ) : (
                <Input
                  type={field.type === "number" ? "number" : "text"}
                  value={draft[field.key] ?? ""}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickCourseForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (payload: {
    slug: string;
    title: string;
    category: string;
    price: number;
    summary: string;
    level: string;
    duration: string;
    format: string;
    published: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Software Development");
  const [price, setPrice] = useState("0");
  const [summary, setSummary] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [duration, setDuration] = useState("12 weeks");
  const [format, setFormat] = useState("Live online");

  return (
    <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="new-course-slug"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Category
          </label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Price (₹)
          </label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Level</label>
          <Input value={level} onChange={(e) => setLevel(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Duration
          </label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Format
          </label>
          <Input value={format} onChange={(e) => setFormat(e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Summary
          </label>
          <Textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="hero"
          disabled={!slug || !title || !category}
          onClick={() =>
            onSubmit({
              slug,
              title,
              category,
              price: Number(price) || 0,
              summary,
              level,
              duration,
              format,
              published: true,
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Create course
        </Button>
      </div>
    </div>
  );
}

function QuickBatchForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (
    payload: Record<string, unknown> & { id: string; course_slug: string; name: string },
  ) => void;
  onCancel: () => void;
}) {
  const [id, setId] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [seats, setSeats] = useState("30");
  const [price, setPrice] = useState("0");

  return (
    <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Batch id
          </label>
          <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="java-dec-26" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Course slug
          </label>
          <Input value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Batch name
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Start date
          </label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            End date
          </label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Seats</label>
          <Input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Price (₹)
          </label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="hero"
          disabled={!id || !courseSlug || !name || !startDate || !endDate}
          onClick={() =>
            onSubmit({
              id,
              course_slug: courseSlug,
              name,
              start_date: startDate,
              end_date: endDate,
              seats: Number(seats) || 0,
              available: Number(seats) || 0,
              price: Number(price) || 0,
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Create batch
        </Button>
      </div>
    </div>
  );
}

function QuickPostForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (payload: Record<string, unknown> & { slug: string; title: string }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Industry Insights");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="new-post-slug"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Category
          </label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Excerpt
          </label>
          <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Content (one paragraph per line)
          </label>
          <Textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="hero"
          disabled={!slug || !title}
          onClick={() =>
            onSubmit({
              slug,
              title,
              category,
              excerpt,
              content: content
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
              published: true,
            })
          }
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Publish post
        </Button>
      </div>
    </div>
  );
}
