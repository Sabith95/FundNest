import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  History,
  PackageSearch,
  PiggyBank,
  Plus,
  Sparkles,
  Trash2,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../../components/admin/Header";
import Sidebar from "../../../components/admin/Sidebar";
import SubscriptionPlanCard from "../../../components/subscription/SubscriptionPlanCard";
import SubscriptionPlanFormModal from "../../../components/subscription/SubscriptionPlanFormModal";
import { adminSubscriptionPlanService } from "../../../services/adminSubscriptionPlanService";
import { ROUTES } from "../../../shared/constants";
import type {
  CreateSubscriptionPlanPayload,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from "../../../types/subsctiption.types";

const PLAN_ICONS: Record<string, LucideIcon> = {
  BASIC: PiggyBank,
  PRO: TreePine,
  PREMIUM: Building2,
  PLATINUM: Sparkles,
  ENTERPRISE: Building2,
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Status toggle confirmation modal
  const [planToToggle, setPlanToToggle] = useState<SubscriptionPlan | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Soft delete confirmation modal
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await adminSubscriptionPlanService.getAll();

      // Sort plans by price ascending
      const sortedPlans = [...result].sort(
        (first, second) => first.price - second.price,
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

  const openCreateModal = () => {
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
            (first, second) => first.price - second.price,
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

  // Toggle status with permission modal
  const handleRequestToggleStatus = (plan: SubscriptionPlan) => {
    setPlanToToggle(plan);
  };

  const handleConfirmToggleStatus = async () => {
    if (!planToToggle) return;

    try {
      setIsUpdatingStatus(true);
      const nextActiveState = !planToToggle.isActive;

      const updatedPlan = await adminSubscriptionPlanService.updateStatus(
        planToToggle.id,
        nextActiveState,
      );

      setPlans((current) =>
        current.map((item) =>
          item.id === updatedPlan.id ? updatedPlan : item,
        ),
      );

      toast.success(
        updatedPlan.isActive
          ? `Plan "${updatedPlan.name}" unblocked successfully.`
          : `Plan "${updatedPlan.name}" blocked successfully.`,
      );

      setPlanToToggle(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to update the subscription plan status"),
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Soft delete with permission modal
  const handleRequestDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      setIsDeleting(true);
      await adminSubscriptionPlanService.delete(planToDelete.id);

      setPlans((current) =>
        current.filter((item) => item.id !== planToDelete.id),
      );

      toast.success(`Plan "${planToDelete.name}" deleted successfully.`);
      setPlanToDelete(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to delete the subscription plan"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

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
                Create and manage custom subscription plans offered to FundNest
                tenants.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(ROUTES.SUPER_ADMIN.BILLING_HISTORY)}
                className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <History className="h-4 w-4 text-slate-500" />
                View billing history
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create new plan
              </button>
            </div>
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
                  icon={PLAN_ICONS[plan.planType] ?? Building2}
                  onEdit={openEditModal}
                  onToggleStatus={handleRequestToggleStatus}
                  onDelete={handleRequestDelete}
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
                Create subscription plans tailored to your needs to begin
                offering subscriptions to tenants.
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
          isSubmitting={isSaving}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* Confirmation Modal for Block / Unblock */}
      {planToToggle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  planToToggle.isActive
                    ? "bg-amber-100 text-amber-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {planToToggle.isActive
                    ? "Block Subscription Plan?"
                    : "Unblock Subscription Plan?"}
                </h3>
                <p className="text-xs text-slate-500">
                  Plan: <span className="font-semibold text-slate-700">{planToToggle.name}</span>
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              {planToToggle.isActive
                ? "Blocking this plan prevents new tenants from selecting or purchasing it. Existing active tenant subscriptions will continue to function normally until their billing period expires."
                : "Unblocking this plan will immediately make it active and available in the public catalog for tenants to purchase."}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPlanToToggle(null)}
                disabled={isUpdatingStatus}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmToggleStatus()}
                disabled={isUpdatingStatus}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed ${
                  planToToggle.isActive
                    ? "bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300"
                    : "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                }`}
              >
                {isUpdatingStatus
                  ? "Updating..."
                  : planToToggle.isActive
                    ? "Yes, Block Plan"
                    : "Yes, Unblock Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Soft Delete */}
      {planToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Delete Subscription Plan?
                </h3>
                <p className="text-xs text-slate-500">
                  Plan: <span className="font-semibold text-slate-700">{planToDelete.name}</span>
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              Are you sure you want to permanently delete this plan? This will remove it from all catalogs.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Note: If any tenants currently have an active subscription on this plan, deletion will be blocked by system safety rules to protect customer accounts.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPlanToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}