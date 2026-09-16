import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  PackageSearch,
  PiggyBank,
  Plus,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../../components/admin/Header";
import Sidebar from "../../../components/admin/Sidebar";
import SubscriptionPlanCard from "../../../components/subscription/SubscriptionPlanCard";
import SubscriptionPlanFormModal from "../../../components/subscription/SubscriptionPlanFormModal";
import { adminSubscriptionPlanService } from "../../../services/adminSubscriptionPlanService";
import type {
  CreateSubscriptionPlanPayload,
  PlanType,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from "../../../types/subsctiption.types";

const PLAN_TYPES: PlanType[] = ["BASIC", "PRO", "PREMIUM"];

const PLAN_ICONS: Record<PlanType, LucideIcon> = {
  BASIC: PiggyBank,
  PRO: TreePine,
  PREMIUM: Building2,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export default function SubscriptionBilling() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await adminSubscriptionPlanService.getAll();

      const sortedPlans = [...result].sort(
        (first, second) =>
          PLAN_TYPES.indexOf(first.planType) -
          PLAN_TYPES.indexOf(second.planType),
      );

      setPlans(sortedPlans);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load subscription plans"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const availablePlanTypes = useMemo(
    () =>
      PLAN_TYPES.filter(
        (type) =>
          !plans.some((plan) => plan.planType === type) ||
          type === editingPlan?.planType,
      ),
    [editingPlan?.planType, plans],
  );

  const openCreateModal = () => {
    if (plans.length >= PLAN_TYPES.length) {
      toast.info("All three subscription plans have already been created.");
      return;
    }

    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSaving) {
      setIsFormOpen(false);
      setEditingPlan(null);
    }
  };

  const handleSubmit = async (
    payload: CreateSubscriptionPlanPayload | UpdateSubscriptionPlanPayload,
  ) => {
    try {
      setIsSaving(true);

      if (editingPlan) {
        const updatedPlan = await adminSubscriptionPlanService.update(
          editingPlan.id,
          payload as UpdateSubscriptionPlanPayload,
        );

        setPlans((current) =>
          current.map((plan) =>
            plan.id === updatedPlan.id ? updatedPlan : plan,
          ),
        );

        toast.success("Subscription plan updated successfully.");
      } else {
        const createdPlan = await adminSubscriptionPlanService.create(
          payload as CreateSubscriptionPlanPayload,
        );

        setPlans((current) =>
          [...current, createdPlan].sort(
            (first, second) =>
              PLAN_TYPES.indexOf(first.planType) -
              PLAN_TYPES.indexOf(second.planType),
          ),
        );

        toast.success("Subscription plan created successfully.");
      }

      setIsFormOpen(false);
      setEditingPlan(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to save the subscription plan"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (plan: SubscriptionPlan) => {
    try {
      const updatedPlan = await adminSubscriptionPlanService.updateStatus(
        plan.id,
        !plan.isActive,
      );

      setPlans((current) =>
        current.map((item) =>
          item.id === updatedPlan.id ? updatedPlan : item,
        ),
      );

      toast.success(
        updatedPlan.isActive
          ? "Subscription plan unblocked successfully."
          : "Subscription plan blocked successfully.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to update the subscription plan status"),
      );
    }
  };

  const canCreatePlan = plans.length < PLAN_TYPES.length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          adminName="Admin User"
          adminRole="Super Admin"
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Subscription plans
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Create and manage the three subscription plans offered to
                FundNest tenants.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              disabled={!canCreatePlan}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus className="h-4 w-4" />
              {canCreatePlan ? "Create new plan" : "All plans created"}
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading subscription plans...
            </div>
          ) : plans.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8 lg:py-4">
              {plans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  icon={PLAN_ICONS[plan.planType]}
                  onEdit={openEditModal}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                <PackageSearch className="h-6 w-6 text-indigo-500" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No subscription plans yet
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                Create a Basic, Pro, or Premium plan to begin offering
                subscriptions to tenants.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Create new plan
              </button>
            </div>
          )}
        </main>
      </div>

      {isFormOpen && (
        <SubscriptionPlanFormModal
          plan={editingPlan}
          availablePlanTypes={availablePlanTypes}
          isSubmitting={isSaving}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
