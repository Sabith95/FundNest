

// import { useState } from "react";
// import {
//   Building2,
//   ChevronLeft,
//   CheckCircle2,
//   Circle,
//   ShieldCheck,
//   FileText,
//   Landmark,
//   FileBadge,
//   UserSquare2,
//   AlertTriangle,
//   ChevronRight,
//   X,
// } from "lucide-react";

// import Sidebar from "../../../components/admin/Sidebar";
// import Header from "../../../components/admin/Header";

// type DocStatus = "pending" | "verified" | "rejected";

// interface DocItem {
//   id: string;
//   title: string;
//   uploaded: string;
//   icon: React.ReactNode;
//   status: DocStatus;
// }

// // Generic target used to identify what a modal / toast action refers to.
// // "business" | "bank" | "tenant" | `doc:${docId}`
// type ActionTarget = string;

// interface PendingAction {
//   target: ActionTarget;
//   label: string;
// }

// const INITIAL_DOCS: DocItem[] = [
//   { id: "reg", title: "Business Registration", uploaded: "Oct 12, 2023", icon: <FileBadge className="h-5 w-5" />, status: "pending" },
//   { id: "id", title: "Owner ID Proof", uploaded: "Oct 12, 2023", icon: <UserSquare2 className="h-5 w-5" />, status: "pending" },
// ];

// export default function KycReview() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [businessStatus, setBusinessStatus] = useState<DocStatus>("pending");
//   const [bankStatus, setBankStatus] = useState<DocStatus>("pending");
//   const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);

//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
//   const [confirmAction, setConfirmAction] = useState<PendingAction | null>(null);
//   const [rejectAction, setRejectAction] = useState<PendingAction | null>(null);

//   const showToast = (message: string, type: "success" | "error" = "success") => {
//     setToast({ message, type });
//     window.setTimeout(() => setToast(null), 3000);
//   };

//   const setDocStatus = (id: string, status: DocStatus) =>
//     setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

//   const allVerified =
//     businessStatus === "verified" && bankStatus === "verified" && docs.every((d) => d.status === "verified");
//   const stillPending = docs.filter((d) => d.status !== "verified").length;

//   // Opens the "are you sure" confirmation modal for a verify action.
//   const openVerifyConfirm = (target: ActionTarget, label: string) => setConfirmAction({ target, label });

//   // Opens the reject-reason modal for a reject action.
//   const openRejectReason = (target: ActionTarget, label: string) => setRejectAction({ target, label });

//   const applyVerified = (target: ActionTarget) => {
//     if (target === "business") setBusinessStatus("verified");
//     else if (target === "bank") setBankStatus("verified");
//     else if (target.startsWith("doc:")) setDocStatus(target.slice(4), "verified");
//   };

//   const applyRejected = (target: ActionTarget) => {
//     if (target === "business") setBusinessStatus("rejected");
//     else if (target === "bank") setBankStatus("rejected");
//     else if (target.startsWith("doc:")) setDocStatus(target.slice(4), "rejected");
//   };

//   const handleConfirmVerify = () => {
//     if (!confirmAction) return;
//     const { target, label } = confirmAction;
//     applyVerified(target);
//     setConfirmAction(null);
//     showToast(target === "tenant" ? "Tenant approved successfully" : `${label} verified successfully`, "success");
//   };

//   const handleSubmitReject = (reason: string) => {
//     if (!rejectAction) return;
//     const { target, label } = rejectAction;
//     applyRejected(target);
//     setRejectAction(null);
//     showToast(target === "tenant" ? "Tenant rejected" : `${label} rejected`, "error");
//     // `reason` is captured here and can be wired up to an API call if needed.
//     void reason;
//   };

//   return (
//     <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <div className="flex min-h-screen flex-1 flex-col">
//         <Header onMenuClick={() => setSidebarOpen(true)} adminName="Jonathan Sterling" adminRole="Super Admin" />

