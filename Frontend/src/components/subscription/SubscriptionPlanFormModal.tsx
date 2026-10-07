import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  BillingCycle,
  CreateSubscriptionPlanPayload,
  PlanType,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from "../../types/subsctiption.types";

interface SubscriptionPlanFormModalProps {
  plan: SubscriptionPlan | null;
  availablePlanTypes?: PlanType[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CreateSubscriptionPlanPayload | UpdateSubscriptionPlanPayload,
  ) => Promise<void>;
}

interface FormValues {
  planType: string;
  name: string;
  price: string;
  billingCycle: BillingCycle;
  durationDays: string;
  maxFunds: string;
  maxUsers: string;
  hasAutopay: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const createEmptyForm = (initialType: string = ""): FormValues => ({
  planType: initialType,
  name: "",
  price: "",
  billingCycle: "MONTHLY",
  durationDays: "30",
  maxFunds: "",
  maxUsers: "",
  hasAutopay: false,
});

const isPositiveWholeNumber = (value: string): boolean => {
  const numberValue = Number(value);

  return (
    value.trim() !== "" && Number.isInteger(numberValue) && numberValue > 0
  );
};

const getOptionalLimit = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

export default function SubscriptionPlanFormModal({
  plan,
  isSubmitting,
  onClose,
  onSubmit,
}: SubscriptionPlanFormModalProps) {
  const [form, setForm] = useState<FormValues>(createEmptyForm(""));
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(plan);

  useEffect(() => {
    if (plan) {
      setForm({
        planType: plan.planType,
        name: plan.name,
        price: String(plan.price),
        billingCycle: plan.billingCycle,
        durationDays: String(plan.durationDays),
        maxFunds: plan.maxFunds === null ? "" : String(plan.maxFunds),
        maxUsers: plan.maxUsers === null ? "" : String(plan.maxUsers),
        hasAutopay: plan.hasAutopay,
      });
    } else {
      setForm(createEmptyForm(""));
    }

    setErrors({});
  }, [plan]);

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const { [field]: _removedError, ...remainingErrors } = current;
      return remainingErrors;
    });
  };

  const validateForm = (): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!isEditing) {
      const trimmedPlanType = form.planType.trim();
      if (!trimmedPlanType) {
        validationErrors.planType = "Plan type is required.";
      } else if (trimmedPlanType.length < 2) {
        validationErrors.planType =
          "Plan type must contain at least 2 characters.";
      } else if (trimmedPlanType.length > 50) {
        validationErrors.planType = "Plan type must not exceed 50 characters.";
      }
    }

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      validationErrors.name = "Plan name is required.";
    } else if (trimmedName.length < 2) {
      validationErrors.name = "Plan name must contain at least 2 characters.";
    } else if (trimmedName.length > 100) {
      validationErrors.name = "Plan name must not exceed 100 characters.";
    }

    const price = Number(form.price);

    if (form.price.trim() === "") {
      validationErrors.price = "Price is required.";
    } else if (!Number.isFinite(price)) {
      validationErrors.price = "Enter a valid price.";
    } else if (price <= 0) {
      validationErrors.price = "Price must be greater than zero.";
    }

    if (!["MONTHLY", "YEARLY"].includes(form.billingCycle)) {
      validationErrors.billingCycle = "Select a valid billing cycle.";
    }

    if (form.durationDays.trim() === "") {
      validationErrors.durationDays = "Duration is required.";
    } else if (!isPositiveWholeNumber(form.durationDays)) {
      validationErrors.durationDays =
        "Duration must be a positive whole number.";
    }

    if (form.maxFunds.trim() !== "" && !isPositiveWholeNumber(form.maxFunds)) {
      validationErrors.maxFunds =
        "Maximum funds must be a positive whole number or left empty for unlimited.";
    }

    if (form.maxUsers.trim() !== "" && !isPositiveWholeNumber(form.maxUsers)) {
      validationErrors.maxUsers =
        "Maximum users must be a positive whole number or left empty for unlimited.";
    }

    return validationErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const price = Number(form.price);
    const durationDays = Number(form.durationDays);
    const maxFunds = getOptionalLimit(form.maxFunds);
    const maxUsers = getOptionalLimit(form.maxUsers);

    if (isEditing) {
      const payload: UpdateSubscriptionPlanPayload = {
        name: form.name.trim(),
        price,
        billingCycle: form.billingCycle,
        durationDays,
        maxFunds,
        maxUsers,
        hasAutopay: form.hasAutopay,
      };

      await onSubmit(payload);
      return;
    }

    const payload: CreateSubscriptionPlanPayload = {
      planType: form.planType.trim().toUpperCase(),
      name: form.name.trim(),
      price,
      billingCycle: form.billingCycle,
      durationDays,
      maxFunds,
      maxUsers,
      hasAutopay: form.hasAutopay,
    };

    await onSubmit(payload);
  };

  const inputClassName = (hasError: boolean) =>
    `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
    }`;

  const errorText = (message?: string) =>
    message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Edit subscription plan" : "Create subscription plan"}
            </h2>
            <p className="text-xs text-slate-500">
              Configure plan pricing, limits, and supported features.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Plan type / Tier code
              </span>
              <input
                type="text"
                list="plan-type-presets"
                value={form.planType}
                disabled={isEditing || isSubmitting}
                onChange={(event) =>
                  updateField("planType", event.target.value.toUpperCase())
                }
                placeholder="Example: BASIC, PRO, ENTERPRISE"
                className={inputClassName(Boolean(errors.planType))}
              />
              <datalist id="plan-type-presets">
                <option value="BASIC" />
                <option value="PRO" />
                <option value="PREMIUM" />
                <option value="ENTERPRISE" />
                <option value="STARTER" />
                <option value="GROWTH" />
                <option value="CUSTOM" />
              </datalist>
              {errorText(errors.planType)}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Plan name
              </span>
              <input
                type="text"
                value={form.name}
                disabled={isSubmitting}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Example: Growth Tier"
                className={inputClassName(Boolean(errors.name))}
              />
              {errorText(errors.name)}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Price (₹)
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                disabled={isSubmitting}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="Example: 499"
                className={inputClassName(Boolean(errors.price))}
              />
              {errorText(errors.price)}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Billing cycle
              </span>
              <select
                value={form.billingCycle}
                disabled={isSubmitting}
                onChange={(event) =>
                  updateField(
                    "billingCycle",
                    event.target.value as BillingCycle,
                  )
                }
                className={inputClassName(Boolean(errors.billingCycle))}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
              {errorText(errors.billingCycle)}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Duration (Days)
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.durationDays}
                disabled={isSubmitting}
                onChange={(event) =>
                  updateField("durationDays", event.target.value)
                }
                placeholder="Example: 30"
                className={inputClassName(Boolean(errors.durationDays))}
              />
              {errorText(errors.durationDays)}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Maximum funds
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.maxFunds}
                disabled={isSubmitting}
                onChange={(event) => updateField("maxFunds", event.target.value)}
                placeholder="Leave blank for unlimited"
                className={inputClassName(Boolean(errors.maxFunds))}
              />
              {errorText(errors.maxFunds)}
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Maximum users
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.maxUsers}
                disabled={isSubmitting}
                onChange={(event) => updateField("maxUsers", event.target.value)}
                placeholder="Leave blank for unlimited"
                className={inputClassName(Boolean(errors.maxUsers))}
              />
              {errorText(errors.maxUsers)}
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Feature toggles
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Configure feature access granted with this plan.
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.hasAutopay}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateField("hasAutopay", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Include Autopay support</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}