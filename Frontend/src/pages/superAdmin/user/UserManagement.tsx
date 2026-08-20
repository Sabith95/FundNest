// import React, { useMemo, useState } from "react";
// import {
//   Search,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   RotateCw,
//   Ban,
//   CheckCircle2,
// } from "lucide-react";
// import Sidebar from "../../../components/admin/Sidebar";
// import Header from "../../../components/admin/Header";

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// type UserStatus = "Active" | "Blocked";

// interface AppUser {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: UserStatus;
//   initials: string;
//   avatarColor: string;
// }

// /* ------------------------------------------------------------------ */
// /*  Sample data — swap for API data                                    */
// /* ------------------------------------------------------------------ */

// const INITIAL_USERS: AppUser[] = [
//   {
//     id: "u-001",
//     name: "Sarah Jenkins",
//     email: "sarah@apex.com",
//     phone: "+91 98765 43210",
//     status: "Active",
//     initials: "SJ",
//     avatarColor: "bg-indigo-600",
//   },
//   {
//     id: "u-002",
//     name: "Michael Chen",
//     email: "m.chen@novasave.co",
//     phone: "+91 91234 56789",
//     status: "Active",
//     initials: "MC",
//     avatarColor: "bg-teal-500",
//   },
//   {
//     id: "u-003",
//     name: "Elizabeth Thorne",
//     email: "ethorne@heritage.org",
//     phone: "+91 90000 11122",
//     status: "Blocked",
//     initials: "ET",
//     avatarColor: "bg-slate-400",
//   },
//   {
//     id: "u-004",
//     name: "Priya Nair",
//     email: "priya@silverline.io",
//     phone: "+91 98888 77766",
//     status: "Active",
//     initials: "PN",
//     avatarColor: "bg-violet-500",
//   },
//   {
//     id: "u-005",
//     name: "David Kim",
//     email: "david.kim@coastalcc.com",
//     phone: "+91 97777 22233",
//     status: "Blocked",
//     initials: "DK",
//     avatarColor: "bg-amber-500",
//   },
// ];

// /* ------------------------------------------------------------------ */
// /*  Pills                                                               */
// /* ------------------------------------------------------------------ */

// function StatusPill({ status }: { status: UserStatus }) {
//   const isActive = status === "Active";
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
//         isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
//       }`}
//     >
//       <span
//         className={`h-1.5 w-1.5 rounded-full ${
//           isActive ? "bg-emerald-500" : "bg-red-500"
//         }`}
//       />
//       {status}
//     </span>
//   );
// }

// function Avatar({ user }: { user: AppUser }) {
//   return (
//     <div
//       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white ${user.avatarColor}`}
//     >
//       {user.initials}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Status toggle button                                               */
// /*  Active  -> shows "Block" button                                    */
// /*  Blocked -> shows "Unblock" button                                  */
// /* ------------------------------------------------------------------ */

// function StatusToggleButton({
//   status,
//   onToggle,
// }: {
//   status: UserStatus;
//   onToggle: () => void;
// }) {
//   const isActive = status === "Active";

//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
//         isActive
//           ? "border-red-200 text-red-600 hover:bg-red-50"
//           : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//       }`}
//     >
//       {isActive ? (
//         <>
//           <Ban className="h-3.5 w-3.5" />
//           Block
//         </>
//       ) : (
//         <>
//           <CheckCircle2 className="h-3.5 w-3.5" />
//           Unblock
//         </>
//       )}
//     </button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Filters bar                                                        */
// /* ------------------------------------------------------------------ */

// type StatusFilter = "All Status" | UserStatus;

// function FiltersBar({
//   query,
//   onQueryChange,
//   statusFilter,
//   onStatusChange,
//   onReset,
// }: {
//   query: string;
//   onQueryChange: (v: string) => void;
//   statusFilter: StatusFilter;
//   onStatusChange: (v: StatusFilter) => void;
//   onReset: () => void;
// }) {
//   return (
//     <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
//       <div className="relative flex-1">
//         <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//         <input
//           value={query}
//           onChange={(e) => onQueryChange(e.target.value)}
//           type="text"
//           placeholder="Search by name, email or phone..."
//           className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
//         />
//       </div>

//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative">
//           <select
//             value={statusFilter}
//             onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
//             className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//           >
//             <option>All Status</option>
//             <option>Active</option>
//             <option>Blocked</option>
//           </select>
//           <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//         </div>

//         <button
//           type="button"
//           onClick={onReset}
//           className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
//           aria-label="Reset filters"
//         >
//           <RotateCw className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Table                                                               */
// /*  Table view only — scrolls horizontally on narrow screens so no     */
// /*  data is dropped on mobile.                                         */
// /* ------------------------------------------------------------------ */

// function UserTable({
//   users,
//   onToggleStatus,
// }: {
//   users: AppUser[];
//   onToggleStatus: (id: string) => void;
// }) {
//   return (
//     <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[720px] text-left">
//           <thead>
//             <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
//               <th className="px-6 py-3.5">Name</th>
//               <th className="px-6 py-3.5">Email</th>
//               <th className="px-6 py-3.5">Phone</th>
//               <th className="px-6 py-3.5">Status</th>
//               <th className="px-6 py-3.5 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-slate-50">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <Avatar user={user} />
//                     <p className="truncate text-sm font-semibold text-slate-900">
//                       {user.name}
//                     </p>
//                   </div>
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
//                   {user.email}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
//                   {user.phone}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4">
//                   <StatusPill status={user.status} />
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-right">
//                   <StatusToggleButton
//                     status={user.status}
//                     onToggle={() => onToggleStatus(user.id)}
//                   />
//                 </td>
//               </tr>
//             ))}

