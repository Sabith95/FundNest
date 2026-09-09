import { AlertTriangle, ArrowRight, FileX2, Building2, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants";
import type { ITenantProfile } from "../../../types/tenant.types";

interface VerificationRejectedProps {
  tenantName?: string;
  profile?: ITenantProfile;
  rejectionReason?: string;
}

export default function VerificationRejected({
  tenantName,
  profile,
  rejectionReason,
}: VerificationRejectedProps) {
  const navigate = useNavigate();

  const busInfoStatus = profile?.businessInfo?.verification?.status;
  const busInfoReason = profile?.businessInfo?.verification?.rejectionReason;

  const busDocStatus = profile?.kycDocuments?.businessRegistrationCertificate?.verification?.status;
  const busDocReason = profile?.kycDocuments?.businessRegistrationCertificate?.verification?.rejectionReason;

  const ownerIdStatus = profile?.kycDocuments?.ownerIdProof?.verification?.status;
  const ownerIdReason = profile?.kycDocuments?.ownerIdProof?.verification?.rejectionReason;

  const bankStatus = profile?.bankDetails?.verification?.status;
  const bankReason = profile?.bankDetails?.verification?.rejectionReason;

  const isKycRejected = busDocStatus === "REJECTED" || ownerIdStatus === "REJECTED";
  const isBusinessInfoRejected = busInfoStatus === "REJECTED";
  const isBankRejected = bankStatus === "REJECTED";

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-10">
        
        {/* Header Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Title */}
        <div className="mt-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {tenantName ? `Action Required, ${tenantName}` : "Action Required: Verification Rejected"}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            Our compliance team reviewed your submission and identified items that require correction before your account can be activated.
          </p>
        </div>

        {/* Reviewer Comments Banner */}
        {rejectionReason && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50/70 p-4 text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red-800">
              Reviewer Comments:
            </h3>
            <p className="mt-1 text-sm font-medium text-red-900">{rejectionReason}</p>
          </div>
        )}

        {/* Section Cards */}
        <div className="mt-6 space-y-3">
          {/* Business Info Section */}
          {isBusinessInfoRejected && (
            <div className="flex flex-col justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Business Information</h4>
                  {busInfoReason && <p className="text-xs text-amber-800 mt-0.5">{busInfoReason}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TENANT.BUSINESS_INFO)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 sm:mt-0"
              >
                Fix Business Info <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* KYC Documents Section */}
          {isKycRejected && (
            <div className="flex flex-col justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <FileX2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">KYC Documents</h4>
                  {busDocReason && <p className="text-xs text-amber-800 mt-0.5">Registration Cert: {busDocReason}</p>}
                  {ownerIdReason && <p className="text-xs text-amber-800 mt-0.5">Owner ID: {ownerIdReason}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TENANT.KYC_UPLOAD)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 sm:mt-0"
              >
                Re-upload Documents <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Banking Details Section */}
          {isBankRejected && (
            <div className="flex flex-col justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Banking Details</h4>
                  {bankReason && <p className="text-xs text-amber-800 mt-0.5">{bankReason}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TENANT.BANKING)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 sm:mt-0"
              >
                Update Bank Details <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}