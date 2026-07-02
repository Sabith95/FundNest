// ─── Stat summary ─────────────────────────────────────────
export interface IDashboardStats {
  fundsJoined: number;
  pendingAmount: number;
  pendingDueText?: string;
  walletBalance: number;
}

// ─── Chit fund ────────────────────────────────────────────
export type FundStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'OPEN' | 'FILLING';

export interface IActiveFund {
  id: string;
  name: string;
  monthlyAmount: number;
  paidInstallments: number;
  totalInstallments: number;
  status: FundStatus;
  imageUrl?: string;
}

// ─── Recent activity ──────────────────────────────────────
export type ActivityType = 'contribution' | 'topup' | 'scheduled' | 'withdrawal';
export type ActivityStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface IActivity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  amount: number;
  isCredit: boolean;
  status: ActivityStatus;
}

// ─── Alert ────────────────────────────────────────────────
export type AlertType = 'urgent' | 'info' | 'success';

export interface IAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

// ─── Available fund (for new user) ───────────────────────
export interface IAvailableFund {
  id: string;
  name: string;
  monthlyAmount: number;
  members: number;
  duration: string;
  status: 'Open' | 'Filling' | 'Full';
}

// ─── Full dashboard data ──────────────────────────────────
export interface IDashboardData {
  isNewUser: boolean;            // ← controls which UI to show
  userName: string;
  userRole: string;
  stats: IDashboardStats;
  activeFunds: IActiveFund[];
  recentActivity: IActivity[];
  alerts: IAlert[];
  availableFunds: IAvailableFund[];
  kycCompleted: boolean;
}