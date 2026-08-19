import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminTenantService, type AdminTenant } from "../../../services/adminTenantService";

export default function TenantDetailsPage() {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState<AdminTenant | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (tenantId) adminTenantService.getTenant(tenantId).then(setTenant).catch(() => setError("Tenant could not be found.")); }, [tenantId]);
  if (error) return <main className="p-8"><p className="text-red-600">{error}</p><Link className="text-indigo-600" to="/superadmin/tenants">Back to tenants</Link></main>;
  if (!tenant) return <main className="p-8 text-slate-500">Loading tenant…</main>;
  return <main className="min-h-screen bg-slate-50 p-6 sm:p-8"><Link className="text-sm text-indigo-600 hover:underline" to="/superadmin/tenants">? Back to tenants</Link><section className="mt-5 max-w-2xl rounded-lg border border-slate-200 bg-white p-6"><h1 className="text-2xl font-bold text-slate-900">{tenant.companyName}</h1><dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-slate-400">Owner</dt><dd className="mt-1 text-slate-800">{tenant.ownerName}</dd></div><div><dt className="text-slate-400">Email</dt><dd className="mt-1 text-slate-800">{tenant.email}</dd></div><div><dt className="text-slate-400">Account status</dt><dd className="mt-1 text-slate-800">{tenant.isActive ? "Active" : "Blocked"}</dd></div><div><dt className="text-slate-400">Verification</dt><dd className="mt-1 text-slate-800">{tenant.verificationStatus.replace(/_/g, " ")}</dd></div><div><dt className="text-slate-400">Created</dt><dd className="mt-1 text-slate-800">{new Date(tenant.createdAt).toLocaleString()}</dd></div></dl></section></main>;
}
