import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Download,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { site } from "@/data/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin Console | ${site.name}` },
      { name: "description", content: "GUIDESOFT administrative operations and lead CRM." },
    ],
  }),
  component: AdminPage,
});

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

const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: "demo-lead-101",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 9876543210",
    course_slug: "java-full-stack-development",
    batch_id: "java-aug-26",
    source: "website",
    message: "I am looking for weekend live batches with placement assistance.",
    status: "new",
    notes: "Follow-up scheduled for tomorrow 11 AM",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "demo-lead-102",
    name: "Sneha Patel",
    email: "sneha.p@example.com",
    phone: "+91 9823456789",
    course_slug: "devops-cloud-engineering",
    batch_id: "devops-aug-26",
    source: "enquiry_modal",
    message: "Need company sponsorship invoice for DevOps training.",
    status: "contacted",
    notes: "Shared course syllabus and corporate fee structure.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "demo-lead-103",
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    phone: "+91 9988776655",
    course_slug: "react-full-stack-development",
    batch_id: "react-sep-26",
    source: "website",
    message: "Enrolled after demo session. Payment confirmed via Cashfree.",
    status: "enrolled",
    notes: "Added to Batch Sep-26 Discord channel and shared starter repo.",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "demo-lead-104",
    name: "Meera Krishnan",
    email: "meera.k@example.com",
    phone: "+91 9765432190",
    course_slug: "python-data-engineering",
    source: "contact_page",
    message: "Interested in the Python & Data Engineering 6-month roadmap.",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("guidesoft_admin_key") || "test-admin-key";
    }
    return "test-admin-key";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem("guidesoft_admin_auth") === "true");
    }
    return false;
  });
  const [tempKeyInput, setTempKeyInput] = useState<string>(adminKey);

  const [leads, setLeads] = useState<Lead[]>(INITIAL_DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: INITIAL_DEMO_LEADS.length,
    new: 2,
    contacted: 1,
    enrolled: 1,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempKeyInput.trim()) {
      toast.error("Please enter an Admin Key");
      return;
    }
    setAdminKey(tempKeyInput.trim());
    localStorage.setItem("guidesoft_admin_key", tempKeyInput.trim());
    localStorage.setItem("guidesoft_admin_auth", "true");
    setIsAuthenticated(true);
    toast.success("Admin access granted.");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("guidesoft_admin_auth");
    toast.info("Logged out from admin console.");
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminLeads(adminKey, search, statusFilter);
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setLeads(data.items);
      }
      const statsData = await api.getAdminStats(adminKey);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Using local CRM data:", msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, search, statusFilter]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.updateLead(adminKey, leadId, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
    } catch {
      toast.info(`Updated status locally to ${newStatus}`);
    }
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)),
    );
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await api.deleteLead(adminKey, leadId);
      toast.success("Enquiry removed.");
    } catch {
      toast.info("Enquiry removed locally.");
    }
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
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
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `guidesoft-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV.");
  };

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
              Sign in with your administrator security key to manage enquiries, batches and
              analytics.
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

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      {/* Header Bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              GS
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Management Console</h1>
              <p className="text-xs text-muted-foreground">Enquiries, CRM, and Batch Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="subtle" size="sm" onClick={fetchLeads} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Lock Console
            </Button>
          </div>
        </div>
      </div>

      <Section>
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-panel rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Total Enquiries</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">{leads.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across all programs</p>
          </div>

          <div className="surface-panel rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>New / Uncontacted</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-amber-600 dark:text-amber-400">
              {leads.filter((l) => l.status === "new").length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting advisor outreach</p>
          </div>

          <div className="surface-panel rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>In Discussion</span>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-blue-600 dark:text-blue-400">
              {leads.filter((l) => l.status === "contacted").length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Counselling in progress</p>
          </div>

          <div className="surface-panel rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Enrolled & Paid</span>
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {leads.filter((l) => l.status === "enrolled").length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Confirmed learners</p>
          </div>
        </div>

        {/* Lead Table Header Actions */}
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
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Leads Table */}
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
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2 text-xs text-muted-foreground">{lead.message}</p>
                        {lead.notes && (
                          <p className="mt-1 text-[11px] font-medium text-primary">
                            Note: {lead.notes}
                          </p>
                        )}
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
      </Section>
    </div>
  );
}
