import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hooks";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import {
  userFundService,
  type IKycRequirementItem,
  type IFundJoinStatusResponse,
  type IFundFullDetailsResponse,
} from "../../../services/userFundService";

// ─── Icons ────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    <polyline points="16 16 12 12 8 16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-emerald-500">
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-rose-500 flex-shrink-0">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-[#006590]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface UploadSlotState {
  frontKey?: string;
  frontName?: string;
  frontLoading?: boolean;
  backKey?: string;
  backName?: string;
  backLoading?: boolean;
  error?: string;
}

const FundKycUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { fundId } = useParams<{ fundId: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [fundDetails, setFundDetails] = useState<IFundFullDetailsResponse | null>(null);
  const [requirements, setRequirements] = useState<IKycRequirementItem[]>([]);
  const [templateName, setTemplateName] = useState<string>("Tenant KYC Requirements");
  const [joinStatus, setJoinStatus] = useState<IFundJoinStatusResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Requirement upload state by requirementId
  const [uploadMap, setUploadMap] = useState<Record<string, UploadSlotState>>({});

  const loadData = useCallback(async () => {
    if (!fundId) return;
    try {
      setLoading(true);
      setPageError(null);

      const [detailsData, reqData, statusData] = await Promise.all([
        userFundService.getFundDetails(fundId),
        userFundService.getKycRequirements(fundId),
        userFundService.getJoinStatus(fundId),
      ]);

      setFundDetails(detailsData);
      setJoinStatus(statusData);

      const reqs = reqData?.template?.requirements || [];
      setRequirements(reqs);
      if (reqData?.template?.name) {
        setTemplateName(reqData.template.name);
      }

      // Pre-fill existing documents if re-uploading
      const initialMap: Record<string, UploadSlotState> = {};
      if (statusData?.documents && statusData.documents.length > 0) {
        for (const doc of statusData.documents) {
          initialMap[doc.requirementId] = {
            frontKey: doc.frontSideKey,
            frontName: doc.frontSideKey ? "Previously Uploaded Document" : undefined,
            backKey: doc.backSideKey,
            backName: doc.backSideKey ? "Previously Uploaded Back Side" : undefined,
          };
        }
      }
      setUploadMap(initialMap);
    } catch (err: any) {
      console.error("Failed to load KYC setup:", err);
      setPageError(err.response?.data?.message || "Failed to load verification requirements");
    } finally {
      setLoading(false);
    }
  }, [fundId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle direct S3 upload
  const handleFileUpload = async (
    reqItem: IKycRequirementItem,
    side: "front" | "back",
    file: File,
  ) => {
    // Validate file size
    const maxBytes = reqItem.maxFileSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const msg = `File size exceeds the ${reqItem.maxFileSizeMb} MB limit`;
      toast.error(msg);
      setUploadMap((prev) => ({
        ...prev,
        [reqItem.id]: {
          ...prev[reqItem.id],
          error: msg,
        },
      }));
      return;
    }

    // Set loading
    setUploadMap((prev) => ({
      ...prev,
      [reqItem.id]: {
        ...prev[reqItem.id],
        error: undefined,
        [side === "front" ? "frontLoading" : "backLoading"]: true,
      },
    }));

    try {
      const s3Key = await userFundService.uploadFileToS3(file);
      toast.success(`${reqItem.title} (${side}) uploaded successfully`);
      setUploadMap((prev) => ({
        ...prev,
        [reqItem.id]: {
          ...prev[reqItem.id],
          [side === "front" ? "frontKey" : "backKey"]: s3Key,
          [side === "front" ? "frontName" : "backName"]: file.name,
          [side === "front" ? "frontLoading" : "backLoading"]: false,
          error: undefined,
        },
      }));
    } catch (err: any) {
      console.error(`S3 upload error for ${reqItem.title}:`, err);
      const msg = err.message || "Failed to upload file to cloud storage";
      toast.error(msg);
      setUploadMap((prev) => ({
        ...prev,
        [reqItem.id]: {
          ...prev[reqItem.id],
          [side === "front" ? "frontLoading" : "backLoading"]: false,
          error: msg,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundId) return;

    // Validate all required documents have keys
    for (const req of requirements) {
      if (req.isRequired) {
        const slot = uploadMap[req.id];
        if (!slot?.frontKey) {
          const msg = `Please upload the front side for ${req.title}`;
          toast.error(msg);
          setPageError(msg);
          return;
        }
        if (req.requiresBothSides && !slot?.backKey) {
          const msg = `Please upload the back side for ${req.title}`;
          toast.error(msg);
          setPageError(msg);
          return;
        }
      }
    }

    setSubmitting(true);
    setPageError(null);

    const documentsPayload = requirements
      .filter((r) => uploadMap[r.id]?.frontKey)
      .map((r) => ({
        requirementId: r.id,
        documentType: r.documentType,
        title: r.title,
        frontSideKey: uploadMap[r.id].frontKey!,
        backSideKey: uploadMap[r.id].backKey,
      }));

    try {
      if (joinStatus?.status === "REJECTED") {
        await userFundService.reuploadKyc(fundId, documentsPayload);
      } else {
        await userFundService.submitJoinRequest(fundId, documentsPayload);
      }
      toast.success("KYC documents submitted successfully! Organizer has been notified.");
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      const msg = err.response?.data?.message || "Failed to submit verification documents";
      toast.error(msg);
      setPageError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header userName={currentUser?.name || "Member"} />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <SpinnerIcon />
              <span className="font-medium">Loading KYC requirements...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={currentUser?.name || "Member"} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 max-w-4xl mx-auto w-full">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Link
              to={`/funds/${fundId}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#006590] hover:underline"
            >
              <ArrowLeftIcon /> Back to Fund Details
            </Link>
          </div>

          {/* Success Banner */}
          {submitSuccess ? (
            <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-emerald-100 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircleIcon />
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">
                KYC Documents Submitted!
              </h1>
              <p className="mt-3 text-sm text-slate-600 max-w-lg mx-auto">
                Your application to join <strong>{fundDetails?.fund.name}</strong> has been submitted. The organizer ({fundDetails?.tenant.companyName}) will review your documents. Once approved, you will be notified via email to pay the initial contribution and secure your slot.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => navigate(`/funds/${fundId}`)}
                  className="rounded-xl bg-[#006590] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#0980c8] transition"
                >
                  Return to Fund Details
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006590]">
                      Compliance &amp; Verification
                    </span>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                      Submit KYC for {fundDetails?.fund.name}
                    </h1>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                    Organizer: {fundDetails?.tenant.companyName}
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {templateName}. Each organizer configures custom identity requirements in compliance with state chit fund regulations.
                </p>
              </div>

              {/* Status Alert if previously rejected */}
              {joinStatus?.status === "REJECTED" && (
                <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50/80 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangleIcon />
                    <div>
                      <h2 className="text-sm font-bold text-rose-900">
                        Previous Verification Rejected by Organizer
                      </h2>
                      <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                        <strong>Reason:</strong> {joinStatus.rejectionReason || "Uploaded documents did not meet verification criteria. Please re-upload clear copies."}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold text-rose-700">
                        Please update the requested documents below and resubmit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* General Page Error */}
              {pageError && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
                  {pageError}
                </div>
              )}

              {/* Requirements Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {requirements.length === 0 ? (
                  <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
                    <p className="text-sm text-slate-600">
                      No specific KYC documents configured for this organizer. You can proceed directly to join.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/funds/${fundId}`)}
                      className="mt-4 rounded-xl bg-[#006590] px-5 py-2.5 text-xs font-bold text-white"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  requirements.map((req, idx) => {
                    const slot = uploadMap[req.id] || {};
                    return (
                      <div
                        key={req.id}
                        className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-100 transition hover:border-slate-200"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006590]/10 text-xs font-bold text-[#006590]">
                                {idx + 1}
                              </span>
                              <h2 className="text-base font-bold text-slate-900">
                                {req.title}
                              </h2>
                              {req.isRequired && (
                                <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                                  Required
                                </span>
                              )}
                            </div>
                            {req.description && (
                              <p className="mt-1 text-xs text-slate-500">
                                {req.description}
                              </p>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Max {req.maxFileSizeMb} MB · PDF, JPG, PNG
                          </div>
                        </div>

                        {slot.error && (
                          <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                            {slot.error}
                          </div>
                        )}

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Front Side Upload */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                              Front Side {req.isRequired && <span className="text-rose-500">*</span>}
                            </label>
                            <label className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
                              slot.frontKey
                                ? "border-emerald-200 bg-emerald-50/40"
                                : "border-slate-200 hover:border-[#006590] hover:bg-slate-50"
                            }`}>
                              <input
                                type="file"
                                className="hidden"
                                accept={req.allowedMimeTypes?.join(",") || "image/*,application/pdf"}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleFileUpload(req, "front", f);
                                }}
                              />

                              {slot.frontLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                  <SpinnerIcon />
                                  <span className="text-xs font-semibold text-slate-600">
                                    Uploading to S3...
                                  </span>
                                </div>
                              ) : slot.frontKey ? (
                                <div className="flex flex-col items-center gap-1.5">
                                  <CheckCircleIcon />
                                  <span className="text-xs font-bold text-emerald-800 break-all">
                                    {slot.frontName || "File Attached"}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500 underline">
                                    Click to change
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                  <UploadCloudIcon />
                                  <span className="text-xs font-semibold text-slate-700">
                                    Upload Front Side
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    Drag &amp; drop or browse
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>

                          {/* Back Side Upload (if required) */}
                          {req.requiresBothSides ? (
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                Back Side {req.isRequired && <span className="text-rose-500">*</span>}
                              </label>
                              <label className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
                                slot.backKey
                                  ? "border-emerald-200 bg-emerald-50/40"
                                  : "border-slate-200 hover:border-[#006590] hover:bg-slate-50"
                              }`}>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept={req.allowedMimeTypes?.join(",") || "image/*,application/pdf"}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleFileUpload(req, "back", f);
                                  }}
                                />

                                {slot.backLoading ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <SpinnerIcon />
                                    <span className="text-xs font-semibold text-slate-600">
                                      Uploading to S3...
                                    </span>
                                  </div>
                                ) : slot.backKey ? (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <CheckCircleIcon />
                                    <span className="text-xs font-bold text-emerald-800 break-all">
                                      {slot.backName || "File Attached"}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500 underline">
                                      Click to change
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <UploadCloudIcon />
                                    <span className="text-xs font-semibold text-slate-700">
                                      Upload Back Side
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      Drag &amp; drop or browse
                                    </span>
                                  </div>
                                )}
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                              <span className="text-xs text-slate-400">
                                Back side not required for this document.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Submit CTA */}
                {requirements.length > 0 && (
                  <div className="pt-4 flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/funds/${fundId}`)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-[#006590] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0980c8] transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <SpinnerIcon /> Submitting Request...
                        </>
                      ) : joinStatus?.status === "REJECTED" ? (
                        "Resubmit KYC Documents"
                      ) : (
                        "Submit KYC & Request to Join"
                      )}
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FundKycUploadPage;
