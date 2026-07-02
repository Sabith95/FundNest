// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// // ─── Nav item type ────────────────────────────────────────
// interface INavItem {
//   label: string;
//   path: string;
//   icon: React.ReactNode;
// }

// // ─── Icons ────────────────────────────────────────────────
// const DashboardIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
//     <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
//   </svg>
// );

// const ProfileIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
//     <circle cx="12" cy="7" r="4"/>
//   </svg>
// );

// const FundsIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="3" y1="22" x2="3" y2="2"/><line x1="21" y1="22" x2="21" y2="2"/>
//     <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// );

// const PaymentsIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
//     <line x1="1" y1="10" x2="23" y2="10"/>
//   </svg>
// );

// const WalletIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
//     <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
//     <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
//   </svg>
// );

// const NotifIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
//     <path d="M13.73 21a2 2 0 01-3.46 0"/>
//   </svg>
// );

// const LiveIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//   </svg>
// );

// const SettingsIcon = () => (
//   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="3"/>
//     <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
//   </svg>
// );

// const LogoutIcon = () => (
//   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
//     <polyline points="16 17 21 12 16 7"/>
//     <line x1="21" y1="12" x2="9" y2="12"/>
//   </svg>
// );

// const MenuIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// );

// const CloseIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18"/>
//     <line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// );

// // ─── Nav items ────────────────────────────────────────────
// const NAV_ITEMS: INavItem[] = [
//   { label: 'Dashboard',      path: '/dashboard',      icon: <DashboardIcon /> },
//   { label: 'Profile',        path: '/profile',        icon: <ProfileIcon /> },
//   { label: 'Funds',          path: '/funds',          icon: <FundsIcon /> },
//   { label: 'Payments',       path: '/payments',       icon: <PaymentsIcon /> },
//   { label: 'Wallet',         path: '/wallet',         icon: <WalletIcon /> },
//   { label: 'Notifications',  path: '/notifications',  icon: <NotifIcon /> },
//   { label: 'Live Selection', path: '/live-selection', icon: <LiveIcon /> },
// ];

// const BOTTOM_ITEMS: INavItem[] = [
//   { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
//   { label: 'Logout',   path: '/logout',   icon: <LogoutIcon /> },
// ];

// // ─── Sidebar Component ────────────────────────────────────
// const Sidebar: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);

//   const isActive = (path: string): boolean => location.pathname === path;

//   const handleNav = (path: string): void => {
//     if (path === '/logout') {
//       navigate('/login');
//       return;
//     }
//     navigate(path);
//     setMobileOpen(false);
//   };

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full">

//       {/* Logo */}
//       <div className="px-5 py-5 border-b border-gray-100">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100">
//             <svg width="20" height="20" viewBox="0 0 42 42" fill="none">
//               <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25"/>
//               <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
//               <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
//               <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e"/>
//             </svg>
//           </div>
//           <div>
//             <p className="text-sm font-black text-[#1a3a6e] leading-none">FundNest</p>
//             <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
//               The Digital Sanctuary
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main nav */}
//       <nav className="flex-1 px-3 py-4 overflow-y-auto">
//         <div className="flex flex-col gap-0.5">
//           {NAV_ITEMS.map((item) => (
//             <button
//               key={item.path}
//               onClick={() => handleNav(item.path)}
//               className={`
//                 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
//                 transition-all duration-150 text-left
//                 ${isActive(item.path)
//                   ? 'bg-blue-50 text-[#1a3a6e] font-semibold'
//                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
//                 }
//               `}
//             >
//               <span className={isActive(item.path) ? 'text-[#1a78d4]' : 'text-gray-400'}>
//                 {item.icon}
//               </span>
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Bottom nav */}
//       <div className="px-3 py-4 border-t border-gray-100">
//         <div className="flex flex-col gap-0.5">
//           {BOTTOM_ITEMS.map((item) => (
//             <button
//               key={item.path}
//               onClick={() => handleNav(item.path)}
//               className={`
//                 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
//                 transition-all duration-150 text-left
//                 ${item.label === 'Logout'
//                   ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
//                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
//                 }
//               `}
//             >
//               <span>{item.icon}</span>
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>

//     </div>
//   );

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-gray-600"
//       >
//         {mobileOpen ? <CloseIcon /> : <MenuIcon />}
//       </button>

