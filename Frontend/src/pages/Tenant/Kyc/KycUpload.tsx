import React, { useCallback, useRef, useState } from "react";
import { ArrowLeft, Check, Cloud, FileText, IdCard } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tenantKycService } from "../../../services/tenantKycService";
import { ROUTES } from "../../../shared/constants";

/**
 * KycUpload
 *
 * Step 2 of 3 in the FundNest onboarding flow.
 * Reuses the same header and progress-bar pattern as BusinessSetup
 * (logo, back button, step counter, "% Complete" progress bar).
 * Fully responsive, built with Tailwind CSS.
 */

type DocumentStatus = "pending" | "uploading" | "uploaded";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: DocumentStatus;
  file?: File; // the actual selected File, sent to the backend on submit
  fileName?: string;
  fileSize?: string;
  uploadedLabel?: string;
  progress?: number; // 0-100, used while status === "uploading"
  showStatus?: boolean; // set false to hide the PENDING/UPLOADED badge
  error?: string; // inline validation message, shown under the field
}

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const ACCEPTED_TYPES_LABEL = "PNG, JPG or PDF";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_LABEL = "5MB";

/** Validates a selected file, returning an error message or null if valid. */
const validateFile = (file: File): string | null => {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return `Unsupported file type. Please upload a ${ACCEPTED_TYPES_LABEL} file.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`;
  }
  return null;
};

const TOTAL_STEPS = 3;
const CURRENT_STEP = 2;
const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "business-registration",
    title: "Business Registration Certificate",
    description: "Certificate of Incorporation or equivalent",
    icon: FileText,
    status: "pending",
    showStatus: false,
  },
  {
    id: "owner-id",
    title: "Owner ID Proof",
    description: "Passport, National ID or Driver's License",
    icon: IdCard,
    status: "pending",
    showStatus: false,
  },
];

const STATUS_BADGE_STYLES: Record<DocumentStatus, string> = {
  pending: "bg-slate-200 text-slate-600",
  uploading: "bg-slate-200 text-slate-600",
  uploaded: "bg-emerald-800 text-white",
};

const STATUS_BADGE_LABEL: Record<DocumentStatus, string> = {
  pending: "PENDING",
  uploading: "PENDING",
  uploaded: "UPLOADED",
};

const UploadDropzone: React.FC<{
  onFiles: (files: FileList) => void;
  hasError?: boolean;
  describedBy?: string;
}> = ({ onFiles, hasError, describedBy }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-invalid={hasError || undefined}
      aria-describedby={describedBy}
      className={[
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg py-8 text-center transition",
        isDragging ? "bg-indigo-50" : "",
      ].join(" ")}
    >
      <Cloud
        className={["h-6 w-6", hasError ? "text-red-400" : "text-slate-300"].join(
          " "
        )}
      />
      <p className="text-sm text-slate-500">
        Drag &amp; drop or{" "}
        <span className="font-medium text-indigo-700 underline-offset-2 hover:underline">
          click to upload
        </span>
      </p>
      <p className="text-xs text-slate-400">
        {ACCEPTED_TYPES_LABEL} &middot; up to {MAX_FILE_SIZE_LABEL}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </div>
  );
};