//         {/* Breadcrumb + back action bar */}
//         <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
//           <div className="hidden min-w-0 items-center gap-1.5 truncate text-sm text-slate-400 md:flex">
//             <span>Dashboard</span>
//             <ChevronRight className="h-3.5 w-3.5 shrink-0" />
//             <span>Tenants</span>
//             <ChevronRight className="h-3.5 w-3.5 shrink-0" />
//             <span>Tenant Details</span>
//             <ChevronRight className="h-3.5 w-3.5 shrink-0" />
//             <span className="font-semibold text-slate-800">KYC Review</span>
//           </div>
//           <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
//             <ChevronLeft className="h-4 w-4" />
//             <span className="hidden sm:inline">Back to Tenant Details</span>
//             <span className="sm:hidden">Back</span>
//           </button>
//         </div>

//         <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
//           <div className="mx-auto flex max-w-6xl flex-col gap-6">
//             {/* Title row */}
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">KYC &amp; Document Review</h1>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Final verification step for onboarding regional investment entities.
//                 </p>
//               </div>
//               <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
//                 <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
//                 Under Review
//               </span>
//             </div>

//             {/* Summary */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="mb-5 flex items-center gap-2">
//                 <Building2 className="h-[18px] w-[18px] text-indigo-600" />
//                 <h2 className="text-base font-bold text-slate-900">Tenant Summary</h2>
//               </div>
//               <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
//                 <Field label="Company Name" value="Apex Capital Partners LLC" valueClass="text-indigo-700" />
//                 <Field label="Tenant ID" value="FN-2024-APEX-0092" />
//                 <Field label="Owner Name" value="Jonathan Sterling" />
//                 <Field label="Contact Info" value="j.sterling@apexcap.com" />
//               </div>
//             </div>

//             {/* Business Details Review */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex flex-wrap items-center gap-2.5">
//                   <Building2 className="h-[18px] w-[18px] text-indigo-600" />
//                   <h2 className="text-base font-bold text-slate-900">Business Details Review</h2>
//                   <StatusPill status={businessStatus} />
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => openRejectReason("business", "Business Details")}
//                     className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
//                   >
//                     Reject
//                   </button>
//                   <button
//                     onClick={() => openVerifyConfirm("business", "Business Details")}
//                     className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//                   >
//                     Verify
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
//                 <Field label="Registration ID" value="US-NY-988231-A" />
//                 <Field label="Business Type" value="Private Limited Liability Company" />
//                 <Field label="Registered Address" value="12th Floor, Financial District One, Manhattan, NY 10004" />
//               </div>
//             </section>

//             {/* Bank Details Verification */}
//             <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
//               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex flex-wrap items-center gap-2.5">
//                   <Landmark className="h-[18px] w-[18px] text-indigo-600" />
//                   <h2 className="text-base font-bold text-slate-900">Bank Details Verification</h2>
//                   <StatusPill status={bankStatus} />
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => openRejectReason("bank", "Bank Details")}
//                     className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
//                   >
//                     Reject
//                   </button>
//                   <button
//                     onClick={() => openVerifyConfirm("bank", "Bank Details")}
//                     className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//                   >
//                     Verify
//                   </button>
//                 </div>
//               </div>
//               <div className="rounded-xl bg-white p-5">
//                 <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
//                   <Field label="Bank Name" value="Chase Manhattan National" />
//                   <Field label="Account Holder" value="Apex Capital Partners LLC" />
//                   <Field label="Account Number" value="**** **** 4492" />
//                   <Field label="IFSC / SWIFT Code" value="CHASUS33XXX" />
//                 </div>
//               </div>
//             </section>

//             {/* Document Verification */}
//             <section>
//               <div className="mb-4 flex items-center gap-2">
//                 <FileText className="h-[18px] w-[18px] text-indigo-600" />
//                 <h2 className="text-base font-bold text-slate-900">Document Verification</h2>
//               </div>
//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                 {docs.map((doc) => (
//                   <DocumentCard
//                     key={doc.id}
//                     doc={doc}
//                     onReject={() => openRejectReason(`doc:${doc.id}`, doc.title)}
//                     onVerify={() => openVerifyConfirm(`doc:${doc.id}`, doc.title)}
//                   />
//                 ))}
//               </div>
//             </section>