//             {users.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-6 py-14 text-center text-sm text-slate-400"
//                 >
//                   No users match your filters.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Pagination                                                         */
// /* ------------------------------------------------------------------ */

// function Pagination({
//   page,
//   totalPages,
//   totalItems,
//   pageSize,
//   onPageChange,
// }: {
//   page: number;
//   totalPages: number;
//   totalItems: number;
//   pageSize: number;
//   onPageChange: (p: number) => void;
// }) {
//   const start = (page - 1) * pageSize + 1;
//   const end = Math.min(page * pageSize, totalItems);

//   return (
//     <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
//       <p>
//         Showing {totalItems === 0 ? 0 : start} to {end} of {totalItems} users
//       </p>
//       <div className="flex items-center justify-center gap-1.5">
//         <button
//           type="button"
//           onClick={() => onPageChange(Math.max(1, page - 1))}
//           disabled={page === 1}
//           className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
//           aria-label="Previous page"
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//           <button
//             key={p}
//             type="button"
//             onClick={() => onPageChange(p)}
//             className={`h-8 w-8 rounded-md text-sm font-medium ${
//               p === page
//                 ? "bg-indigo-600 text-white"
//                 : "text-slate-500 hover:bg-slate-100"
//             }`}
//           >
//             {p}
//           </button>
//         ))}
//         <button
//           type="button"
//           onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//           disabled={page === totalPages}
//           className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
//           aria-label="Next page"
//         >
//           <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Page component                                                     */
// /*  Renders Sidebar + Header directly, same pattern as Dashboard.tsx   */
// /*  and TenantManagement.tsx.                                          */
// /* ------------------------------------------------------------------ */

// const PAGE_SIZE = 5;

// const UserManagement: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
//   const [page, setPage] = useState(1);

//   const handleToggleStatus = (id: string) => {
//     setUsers((prev) =>
//       prev.map((user) =>
//         user.id === id
//           ? {
//               ...user,
//               status: user.status === "Active" ? "Blocked" : "Active",
//             }
//           : user
//       )
//     );
//   };

//   const filteredUsers = useMemo(() => {
//     return users.filter((user) => {
//       const q = query.trim().toLowerCase();
//       const matchesQuery =
//         q === "" ||
//         user.name.toLowerCase().includes(q) ||
//         user.email.toLowerCase().includes(q) ||
//         user.phone.toLowerCase().includes(q);

//       const matchesStatus =
//         statusFilter === "All Status" || user.status === statusFilter;

//       return matchesQuery && matchesStatus;
//     });
//   }, [users, query, statusFilter]);

//   const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
//   const paginatedUsers = filteredUsers.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   const handleReset = () => {
//     setQuery("");
//     setStatusFilter("All Status");
//     setPage(1);
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* Reusable sidebar */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       <div className="flex min-h-screen w-full flex-1 flex-col">
//         {/* Reusable header */}
//         <Header onMenuClick={() => setIsSidebarOpen(true)} />

//         <main className="flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
//           {/* Page header */}
//           <div>
//             <p className="flex items-center gap-1 text-xs text-slate-400">
//               Admin <ChevronRight className="h-3 w-3" /> Users
//             </p>
//             <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
//               User Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               View, search and manage access for every user across all
//               tenants.
//             </p>
//           </div>

//           <FiltersBar
//             query={query}
//             onQueryChange={(v) => {
//               setQuery(v);
//               setPage(1);
//             }}
//             statusFilter={statusFilter}
//             onStatusChange={(v) => {
//               setStatusFilter(v);
//               setPage(1);
//             }}
//             onReset={handleReset}
//           />

//           <UserTable users={paginatedUsers} onToggleStatus={handleToggleStatus} />

//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             totalItems={filteredUsers.length}
//             pageSize={PAGE_SIZE}
//             onPageChange={setPage}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


// pages/admin/UserManagement.tsx
// import AdminEntityManager, { Column } from '../../../components/admin/AdminEntityManager'
// import { adminUserService, type AdminUser } from '../../../services/adminListService';

// type UserRow = AdminUser & { displayName: string };

// const UserManagement: React.FC = () => {
//   const columns: Column<UserRow>[] = [
//     { key: "name", header: "Name", render: (u) => <span className="text-sm font-semibold text-slate-900">{u.name}</span> },
//     { key: "email", header: "Email", render: (u) => <span className="text-sm text-slate-600">{u.email}</span> },
//     { key: "phone", header: "Phone", render: (u) => <span className="text-sm text-slate-600">{u.phone}</span> },
//   ];

//   return (
//     <AdminEntityManager<UserRow>
//       breadcrumb="Admin / Users"
//       title="User Management"
//       description="View, search and manage access for every user across all tenants."
//       searchPlaceholder="Search by name, email or phone..."
//       columns={columns}
//       service={{
//         getList: (page, pageSize, search) =>
//           adminUserService.getUsers(page, pageSize, search).then((r) => ({
//             data: r.users.map((u) => ({ ...u, displayName: u.name })),
//             total: r.total,
//           })),
//         updateStatus: (id, isActive) => adminUserService.updateStatus(id, isActive).then((u) => ({ ...u, displayName: u.name })),
//       }}
//     />
//   );
// };
// export default UserManagement;