const KycUpload: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] =
    useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesForDoc = (docId: string, files: FileList) => {
    const file = files[0];
    if (!file) return;

    const error = validateFile(file);

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? error
            ? { ...doc, error, status: "pending" }
            : {
                ...doc,
                status: "uploaded",
                file,
                fileName: file.name,
                error: undefined,
              }
          : doc
      )
    );
    // Real upload logic (API call) would go here.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validated = documents.map((doc) =>
      doc.status !== "uploaded"
        ? { ...doc, error: "This document is required." }
        : doc
    );

    const hasErrors = validated.some((doc) => doc.error);
    setDocuments(validated);
    if (hasErrors) return;

    const businessRegistrationCertificate = validated.find(
      (doc) => doc.id === "business-registration"
    )?.file;
    const ownerIdProof = validated.find((doc) => doc.id === "owner-id")?.file;

    if (!businessRegistrationCertificate || !ownerIdProof) return;

    setIsSubmitting(true);
    try {
      await tenantKycService.uploadKyc({
        businessRegistrationCertificate,
        ownerIdProof,
      });
      toast.success("KYC documents uploaded successfully.");
      navigate(ROUTES.TENANT.BANKING);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload KYC documents. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Top nav — same pattern as BusinessSetup */}
      <header className="w-full border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            className="flex items-center gap-2 text-lg font-bold text-indigo-900 sm:text-xl"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
            <span>FundNest</span>
          </button>

          <span className="text-sm font-medium text-slate-500">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Section title + progress — same pattern as BusinessSetup */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">
              KYC Upload
            </h1>
            <span className="text-sm font-medium text-slate-500 sm:pb-1">
              {PROGRESS_PERCENT}% Complete
            </span>
          </div>

          <div
            className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuenow={PROGRESS_PERCENT}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-900 to-emerald-700 transition-all duration-500"
              style={{ width: `${PROGRESS_PERCENT}%` }}
            />
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Upload Business Documents
                </h2>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Provide required documents to verify your business account
                </p>
              </div>

              <div className="space-y-5">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  const isPending = doc.status === "pending";
                  const isUploading = doc.status === "uploading";
                  const isUploaded = doc.status === "uploaded";

                  return (
                    <div
                      key={doc.id}
                      className={[
                        "rounded-xl p-4 sm:p-5",
                        doc.error
                          ? "border-2 border-dashed border-red-400 bg-white"
                          : isPending
                          ? "border-2 border-dashed border-slate-300 bg-white"
                          : isUploading
                          ? "bg-slate-100"
                          : "border border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                            <Icon className="h-5 w-5 text-indigo-700" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                              {doc.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                        {doc.showStatus !== false && (
                          <span
                            className={[
                              "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide",
                              STATUS_BADGE_STYLES[doc.status],
                            ].join(" ")}
                          >
                            {STATUS_BADGE_LABEL[doc.status]}
                          </span>
                        )}
                      </div>

                      {/* Body: dropzone / uploaded file row */}
                      {isPending && (
                        <UploadDropzone
                          onFiles={(files) => handleFilesForDoc(doc.id, files)}
                          hasError={!!doc.error}
                          describedBy={doc.error ? `${doc.id}-error` : undefined}
                        />
                      )}

                      {doc.error && (
                        <p
                          id={`${doc.id}-error`}
                          role="alert"
                          className="mt-2 text-xs font-medium text-red-600"
                        >
                          {doc.error}
                        </p>
                      )}

                      {isUploaded && (
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800">
                              <Check
                                className="h-4 w-4 text-white"
                                strokeWidth={3}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {doc.fileName}
                              </p>
                              {(doc.fileSize || doc.uploadedLabel) && (
                                <p className="text-xs text-slate-400">
                                  {doc.fileSize}
                                  {doc.fileSize && doc.uploadedLabel && " \u2022 "}
                                  {doc.uploadedLabel}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                            onClick={() =>
                              setDocuments((prev) =>
                                prev.map((d) =>
                                  d.id === doc.id
                                    ? { ...d, status: "pending", error: undefined }
                                    : d
                                )
                              )
                            }
                          >
                            Replace
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:from-indigo-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Uploading..." : "Upload & Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer — same pattern as BusinessSetup */}
      <footer className="w-full py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-slate-400">
            <a href="#" className="hover:text-slate-600">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-slate-600">
              TERMS OF SERVICE
            </a>
            <a href="#" className="hover:text-slate-600">
              SECURITY VAULT
            </a>
          </div>
          <p className="text-xs tracking-wide text-slate-300">
            © 2024 FUNDNEST INSTITUTIONAL SERVICES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KycUpload;