//             {/* Warning banner */}
//             {!allVerified && (
//               <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
//                 <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
//                 <p>
//                   Cannot approve until all KYC items are verified.{" "}
//                   {stillPending > 0
//                     ? `${stillPending} document${stillPending > 1 ? "s" : ""} still require manual review.`
//                     : "Awaiting final checks."}
//                 </p>
//               </div>
//             )}

//             {/* Footer actions */}
//             <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-end">
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => openRejectReason("tenant", "Tenant")}
//                   className="rounded-lg border-2 border-rose-500 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
//                 >
//                   Reject Tenant
//                 </button>
//                 <button
//                   disabled={!allVerified}
//                   onClick={() => openVerifyConfirm("tenant", "Tenant")}
//                   className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${
//                     allVerified
//                       ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                       : "cursor-not-allowed bg-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <ShieldCheck className="h-4 w-4" />
//                   Approve Tenant
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Verify confirmation modal */}
//       <ConfirmModal
//         open={confirmAction !== null}
//         title={confirmAction?.target === "tenant" ? "Approve Tenant" : `Verify ${confirmAction?.label ?? ""}`}
//         message={
//           confirmAction?.target === "tenant"
//             ? "Are you sure you want to approve this tenant? This action will complete the onboarding process."
//             : `Are you sure you want to mark "${confirmAction?.label}" as verified?`
//         }
//         confirmLabel={confirmAction?.target === "tenant" ? "Approve" : "Verify"}
//         onConfirm={handleConfirmVerify}
//         onCancel={() => setConfirmAction(null)}
//       />

//       {/* Reject reason modal */}
//       <RejectReasonModal
//         open={rejectAction !== null}
//         title={rejectAction?.target === "tenant" ? "Reject Tenant" : `Reject ${rejectAction?.label ?? ""}`}
//         onSubmit={handleSubmitReject}
//         onCancel={() => setRejectAction(null)}
//       />

//       {/* Toast */}
//       <Toast toast={toast} />
//     </div>
//   );
// }

// function Field({
//   label,
//   value,
//   valueClass = "text-slate-800",
// }: {
//   label: string;
//   value: string;
//   valueClass?: string;
// }) {
//   return (
//     <div>
//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
//       <p className={`mt-1 text-[15px] font-semibold leading-snug ${valueClass}`}>{value}</p>
//     </div>
//   );
// }

// function StatusPill({ status }: { status: DocStatus }) {
//   const map: Record<DocStatus, string> = {
//     pending: "bg-amber-100 text-amber-700",
//     verified: "bg-emerald-100 text-emerald-700",
//     rejected: "bg-rose-100 text-rose-700",
//   };
//   const text: Record<DocStatus, string> = {
//     pending: "PENDING",
//     verified: "VERIFIED",
//     rejected: "REJECTED",
//   };
//   return (
//     <span className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide ${map[status]}`}>
//       {text[status]}
//     </span>
//   );
// }

// function DocumentCard({
//   doc,
//   onReject,
//   onVerify,
// }: {
//   doc: DocItem;
//   onReject: () => void;
//   onVerify: () => void;
// }) {
//   const barColor =
//     doc.status === "verified" ? "bg-emerald-500" : doc.status === "rejected" ? "bg-rose-500" : "bg-amber-400";

//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className={`h-1 w-full ${barColor}`} />
//       <div className="p-5">
//         <div className="mb-4 flex items-start justify-between">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
//             {doc.icon}
//           </div>
//           <StatusPill status={doc.status} />
//         </div>
//         <p className="text-[15px] font-bold text-slate-900">{doc.title}</p>
//         <p className="mt-0.5 text-xs text-slate-400">Uploaded: {doc.uploaded}</p>

