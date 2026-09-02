// // import React, { useCallback, useRef, useState } from "react";
// // import { ArrowLeft, Check, Cloud, FileText, IdCard } from "lucide-react";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";
// // import { tenantKycService } from "../../../services/tenantKycService";
// // import { ROUTES } from "../../../shared/constants";
// // import { getErrorMessage } from "../../../utitls/errorUtils";
// // import { useAppDispatch } from "../../../store/hooks";
// // import { updateOnboardingStep } from "../../../store/slices/tenantSlice";
// // /**
// //  * KycUpload
// //  *
// //  * Step 2 of 3 in the FundNest onboarding flow.
// //  * Reuses the same header and progress-bar pattern as BusinessSetup
// //  * (logo, back button, step counter, "% Complete" progress bar).
// //  * Fully responsive, built with Tailwind CSS.
// //  */

// // type DocumentStatus = "pending" | "uploading" | "uploaded";

// // interface DocumentItem {
// //   id: string;
// //   title: string;
// //   description: string;
// //   icon: React.ElementType;
// //   status: DocumentStatus;
// //   file?: File; // the actual selected File, sent to the backend on submit
// //   fileName?: string;
// //   fileSize?: string;
// //   uploadedLabel?: string;
// //   progress?: number; // 0-100, used while status === "uploading"
// //   showStatus?: boolean; // set false to hide the PENDING/UPLOADED badge
// //   error?: string; // inline validation message, shown under the field
// // }

// // const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
// // const ACCEPTED_TYPES_LABEL = "PNG, JPG or PDF";
// // const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
// // const MAX_FILE_SIZE_LABEL = "5MB";

// // /** Validates a selected file, returning an error message or null if valid. */
// // const validateFile = (file: File): string | null => {
// //   if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
// //     return `Unsupported file type. Please upload a ${ACCEPTED_TYPES_LABEL} file.`;
// //   }
// //   if (file.size > MAX_FILE_SIZE_BYTES) {
// //     return `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`;
// //   }
// //   return null;
// // };

// // const TOTAL_STEPS = 3;
// // const CURRENT_STEP = 2;
// // const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

// // const INITIAL_DOCUMENTS: DocumentItem[] = [
// //   {
// //     id: "business-registration",
// //     title: "Business Registration Certificate",
// //     description: "Certificate of Incorporation or equivalent",
// //     icon: FileText,
// //     status: "pending",
// //     showStatus: false,
// //   },
// //   {
// //     id: "owner-id",
// //     title: "Owner ID Proof",
// //     description: "Passport, National ID or Driver's License",
// //     icon: IdCard,
// //     status: "pending",
// //     showStatus: false,
// //   },
// // ];

// // const STATUS_BADGE_STYLES: Record<DocumentStatus, string> = {
// //   pending: "bg-slate-200 text-slate-600",
// //   uploading: "bg-slate-200 text-slate-600",
// //   uploaded: "bg-emerald-800 text-white",
// // };

// // const STATUS_BADGE_LABEL: Record<DocumentStatus, string> = {
// //   pending: "PENDING",
// //   uploading: "PENDING",
// //   uploaded: "UPLOADED",
// // };

// // const UploadDropzone: React.FC<{
// //   onFiles: (files: FileList) => void;
// //   hasError?: boolean;
// //   describedBy?: string;
// // }> = ({ onFiles, hasError, describedBy }) => {
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const [isDragging, setIsDragging] = useState(false);

// //   const handleDrop = useCallback(
// //     (e: React.DragEvent<HTMLDivElement>) => {
// //       e.preventDefault();
// //       setIsDragging(false);
// //       if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
// //     },
// //     [onFiles]
// //   );

