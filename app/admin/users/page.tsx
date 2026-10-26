
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Phone,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USERS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      if (!API_URL) {
        throw new Error("Backend API URL is not configured.");
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch users.");
      }

      setUsers(data.users || []);
      setCurrentPage(1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const firstUser = users.length === 0 ? 0 : startIndex + 1;
  const lastUser = Math.min(startIndex + USERS_PER_PAGE, users.length);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-[#8a9276]">
              Dhavam Spices / Admin
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#2f381b] sm:text-4xl">
              Users
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and view your registered customers.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2f381b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#46532b] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total users"
            value={loading ? "—" : users.length}
            icon={<Users size={22} />}
            iconClass="bg-[#edf1e5] text-[#3f4a24]"
          />

          <SummaryCard
            title="Administrators"
            value={
              loading
                ? "—"
                : users.filter((user) => user.role === "admin").length
            }
            icon={<ShieldCheck size={22} />}
            iconClass="bg-[#f8eee7] text-[#9a432a]"
          />

          <SummaryCard
            title="Customers"
            value={
              loading
                ? "—"
                : users.filter((user) => user.role !== "admin").length
            }
            icon={<Mail size={22} />}
            iconClass="bg-[#edf1e5] text-[#3f4a24]"
          />
        </div>

        {/* Users table */}
        <div className="overflow-hidden rounded-2xl border border-[#e7e9df] bg-white shadow-sm">
          <div className="border-b border-[#edf0e7] px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-[#2f381b]">
              Registered users
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customer account information.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  className="mx-auto mb-3 animate-spin text-[#3f4a24]"
                  size={28}
                />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-red-600">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 rounded-lg bg-[#2f381b] px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-[#2f381b]">
                No users found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Registered accounts will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#f7f8f3]">
                    <tr className="text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf0e7]">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-[#fafbf7]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6ebdc] font-bold uppercase text-[#2f381b]">
                              {user.username?.charAt(0) || "U"}
                            </div>

                            <div>
                              <p className="font-semibold text-[#2f381b]">
                                {user.username}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                ID: {user._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2">
                            <Mail size={15} className="text-gray-400" />
                            {user.email}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2">
                            <Phone size={15} className="text-gray-400" />
                            {user.phone}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-[#f8eee7] text-[#9a432a]"
                                : "bg-[#edf1e5] text-[#3f4a24]"
                            }`}
                          >
                            {user.role || "user"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex flex-col gap-4 border-t border-[#edf0e7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-[#2f381b]">
                    {firstUser}–{lastUser}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#2f381b]">
                    {users.length}
                  </span>{" "}
                  users
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e1e5d8] px-3 py-2 text-sm font-medium text-[#2f381b] transition hover:bg-[#edf1e5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                        currentPage === page
                          ? "bg-[#2f381b] text-white"
                          : "border border-[#e1e5d8] text-[#2f381b] hover:bg-[#edf1e5]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e1e5d8] px-3 py-2 text-sm font-medium text-[#2f381b] transition hover:bg-[#edf1e5] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e9df] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-[#2f381b]">{value}</p>
        </div>
      </div>
    </div>
  );
}
