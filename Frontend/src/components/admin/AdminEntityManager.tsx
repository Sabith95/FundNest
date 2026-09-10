import React, { useEffect, useRef, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { AdminListService } from "../../services/adminListService";
import { toast } from "react-toastify";
import { confirmToast } from "../../utitls/confirmToast";

const PAGE_SIZE = 5;

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (item: T) => React.ReactNode;
}

interface AdminEntityManagerProps<
  T extends { id: string; isActive: boolean; displayName: string },
> {
  breadcrumb: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: Column<T>[];
  service: AdminListService<T>;
  pageSize?: number;
}

function AdminEntityManager<
  T extends { id: string; isActive: boolean; displayName: string },
>({
  breadcrumb,
  title,
  description,
  searchPlaceholder,
  columns,
  service,
  pageSize = PAGE_SIZE,
}: AdminEntityManagerProps<T>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Stabilize service reference to prevent infinite effect loops when passed inline
  const serviceRef = useRef(service);
  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  // Debounce search input
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => setPage(1), [debouncedQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    serviceRef.current
      .getList(page, pageSize, debouncedQuery)
      .then((res) => {
        if (!active) return;
        setItems(res.data);
        setTotal(res.total);
        setError("");
      })
      .catch(() => active && setError("Unable to load data. Please try again."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, pageSize, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const toggleStatus = async (item: T) => {
    const action = item.isActive ? "block" : "activate";
    const confirmed = await confirmToast(
      `Are you sure you want to ${action} ${item.displayName}?`,
    );
    if (!confirmed) return;

    try {
      setUpdatingId(item.id);
      const updated = await serviceRef.current.updateStatus(
        item.id,
        !item.isActive,
      );
      setItems((cur) => cur.map((i) => (i.id === updated.id ? updated : i)));
      toast.success(
        `${item.displayName} ${action === "block" ? "blocked" : "activated"} successfully`,
      );
    } catch {
      setError(`Unable to ${action} this record. Please try again.`);
      toast.error(`Unable to ${action} this record. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-screen w-full flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
          <div>
            <p className="text-xs text-slate-400">{breadcrumb}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase text-slate-400">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-6 py-3 ${col.align === "right" ? "text-right" : ""}`}
                      >
                        {col.header}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-6 py-14 text-center text-sm text-slate-400"
                      >
                        Loading…
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-6 py-4 ${col.align === "right" ? "text-right" : ""}`}
                          >
                            {col.render(item)}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => toggleStatus(item)}
                            className={
                              item.isActive
                                ? "inline-flex items-center gap-1 rounded border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                                : "inline-flex items-center gap-1 rounded border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
                            }
                          >
                            {item.isActive ? (
                              <Ban className="h-3.5 w-3.5" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {item.isActive ? "Block" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {!loading && items.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-6 py-14 text-center text-sm text-slate-400"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + (total ? 1 : 0)}–
              {Math.min(page * pageSize, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs text-slate-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminEntityManager;