// //   return (
// //     <div
// //       onDragOver={(e) => {
// //         e.preventDefault();
// //         setIsDragging(true);
// //       }}
// //       onDragLeave={() => setIsDragging(false)}
// //       onDrop={handleDrop}
// //       onClick={() => inputRef.current?.click()}
// //       role="button"
// //       tabIndex={0}
// //       aria-invalid={hasError || undefined}
// //       aria-describedby={describedBy}
// //       className={[
// //         "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg py-8 text-center transition",
// //         isDragging ? "bg-indigo-50" : "",
// //       ].join(" ")}
// //     >
// //       <Cloud
// //         className={["h-6 w-6", hasError ? "text-red-400" : "text-slate-300"].join(
// //           " "
// //         )}
// //       />
// //       <p className="text-sm text-slate-500">
// //         Drag &amp; drop or{" "}
// //         <span className="font-medium text-indigo-700 underline-offset-2 hover:underline">
// //           click to upload
// //         </span>
// //       </p>
// //       <p className="text-xs text-slate-400">
// //         {ACCEPTED_TYPES_LABEL} &middot; up to {MAX_FILE_SIZE_LABEL}
// //       </p>
// //       <input
// //         ref={inputRef}
// //         type="file"
// //         accept={ACCEPTED_FILE_TYPES.join(",")}
// //         className="hidden"
// //         onChange={(e) => e.target.files && onFiles(e.target.files)}
// //       />
// //     </div>
// //   );
// // };

// // const KycUpload: React.FC = () => {
// //   const navigate = useNavigate();
// //   const dispatch = useAppDispatch()
// //   const [documents, setDocuments] =
// //     useState<DocumentItem[]>(INITIAL_DOCUMENTS);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleFilesForDoc = (docId: string, files: FileList) => {
// //     const file = files[0];
// //     if (!file) return;

// //     const error = validateFile(file);

