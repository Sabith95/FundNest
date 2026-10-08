import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import TenantDashboardLayout from "../Dashboard/TenantDashboardlayout";
import { ROUTES } from "../../../shared/constants";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";
import { tenantAuthService } from "../../../services/tenantAuthService";
import { setTenant } from "../../../store/slices/tenantSlice";
import { tenantFundService } from "../../../services/tenantFundService";

// ─── Icons ────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-emerald-500">
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

const XCircleIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-rose-500">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  PENDING_VERIFICATION: {
    label: "Pending Review",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved (Awaiting Payment)",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border-rose-200",
  },
  COMPLETED: {
    label: "Enrolled Active Member",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const TenantFundRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant) {
      tenantAuthService
        .getTenantProfile()
        .then((data) => {
          dispatch(setTenant(data));
        })
        .catch((err) => {
          console.error("Failed to fetch tenant profile:", err);
        });
    }
  }, [dispatch, tenant]);

  // Selected request for inspection & review
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tenantFundService.getJoinRequests({
        page,
        limit: 10,
        status: statusFilter || undefined,
      });
      setRequests(res.data || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      console.error("Failed to load requests:", err);
      setError(err.response?.data?.message || "Failed to load member join requests");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenReview = (req: any) => {
    setSelectedRequest(req);
    setRejecting(false);
    setRejectionReason("");
    setActionError(null);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setRejecting(false);
    setRejectionReason("");
    setActionError(null);
  };

  const handleViewDocument = async (key: string) => {
    try {
      const url = await tenantFundService.getDocumentDownloadUrl(key);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast.error("Failed to generate download URL: " + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await tenantFundService.reviewJoinRequest(selectedRequest.id, {
        decision: "APPROVED",
      });
      handleCloseModal();
      await fetchRequests();
      toast.success("Application approved! An email notification has been sent to the applicant.");
    } catch (err: any) {
      setActionError(err.response?.data?.message || err.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      setActionError("Please provide a specific reason for rejection.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      await tenantFundService.reviewJoinRequest(selectedRequest.id, {
        decision: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      handleCloseModal();
      await fetchRequests();
      toast.success("Application rejected. An email detailing the reason has been sent to the applicant.");
    } catch (err: any) {
      setActionError(err.response?.data?.message || err.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  if (!tenant) return <Navigate to={ROUTES.TENANT.LOGIN} replace />;

  return (
    <TenantDashboardLayout
      user={{
        name: tenant.ownerName,
        role: "Tenant administrator",
        verificationStatus: mapTenantVerificationStatus(tenant.status),
        rejectionReason: tenant.rejectionReason,
        profile: tenant,
      }}
      activeHref={ROUTES.TENANT.FUND_REQUESTS}
    >
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
          {/* Header & Filter */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Fund Join &amp; KYC Requests
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review applicant identity documents and approve or reject membership requests ({total} total).
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All", value: "" },
                { label: "Pending", value: "PENDING_VERIFICATION" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Enrolled", value: "COMPLETED" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(1);
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    statusFilter === tab.value
                      ? "bg-indigo-800 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <SpinnerIcon />
                <span className="ml-3 text-sm text-slate-500 font-medium">
                  Loading applications...
                </span>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  No join requests found for the selected filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Chit Fund</th>
                      <th className="px-6 py-4">Submitted Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => {
                      const badge = STATUS_BADGES[req.status] || {
                        label: req.status,
                        cls: "bg-slate-100 text-slate-700 border-slate-200",
                      };
                      return (
                        <tr key={req.id} className="hover:bg-slate-50/60 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">
                              {req.applicant?.name || "Applicant"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {req.applicant?.email}
                            </div>
                            {req.applicant?.phone && (
                              <div className="text-[11px] text-slate-400">
                                {req.applicant?.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">
                              {req.fundDetails?.name || "Fund Scheme"}
                            </div>
                            <div className="text-xs text-slate-500">
                              Contribution: ₹{req.fundDetails?.contributionAmount?.toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(req.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenReview(req)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-50 transition"
                            >
                              <EyeIcon /> Review KYC
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Verification Inspection
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  KYC Review: {selectedRequest.applicant?.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Applied for {selectedRequest.fundDetails?.name}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {actionError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                  {actionError}
                </div>
              )}

              {/* Applicant Info Summary */}
              <div className="rounded-2xl bg-slate-50 p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Email:</span>
                  <p className="font-bold text-slate-800">{selectedRequest.applicant?.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase">Phone:</span>
                  <p className="font-bold text-slate-800">{selectedRequest.applicant?.phone || "N/A"}</p>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Submitted Documents ({selectedRequest.documents?.length || 0})
                </h3>

                <div className="space-y-3">
                  {selectedRequest.documents?.map((doc: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:border-slate-200"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          {doc.title}
                        </div>
                        <div className="text-xs text-slate-400 uppercase">
                          Type: {doc.documentType}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.frontSideKey && (
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc.frontSideKey)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                          >
                            <ExternalLinkIcon /> View Front
                          </button>
                        )}
                        {doc.backSideKey && (
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc.backSideKey)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                          >
                            <ExternalLinkIcon /> View Back
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Input (if rejecting) */}
              {rejecting && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                  <label className="block text-xs font-bold text-rose-900 uppercase">
                    Reason for Rejection (Sent to applicant via email):
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Aadhaar back side image is blurred. Please re-upload a clear copy."
                    className="w-full rounded-xl border border-rose-200 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>

              {selectedRequest.status === "PENDING_VERIFICATION" && (
                <>
                  {!rejecting ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setRejecting(true)}
                        disabled={actionLoading}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                      >
                        Reject...
                      </button>

                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-800 transition flex items-center gap-1.5"
                      >
                        {actionLoading ? <SpinnerIcon /> : <CheckCircleIcon />} Approve Application
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setRejecting(false)}
                        disabled={actionLoading}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
                      >
                        Cancel Rejection
                      </button>

                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {actionLoading ? <SpinnerIcon /> : <XCircleIcon />} Confirm Rejection &amp; Email Applicant
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </TenantDashboardLayout>
  );
};

export default TenantFundRequestsPage;
