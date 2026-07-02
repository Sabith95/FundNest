import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { userProfileService } from '../../../services/userProfileService';
import type {
  IDashboardData,
  IActiveFund,
  IActivity,
  IAlert,
} from '../../../types/dashboard.types';

const DEFAULT_DASHBOARD_DATA: IDashboardData = {
  isNewUser: true,
  userName: 'User',
  userRole: 'Member',
  kycCompleted: false,
  stats: {
    fundsJoined: 0,
    pendingAmount: 0,
    walletBalance: 0,
  },
  activeFunds: [],
  recentActivity: [],
  alerts: [],
  availableFunds: [],
};

// ─── Icons ────────────────────────────────────────────────
const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="3" y2="2"/><line x1="21" y1="22" x2="21" y2="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
    <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);

const FundsIllustrationIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="3" y2="2"/><line x1="21" y1="22" x2="21" y2="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────
interface IStatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  label: string;
  value: string;
  subText: string;
  subColor?: string;
  isWallet?: boolean;
}

const StatCard: React.FC<IStatCardProps> = ({
  icon, iconBg, iconColor, badge, badgeBg, badgeColor,
  label, value, subText, subColor, isWallet,
}) => {
  if (isWallet) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #1a78d4 0%, #0ea5e9 100%)' }}>
        <div className="absolute right-2 top-2 opacity-10">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12V22H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white">{icon}</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-lg bg-white/20 text-white">
              {badge}
            </span>
          </div>
          <p className="text-xs text-blue-100 font-medium mb-1">{label}</p>
          <p className="text-3xl font-black leading-none mb-1">{value}</p>
          <p className="text-xs text-blue-200">{subText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-lg ${badgeBg} ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 leading-none mb-1">{value}</p>
      <p className={`text-xs font-medium ${subColor || 'text-gray-400'}`}>{subText}</p>
    </div>
  );
};