// //     setDocuments((prev) =>
// //       prev.map((doc) =>
// //         doc.id === docId
// //           ? error
// //             ? { ...doc, error, status: "pending" }
// //             : {
// //                 ...doc,
// //                 status: "uploaded",
// //                 file,
// //                 fileName: file.name,
// //                 error: undefined,
// //               }
// //           : doc
// //       )
// //     );
// //     // Real upload logic (API call) would go here.
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const validated = documents.map((doc) =>
// //       doc.status !== "uploaded"
// //         ? { ...doc, error: "This document is required." }
// //         : doc
// //     );

// //     const hasErrors = validated.some((doc) => doc.error);
// //     setDocuments(validated);
// //     if (hasErrors) return;

// //     const businessRegistrationCertificate = validated.find(
// //       (doc) => doc.id === "business-registration"
// //     )?.file;
// //     const ownerIdProof = validated.find((doc) => doc.id === "owner-id")?.file;

// //     if (!businessRegistrationCertificate || !ownerIdProof) return;

// //     setIsSubmitting(true);
// //     try {
// //       // 1. Fetch presigned URLs from backend
// //       const busCertPresigned = await tenantKycService.getPresignedUrl(
// //         businessRegistrationCertificate.name,
// //         businessRegistrationCertificate.type
// //       );
// //       const ownerIdPresigned = await tenantKycService.getPresignedUrl(
// //         ownerIdProof.name,
// //         ownerIdProof.type
// //       );
// //       // 2. Upload raw files directly to S3 bucket
// //       await Promise.all([
// //         tenantKycService.uploadFileToS3(
// //           busCertPresigned.uploadUrl,
// //           businessRegistrationCertificate
// //         ),
// //         tenantKycService.uploadFileToS3(
// //           ownerIdPresigned.uploadUrl,
// //           ownerIdProof
// //         ),
// //       ]);
// //       // 3. Send S3 objectKeys to backend KYC update route
// //       const result = await tenantKycService.uploadKyc({
// //         businessRegistrationCertificateKey: busCertPresigned.objectKey,
// //         ownerIdProofKey: ownerIdPresigned.objectKey,
// //       });
// //       dispatch(updateOnboardingStep(result.tenant.onboardingStep));
// //       toast.success("KYC documents uploaded successfully.");
// //       navigate(ROUTES.TENANT.BANKING);
// //     } catch (err) {
// //       const message = getErrorMessage(
// //       err,
// //       "Failed to upload KYC documents. Please try again."
// //     );
// //       toast.error(message);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen w-full bg-slate-50 flex flex-col">
// //       {/* Top nav — same pattern as BusinessSetup */}
// //       <header className="w-full border-b border-slate-100 bg-slate-50">
// //         <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
// //           <button
// //             type="button"
// //             aria-label="Go back"
// //             className="flex items-center gap-2 text-lg font-bold text-indigo-900 sm:text-xl"
// //           >
// //             <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
// //             <span>FundNest</span>
// //           </button>

// //           <span className="text-sm font-medium text-slate-500">
// //             Step {CURRENT_STEP} of {TOTAL_STEPS}
// //           </span>
// //         </div>
// //       </header>

// //       {/* Main content */}
// //       <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
// //         <div className="w-full max-w-2xl">
// //           {/* Section title + progress — same pattern as BusinessSetup */}
// //           <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
// //             <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">
// //               KYC Upload
// //             </h1>
// //             <span className="text-sm font-medium text-slate-500 sm:pb-1">
// //               {PROGRESS_PERCENT}% Complete
// //             </span>
// //           </div>

// //           <div
// //             className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
// //             role="progressbar"
// //             aria-valuenow={PROGRESS_PERCENT}
// //             aria-valuemin={0}
// //             aria-valuemax={100}
// //           >
// //             <div
// //               className="h-full rounded-full bg-gradient-to-r from-indigo-900 to-emerald-700 transition-all duration-500"
// //               style={{ width: `${PROGRESS_PERCENT}%` }}
// //             />
// //           </div>

// //           {/* Card */}
// //           <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
// //             <form
// //               onSubmit={handleSubmit}
// //               className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12"
// //             >
// //               <div className="mb-8 text-center">
// //                 <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
// //                   Upload Business Documents
// //                 </h2>
// //                 <p className="mt-2 text-sm text-slate-500 sm:text-base">
// //                   Provide required documents to verify your business account
// //                 </p>
// //               </div>

// //               <div className="space-y-5">
// //                 {documents.map((doc) => {
// //                   const Icon = doc.icon;
// //                   const isPending = doc.status === "pending";
// //                   const isUploading = doc.status === "uploading";
// //                   const isUploaded = doc.status === "uploaded";

// //                   return (
// //                     <div
// //                       key={doc.id}
// //                       className={[
// //                         "rounded-xl p-4 sm:p-5",
// //                         doc.error
// //                           ? "border-2 border-dashed border-red-400 bg-white"
// //                           : isPending
// //                           ? "border-2 border-dashed border-slate-300 bg-white"
// //                           : isUploading
// //                           ? "bg-slate-100"
// //                           : "border border-slate-200 bg-white",
// //                       ].join(" ")}
// //                     >
// //                       {/* Header row */}
// //                       <div className="flex items-start justify-between gap-3">
// //                         <div className="flex items-start gap-3">
// //                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
// //                             <Icon className="h-5 w-5 text-indigo-700" />
// //                           </div>
// //                           <div>
// //                             <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
// //                               {doc.title}
// //                             </h3>
// //                             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
// //                               {doc.description}
// //                             </p>
// //                           </div>
// //                         </div>
// //                         {doc.showStatus !== false && (
// //                           <span
// //                             className={[
// //                               "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide",
// //                               STATUS_BADGE_STYLES[doc.status],
// //                             ].join(" ")}
// //                           >
// //                             {STATUS_BADGE_LABEL[doc.status]}
// //                           </span>
// //                         )}
// //                       </div>

// //                       {/* Body: dropzone / uploaded file row */}
// //                       {isPending && (
// //                         <UploadDropzone
// //                           onFiles={(files) => handleFilesForDoc(doc.id, files)}
// //                           hasError={!!doc.error}
// //                           describedBy={doc.error ? `${doc.id}-error` : undefined}
// //                         />
// //                       )}

// //                       {doc.error && (
// //                         <p
// //                           id={`${doc.id}-error`}
// //                           role="alert"
// //                           className="mt-2 text-xs font-medium text-red-600"
// //                         >
// //                           {doc.error}
// //                         </p>
// //                       )}

// //                       {isUploaded && (
// //                         <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
// //                           <div className="flex items-center gap-3">
// //                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800">
// //                               <Check
// //                                 className="h-4 w-4 text-white"
// //                                 strokeWidth={3}
// //                               />
// //                             </div>
// //                             <div>
// //                               <p className="text-sm font-semibold text-slate-900">
// //                                 {doc.fileName}
// //                               </p>
// //                               {(doc.fileSize || doc.uploadedLabel) && (
// //                                 <p className="text-xs text-slate-400">
// //                                   {doc.fileSize}
// //                                   {doc.fileSize && doc.uploadedLabel && " \u2022 "}
// //                                   {doc.uploadedLabel}
// //                                 </p>
// //                               )}
// //                             </div>
// //                           </div>
// //                           <button
// //                             type="button"
// //                             className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
// //                             onClick={() =>
// //                               setDocuments((prev) =>
// //                                 prev.map((d) =>
// //                                   d.id === doc.id
// //                                     ? { ...d, status: "pending", error: undefined }
// //                                     : d
// //                                 )
// //                               )
// //                             }
// //                           >
// //                             Replace
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               {/* Submit button */}
// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="mt-8 w-full rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:from-indigo-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
// //               >
// //                 {isSubmitting ? "Uploading..." : "Upload & Continue"}
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </main>

// //       {/* Footer — same pattern as BusinessSetup */}
// //       <footer className="w-full py-10">
// //         <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
// //           <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-slate-400">
// //             <a href="#" className="hover:text-slate-600">
// //               PRIVACY POLICY
// //             </a>
// //             <a href="#" className="hover:text-slate-600">
// //               TERMS OF SERVICE
// //             </a>
// //             <a href="#" className="hover:text-slate-600">
// //               SECURITY VAULT
// //             </a>
// //           </div>
// //           <p className="text-xs tracking-wide text-slate-300">
// //             © 2024 FUNDNEST INSTITUTIONAL SERVICES. ALL RIGHTS RESERVED.
// //           </p>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default KycUpload;

// import React, { useRef, useState } from "react";
// import { ArrowLeft, Check, Cloud, FileText, IdCard, AlertCircle } from "lucide-react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { tenantKycService } from "../../../services/tenantKycService";
// import { ROUTES, TENANT_STATUS } from "../../../shared/constants";
// import { getErrorMessage } from "../../../utitls/errorUtils";
// import { useAppDispatch, useAppSelector } from "../../../store/hooks";
// import { updateOnboardingStep, updateTenantStatus } from "../../../store/slices/tenantSlice";

// type DocumentStatus = "pending" | "uploading" | "uploaded";

// interface DocumentItem {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ElementType;
//   status: DocumentStatus;
//   file?: File;
//   fileName?: string;
//   error?: string;
//   rejectionReason?: string;
// }

// const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
// const ACCEPTED_TYPES_LABEL = "PNG, JPG or PDF";
// const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// const validateFile = (file: File): string | null => {
//   if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
//     return `Unsupported file type. Please upload a ${ACCEPTED_TYPES_LABEL} file.`;
//   }
//   if (file.size > MAX_FILE_SIZE_BYTES) {
//     return `File is too large. Maximum size is 5MB.`;
//   }
//   return null;
// };

// const KycUpload: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const tenant = useAppSelector((state) => state.tenant.tenant);

//   const busCertVerification = tenant?.kycDocuments?.businessRegistrationCertificate?.verification;
//   const ownerIdVerification = tenant?.kycDocuments?.ownerIdProof?.verification;

//   const initialDocs: DocumentItem[] = [
//     {
//       id: "business-registration",
//       title: "Business Registration Certificate",
//       description: "Certificate of Incorporation or equivalent",
//       icon: FileText,
//       status: "pending",
//       rejectionReason: busCertVerification?.status === "REJECTED" ? busCertVerification.rejectionReason : undefined,
//     },
//     {
//       id: "owner-id",
//       title: "Owner ID Proof",
//       description: "Passport, National ID or Driver's License",
//       icon: IdCard,
//       status: "pending",
//       rejectionReason: ownerIdVerification?.status === "REJECTED" ? ownerIdVerification.rejectionReason : undefined,
//     },
//   ];

//   const [documents, setDocuments] = useState<DocumentItem[]>(initialDocs);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleFilesForDoc = (docId: string, files: FileList) => {
//     const file = files[0];
//     if (!file) return;

//     const error = validateFile(file);

//     setDocuments((prev) =>
//       prev.map((doc) =>
//         doc.id === docId
//           ? error
//             ? { ...doc, error, status: "pending" }
//             : { ...doc, status: "uploaded", file, fileName: file.name, error: undefined }
//           : doc
//       )
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const validated = documents.map((doc) =>
//       doc.status !== "uploaded" ? { ...doc, error: "This document is required." } : doc
//     );

//     if (validated.some((doc) => doc.error)) {
//       setDocuments(validated);
//       return;
//     }

//     const busCertFile = validated.find((doc) => doc.id === "business-registration")?.file;
//     const ownerIdFile = validated.find((doc) => doc.id === "owner-id")?.file;

//     if (!busCertFile || !ownerIdFile) return;

//     setIsSubmitting(true);
//     try {
//       const busCertPresigned = await tenantKycService.getPresignedUrl(busCertFile.name, busCertFile.type);
//       const ownerIdPresigned = await tenantKycService.getPresignedUrl(ownerIdFile.name, ownerIdFile.type);

//       await Promise.all([
//         tenantKycService.uploadFileToS3(busCertPresigned.uploadUrl, busCertFile),
//         tenantKycService.uploadFileToS3(ownerIdPresigned.uploadUrl, ownerIdFile),
//       ]);

//       const result = await tenantKycService.uploadKyc({
//         businessRegistrationCertificateKey: busCertPresigned.objectKey,
//         ownerIdProofKey: ownerIdPresigned.objectKey,
//       });

//       dispatch(updateOnboardingStep(result.tenant.onboardingStep));
//       dispatch(updateTenantStatus(TENANT_STATUS.PENDING));

//       toast.success("KYC documents uploaded successfully.");
//       navigate(ROUTES.TENANT.DASHBOARD);
//     } catch (err) {
//       toast.error(getErrorMessage(err, "Failed to upload KYC documents."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-slate-50 flex flex-col">
//       <header className="w-full border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-lg font-bold text-indigo-900">
//           <ArrowLeft className="h-5 w-5 text-indigo-700" />
//           <span>FundNest</span>
//         </button>
//       </header>

//       <main className="flex flex-1 flex-col items-center px-4 py-10">
//         <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//           <h1 className="text-2xl font-bold text-slate-900 text-center">KYC Document Upload</h1>
//           <p className="text-sm text-slate-500 text-center mt-1">Please select clean and legible document files</p>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             {documents.map((doc) => (
//               <div key={doc.id} className="rounded-xl border border-slate-200 p-5 bg-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold text-slate-900">{doc.title}</h3>
//                 </div>

//                 {doc.rejectionReason && (
//                   <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
//                     <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
//                     <span>Rejection Reason: {doc.rejectionReason}</span>
//                   </div>
//                 )}

//                 {doc.status === "pending" ? (
//                   <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:bg-indigo-50/50">
//                     <Cloud className="h-6 w-6 text-slate-400" />
//                     <span className="mt-2 text-sm text-slate-600">Click to select file</span>
//                     <input
//                       type="file"
//                       accept={ACCEPTED_FILE_TYPES.join(",")}
//                       className="hidden"
//                       onChange={(e) => e.target.files && handleFilesForDoc(doc.id, e.target.files)}
//                     />
//                   </label>
//                 ) : (
//                   <div className="mt-3 flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
//                     <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
//                       <Check className="h-4 w-4 text-emerald-600" />
//                       <span>{doc.fileName}</span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "pending" } : d)))}
//                       className="text-xs font-semibold text-indigo-600"
//                     >
//                       Replace
//                     </button>
//                   </div>
//                 )}
//                 {doc.error && <p className="mt-2 text-xs text-red-600">{doc.error}</p>}
//               </div>
//             ))}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
//             >
//               {isSubmitting ? "Uploading..." : "Resubmit Documents"}
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default KycUpload;


import React, { useState } from "react";
import { ArrowLeft, Check, Cloud, FileText, IdCard, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tenantKycService } from "../../../services/tenantKycService";
import { ROUTES, TENANT_STATUS } from "../../../shared/constants";
import { getErrorMessage } from "../../../utitls/errorUtils";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateOnboardingStep, updateTenantStatus } from "../../../store/slices/tenantSlice";

type DocumentStatus = "pending" | "uploading" | "uploaded";
type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | undefined;

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: DocumentStatus;
  file?: File;
  fileName?: string;
  error?: string;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
}

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const ACCEPTED_TYPES_LABEL = "PNG, JPG or PDF";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = "5MB";