//         <div className="mt-4 flex items-center gap-2">
//           <button className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200">
//             View File
//           </button>
//           <button
//             onClick={onReject}
//             aria-label="Reject document"
//             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
//               doc.status === "rejected" ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-100"
//             }`}
//           >
//             <X className="h-4 w-4" />
//           </button>
//           <button
//             onClick={onVerify}
//             aria-label="Verify document"
//             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
//               doc.status === "verified"
//                 ? "bg-emerald-500 text-white"
//                 : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
//             }`}
//           >
//             <CheckCircle2 className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ConfirmModal({
//   open,
//   title,
//   message,
//   confirmLabel = "Confirm",
//   onConfirm,
//   onCancel,
// }: {
//   open: boolean;
//   title: string;
//   message: string;
//   confirmLabel?: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
//       <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
//         <div className="mb-4 flex items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
//             <CheckCircle2 className="h-5 w-5" />
//           </div>
//           <h3 className="text-base font-bold text-slate-900">{title}</h3>
//         </div>
//         <p className="text-sm text-slate-600">{message}</p>
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RejectReasonModal({
//   open,
//   title,
//   onSubmit,
//   onCancel,
// }: {
//   open: boolean;
//   title: string;
//   onSubmit: (reason: string) => void;
//   onCancel: () => void;
// }) {
//   const [reason, setReason] = useState("");

//   if (!open) return null;

//   const handleClose = () => {
//     setReason("");
//     onCancel();
//   };

//   const handleSubmit = () => {
//     if (!reason.trim()) return;
//     onSubmit(reason.trim());
//     setReason("");
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
//       <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
//         <div className="mb-4 flex items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
//             <X className="h-5 w-5" />
//           </div>
//           <h3 className="text-base font-bold text-slate-900">{title}</h3>
//         </div>
//         <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
//           Rejection Reason
//         </label>
//         <textarea
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           rows={4}
//           placeholder="Enter the reason for rejection..."
//           className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
//         />
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             onClick={handleClose}
//             className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!reason.trim()}
//             className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
//               reason.trim() ? "bg-rose-600 hover:bg-rose-700" : "cursor-not-allowed bg-rose-300"
//             }`}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Toast({ toast }: { toast: { message: string; type: "success" | "error" } | null }) {
//   if (!toast) return null;

//   const isSuccess = toast.type === "success";

//   return (
//     <div
//       className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
//       style={{
//         backgroundColor: isSuccess ? "#ecfdf5" : "#fff1f2",
//         borderColor: isSuccess ? "#a7f3d0" : "#fecdd3",
//       }}
//     >
//       {isSuccess ? (
//         <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
//       ) : (
//         <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
//       )}
//       <span className={`text-sm font-semibold ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
//         {toast.message}
//       </span>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  CheckCircle2,
  Circle,
  FileText,
  Landmark,
  FileBadge,
  UserSquare2,
  AlertTriangle,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header";
import { adminTenantService } from "../../../services/adminTenantService";
import type { TenantDetailsData } from "../../../types/tenant.types";
import { tenantKycService } from "../../../services/tenantKycService";

type ActionTarget = "business" | "bank" | "doc:reg" | "doc:id";

interface PendingAction {
  target: ActionTarget;
  label: string;
}

export default function KycReview() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenant, setTenant] = useState<TenantDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmAction, setConfirmAction] = useState<PendingAction | null>(null);
  const [rejectAction, setRejectAction] = useState<PendingAction | null>(null);

  const loadTenant = () => {
    if (!tenantId) {
      setError("No tenant ID specified.");
      setLoading(false);
      return;
    }

    setLoading(true);
    adminTenantService
      .getTenant(tenantId)
      .then((data) => setTenant(data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load tenant KYC details."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const mapStatus = (status?: string): "pending" | "verified" | "rejected" => {
    if (!status) return "pending";
    const s = status.toUpperCase();
    if (s === "APPROVED" || s === "VERIFIED") return "verified";
    if (s === "REJECTED") return "rejected";
    return "pending";
  };

  const businessStatus = mapStatus(tenant?.businessInfo?.verification?.status);
  const bankStatus = mapStatus(tenant?.bankDetails?.verification?.status);
  const regDocStatus = mapStatus(tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.status);
  const ownerDocStatus = mapStatus(tenant?.kycDocuments?.ownerIdProof?.verification?.status);

  const allItemsReviewed =
    businessStatus !== "pending" &&
    bankStatus !== "pending" &&
    regDocStatus !== "pending" &&
    ownerDocStatus !== "pending";

  const [completingReview, setCompletingReview] = useState(false);

  const handleCompleteReview = async () => {
    if (!tenantId || !allItemsReviewed) return;

    try {
      setCompletingReview(true);
      await adminTenantService.completeVerification(tenantId);
      showToast("Verification process finalized successfully and email sent!", "success");
      loadTenant();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to complete verification.", "error");
    } finally {
      setCompletingReview(false);
    }
  };



const handleConfirmVerify = async () => {
  if (!confirmAction || !tenantId) return;
  const { target, label } = confirmAction;

  try {
    if (target === "business") {
      await adminTenantService.verifyBusinessDetails(tenantId, true);
    } else if (target === "bank") {
      await adminTenantService.verifyBankDetails(tenantId, true);
    } else if (target === "doc:reg") {
      await adminTenantService.verifyKycDocuments(tenantId, {
        businessRegistrationStatus: "APPROVED",
        businessRegistrationRejectionReason: undefined,
        ownerIdProofStatus: tenant?.kycDocuments?.ownerIdProof?.verification?.status || "PENDING",
        ownerIdProofRejectionReason: tenant?.kycDocuments?.ownerIdProof?.verification?.rejectionReason, // <-- Preserve existing reason
      });
    } else if (target === "doc:id") {
      await adminTenantService.verifyKycDocuments(tenantId, {
        businessRegistrationStatus: tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.status || "PENDING",
        businessRegistrationRejectionReason: tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.rejectionReason, // <-- Preserve existing reason
        ownerIdProofStatus: "APPROVED",
        ownerIdProofRejectionReason: undefined,
      });
    }
    showToast(`${label} verified successfully`, "success");
    loadTenant();
  } catch (err: any) {
    showToast(err?.response?.data?.message || "Verification failed", "error");
  } finally {
    setConfirmAction(null);
  }
};

const handleSubmitReject = async (reason: string) => {
  if (!rejectAction || !tenantId) return;
  const { target, label } = rejectAction;

  try {
    if (target === "business") {
      await adminTenantService.verifyBusinessDetails(tenantId, false, reason);
    } else if (target === "bank") {
      await adminTenantService.verifyBankDetails(tenantId, false, reason);
    } else if (target === "doc:reg") {
      await adminTenantService.verifyKycDocuments(tenantId, {
        businessRegistrationStatus: "REJECTED",
        businessRegistrationRejectionReason: reason,
        ownerIdProofStatus: tenant?.kycDocuments?.ownerIdProof?.verification?.status || "PENDING",
        ownerIdProofRejectionReason: tenant?.kycDocuments?.ownerIdProof?.verification?.rejectionReason, // <-- Preserve existing reason
      });
    } else if (target === "doc:id") {
      await adminTenantService.verifyKycDocuments(tenantId, {
        businessRegistrationStatus: tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.status || "PENDING",
        businessRegistrationRejectionReason: tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.rejectionReason, // <-- Preserve existing reason
        ownerIdProofStatus: "REJECTED",
        ownerIdProofRejectionReason: reason,
      });
    }
    showToast(`${label} rejected`, "error");
    loadTenant();
  } catch (err: any) {
    showToast(err?.response?.data?.message || "Rejection failed", "error");
  } finally {
    setRejectAction(null);
  }
};



  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Action bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden min-w-0 items-center gap-1.5 truncate text-sm text-slate-400 md:flex">
            <span>Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span>Tenants</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span>{tenant?.name || "Tenant"}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold text-slate-800">KYC Review</span>
          </div>
          <button
            onClick={() => navigate(`/superadmin/tenants/${tenantId}`)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Tenant Details</span>
          </button>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-slate-500">Loading tenant KYC details...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
              <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
              <p className="mt-2 text-base font-semibold">{error}</p>
            </div>
          ) : tenant ? (
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              {/* Title row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">KYC &amp; Document Review</h1>
                  <p className="mt-1 text-sm text-slate-500">Reviewing verification documents for {tenant.name}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                  <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
                  {tenant.status}
                </span>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Building2 className="h-[18px] w-[18px] text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Tenant Summary</h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Company Name" value={tenant.name} valueClass="text-indigo-700" />
                  <Field label="Tenant ID" value={tenant.id} />
                  <Field label="Primary Owner" value={tenant.primaryOwner} />
                  <Field label="Contact Info" value={`${tenant.email} • ${tenant.phone}`} />
                </div>
              </div>

              {/* Business Details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Building2 className="h-[18px] w-[18px] text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Business Details Review</h2>
                    <StatusPill status={businessStatus} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={businessStatus === "rejected"}
                      onClick={() => setRejectAction({ target: "business", label: "Business Details" })}
                      className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      disabled={businessStatus === "rejected" || businessStatus === "verified"}
                      onClick={() => setConfirmAction({ target: "business", label: "Business Details" })}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {businessStatus === "verified" ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
                {tenant.businessInfo?.verification?.rejectionReason && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                    <strong>Rejection Reason:</strong> {tenant.businessInfo.verification.rejectionReason}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                  <Field label="Registration ID" value={tenant.businessInfo?.registrationId || "N/A"} />
                  <Field label="Business Type" value={tenant.businessInfo?.businessType || "N/A"} />
                  <Field label="Registered Address" value={tenant.businessInfo?.registeredBusinessAddress || "N/A"} />
                </div>
              </section>

              {/* Bank Details */}
              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Landmark className="h-[18px] w-[18px] text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Bank Details Verification</h2>
                    <StatusPill status={bankStatus} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={bankStatus === "rejected"}
                      onClick={() => setRejectAction({ target: "bank", label: "Bank Details" })}
                      className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      disabled={bankStatus === "rejected" || bankStatus === "verified"}
                      onClick={() => setConfirmAction({ target: "bank", label: "Bank Details" })}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {bankStatus === "verified" ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
                {tenant.bankDetails?.verification?.rejectionReason && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                    <strong>Rejection Reason:</strong> {tenant.bankDetails.verification.rejectionReason}
                  </div>
                )}
                <div className="rounded-xl bg-white p-5">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Account Holder" value={tenant.bankDetails?.accountHolderName || "N/A"} />
                    <Field label="Account Number" value={tenant.bankDetails?.accountNumber || "N/A"} />
                    <Field label="IFSC Code" value={tenant.bankDetails?.ifscCode || "N/A"} />
                  </div>
                </div>
              </section>

              {/* Document Verification */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-[18px] w-[18px] text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Document Verification</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <DocumentCard
                    title="Business Registration Certificate"
                    icon={<FileBadge className="h-5 w-5" />}
                    objectKey={tenant.kycDocuments?.businessRegistrationCertificate?.objectKey}
                    status={regDocStatus}
                    rejectionReason={tenant.kycDocuments?.businessRegistrationCertificate?.verification?.rejectionReason}
                    onReject={() => setRejectAction({ target: "doc:reg", label: "Business Registration Certificate" })}
                    onVerify={() => setConfirmAction({ target: "doc:reg", label: "Business Registration Certificate" })}
                  />
                  <DocumentCard
                    title="Owner ID Proof"
                    icon={<UserSquare2 className="h-5 w-5" />}
                    objectKey={tenant.kycDocuments?.ownerIdProof?.objectKey}
                    status={ownerDocStatus}
                    rejectionReason={tenant.kycDocuments?.ownerIdProof?.verification?.rejectionReason}
                    onReject={() => setRejectAction({ target: "doc:id", label: "Owner ID Proof" })}
                    onVerify={() => setConfirmAction({ target: "doc:id", label: "Owner ID Proof" })}
                  />
                </div>
              </section>

              {/* Complete Review Section */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Finalize Tenant Verification</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {allItemsReviewed
                      ? "All items have been reviewed. Click Complete Review to finalize verification and send status notification email."
                      : "Please review (verify or reject) all business details, bank details, and KYC documents before completing review."}
                  </p>
                </div>
                <button
                  disabled={!allItemsReviewed || completingReview}
                  onClick={handleCompleteReview}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {completingReview ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Completing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Modals & Toast */}
      <ConfirmModal
        open={confirmAction !== null}
        title={`Verify ${confirmAction?.label ?? ""}`}
        message={`Are you sure you want to mark "${confirmAction?.label}" as verified?`}
        onConfirm={handleConfirmVerify}
        onCancel={() => setConfirmAction(null)}
      />

      <RejectReasonModal
        open={rejectAction !== null}
        title={`Reject ${rejectAction?.label ?? ""}`}
        onSubmit={handleSubmitReject}
        onCancel={() => setRejectAction(null)}
      />

      <Toast toast={toast} />
    </div>
  );
}

function Field({ label, value, valueClass = "text-slate-800" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-[15px] font-semibold leading-snug ${valueClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "pending" | "verified" | "rejected" }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    verified: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide ${map[status]}`}>{status.toUpperCase()}</span>;
}

// function DocumentCard({
//   title,
//   icon,
//   objectKey,
//   status,
//   rejectionReason,
//   onReject,
//   onVerify,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   objectKey?: string;
//   status: "pending" | "verified" | "rejected";
//   rejectionReason?: string;
//   onReject: () => void;
//   onVerify: () => void;
// }) {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="p-5">
//         <div className="mb-4 flex items-start justify-between">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
//           <StatusPill status={status} />
//         </div>
//         <p className="text-[15px] font-bold text-slate-900">{title}</p>
//         <p className="mt-0.5 text-xs text-slate-400 font-mono truncate">{objectKey || "No file uploaded"}</p>

//         {rejectionReason && (
//           <p className="mt-2 rounded bg-rose-50 p-2 text-xs text-rose-600">
//             <strong>Reason:</strong> {rejectionReason}
//           </p>
//         )}

//         <div className="mt-4 flex items-center gap-2">
//           <button
//             disabled={!objectKey}
//             className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50"
//           >
//             View Document
//           </button>
//           <button
//             disabled={status === "rejected"}
//             onClick={onReject}
//             className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <X className="h-4 w-4" />
//           </button>
//           <button
//             disabled={status === "rejected" || status === "verified"}
//             onClick={onVerify}
//             className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <CheckCircle2 className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

function DocumentCard({
  title,
  icon,
  objectKey,
  status,
  rejectionReason,
  onReject,
  onVerify,
}: {
  title: string;
  icon: React.ReactNode;
  objectKey?: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  onReject: () => void;
  onVerify: () => void;
}) {
  const [loadingUrl, setLoadingUrl] = useState(false);

  const handleViewDocument = async () => {
    if (!objectKey) return;
    try {
      setLoadingUrl(true);
      const viewUrl = await tenantKycService.getPresignedViewUrl(objectKey);
      window.open(viewUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to fetch document view URL", err);
      alert("Could not load document for viewing.");
    } finally {
      setLoadingUrl(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
          <StatusPill status={status} />
        </div>
        <p className="text-[15px] font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400 font-mono truncate">{objectKey || "No file uploaded"}</p>

        {rejectionReason && (
          <p className="mt-2 rounded bg-rose-50 p-2 text-xs text-rose-600">
            <strong>Reason:</strong> {rejectionReason}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={!objectKey || loadingUrl}
            onClick={handleViewDocument}
            className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            {loadingUrl ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "View Document"}
          </button>
          <button
            disabled={status === "rejected"}
            onClick={onReject}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            disabled={status === "rejected" || status === "verified"}
            onClick={onVerify}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// FIX: Resets text input every time the modal opens
function RejectReasonModal({ open, title, onSubmit, onCancel }: { open: boolean; title: string; onSubmit: (reason: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter reason for rejection..."
          className="mt-3 w-full rounded-lg border p-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-rose-200"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button onClick={() => onSubmit(reason)} disabled={!reason.trim()} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-rose-300">Submit</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }: { toast: { message: string; type: "success" | "error" } | null }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl border bg-white px-4 py-3 shadow-lg text-sm font-semibold">
      {toast.message}
    </div>
  );
}