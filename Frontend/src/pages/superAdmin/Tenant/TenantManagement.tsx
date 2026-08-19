import React, { useEffect, useState } from "react";
import { Ban, CheckCircle2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header";
import { adminTenantService, type AdminTenant } from "../../../services/adminTenantService";

const PAGE_SIZE = 10;
const formatStatus = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const TenantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminTenantService.getTenants(page, PAGE_SIZE)
      .then((data) => { if (active) { setTenants(data.tenants); setTotal(data.total); setError(""); } })
      .catch(() => { if (active) setError("Unable to load tenants. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  const visibleTenants = tenants.filter((tenant) =>
    `${tenant.companyName} ${tenant.ownerName} ${tenant.email}`.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const toggleStatus = async (tenant: AdminTenant) => {
    const action = tenant.isActive ? "block" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${tenant.companyName}?`)) return;
    try {
      setUpdatingId(tenant.id);
      const updated = await adminTenantService.updateStatus(tenant.id, !tenant.isActive);
      setTenants((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch { setError(`Unable to ${action} this tenant. Please try again.`); }
    finally { setUpdatingId(null); }
  };

  return <div className="flex min-h-screen bg-slate-50">
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <div className="flex min-h-screen w-full flex-1 flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
        <div><p className="text-xs text-slate-400">Admin / Tenants</p><h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Tenant Management</h1><p className="mt-1 text-sm text-slate-500">Manage access for your tenant organizations.</p></div>
        <div className="relative max-w-xl"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, owner, or email..." className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" /></div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b bg-slate-50 text-xs uppercase text-slate-400"><th className="px-6 py-3">Company</th><th className="px-6 py-3">Owner</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Verification</th><th className="px-6 py-3">Created</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
          {loading ? <tr><td colSpan={7} className="px-6 py-14 text-center text-sm text-slate-400">Loading tenants…</td></tr> : visibleTenants.map((tenant) => <tr key={tenant.id} className="hover:bg-slate-50"><td className="px-6 py-4"><button onClick={() => navigate(`/superadmin/tenants/${tenant.id}`)} className="font-semibold text-indigo-600 hover:underline">{tenant.companyName}</button></td><td className="px-6 py-4 text-sm text-slate-600">{tenant.ownerName}</td><td className="px-6 py-4 text-sm text-slate-600">{tenant.email}</td><td className="px-6 py-4"><span className={tenant.isActive ? "text-emerald-700" : "text-red-600"}>{tenant.isActive ? "Active" : "Blocked"}</span></td><td className="px-6 py-4 text-sm text-slate-600">{formatStatus(tenant.verificationStatus)}</td><td className="px-6 py-4 text-sm text-slate-500">{new Date(tenant.createdAt).toLocaleDateString()}</td><td className="px-6 py-4 text-right"><button disabled={updatingId === tenant.id} onClick={() => toggleStatus(tenant)} className={tenant.isActive ? "inline-flex items-center gap-1 rounded border border-red-200 px-3 py-1.5 text-xs text-red-600" : "inline-flex items-center gap-1 rounded border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700"}>{tenant.isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{tenant.isActive ? "Block" : "Activate"}</button></td></tr>)}
          {!loading && visibleTenants.length === 0 && <tr><td colSpan={7} className="px-6 py-14 text-center text-sm text-slate-400">No tenants found.</td></tr>}</tbody></table></div></div>
        <div className="flex items-center justify-between text-sm text-slate-500"><span>Showing {(page - 1) * PAGE_SIZE + (total ? 1 : 0)}–{Math.min(page * PAGE_SIZE, total)} of {total}</span><div><button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div>
      </main></div></div>;
};
export default TenantManagement;