const TOTAL_STEPS = 3;
const CURRENT_STEP = 2;
const PROGRESS_PERCENT = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

const validateFile = (file: File): string | null => {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return `Unsupported file type. Please upload a ${ACCEPTED_TYPES_LABEL} file.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`;
  }
  return null;
};

const KycUpload: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  const busCertVerification = tenant?.kycDocuments?.businessRegistrationCertificate?.verification;
  const ownerIdVerification = tenant?.kycDocuments?.ownerIdProof?.verification;

  const busCertStatus: VerificationStatus = busCertVerification?.status;
  const ownerIdStatus: VerificationStatus = ownerIdVerification?.status;

  // A doc needs resubmission only if it was actually rejected.
  // "Never submitted" (undefined) is NOT the same as "rejected" — this was the bug.
  const anyRejected = busCertStatus === "REJECTED" || ownerIdStatus === "REJECTED";
  const anyPending = busCertStatus === "PENDING" || ownerIdStatus === "PENDING";
  const hasSubmittedBefore = !!busCertVerification || !!ownerIdVerification;

  const isResubmit = anyRejected;
  const isPendingReview = !isResubmit && anyPending && hasSubmittedBefore;
  const isFirstTimeUpload = !hasSubmittedBefore;

  const initialDocs: DocumentItem[] = [
    {
      id: "business-registration",
      title: "Business Registration Certificate",
      description: "Certificate of Incorporation or equivalent",
      icon: FileText,
      status: "pending",
      verificationStatus: busCertStatus,
      rejectionReason: busCertStatus === "REJECTED" ? busCertVerification?.rejectionReason : undefined,
    },
    {
      id: "owner-id",
      title: "Owner ID Proof",
      description: "Passport, National ID or Driver's License",
      icon: IdCard,
      status: "pending",
      verificationStatus: ownerIdStatus,
      rejectionReason: ownerIdStatus === "REJECTED" ? ownerIdVerification?.rejectionReason : undefined,
    },
  ];

  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocs);
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
            : { ...doc, status: "uploaded", file, fileName: file.name, error: undefined }
          : doc
      )
    );
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // In resubmit mode, only documents that were actually rejected are required again.
  //   // Docs that are still PENDING or already APPROVED shouldn't block resubmission.
  //   const validated = documents.map((doc) => {
  //     const mustProvide = isResubmit ? doc.verificationStatus === "REJECTED" : true;
  //     if (mustProvide && doc.status !== "uploaded") {
  //       return { ...doc, error: "This document is required." };
  //     }
  //     return doc;
  //   });

  //   if (validated.some((doc) => doc.error)) {
  //     setDocuments(validated);
  //     return;
  //   }

  //   const busCertFile = validated.find((doc) => doc.id === "business-registration")?.file;
  //   const ownerIdFile = validated.find((doc) => doc.id === "owner-id")?.file;

  //   // In resubmit mode we only need to send files for docs the user re-uploaded.
  //   if (isResubmit && !busCertFile && !ownerIdFile) {
  //     toast.error("Please upload at least one corrected document.");
  //     return;
  //   }
  //   if (!isResubmit && (!busCertFile || !ownerIdFile)) return;

  //   setIsSubmitting(true);
  //   try {
  //     const uploads: Record<string, string> = {};

  //     if (busCertFile) {
  //       const presigned = await tenantKycService.getPresignedUrl(busCertFile.name, busCertFile.type);
  //       await tenantKycService.uploadFileToS3(presigned.uploadUrl, busCertFile);
  //       uploads.businessRegistrationCertificateKey = presigned.objectKey;
  //     }
  //     if (ownerIdFile) {
  //       const presigned = await tenantKycService.getPresignedUrl(ownerIdFile.name, ownerIdFile.type);
  //       await tenantKycService.uploadFileToS3(presigned.uploadUrl, ownerIdFile);
  //       uploads.ownerIdProofKey = presigned.objectKey;
  //     }

  //     const result = await tenantKycService.uploadKyc(uploads);

  //     if (isResubmit) {
  //       dispatch(updateTenantStatus(TENANT_STATUS.PENDING));
  //       toast.success("Documents resubmitted for review.");
  //       navigate(ROUTES.TENANT.DASHBOARD);
  //     } else {
  //       dispatch(updateOnboardingStep(result.tenant.onboardingStep));
  //       toast.success("KYC documents uploaded successfully.");
  //       navigate(ROUTES.TENANT.BANKING);
  //     }
  //   } catch (err) {
  //     toast.error(
  //       getErrorMessage(err, isResubmit ? "Failed to resubmit documents." : "Failed to upload KYC documents.")
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // In resubmit mode, only documents that were actually rejected are required to be re-uploaded.
  const validated = documents.map((doc) => {
    const mustProvide = isResubmit ? doc.verificationStatus === "REJECTED" : true;
    if (mustProvide && doc.status !== "uploaded") {
      return { ...doc, error: "This document is required." };
    }
    return doc;
  });

  if (validated.some((doc) => doc.error)) {
    setDocuments(validated);
    return;
  }

  const busCertFile = validated.find((doc) => doc.id === "business-registration")?.file;
  const ownerIdFile = validated.find((doc) => doc.id === "owner-id")?.file;

  // Existing S3 keys already on the tenant record — used as fallback when a doc isn't re-uploaded.
  const existingBusCertKey = tenant?.kycDocuments?.businessRegistrationCertificate?.objectKey;
  const existingOwnerIdKey = tenant?.kycDocuments?.ownerIdProof?.objectKey;

  if (isResubmit && !busCertFile && !ownerIdFile) {
    toast.error("Please upload at least one corrected document.");
    return;
  }
  if (!isResubmit && (!busCertFile || !ownerIdFile)) return;

  setIsSubmitting(true);
  try {
    const businessRegistrationCertificateKey = busCertFile
      ? await uploadDocument(busCertFile)
      : existingBusCertKey;

    const ownerIdProofKey = ownerIdFile
      ? await uploadDocument(ownerIdFile)
      : existingOwnerIdKey;

    if (!businessRegistrationCertificateKey || !ownerIdProofKey) {
      toast.error("Missing a required document reference. Please re-upload and try again.");
      return;
    }

    const result = await tenantKycService.uploadKyc({
      businessRegistrationCertificateKey,
      ownerIdProofKey,
    });

    if (isResubmit) {
      dispatch(updateTenantStatus(TENANT_STATUS.PENDING));
      toast.success("Documents resubmitted for review.");
      navigate(ROUTES.TENANT.DASHBOARD);
    } else {
      dispatch(updateOnboardingStep(result.tenant.onboardingStep));
      toast.success("KYC documents uploaded successfully.");
      navigate(ROUTES.TENANT.BANKING);
    }
  } catch (err) {
    toast.error(
      getErrorMessage(err, isResubmit ? "Failed to resubmit documents." : "Failed to upload KYC documents.")
    );
  } finally {
    setIsSubmitting(false);
  }
};

