import type { IDashboardData } from '../types/dashboard.types';

// ─── New user (just signed up) ────────────────────────────
export const NEW_USER_DATA: IDashboardData = {
  isNewUser: true,
  userName: 'Alex Thompson',
  userRole: 'New Member',
  kycCompleted: false,
  stats: {
    fundsJoined: 0,
    pendingAmount: 0,
    walletBalance: 0,
  },
  activeFunds: [],
  recentActivity: [],
  alerts: [],
  availableFunds: [
    {
      id: '1',
      name: 'Growth Equity 2026',
      monthlyAmount: 2000,
      members: 18,
      duration: '24 months',
      status: 'Open',
    },
    {
      id: '2',
      name: 'Premium Wealth Circle',
      monthlyAmount: 5000,
      members: 11,
      duration: '24 months',
      status: 'Filling',
    },
    {
      id: '3',
      name: 'Safe Haven 2024',
      monthlyAmount: 1000,
      members: 22,
      duration: '12 months',
      status: 'Open',
    },
  ],
};

// ─── Active user (joined funds, has activity) ─────────────
export const ACTIVE_USER_DATA: IDashboardData = {
  isNewUser: false,
  userName: 'Alex Thompson',
  userRole: 'Premium Member',
  kycCompleted: true,
  stats: {
    fundsJoined: 3,
    pendingAmount: 4500,
    pendingDueText: 'Due in 2 days',
    walletBalance: 12850,
  },
  activeFunds: [
    {
      id: '1',
      name: 'Growth Equity 2026',
      monthlyAmount: 2000,
      paidInstallments: 8,
      totalInstallments: 24,
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Premium Wealth Circle',
      monthlyAmount: 5000,
      paidInstallments: 12,
      totalInstallments: 24,
      status: 'ACTIVE',
    },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'contribution',
      title: 'Monthly Contribution - Growth 26',
      subtitle: 'PAID ON JUNE 12, 2024 • ID: #FN-9821',
      amount: 2000,
      isCredit: false,
      status: 'SUCCESS',
    },
    {
      id: '2',
      type: 'topup',
      title: 'Wallet Top-up',
      subtitle: 'JUNE 10, 2024 • BANK TRANSFER',
      amount: 5000,
      isCredit: true,
      status: 'SUCCESS',
    },
    {
      id: '3',
      type: 'scheduled',
      title: 'Payment Scheduled - Wealth Circle',
      subtitle: 'DUE ON JUNE 16, 2024',
      amount: 5000,
      isCredit: false,
      status: 'PENDING',
    },
  ],
  alerts: [
    {
      id: '1',
      type: 'urgent',
      title: 'Urgent Payment Due',
      description:
        'Your installment for Premium Wealth Circle is due in 48 hours to avoid penalties.',
      actionLabel: 'Pay Now',
      actionPath: '/payments',
    },
    {
      id: '2',
      type: 'info',
      title: 'Draw Results Published',
      description:
        "The results for the 'Safe Haven 2024' June draw are now live. Tap to see winners.",
      actionLabel: 'View Draw Results',
      actionPath: '/live-selection',
    },
  ],
  availableFunds: [],
};