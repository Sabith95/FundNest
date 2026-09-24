import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Wallet,
  Users,
  Layers,
  TrendingUp,
  RefreshCw,
  Lock,
  Unlock,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import type { TenantUser } from "../../types/tenant.types";
import {
  tenantFundService,
  type ChitFund,
} from "../../services/tenantFundService";
import { confirmToast } from "../../utitls/confirmToast";
import CreateFundModal from "../../components/fund/CreateFundModal";
import ViewFundModal from "../../components/fund/ViewFundModal";

interface FundPageProps {
  user?: TenantUser;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FundPage({ user: _user }: FundPageProps) {
  const navigate = useNavigate();
  const [funds, setFunds] = useState<ChitFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "NORMAL" | "MULTI_DIVISION"
  >("ALL");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<ChitFund | null>(null);
  const [togglingFundId, setTogglingFundId] = useState<string | null>(null);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const data = await tenantFundService.getTenantFunds();
      setFunds(data);
    } catch (err: any) {
      console.error("Failed to load chit funds:", err);
      toast.error(err.response?.data?.message || "Failed to load chit funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const filteredFunds = useMemo(() => {
    return funds.filter((fund) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        fund.name.toLowerCase().includes(q) ||
        fund.id.toLowerCase().includes(q) ||
        (fund.description && fund.description.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && fund.isActive) ||
        (statusFilter === "BLOCKED" && !fund.isActive);

      const matchesType = typeFilter === "ALL" || fund.fundType === typeFilter;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [funds, query, statusFilter, typeFilter]);

  const handleToggleBlock = async (fund: ChitFund) => {
    const action = fund.isActive ? "block" : "unblock";
    const confirmed = await confirmToast(
      fund.isActive
        ? `Are you sure you want to block "${fund.name}"? Members will not be able to join this plan until it is unblocked.`
        : `Are you sure you want to unblock "${fund.name}"? This plan will become available again.`,
    );
    if (!confirmed) return;

    try {
      setTogglingFundId(fund.id);
      if (fund.isActive) {
        await tenantFundService.blockFund(fund.id);
        toast.info(`Fund "${fund.name}" has been blocked.`);
      } else {
        await tenantFundService.unblockFund(fund.id);
        toast.success(`Fund "${fund.name}" has been unblocked.`);
      }
      await fetchFunds();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      toast.error(
        err.response?.data?.message || `Failed to ${action} this plan.`,
      );
    } finally {
      setTogglingFundId(null);
    }
  };

  const totalPoolValue = useMemo(
    () => funds.reduce((acc, f) => acc + f.chitValue, 0),
    [funds],
  );
  const activeCount = useMemo(
    () => funds.filter((f) => f.isActive).length,
    [funds],
  );
  const totalMembers = useMemo(
    () => funds.reduce((acc, f) => acc + f.currentMembersCount, 0),
    [funds],
  );

  const hasFunds = funds.length > 0;

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Chit Funds
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage your organization&apos;s chit fund schemes with
            live backend data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFunds}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50"
            title="Refresh Funds"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => navigate("/tenants/kyc-config")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ShieldCheck className="h-4 w-4" />
            KYC Configuration
          </button>

          {hasFunds && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      {hasFunds && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Schemes
              </span>
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {funds.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Funds
              </span>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Pool Value
              </span>
              <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totalPoolValue)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Enrolled
              </span>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalMembers}
            </p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && !hasFunds && (
        <div className="mt-12 flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading your chit funds...
          </p>
        </div>
      )}

      {/* Empty State Hero Card */}
      {!loading && !hasFunds && (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
            <Wallet className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-800">
            You don&apos;t have any funds yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
            Create your first chit fund plan to start pooling contributions,
            inviting subscribers, and managing monthly auctions.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Create Fund Plan
          </button>
        </div>
      )}

      {/* Table & Mobile Cards */}
      {!loading && hasFunds && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="BLOCKED">Blocked Only</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ALL">All Categories</option>
                <option value="NORMAL">Normal Chit</option>
                <option value="MULTI_DIVISION">Multi-Division</option>
              </select>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by fund name..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Scheme Details</th>
                  <th className="px-6 py-3.5 text-right">Pool Amount</th>
                  <th className="px-6 py-3.5 text-right">Monthly Sub.</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Members</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFunds.map((fund) => (
                  <tr
                    key={fund.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">
                        {fund.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400">
                          {fund.fundType === "MULTI_DIVISION" ? (
                            <span className="text-indigo-600 font-semibold">
                              Multi-Division ({fund.division} Divs)
                            </span>
                          ) : (
                            "Normal Chit"
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">
                      {formatCurrency(fund.chitValue)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      {formatCurrency(fund.contributionAmount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {fund.durationMonths} Months
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {fund.currentMembersCount}
                      </span>{" "}
                      / {fund.totalMembers}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          fund.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            fund.isActive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {fund.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedFund(fund)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleToggleBlock(fund)}
                          disabled={togglingFundId === fund.id}
                          className={`rounded-lg p-2 transition-colors ${
                            fund.isActive
                              ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                              : "text-amber-600 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                          title={fund.isActive ? "Block Fund" : "Unblock Fund"}
                        >
                          {togglingFundId === fund.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : fund.isActive ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredFunds.map((fund) => (
              <div key={fund.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {fund.name}
                    </h4>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                      {fund.fundType === "MULTI_DIVISION"
                        ? `Multi-Division (${fund.division} Divs)`
                        : "Normal Chit"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      fund.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {fund.isActive ? "Active" : "Blocked"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-400">Pool Value</span>
                    <p className="font-bold text-indigo-700 text-sm">
                      {formatCurrency(fund.chitValue)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-400">Monthly</span>
                    <p className="font-semibold text-slate-800 text-sm">
                      {formatCurrency(fund.contributionAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Duration:{" "}
                    <strong className="text-slate-700">
                      {fund.durationMonths} Months
                    </strong>
                  </span>
                  <span>
                    Enrolled:{" "}
                    <strong className="text-slate-700">
                      {fund.currentMembersCount}/{fund.totalMembers}
                    </strong>
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFund(fund)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                  <button
                    onClick={() => handleToggleBlock(fund)}
                    disabled={togglingFundId === fund.id}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                      fund.isActive
                        ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                        : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {fund.isActive ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFunds.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              No funds found matching your search or filters.
            </div>
          )}
        </div>
      )}

      <CreateFundModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchFunds}
      />

      <ViewFundModal
        fund={selectedFund}
        onClose={() => setSelectedFund(null)}
      />
    </div>
  );
}