// Small helper to keep the presign → S3 upload sequence out of handleSubmit's main flow
const uploadDocument = async (file: File): Promise<string> => {
  const presigned = await tenantKycService.getPresignedUrl(file.name, file.type);
  await tenantKycService.uploadFileToS3(presigned.uploadUrl, file);
  return presigned.objectKey;
};
  // Submitted, nothing rejected, still under review — lock the form
  if (isPendingReview) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col">
        <header className="w-full border-b border-slate-100 bg-white px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-lg font-bold text-indigo-900">
            <ArrowLeft className="h-5 w-5 text-indigo-700" />
            <span>FundNest</span>
          </button>
        </header>
        <main className="flex flex-1 flex-col items-center px-4 py-10">
          <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 text-amber-600 mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-4">Documents Under Review</h1>
            <p className="mt-2 text-sm text-slate-500">
              Your KYC documents are being verified. We'll notify you once the review is complete.
            </p>
            <button
              onClick={() => navigate(ROUTES.TENANT.DASHBOARD)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="w-full border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-lg font-bold text-indigo-900 sm:text-xl"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-indigo-700" />
            <span>FundNest</span>
          </button>

          {isFirstTimeUpload ? (
            <span className="text-sm font-medium text-slate-500">
              Step {CURRENT_STEP} of {TOTAL_STEPS}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-500">Resubmission</span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {isFirstTimeUpload && (
            <>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-2xl font-bold text-indigo-900 sm:text-3xl">KYC Upload</h1>
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
            </>
          )}

          {/* Card */}
          <div className="overflow-hidden rounded-2xl border-t-4 border-indigo-700 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {isResubmit ? "Resubmit KYC Documents" : "Upload Business Documents"}
                </h2>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  {isResubmit
                    ? "Only documents marked as rejected need to be re-uploaded."
                    : "Provide required documents to verify your business account"}
                </p>
              </div>

              <div className="space-y-5">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  const isPending = doc.status === "pending";
                  const isUploaded = doc.status === "uploaded";
                  const wasRejected = doc.verificationStatus === "REJECTED";
                  // In resubmit mode, a doc that wasn't rejected doesn't need re-upload
                  const isLockedApprovedOrPending = isResubmit && !wasRejected && doc.verificationStatus;

                  return (
                    <div
                      key={doc.id}
                      className={[
                        "rounded-xl p-4 sm:p-5",
                        doc.error
                          ? "border-2 border-dashed border-red-400 bg-white"
                          : isPending
                          ? "border-2 border-dashed border-slate-300 bg-white"
                          : "border border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                            <Icon className="h-5 w-5 text-indigo-700" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{doc.title}</h3>
                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{doc.description}</p>
                          </div>
                        </div>
                        {wasRejected && (
                          <span className="shrink-0 rounded-md bg-red-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-red-700">
                            REJECTED
                          </span>
                        )}
                        {isLockedApprovedOrPending && (
                          <span className="shrink-0 rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-700">
                            {doc.verificationStatus}
                          </span>
                        )}
                      </div>

                      {/* Rejection reason banner — only for actually rejected docs */}
                      {wasRejected && doc.rejectionReason && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                          <span>Rejection Reason: {doc.rejectionReason}</span>
                        </div>
                      )}

                      {/* Docs that are approved/pending in resubmit mode are shown but not editable */}
                      {isLockedApprovedOrPending ? (
                        <p className="mt-3 text-xs text-slate-400">
                          This document does not need to be re-uploaded.
                        </p>
                      ) : isPending ? (
                        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-8 text-center hover:bg-indigo-50/50">
                          <Cloud className={["h-6 w-6", doc.error ? "text-red-400" : "text-slate-300"].join(" ")} />
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
                            type="file"
                            accept={ACCEPTED_FILE_TYPES.join(",")}
                            className="hidden"
                            onChange={(e) => e.target.files && handleFilesForDoc(doc.id, e.target.files)}
                          />
                        </label>
                      ) : null}

                      {doc.error && (
                        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                          {doc.error}
                        </p>
                      )}

                      {isUploaded && (
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800">
                              <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{doc.fileName}</p>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                            onClick={() =>
                              setDocuments((prev) =>
                                prev.map((d) => (d.id === doc.id ? { ...d, status: "pending", error: undefined } : d))
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:from-indigo-900 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Uploading..." : isResubmit ? "Resubmit Documents" : "Upload & Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-slate-400">
            <a href="#" className="hover:text-slate-600">PRIVACY POLICY</a>
            <a href="#" className="hover:text-slate-600">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-slate-600">SECURITY VAULT</a>
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