//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/30 z-30"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Mobile sidebar */}
//       <aside className={`
//         lg:hidden fixed top-0 left-0 h-full w-56 bg-white shadow-xl z-40
//         transition-transform duration-300
//         ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         <SidebarContent />
//       </aside>

//       {/* Desktop sidebar */}
//       <aside className="hidden lg:flex flex-col w-52 xl:w-56 bg-white border-r border-gray-100 h-screen flex-shrink-0 sticky top-0">
//         <SidebarContent />
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────
interface INavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: INavItem[];
}

// ─── Icons ────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const FundsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="3" y2="2"/><line x1="21" y1="22" x2="21" y2="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const PaymentsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
    <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);

const NotifIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const LiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ProfileInfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const KycIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ─── Nav config ───────────────────────────────────────────
const NAV_ITEMS: INavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  {
    label: 'Profile',
    path: '/profile',
    icon: <ProfileIcon />,
    children: [
      { label: 'Profile Info', path: '/profile/info',       icon: <ProfileInfoIcon /> },
      { label: 'KYC Upload',  path: '/profile/kyc-upload',  icon: <KycIcon /> },
    ],
  },
  { label: 'Funds',         path: '/funds',          icon: <FundsIcon /> },
  { label: 'Payments',      path: '/payments',       icon: <PaymentsIcon /> },
  { label: 'Wallet',        path: '/wallet',         icon: <WalletIcon /> },
  { label: 'Notifications', path: '/notifications',  icon: <NotifIcon /> },
  { label: 'Live Draw',     path: '/live-draw',      icon: <LiveIcon /> },
];

const BOTTOM_ITEMS: INavItem[] = [
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  { label: 'Logout',   path: '/logout',   icon: <LogoutIcon /> },
];

// ─── Sidebar Component ────────────────────────────────────
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Track which parent menus are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand profile if on a profile sub-page
    return { '/profile': location.pathname.startsWith('/profile') };
  });

  const isActive = (path: string): boolean => location.pathname === path;

  const isParentActive = (item: INavItem): boolean => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.path));
    }
    return false;
  };

  const handleNav = (path: string): void => {
    if (path === '/logout') {
      navigate('/login');
      return;
    }
    navigate(path);
    setMobileOpen(false);
  };

  const toggleExpand = (path: string): void => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100">
            <svg width="20" height="20" viewBox="0 0 42 42" fill="none">
              <ellipse cx="21" cy="27" rx="16" ry="6" fill="#1a3a6e" opacity="0.25"/>
              <ellipse cx="21" cy="24" rx="16" ry="6" fill="#f5c842"/>
              <ellipse cx="21" cy="20" rx="16" ry="6" fill="#3b8bd4"/>
              <ellipse cx="21" cy="16" rx="16" ry="6" fill="#1a3a6e"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-[#1a3a6e] leading-none">FundNest</p>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
              Wealth Management
            </p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const parentActive = isParentActive(item);
            const isExpanded = expanded[item.path];

            return (
              <div key={item.path}>
                {/* Parent nav item */}
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.path);
                    } else {
                      handleNav(item.path);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150 text-left
                    ${parentActive
                      ? 'bg-blue-50 text-[#1a3a6e] font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {parentActive && (
                    <span
                      className="absolute right-0 w-0.5 h-7 bg-[#1a78d4] rounded-l-full"
                      style={{ marginRight: '-12px' }}
                    />
                  )}

                  <span className={parentActive ? 'text-[#1a78d4]' : 'text-gray-400'}>
                    {item.icon}
                  </span>

                  <span className="flex-1">{item.label}</span>

                  {/* Chevron for expandable items */}
                  {hasChildren && (
                    <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-gray-400`}>
                      <ChevronDownIcon />
                    </span>
                  )}
                </button>

                {/* Children submenu */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-3">
                    {item.children!.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => handleNav(child.path)}
                        className={`
                          w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium
                          transition-all duration-150 text-left
                          ${isActive(child.path)
                            ? 'bg-blue-50 text-[#1a3a6e] font-semibold'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                          }
                        `}
                      >
                        <span className={isActive(child.path) ? 'text-[#1a78d4]' : 'text-gray-400'}>
                          {child.icon}
                        </span>
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex flex-col gap-0.5">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 text-left
                ${item.label === 'Logout'
                  ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-gray-600"
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        lg:hidden fixed top-0 left-0 h-full w-56 bg-white shadow-xl z-40
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 xl:w-56 bg-white border-r border-gray-100 h-screen flex-shrink-0 sticky top-0 relative">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;