import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Layers,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../../components/admin/Header";
import Sidebar from "../../../components/admin/Sidebar";
import { adminSubscriptionPlanService } from "../../../services/adminSubscriptionPlanService";
import { ROUTES } from "../../../shared/constants";
import type { AdminBillingRecord } from "../../../types/subsctiption.types";

export default function AdminBillingHistoryPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState<AdminBillingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await adminSubscriptionPlanService.getBillingHistory();
      setRecords(data);
    } catch (error) {
      console.error("Failed to load billing history", error);
      toast.error("Failed to load billing history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.tenantEmail &&
          rec.tenantEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rec.razorpayPaymentId &&
          rec.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || rec.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalRecords = records.length;
    const activeCount = records.filter((r) => r.status === "ACTIVE").length;
    const expiredCount = records.filter((r) => r.status === "EXPIRED").length;
    const totalRevenue = records
      .filter((r) => r.status === "ACTIVE" || r.status === "PAID" || r.status === "EXPIRED")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { totalRecords, activeCount, expiredCount, totalRevenue };
  }, [records]);

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          adminName="Admin User"
          adminRole="Super Admin"
        />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header & Back Button */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.SUPER_ADMIN.SUBSCRIPTION)}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Subscription Plans
              </button>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Tenant Billing History
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Overview of all tenant subscriptions, payment records, and renewal dates across FundNest.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadHistory()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Metric Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Billed
                </span>
                <CreditCard className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-slate-500">Gross subscription revenue</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Subscriptions
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.activeCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">Currently active tenants</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Expired / Inactive
                </span>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.expiredCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">Past renewal date</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Records
                </span>
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.totalRecords}
              </p>
              <p className="mt-1 text-xs text-slate-500">Lifetime transactions logged</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant name, plan, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold">
                {["ALL", "ACTIVE", "EXPIRED", "FAILED"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg px-3 py-1.5 transition-colors ${
                      statusFilter === status
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Billing History Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {isLoading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm font-medium text-slate-500">Loading billing history...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center p-12 text-center">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-base font-semibold text-slate-700">No billing history found</p>
                <p className="text-xs text-slate-400">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your search query or status filter."
                    : "No subscriptions or payments have been recorded yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Tenant Name</th>
                      <th className="px-6 py-4 font-semibold">Subscription Plan</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Renewal / Expiry Date</th>
                      <th className="px-6 py-4 font-semibold">Started / Paid Date</th>
                      <th className="px-6 py-4 font-semibold">Payment Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Tenant Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">
                              {record.tenantName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {record.tenantName}
                              </p>
                              {record.tenantEmail && (
                                <p className="text-xs text-slate-400">
                                  {record.tenantEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-800">
                                {record.planName}
                              </p>
                              <p className="text-[11px] text-slate-400 capitalize">
                                {record.planType} • {record.billingCycle}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₹{record.amount.toLocaleString("en-IN")}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {record.status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : record.status === "EXPIRED" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Expired
                            </span>
                          ) : record.status === "FAILED" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <XCircle className="h-3.5 w-3.5 text-red-500" />
                              Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                              Paid
                            </span>
                          )}
                        </td>

                        {/* Renewal Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                            <span className="font-medium">
                              {formatDate(record.renewalDate)}
                            </span>
                          </div>
                        </td>

                        {/* Started / Paid Date */}
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(record.startsAt)}
                        </td>

                        {/* Payment Ref */}
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {record.razorpayPaymentId ? (
                            <span className="rounded bg-slate-100 px-2 py-0.5">
                              {record.razorpayPaymentId}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
