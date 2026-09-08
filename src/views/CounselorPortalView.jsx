import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  KanbanSquare,
  LayoutDashboard,
  List,
  LogOut,
  Mail,
  Menu,
  MessageCircleMore,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Target,
  UserCog,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useApp } from "../context/useApp";
import {
  getErpWorkspaceData,
  loginStaff,
  logoutStaffSession,
  updateErpLeadStatus,
} from "../services/erpApi";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
      { id: "leads", label: "Lead CRM", icon: UsersRound },
      { id: "students", label: "Students", icon: GraduationCap },
    ],
  },
  {
    label: "Admissions",
    items: [
      { id: "applications", label: "Applications", icon: FileCheck2 },
      { id: "operations", label: "Documents & Visa", icon: ShieldCheck },
      { id: "tasks", label: "Tasks & Follow-ups", icon: ClipboardCheck },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "finance", label: "Finance", icon: WalletCards },
      { id: "reports", label: "Reports", icon: Activity },
      { id: "access", label: "Team & Access", icon: UserCog },
      { id: "cms", label: "Website CMS", icon: Settings },
    ],
  },
];

const leadStages = [
  "New",
  "Attempted Contact",
  "Contacted",
  "Counselling Scheduled",
  "Counselling Completed",
  "Interested",
  "Follow-up",
  "Registration Pending",
  "Registered",
  "Application Started",
  "Converted",
  "Lost",
];
const EMPTY_LIST = [];

const statusColors = {
  New: "bg-blue-50 text-blue-700 ring-blue-100",
  Interested: "bg-violet-50 text-violet-700 ring-violet-100",
  Registered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Converted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Lost: "bg-rose-50 text-rose-700 ring-rose-100",
  Submitted: "bg-sky-50 text-sky-700 ring-sky-100",
  "University Processing": "bg-amber-50 text-amber-700 ring-amber-100",
  "Documents Pending": "bg-orange-50 text-orange-700 ring-orange-100",
  Documentation: "bg-amber-50 text-amber-700 ring-amber-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  overdue: "bg-rose-50 text-rose-700 ring-rose-100",
};

const formatAed = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-AE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not set";

