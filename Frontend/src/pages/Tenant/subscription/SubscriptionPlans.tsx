import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  PackageSearch,
  PiggyBank,
  TreePine,
  type LucideIcon,
} from "lucide-react";

import Header from "../../../components/tenant/Header";
import Sidebar from "../../../components/tenant/Sidebar";
import SubscriptionPlanCard from "../../../components/subscription/SubscriptionPlanCard";
import { ROUTES } from "../../../shared/constants";
import { useAppSelector } from "../../../store/hooks";
import type { SubscriptionPlan } from "../../../types/subsctiption.types";
import { mapTenantVerificationStatus } from "../../../utitls/tenantRouting";
import { tenantSubscriptionPlanService } from "../../../services/tenantSubscriptionService";

const PLAN_ICONS: Record<string, LucideIcon> = {
  BASIC: PiggyBank,
  PRO: TreePine,
  PREMIUM: Building2,
};

export default function SubscriptionPlans() {
  const tenant = useAppSelector((state) => state.tenant.tenant);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const availablePlans =
        await tenantSubscriptionPlanService.getAvailablePlans();

      setPlans(availablePlans);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription plans.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  if (!tenant) {
    return <Navigate to={ROUTES.TENANT.LOGIN} replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeHref={ROUTES.TENANT.SUBSCRIPTION}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={{
            name: tenant.ownerName,
            role: "Tenant administrator",
            verificationStatus: mapTenantVerificationStatus(tenant.status),
            profile: tenant,
          }}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription plans
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Review the available plans for your fund.
          </p>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Couldn&apos;t load subscription plans
              </h2>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <button
                type="button"
                onClick={() => void loadPlans()}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Try again
              </button>
            </div>
          ) : plans.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8 lg:py-4">
              {plans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  variant="tenant"
                  icon={PLAN_ICONS[plan.planType]}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <PackageSearch className="h-6 w-6 text-indigo-500" />
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No plans available right now
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please check back later.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