// ─── Active Fund Card ─────────────────────────────────────
const ActiveFundCard: React.FC<{ fund: IActiveFund }> = ({ fund }) => {
  const progress = Math.round(
    (fund.paidInstallments / fund.totalInstallments) * 100
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a1f6e] to-[#1a78d4] flex-shrink-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-gray-800 leading-tight">
              {fund.name}
            </p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-50 text-green-700 flex-shrink-0">
              {fund.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Monthly: ₹{fund.monthlyAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5">
          <span>Progress (Paid {fund.paidInstallments}/{fund.totalInstallments})</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1a78d4, #0ea5e9)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Activity Icon ────────────────────────────────────────
const ActivityIcon: React.FC<{ type: string; status: string }> = ({ type, status }) => {
  const configs: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    contribution: {
      bg: status === 'SUCCESS' ? 'bg-green-50' : 'bg-orange-50',
      color: status === 'SUCCESS' ? 'text-green-500' : 'text-orange-400',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {status === 'SUCCESS'
            ? <><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>
            : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
          }
        </svg>
      ),
    },
    topup: {
      bg: 'bg-blue-50', color: 'text-blue-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    scheduled: {
      bg: 'bg-red-50', color: 'text-red-400',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  };
  const cfg = configs[type] || configs.contribution;
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
      {cfg.icon}
    </div>
  );
};

// ─── Alert Card ───────────────────────────────────────────
const AlertCard: React.FC<{
  alert: IAlert;
  onAction: (path: string) => void;
}> = ({ alert, onAction }) => {
  const configs = {
    urgent: { border: 'border-l-red-400',   titleColor: 'text-red-600',   dot: 'bg-red-500'   },
    info:   { border: 'border-l-blue-400',   titleColor: 'text-blue-700',  dot: 'bg-blue-500'  },
    success:{ border: 'border-l-green-400',  titleColor: 'text-green-700', dot: 'bg-green-500' },
  };
  const cfg = configs[alert.type];

  return (
    <div className={`bg-white rounded-xl p-4 border border-gray-100 border-l-4 ${cfg.border}`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-5 h-5 rounded-full ${cfg.dot} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          {alert.type === 'urgent' ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${cfg.titleColor}`}>{alert.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{alert.description}</p>
          {alert.actionLabel && alert.actionPath && (
            <button
              onClick={() => onAction(alert.actionPath!)}
              className={`text-xs font-bold mt-2 ${cfg.titleColor} hover:underline`}
            >
              {alert.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard Page ──────────────────────────────────
interface IDashboardPageProps {
  data?: IDashboardData;
}

const DashboardPage: React.FC<IDashboardPageProps> = ({ data: initialData }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<IDashboardData>(initialData ?? DEFAULT_DASHBOARD_DATA);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(!initialData);

  useEffect(() => {
    if (initialData) return;

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await userProfileService.getProfile();

        if (!isMounted) return;

        setData((current) => ({
          ...current,
          userName: profile.fullName || 'User',
          userRole: profile.role,
          kycCompleted: profile.kycStatus === 'VERIFIED',
          alerts: profile.kycStatus === 'PENDING'
            ? [
                {
                  id: 'kyc-pending',
                  type: 'info',
                  title: 'Complete KYC',
                  description: 'Upload your identity documents to unlock all FundNest features.',
                  actionLabel: 'Upload Documents',
                  actionPath: '/profile/kyc-upload',
                },
              ]
            : current.alerts,
        }));
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const firstName = data.userName.split(' ')[0];

  // ── New user — no funds joined yet ────────────────────
  // Show only a clean empty state with one CTA button
  if (data.isNewUser) {
    return (
      <DashboardLayout
        userName={data.userName}
        userRole={data.userRole}
        notificationCount={0}
      >
        <div className="p-5 sm:p-6 lg:p-7">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {isLoadingProfile ? 'Loading your dashboard...' : "Welcome to FundNest! Let's get you started."}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="font-medium">{today}</span>
            </div>
          </div>

          {/* Empty state card — single CTA */}
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto">

            {/* Illustration */}
            <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
              <FundsIllustrationIcon />
            </div>

            {/* Text */}
            <h2 className="text-xl font-black text-gray-900 mb-2">
              No funds joined yet
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-xs">
              You haven't joined any chit fund yet. Browse available funds
              and start building your wealth today.
            </p>

            {/* Single CTA button */}
            <button
              onClick={() => navigate('/funds')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #1a3a6e 0%, #1a78d4 100%)',
              }}
            >
              View Available Funds
              <ArrowRightIcon />
            </button>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Active user — has joined funds ────────────────────
  return (
    <DashboardLayout
      userName={data.userName}
      userRole={data.userRole}
      notificationCount={data.alerts.length}
    >
      <div className="p-5 sm:p-6 lg:p-7 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Here's your financial overview for today.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="font-medium">{today}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<BankIcon />}
            iconBg="bg-blue-50" iconColor="text-blue-500"
            badge="Total Active" badgeBg="bg-blue-50" badgeColor="text-blue-600"
            label="Funds Joined"
            value={String(data.stats.fundsJoined).padStart(2, '0')}
            subText="+1 this month"
            subColor="text-green-500"
          />
          <StatCard
            icon={<AlertCircleIcon />}
            iconBg="bg-orange-50" iconColor="text-orange-400"
            badge={data.stats.pendingAmount > 0 ? 'Urgent' : 'Pending'}
            badgeBg={data.stats.pendingAmount > 0 ? 'bg-red-50' : 'bg-orange-50'}
            badgeColor={data.stats.pendingAmount > 0 ? 'text-red-600' : 'text-orange-500'}
            label="Pending Payments"
            value={`₹${data.stats.pendingAmount.toLocaleString('en-IN')}`}
            subText={data.stats.pendingDueText || 'Check payments'}
            subColor={data.stats.pendingAmount > 0 ? 'text-red-500' : 'text-gray-400'}
          />
          <StatCard
            icon={<WalletIcon />}
            iconBg="" iconColor=""
            badge="Withdrawable" badgeBg="" badgeColor=""
            label="Wallet Balance"
            value={`₹${data.stats.walletBalance.toLocaleString('en-IN')}`}
            subText="Available to withdraw"
            isWallet
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left — Active funds + Activity */}
          <div className="lg:col-span-3 space-y-5">

            {/* Active chit funds */}
            {data.activeFunds.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-gray-900">
                      Active Chit Funds
                    </h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg font-medium">
                      Managed
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/funds')}
                    className="text-xs font-bold text-[#1a78d4] hover:underline"
                  >
                    View all funds
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.activeFunds.map((fund) => (
                    <ActiveFundCard key={fund.id} fund={fund} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent activity */}
            {data.recentActivity.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-black text-gray-900">
                    Recent Activity
                  </h2>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <DownloadIcon /> Download History
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {data.recentActivity.map((item: IActivity, i: number) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-4 ${
                        i < data.recentActivity.length - 1 ? 'border-b border-gray-50' : ''
                      }`}
                    >
                      <ActivityIcon type={item.type} status={item.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${
                          item.status === 'PENDING' ? 'text-gray-700' :
                          item.isCredit ? 'text-green-600' : 'text-gray-800'
                        }`}>
                          {item.isCredit ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                        </p>
                        <p className={`text-[10px] font-bold mt-0.5 ${
                          item.status === 'SUCCESS' ? 'text-green-500' :
                          item.status === 'PENDING' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Alerts */}
          {data.alerts.length > 0 && (
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900">Alerts</h2>
                <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {data.alerts.length} New
                </span>
              </div>
              {data.alerts.map((alert: IAlert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAction={(path) => navigate(path)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
