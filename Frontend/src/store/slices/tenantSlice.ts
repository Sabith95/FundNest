import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { OnboardingStep, TenantStatus } from "../../shared/constants";
import type { ITenantProfile, ITenantState } from "../../types/tenant.types";
import { logout } from "./authSlice";

const STORAGE_KEY = "tenantState";

const loadTenantFromStorage = (): ITenantProfile | null => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as ITenantProfile;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistTenant = (tenant: ITenantProfile | null): void => {
  if (tenant) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tenant));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};

const initialState: ITenantState = {
  tenant: loadTenantFromStorage(),
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<ITenantProfile>) => {
      state.tenant = action.payload;
      persistTenant(action.payload);
    },

    updateOnboardingStep: (state, action: PayloadAction<OnboardingStep>) => {
      if (!state.tenant) return;
      state.tenant.onboardingStep = action.payload;
      persistTenant(state.tenant);
    },

    updateTenantStatus: (state, action: PayloadAction<TenantStatus>) => {
      if (!state.tenant) return;
      state.tenant.status = action.payload;
      persistTenant(state.tenant);
    },

    clearTenant: (state) => {
      state.tenant = null;
      persistTenant(null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.tenant = null;
      persistTenant(null);
    });
  },
});

export const { setTenant, updateOnboardingStep, updateTenantStatus, clearTenant } =
  tenantSlice.actions;

export default tenantSlice.reducer;