const StatusPill = ({ value }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ring-1 ring-inset ${statusColors[value] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
  >
    {String(value).replaceAll("_", " ")}
  </span>
);

const MetricCard = ({ icon: Icon, label, value, note, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
    rose: "bg-rose-50 text-rose-700",
    cyan: "bg-cyan-50 text-cyan-700",
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(6,45,85,0.045)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <MoreHorizontal className="h-4 w-4 text-slate-300" />
      </div>
      <strong className="font-display mt-5 block text-2xl font-bold tracking-[-0.03em] text-[#082f57]">
        {value}
      </strong>
      <span className="mt-1 block text-[11px] font-extrabold text-slate-700">
        {label}
      </span>
      <span className="mt-2 block text-[9px] leading-4 text-slate-400">
        {note}
      </span>
    </article>
  );
};

const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0874c9]">
        {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#082f57] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

const EmptyState = ({ title, text }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
    <FileText className="mx-auto h-7 w-7 text-slate-300" />
    <h3 className="mt-3 text-sm font-extrabold text-[#082f57]">{title}</h3>
    <p className="mt-2 text-xs text-slate-500">{text}</p>
  </div>
);

export const CounselorPortalView = ({ onNavigate }) => {
  const { activeUser, counselorProfile, showToast, logout } = useApp();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [leadView, setLeadView] = useState("list");
  const [selectedLead, setSelectedLead] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [staffCredentials, setStaffCredentials] = useState({
    email: "",
    password: "",
  });
  const [signingIn, setSigningIn] = useState(false);

  const loadWorkspace = async () => {
    setLoading(true);
    setError("");
    try {
      setWorkspace(await getErpWorkspaceData());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const handleStaffLogin = async (event) => {
    event.preventDefault();
    setSigningIn(true);
    try {
      await loginStaff(staffCredentials.email, staffCredentials.password);
      await loadWorkspace();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleStaffLogout = async () => {
    await logoutStaffSession().catch(() => null);
    logout();
  };

  const currentStaff =
    activeUser?.name || counselorProfile?.name || "Dr. Sarah Jenkins";
  const metrics = workspace?.dashboard?.metrics || {};
  const leads = workspace?.leads || EMPTY_LIST;
  const students = workspace?.students || EMPTY_LIST;
  const applications = workspace?.applications || EMPTY_LIST;
  const tasks = workspace?.tasks || EMPTY_LIST;
  const operations = workspace?.operations || {
    documentSummary: [],
    visas: [],
    invoices: [],
    payments: [],
  };
  const roles = workspace?.roles || [];

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) =>
      [
        lead.full_name,
        lead.email,
        lead.mobile,
        lead.preferred_country,
        lead.preferred_course,
        lead.lead_code,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [leads, searchTerm]);

  const changeLeadStatus = async (lead, status) => {
    if (status === "Lost") {
      showToast(
        "Lost leads require a reason. Open the full lead profile before marking this stage.",
      );
      return;
    }
    try {
      await updateErpLeadStatus(lead.id, status, {
        notes: "Updated from the CRM workspace.",
      });
      setWorkspace((current) => ({
        ...current,
        leads: current.leads.map((item) =>
          item.id === lead.id ? { ...item, status } : item,
        ),
      }));
      if (selectedLead?.id === lead.id)
        setSelectedLead({ ...selectedLead, status });
      showToast(
        `${lead.full_name} moved to ${status}. The transition was added to the activity log.`,
      );
    } catch (requestError) {
      showToast(requestError.message);
    }
  };

  const selectModule = (moduleId) => {
    setMobileNavOpen(false);
    if (moduleId === "cms") {
      onNavigate("cms");
      return;
    }
    setActiveModule(moduleId);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="brand-logo-frame mx-4 mt-5 w-[210px]"
        aria-label="Return to public website"
      >
        <img
          src={`${import.meta.env.BASE_URL}brand/logo-blue.png`}
          alt="Mother Teresa Educational Global Trust"
        />
      </button>
      <div className="mx-4 mt-6 flex items-center gap-3 rounded-2xl bg-[#f0f7ff] p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#075ec5] text-xs font-black text-white">
          SJ
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-[11px] text-[#082f57]">
            {currentStaff}
          </strong>
          <span className="block truncate text-[9px] text-slate-500">
            Dubai Main Branch
          </span>
        </div>
        <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
      </div>
      <nav
        className="mt-6 flex-1 space-y-6 overflow-y-auto px-3 pb-6"
        aria-label="ERP navigation"
      >
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectModule(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-extrabold transition ${active ? "bg-[#075ec5] text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-[#075ec5]"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" /> {item.label}
                    {item.id === "leads" && (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[8px] ${active ? "bg-white/15" : "bg-blue-50 text-blue-700"}`}
                      >
                        {leads.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleStaffLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-extrabold text-slate-500 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  const dashboardView = () => {
    const sourceMax = Math.max(
      ...(workspace.dashboard.sources || []).map((item) => Number(item.total)),
      1,
    );
    const destinationMax = Math.max(
      ...(workspace.dashboard.destinations || []).map((item) =>
        Number(item.total),
      ),
      1,
    );
    return (
      <div className="space-y-7">
        <SectionHeader
          eyebrow="Executive dashboard"
          title="Your consultancy at a glance."
          description="Live operational totals from the centralized MariaDB workspace. Use the filters in the header to narrow branch and period reporting."
          action={
            <button
              type="button"
              onClick={loadWorkspace}
              className="erp-secondary-button"
            >
              <RefreshCw className="h-4 w-4" /> Refresh data
            </button>
          }
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
          <MetricCard
            icon={UsersRound}
            label="Total leads"
            value={metrics.totalLeads || 0}
            note={`${metrics.newLeads || 0} awaiting first action`}
          />
          <MetricCard
            icon={GraduationCap}
            label="Active students"
            value={metrics.activeStudents || 0}
            note={`${metrics.conversionRate || 0}% lead conversion`}
            tone="emerald"
          />
          <MetricCard
            icon={FileCheck2}
            label="Applications"
            value={metrics.applications || 0}
            note={`${metrics.offersReceived || 0} offers recorded`}
            tone="violet"
          />
          <MetricCard
            icon={ShieldCheck}
            label="Visa approved"
            value={metrics.visaApproved || 0}
            note="Country workflows tracked"
            tone="cyan"
          />
          <MetricCard
            icon={CircleDollarSign}
            label="Collections"
            value={formatAed(metrics.revenue)}
            note="Recorded student payments"
            tone="emerald"
          />
          <MetricCard
            icon={BadgeDollarSign}
            label="Outstanding"
            value={formatAed(metrics.outstanding)}
            note="Open invoice balance"
            tone="amber"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="erp-panel">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="erp-panel-title">Lead funnel</h3>
                <p className="erp-panel-subtitle">
                  Current pipeline distribution
                </p>
              </div>
              <Target className="h-5 w-5 text-[#075ec5]" />
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(workspace.dashboard.leadStages || []).map((stage, index) => (
                <div
                  key={stage.status}
                  className="relative overflow-hidden rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-[#075ec5]" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    Stage {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-2 flex items-end justify-between">
                    <strong className="text-sm text-[#082f57]">
                      {stage.status}
                    </strong>
                    <span className="font-display text-2xl font-bold text-[#075ec5]">
                      {stage.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="erp-panel">
            <h3 className="erp-panel-title">Leads by source</h3>
            <p className="erp-panel-subtitle">
              Attribution-ready campaign view
            </p>
            <div className="mt-6 space-y-4">
              {(workspace.dashboard.sources || [])
                .filter((source) => Number(source.total))
                .map((source) => (
                  <div key={source.name}>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-600">{source.name}</span>
                      <span className="text-[#075ec5]">{source.total}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#075ec5] to-sky-400"
                        style={{
                          width: `${(Number(source.total) / sourceMax) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="erp-panel">
            <h3 className="erp-panel-title">Destination demand</h3>
            <p className="erp-panel-subtitle">
              Student preference by live lead count
            </p>
            <div className="mt-6 space-y-4">
              {(workspace.dashboard.destinations || []).map((item) => (
                <div key={item.country} className="flex items-center gap-3">
                  <Globe2 className="h-4 w-4 text-sky-500" />
                  <span className="w-24 truncate text-[10px] font-bold text-slate-600">
                    {item.country}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{
                        width: `${(Number(item.total) / destinationMax) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#082f57]">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="erp-panel">
            <h3 className="erp-panel-title">Upcoming follow-ups</h3>
            <p className="erp-panel-subtitle">
              Next actions requiring attention
            </p>
            <div className="mt-5 space-y-3">
              {(workspace.dashboard.upcoming || []).map((followup) => (
                <button
                  type="button"
                  key={followup.id}
                  onClick={() => setActiveModule("leads")}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#075ec5]">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[10px] text-[#082f57]">
                      {followup.lead_name}
                    </strong>
                    <span className="mt-1 block text-[9px] text-slate-400">
                      {followup.type.replaceAll("_", " ")} ·{" "}
                      {formatDate(followup.followup_at)}
                    </span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </button>
              ))}
            </div>
          </section>
          <section className="erp-panel">
            <h3 className="erp-panel-title">Recent activity</h3>
            <p className="erp-panel-subtitle">Immutable operating timeline</p>
            <div className="mt-5 space-y-4">
              {(workspace.dashboard.activities || [])
                .slice(0, 5)
                .map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#075ec5] ring-4 ring-blue-50" />
                    <div>
                      <p className="text-[10px] font-semibold leading-5 text-slate-600">
                        {activity.description}
                      </p>
                      <span className="mt-1 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        {activity.user_name || "System"} ·{" "}
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const leadsView = () => {
    const activeColumns = [
      "New",
      "Counselling Scheduled",
      "Interested",
      "Follow-up",
      "Registered",
    ];
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Lead management CRM"
          title="Every enquiry, one accountable next step."
          description="Search, review, and move leads through the pipeline. Status changes are stored in history and the activity log."
          action={
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="erp-primary-button"
            >
              <Plus className="h-4 w-4" /> Capture enquiry
            </button>
          }
        />
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name, phone, email, destination, or lead ID"
              className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none ring-1 ring-inset ring-slate-200 focus:ring-blue-300"
            />
          </label>
          <button type="button" className="erp-secondary-button">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setLeadView("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${leadView === "list" ? "bg-white text-[#075ec5] shadow-sm" : "text-slate-400"}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLeadView("kanban")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${leadView === "kanban" ? "bg-white text-[#075ec5] shadow-sm" : "text-slate-400"}`}
              aria-label="Kanban view"
            >
              <KanbanSquare className="h-4 w-4" />
            </button>
          </div>
        </div>

        {leadView === "list" ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Lead</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Study plan</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Counsellor</th>
                    <th className="px-5 py-4">Stage</th>
                    <th className="px-5 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer text-[10px] text-slate-600 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <strong className="block text-[11px] text-[#082f57]">
                          {lead.full_name}
                        </strong>
                        <span className="mt-1 block font-mono text-[8px] text-slate-400">
                          {lead.lead_code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="block">
                          {lead.mobile || "No phone"}
                        </span>
                        <span className="mt-1 block text-slate-400">
                          {lead.email || "No email"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <strong className="block text-slate-700">
                          {lead.preferred_country || "Not decided"}
                        </strong>
                        <span className="mt-1 block text-slate-400">
                          {lead.preferred_course || "Course undecided"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{lead.source}</td>
                      <td className="px-5 py-4">{lead.counselor}</td>
                      <td
                        className="px-5 py-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <select
                          value={lead.status}
                          onChange={(event) =>
                            changeLeadStatus(lead, event.target.value)
                          }
                          className="max-w-44 rounded-lg bg-slate-50 px-2 py-2 text-[9px] font-extrabold text-slate-700 outline-none ring-1 ring-slate-200"
                        >
                          {leadStages.map((stage) => (
                            <option key={stage}>{stage}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filteredLeads.length && (
              <div className="p-6">
                <EmptyState
                  title="No leads found"
                  text="Try a different search or clear the current filters."
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 overflow-x-auto pb-3 lg:grid-cols-5">
            {activeColumns.map((stage) => {
              const stageLeads = filteredLeads.filter(
                (lead) => lead.status === stage,
              );
              return (
                <section
                  key={stage}
                  className="min-w-[250px] rounded-2xl bg-slate-100/80 p-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-[#082f57]">
                      {stage}
                    </h3>
                    <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black text-slate-500">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {stageLeads.map((lead) => (
                      <button
                        type="button"
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <strong className="text-[11px] text-[#082f57]">
                            {lead.full_name}
                          </strong>
                          <span
                            className={`h-2 w-2 rounded-full ${lead.priority === "urgent" ? "bg-rose-500" : lead.priority === "high" ? "bg-amber-500" : "bg-blue-400"}`}
                          />
                        </div>
                        <p className="mt-2 text-[9px] text-slate-500">
                          {lead.preferred_country} · {lead.preferred_course}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-[8px] text-slate-400">
                          <span>{lead.source}</span>
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </button>
                    ))}
                    {!stageLeads.length && (
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-[9px] text-slate-400">
                        No leads
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const studentsView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Student management"
        title="Profiles connected to every operational record."
        description="Student IDs, counselor ownership, applications, and journey stage remain visible in one directory."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => (
          <article key={student.id} className="erp-panel">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075ec5] to-[#062d55] text-xs font-black text-white">
                {student.full_name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <StatusPill value={student.journey_stage} />
            </div>
            <h3 className="mt-5 text-base font-extrabold text-[#082f57]">
              {student.full_name}
            </h3>
            <p className="mt-1 font-mono text-[9px] text-slate-400">
              {student.student_code}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-[9px]">
              <div>
                <span className="block text-slate-400">Destination</span>
                <strong className="mt-1 block text-slate-700">
                  {student.preferred_country}
                </strong>
              </div>
              <div>
                <span className="block text-slate-400">Applications</span>
                <strong className="mt-1 block text-slate-700">
                  {student.applications}
                </strong>
              </div>
              <div className="col-span-2">
                <span className="block text-slate-400">Study plan</span>
                <strong className="mt-1 block text-slate-700">
                  {student.preferred_course} · {student.intake}
                </strong>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href={`tel:${student.mobile}`}
                className="erp-icon-button"
                aria-label={`Call ${student.full_name}`}
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${student.email}`}
                className="erp-icon-button"
                aria-label={`Email ${student.full_name}`}
              >
                <Mail className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "The connected student profile timeline is ready for the next implementation phase.",
                  )
                }
                className="erp-secondary-button flex-1"
              >
                Open profile <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const applicationsView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Application management"
        title="Application processing with clear ownership."
        description="Each record represents a student, university, course, and intake combination."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {applications.map((application) => (
          <article key={application.id} className="erp-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[8px] font-bold text-slate-400">
                  {application.application_code}
                </p>
                <h3 className="mt-2 text-base font-extrabold text-[#082f57]">
                  {application.university_name}
                </h3>
                <p className="mt-1 text-[10px] text-slate-500">
                  {application.student_name} · {application.student_code}
                </p>
              </div>
              <StatusPill value={application.status} />
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold text-slate-700">
                {application.course_name}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-[9px] text-slate-500">
                <span>
                  Intake: <strong>{application.intake}</strong>
                </span>
                <span>
                  Submitted:{" "}
                  <strong>{formatDate(application.submission_date)}</strong>
                </span>
                <span>
                  Fee:{" "}
                  <strong>
                    {application.application_fee
                      ? formatAed(application.application_fee)
                      : "Not recorded"}
                  </strong>
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="h-1 flex-1 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-[#075ec5] ${application.status === "Documents Pending" ? "w-1/6" : application.status === "Submitted" ? "w-2/5" : "w-3/5"}`}
                />
              </div>
              <span className="text-[8px] font-bold text-slate-400">
                Timeline active
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const operationsView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Documents & visa"
        title="Verification and visa workflows in one queue."
        description="Country-specific checklists and verification history are ready to attach to each student and application."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          icon={FileText}
          label="Documents indexed"
          value={operations.documentSummary.reduce(
            (sum, item) => sum + Number(item.total),
            0,
          )}
          note="Central document vault"
        />
        <MetricCard
          icon={ShieldCheck}
          label="Active visa cases"
          value={operations.visas.length}
          note="Country-specific workflow"
          tone="amber"
        />
        <MetricCard
          icon={Check}
          label="Verified records"
          value={
            operations.documentSummary.find(
              (item) => item.status === "verified",
            )?.total || 0
          }
          note="Staff verification trail"
          tone="emerald"
        />
      </div>
      <section className="erp-panel">
        <h3 className="erp-panel-title">Visa processing queue</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              <tr>
                <th className="pb-3">Student</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Visa type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Application date</th>
                <th className="pb-3">Appointment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operations.visas.map((visa) => (
                <tr key={visa.id} className="text-[10px] text-slate-600">
                  <td className="py-4">
                    <strong className="text-[#082f57]">
                      {visa.student_name}
                    </strong>
                    <span className="ml-2 font-mono text-[8px] text-slate-400">
                      {visa.student_code}
                    </span>
                  </td>
                  <td>{visa.country}</td>
                  <td>{visa.visa_type}</td>
                  <td>
                    <StatusPill value={visa.status} />
                  </td>
                  <td>{formatDate(visa.application_date)}</td>
                  <td>{formatDate(visa.appointment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!operations.visas.length && (
          <EmptyState
            title="No visa cases"
            text="Visa cases will appear after an offer and deposit workflow is completed."
          />
        )}
      </section>
    </div>
  );

  const tasksView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Tasks & follow-ups"
        title="The next action should never be unclear."
        description="Priorities, due dates, ownership, and related records are visible in one working queue."
        action={
          <button
            type="button"
            onClick={() =>
              showToast(
                "Task creation drawer is prepared for the next module increment.",
              )
            }
            className="erp-primary-button"
          >
            <Plus className="h-4 w-4" /> New task
          </button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {tasks.map((task) => (
          <article key={task.id} className="erp-panel">
            <div className="flex items-start justify-between">
              <span
                className={`h-3 w-3 rounded-full ${task.priority === "urgent" ? "bg-rose-500" : task.priority === "high" ? "bg-amber-500" : "bg-blue-500"}`}
              />
              <StatusPill value={task.status} />
            </div>
            <h3 className="mt-5 text-sm font-extrabold text-[#082f57]">
              {task.title}
            </h3>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              {task.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[9px] text-slate-400">
              <span>{task.assignee}</span>
              <span>{formatDate(task.due_at)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const financeView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Finance & accounts"
        title="Collections, invoices, and outstanding balances."
        description="All demo finance values come from MariaDB records and remain branch-associated."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CircleDollarSign}
          label="Revenue collected"
          value={formatAed(metrics.revenue)}
          note="All recorded payments"
          tone="emerald"
        />
        <MetricCard
          icon={BadgeDollarSign}
          label="Outstanding"
          value={formatAed(metrics.outstanding)}
          note="Open invoice balance"
          tone="amber"
        />
        <MetricCard
          icon={FileText}
          label="Invoices"
          value={operations.invoices.length}
          note="Draft to paid tracking"
          tone="violet"
        />
        <MetricCard
          icon={WalletCards}
          label="Receipts"
          value={operations.payments.length}
          note="Payment audit records"
          tone="cyan"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="erp-panel">
          <h3 className="erp-panel-title">Student invoices</h3>
          <div className="mt-5 space-y-3">
            {operations.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[10px] text-[#082f57]">
                    {invoice.student_name}
                  </strong>
                  <span className="mt-1 block font-mono text-[8px] text-slate-400">
                    {invoice.invoice_number} · due{" "}
                    {formatDate(invoice.due_date)}
                  </span>
                </div>
                <div className="text-right">
                  <strong className="block text-[11px] text-[#082f57]">
                    {formatAed(invoice.total)}
                  </strong>
                  <span className="text-[8px] text-amber-600">
                    {formatAed(invoice.outstanding)} due
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="erp-panel">
          <h3 className="erp-panel-title">Recent collections</h3>
          <div className="mt-5 space-y-3">
            {operations.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[10px] text-[#082f57]">
                    {payment.student_name}
                  </strong>
                  <span className="mt-1 block font-mono text-[8px] text-slate-400">
                    {payment.receipt_number} · {payment.payment_method}
                  </span>
                </div>
                <strong className="text-[11px] text-emerald-700">
                  {formatAed(payment.amount)}
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const reportsView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Reporting & analytics"
        title="Measure conversion, destinations, and performance."
        description="The visual layer uses centralized operational metrics and is prepared for date, branch, counselor, and destination filters."
      />
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="erp-panel">
          <h3 className="erp-panel-title">Marketing-to-admission flow</h3>
          <div className="mt-8 grid grid-cols-5 items-end gap-3">
            {[
              ["Leads", metrics.totalLeads, "h-44"],
              ["Registered", metrics.activeStudents, "h-32"],
              ["Applications", metrics.applications, "h-36"],
              ["Offers", metrics.offersReceived, "h-20"],
              ["Visa", metrics.visaApproved, "h-14"],
            ].map(([label, value, height], index) => (
              <div key={label} className="text-center">
                <div
                  className={`mx-auto flex w-full max-w-20 items-start justify-center rounded-t-xl bg-gradient-to-t ${index === 0 ? "from-[#075ec5] to-sky-400" : "from-[#062d55] to-blue-500"} ${height} pt-3 text-xs font-black text-white`}
                >
                  {value}
                </div>
                <span className="mt-3 block text-[9px] font-bold text-slate-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="erp-panel">
          <h3 className="erp-panel-title">Conversion health</h3>
          <div className="mt-8 flex justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#075ec5 ${metrics.conversionRate || 0}%, #eaf0f5 0)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <strong className="font-display text-3xl text-[#082f57]">
                  {metrics.conversionRate || 0}%
                </strong>
                <span className="mt-1 text-[9px] font-bold text-slate-400">
                  Lead conversion
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-blue-50 p-3">
              <strong className="text-lg text-blue-700">
                {metrics.newLeads || 0}
              </strong>
              <span className="block text-[8px] font-bold text-blue-600">
                New leads
              </span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <strong className="text-lg text-emerald-700">
                {metrics.activeStudents || 0}
              </strong>
              <span className="block text-[8px] font-bold text-emerald-600">
                Students
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const accessView = () => (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Roles & permissions"
        title="Access shaped around real staff responsibilities."
        description="Employees can hold multiple roles. Module and action permissions are normalized in the database."
        action={
          <button
            type="button"
            onClick={() =>
              showToast(
                "Custom role creation is included in the backend schema and will use this drawer pattern.",
              )
            }
            className="erp-primary-button"
          >
            <Plus className="h-4 w-4" /> Custom role
          </button>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Purpose</th>
                <th className="px-5 py-4">Users</th>
                <th className="px-5 py-4">Permissions</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((role) => (
                <tr key={role.id} className="text-[10px] text-slate-600">
                  <td className="px-5 py-4">
                    <strong className="text-[11px] text-[#082f57]">
                      {role.name}
                    </strong>
                    <span className="mt-1 block font-mono text-[8px] text-slate-400">
                      {role.slug}
                    </span>
                  </td>
                  <td className="px-5 py-4">{role.description}</td>
                  <td className="px-5 py-4 font-bold">{role.users}</td>
                  <td className="px-5 py-4 font-bold">{role.permissions}</td>
                  <td className="px-5 py-4">
                    <StatusPill value="active" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderModule = () => {
    if (!workspace) return null;
    return {
      dashboard: dashboardView,
      leads: leadsView,
      students: studentsView,
      applications: applicationsView,
      operations: operationsView,
      tasks: tasksView,
      finance: financeView,
      reports: reportsView,
      access: accessView,
    }[activeModule]?.();
  };

  return (
    <div className="erp-shell min-h-screen bg-[#f4f7fa] text-slate-900">
      <aside className="fixed bottom-3 left-3 top-3 z-40 hidden w-[260px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(6,45,85,0.12)] lg:block">
        {sidebar}
      </aside>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm lg:hidden">
          <div className="h-full w-[280px] bg-white shadow-2xl">{sidebar}</div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700"
            aria-label="Close ERP navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="lg:pl-[284px]">
        <header className="sticky top-3 z-30 mx-3 flex h-[68px] items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 shadow-[0_14px_40px_rgba(6,45,85,0.09)] backdrop-blur-xl sm:px-6 xl:px-8">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="erp-icon-button lg:hidden"
            aria-label="Open ERP navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <label className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search students, leads, applications...  Ctrl K"
              className="h-10 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-[10px] font-semibold outline-none ring-1 ring-inset ring-slate-200 focus:ring-blue-300"
            />
          </label>
          <select className="hidden h-10 rounded-xl bg-white px-3 text-[9px] font-bold text-slate-600 outline-none ring-1 ring-slate-200 sm:block">
            <option>This month</option>
            <option>Today</option>
            <option>This week</option>
            <option>Custom period</option>
          </select>
          <select className="hidden h-10 rounded-xl bg-white px-3 text-[9px] font-bold text-slate-600 outline-none ring-1 ring-slate-200 md:block">
            <option>Dubai Main Branch</option>
            <option>All branches</option>
          </select>
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="erp-icon-button"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                <h3 className="text-xs font-extrabold text-[#082f57]">
                  Notifications
                </h3>
                <div className="mt-3 space-y-2">
                  <p className="rounded-xl bg-blue-50 p-3 text-[10px] leading-5 text-blue-800">
                    New website enquiries are automatically assigned to the
                    Dubai counseling queue.
                  </p>
                  <p className="rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-800">
                    One application has documents pending.
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6 xl:p-8">
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
                />
              ))}
            </div>
          )}
          {error && (
            <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(6,45,85,0.14)] lg:grid-cols-[0.8fr_1.2fr]">
              <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#062d55] to-[#075ec5] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                <BriefcaseBusiness className="h-10 w-10 text-sky-200" />
                <div>
                  <h2 className="font-display text-3xl font-semibold">
                    Your consultancy workspace.
                  </h2>
                  <p className="mt-4 text-xs leading-6 text-blue-100/75">
                    Leads, students, applications, documents, tasks, finance,
                    and reporting in one secure operating system.
                  </p>
                </div>
              </div>
              <div className="p-7 sm:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#075ec5]">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h2 className="font-display mt-5 text-2xl font-semibold text-[#082f57]">
                  Staff authentication required
                </h2>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  Sign in with your authorized team account to continue.
                </p>
                <form
                  onSubmit={handleStaffLogin}
                  className="mt-7 space-y-4 text-left"
                >
                  <label className="form-label">
                    Staff email
                    <input
                      type="email"
                      value={staffCredentials.email}
                      onChange={(event) =>
                        setStaffCredentials({
                          ...staffCredentials,
                          email: event.target.value,
                        })
                      }
                      className="form-field"
                      placeholder="name@mothertheresa.edu"
                      autoComplete="username"
                      required
                    />
                  </label>
                  <label className="form-label">
                    Password
                    <input
                      type="password"
                      value={staffCredentials.password}
                      onChange={(event) =>
                        setStaffCredentials({
                          ...staffCredentials,
                          password: event.target.value,
                        })
                      }
                      className="form-field"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                  </label>
                  <div className="rounded-xl bg-rose-50 p-3 text-[10px] leading-5 text-rose-700">
                    {error}
                  </div>
                  <button
                    type="submit"
                    disabled={signingIn}
                    className="erp-primary-button w-full"
                  >
                    {signingIn ? "Signing in…" : "Sign in to ERP"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <button
                  type="button"
                  onClick={loadWorkspace}
                  className="mt-4 text-[10px] font-bold text-slate-400 hover:text-[#075ec5]"
                >
                  <RefreshCw className="mr-1 inline h-3.5 w-3.5" /> Retry
                  connection
                </button>
              </div>
            </div>
          )}
          {!loading && !error && renderModule()}
        </main>
      </div>

      {selectedLead && (
        <div
          className="fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <aside
            className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] text-slate-400">
                  {selectedLead.lead_code}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-[#082f57]">
                  {selectedLead.full_name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedLead.preferred_country} ·{" "}
                  {selectedLead.preferred_course}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="erp-icon-button"
                aria-label="Close lead profile"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-7 grid grid-cols-4 gap-2">
              <a
                href={`tel:${selectedLead.mobile}`}
                className="lead-quick-action"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={`https://wa.me/${String(selectedLead.whatsapp || selectedLead.mobile || "").replace(/\D/g, "")}`}
                className="lead-quick-action"
              >
                <MessageCircleMore className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={`mailto:${selectedLead.email}`}
                className="lead-quick-action"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Follow-up scheduling will use the centralized followups table.",
                  )
                }
                className="lead-quick-action"
              >
                <CalendarClock className="h-4 w-4" /> Follow-up
              </button>
            </div>
            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Current stage
                </span>
                <StatusPill value={selectedLead.status} />
              </div>
              <select
                value={selectedLead.status}
                onChange={(event) =>
                  changeLeadStatus(selectedLead, event.target.value)
                }
                className="mt-4 w-full rounded-xl bg-white p-3 text-xs font-bold text-[#082f57] outline-none ring-1 ring-slate-200"
              >
                {leadStages.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div className="mt-7 space-y-4">
              <div>
                <span className="lead-detail-label">Phone / WhatsApp</span>
                <p className="lead-detail-value">{selectedLead.mobile}</p>
              </div>
              <div>
                <span className="lead-detail-label">Email</span>
                <p className="lead-detail-value">{selectedLead.email}</p>
              </div>
              <div>
                <span className="lead-detail-label">Source & branch</span>
                <p className="lead-detail-value">
                  {selectedLead.source} · {selectedLead.branch}
                </p>
              </div>
              <div>
                <span className="lead-detail-label">Assigned counsellor</span>
                <p className="lead-detail-value">{selectedLead.counselor}</p>
              </div>
              <div>
                <span className="lead-detail-label">Preferred intake</span>
                <p className="lead-detail-value">
                  {selectedLead.preferred_intake || "Not decided"}
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-extrabold text-[#082f57]">
                Connected timeline
              </h3>
              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#075ec5] ring-4 ring-blue-50" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-600">
                      Lead created from {selectedLead.source}
                    </p>
                    <span className="mt-1 block text-[8px] uppercase tracking-wider text-slate-400">
                      {formatDate(selectedLead.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-600">
                      Assigned to {selectedLead.counselor}
                    </p>
                    <span className="mt-1 block text-[8px] uppercase tracking-wider text-slate-400">
                      Dubai Main Branch
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
