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

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmAction, setConfirmAction] = useState<PendingAction | null>(
    null,
  );
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
      .catch((err) =>
        setError(
          err?.response?.data?.message || "Failed to load tenant KYC details.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
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
  const regDocStatus = mapStatus(
    tenant?.kycDocuments?.businessRegistrationCertificate?.verification?.status,
  );
  const ownerDocStatus = mapStatus(
    tenant?.kycDocuments?.ownerIdProof?.verification?.status,
  );

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
      showToast(
        "Verification process finalized successfully and email sent!",
        "success",
      );
      loadTenant();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to complete verification.",
        "error",
      );
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
          ownerIdProofStatus:
            tenant?.kycDocuments?.ownerIdProof?.verification?.status ||
            "PENDING",
          ownerIdProofRejectionReason:
            tenant?.kycDocuments?.ownerIdProof?.verification?.rejectionReason, // <-- Preserve existing reason
        });
      } else if (target === "doc:id") {
        await adminTenantService.verifyKycDocuments(tenantId, {
          businessRegistrationStatus:
            tenant?.kycDocuments?.businessRegistrationCertificate?.verification
              ?.status || "PENDING",
          businessRegistrationRejectionReason:
            tenant?.kycDocuments?.businessRegistrationCertificate?.verification
              ?.rejectionReason, // <-- Preserve existing reason
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
          ownerIdProofStatus:
            tenant?.kycDocuments?.ownerIdProof?.verification?.status ||
            "PENDING",
          ownerIdProofRejectionReason:
            tenant?.kycDocuments?.ownerIdProof?.verification?.rejectionReason, // <-- Preserve existing reason
        });
      } else if (target === "doc:id") {
        await adminTenantService.verifyKycDocuments(tenantId, {
          businessRegistrationStatus:
            tenant?.kycDocuments?.businessRegistrationCertificate?.verification
              ?.status || "PENDING",
          businessRegistrationRejectionReason:
            tenant?.kycDocuments?.businessRegistrationCertificate?.verification
              ?.rejectionReason, // <-- Preserve existing reason
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
              <p className="text-sm font-medium text-slate-500">
                Loading tenant KYC details...
              </p>
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
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">
                    KYC &amp; Document Review
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Reviewing verification documents for {tenant.name}
                  </p>
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
                  <h2 className="text-base font-bold text-slate-900">
                    Tenant Summary
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field
                    label="Company Name"
                    value={tenant.name}
                    valueClass="text-indigo-700"
                  />
                  <Field label="Tenant ID" value={tenant.id} />
                  <Field label="Primary Owner" value={tenant.primaryOwner} />
                  <Field
                    label="Contact Info"
                    value={`${tenant.email} • ${tenant.phone}`}
                  />
                </div>
              </div>

              {/* Business Details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Building2 className="h-[18px] w-[18px] text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Business Details Review
                    </h2>
                    <StatusPill status={businessStatus} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={businessStatus === "rejected"}
                      onClick={() =>
                        setRejectAction({
                          target: "business",
                          label: "Business Details",
                        })
                      }
                      className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      disabled={
                        businessStatus === "rejected" ||
                        businessStatus === "verified"
                      }
                      onClick={() =>
                        setConfirmAction({
                          target: "business",
                          label: "Business Details",
                        })
                      }
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {businessStatus === "verified" ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
                {tenant.businessInfo?.verification?.rejectionReason && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                    <strong>Rejection Reason:</strong>{" "}
                    {tenant.businessInfo.verification.rejectionReason}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                  <Field
                    label="Registration ID"
                    value={tenant.businessInfo?.registrationId || "N/A"}
                  />
                  <Field
                    label="Business Type"
                    value={tenant.businessInfo?.businessType || "N/A"}
                  />
                  <Field
                    label="Registered Address"
                    value={
                      tenant.businessInfo?.registeredBusinessAddress || "N/A"
                    }
                  />
                </div>
              </section>

              {/* Bank Details */}
              <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Landmark className="h-[18px] w-[18px] text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Bank Details Verification
                    </h2>
                    <StatusPill status={bankStatus} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={bankStatus === "rejected"}
                      onClick={() =>
                        setRejectAction({
                          target: "bank",
                          label: "Bank Details",
                        })
                      }
                      className="rounded-lg px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      disabled={
                        bankStatus === "rejected" || bankStatus === "verified"
                      }
                      onClick={() =>
                        setConfirmAction({
                          target: "bank",
                          label: "Bank Details",
                        })
                      }
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {bankStatus === "verified" ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
                {tenant.bankDetails?.verification?.rejectionReason && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                    <strong>Rejection Reason:</strong>{" "}
                    {tenant.bankDetails.verification.rejectionReason}
                  </div>
                )}
                <div className="rounded-xl bg-white p-5">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Account Holder"
                      value={tenant.bankDetails?.accountHolderName || "N/A"}
                    />
                    <Field
                      label="Account Number"
                      value={tenant.bankDetails?.accountNumber || "N/A"}
                    />
                    <Field
                      label="IFSC Code"
                      value={tenant.bankDetails?.ifscCode || "N/A"}
                    />
                  </div>
                </div>
              </section>

              {/* Document Verification */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-[18px] w-[18px] text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Document Verification
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <DocumentCard
                    title="Business Registration Certificate"
                    icon={<FileBadge className="h-5 w-5" />}
                    objectKey={
                      tenant.kycDocuments?.businessRegistrationCertificate
                        ?.objectKey
                    }
                    status={regDocStatus}
                    rejectionReason={
                      tenant.kycDocuments?.businessRegistrationCertificate
                        ?.verification?.rejectionReason
                    }
                    onReject={() =>
                      setRejectAction({
                        target: "doc:reg",
                        label: "Business Registration Certificate",
                      })
                    }
                    onVerify={() =>
                      setConfirmAction({
                        target: "doc:reg",
                        label: "Business Registration Certificate",
                      })
                    }
                  />
                  <DocumentCard
                    title="Owner ID Proof"
                    icon={<UserSquare2 className="h-5 w-5" />}
                    objectKey={tenant.kycDocuments?.ownerIdProof?.objectKey}
                    status={ownerDocStatus}
                    rejectionReason={
                      tenant.kycDocuments?.ownerIdProof?.verification
                        ?.rejectionReason
                    }
                    onReject={() =>
                      setRejectAction({
                        target: "doc:id",
                        label: "Owner ID Proof",
                      })
                    }
                    onVerify={() =>
                      setConfirmAction({
                        target: "doc:id",
                        label: "Owner ID Proof",
                      })
                    }
                  />
                </div>
              </section>

              {/* Complete Review Section */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Finalize Tenant Verification
                  </h3>
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

function Field({
  label,
  value,
  valueClass = "text-slate-800",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-[15px] font-semibold leading-snug ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "pending" | "verified" | "rejected";
}) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    verified: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            {icon}
          </div>
          <StatusPill status={status} />
        </div>
        <p className="text-[15px] font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400 font-mono truncate">
          {objectKey || "No file uploaded"}
        </p>

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
            {loadingUrl ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "View Document"
            )}
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

function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// FIX: Resets text input every time the modal opens
function RejectReasonModal({
  open,
  title,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  title: string;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}) {
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
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={!reason.trim()}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-rose-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({
  toast,
}: {
  toast: { message: string; type: "success" | "error" } | null;
}) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl border bg-white px-4 py-3 shadow-lg text-sm font-semibold">
      {toast.message}
    </div>
  );
}
