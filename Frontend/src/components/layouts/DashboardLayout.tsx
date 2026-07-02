import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';

// ─── Props ────────────────────────────────────────────────
interface IDashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole?: string;
  notificationCount?: number;
}

// ─── Layout Component ─────────────────────────────────────
// This is the reusable shell for all dashboard pages.
// Usage:
//   <DashboardLayout userName="Alex">
//     <YourPageContent />
//   </DashboardLayout>
//
// Why this pattern:
//   - Sidebar and Header are written once, used everywhere
//   - Each page only defines its own content
//   - No copy-paste of nav/header across pages
//   - Follows Single Responsibility Principle

const DashboardLayout: React.FC<IDashboardLayoutProps> = ({
  children,
  userName,
  userRole,
  notificationCount,
}) => {
  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-50"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* Sidebar — fixed left, used on all pages */}
      <Sidebar />

      {/* Main area — scrollable content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header — fixed top, used on all pages */}
        <Header
          userName={userName}
          userRole={userRole}
          notificationCount={notificationCount}
        />

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;