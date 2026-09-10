import React, { useState } from "react";
import Sidebar from "../../../components/tenant/Sidebar";
import Header from "../../../components/tenant/Header";
import VerificationPending from "./VerificationPending";
import VerificationRejected from "./VerificationRejected";
import type { TenantUser } from "../../../types/tenant.types";

interface TenantDashboardLayoutProps {
  user: TenantUser;
  activeHref?: string;
  children?: React.ReactNode;
}

export default function TenantDashboardLayout({
  user,
  activeHref = "/dashboard",
  children,
}: TenantDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isVerified = user.verificationStatus === "active";
  const isRejected = user.verificationStatus === "rejected";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activeHref={activeHref}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        disabled={!isVerified}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
          disableSearch={!isVerified}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {isVerified ? (
            children
          ) : isRejected ? (
            <VerificationRejected
              tenantName={user.name.split(" ")[0]}
              profile={user.profile}
              rejectionReason={user.rejectionReason}
            />
          ) : (
            <VerificationPending
              tenantName={user.name.split(" ")[0]}
              submittedAt={user.submittedAt}
            />
          )}
        </main>
      </div>
    </div>
  );
}
