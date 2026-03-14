"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  reviewed: "bg-blue-500/10 text-blue-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  connected: "bg-green-500/10 text-green-500",
  completed: "bg-cyan-500/10 text-cyan-400",
  rejected: "bg-red-500/10 text-red-400",
};

const statusOptions = ["pending", "reviewed", "approved", "connected", "completed", "rejected"];
const assignmentOptions = ["unassigned", "assigned", "in_progress", "completed", "rejected"];

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [applicationsRes, managersRes] = await Promise.all([
        fetch("/api/apply", { cache: "no-store" }),
        fetch("/api/admin/managers", { cache: "no-store" }),
      ]);

      const [applicationsData, managersData] = await Promise.all([applicationsRes.json(), managersRes.json()]);

      if (!applicationsRes.ok || !applicationsData.success) {
        throw new Error(applicationsData.error || "Unable to load applications.");
      }

      setApps(applicationsData.data || []);
      setManagers(managersRes.ok && managersData.success ? managersData.data || [] : []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load requests.");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateApplication = async (id, patch) => {
    const response = await fetch("/api/apply", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      window.alert(data.error || "Unable to update request.");
      return;
    }
    setApps((prev) => prev.map((app) => (app._id === id ? data.data : app)));
  };

  const removeApplication = async (id) => {
    if (!window.confirm("Delete this request permanently?")) return;
    const response = await fetch(`/api/apply?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      window.alert(data.error || "Unable to delete request.");
      return;
    }
    setApps((prev) => prev.filter((app) => app._id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black">Collection Requests</h2>
        <div className="bg-orange-600/20 text-orange-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Total: {apps.length}
        </div>
      </div>

      {loading ? <p className="text-slate-400">Loading requests...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}

      <div className="grid gap-4 xl:hidden">
        {apps.map((app) => (
          <div key={app._id} className="rounded-[1.5rem] border border-white/5 bg-slate-900 p-5">
            <div className="space-y-1">
              <Link href={`/admin/dashboard/applications/${app._id}`} className="font-bold text-white hover:text-orange-400 transition">
                {app.fullName || app.name || "N/A"}
              </Link>
              <p className="text-xs text-slate-500">{app.mobile || app.phone || "N/A"}</p>
              <p className="text-xs text-slate-500">
                {app.requestedAt ? new Date(app.requestedAt).toLocaleString() : "N/A"}
              </p>
              <p className="font-mono text-sm text-orange-400">{app.package || "N/A"}</p>
              <p className="text-sm text-slate-400">{app.location || app.address || "N/A"}</p>
            </div>
            <div className="mt-4 grid gap-3">
              <select
                value={app.assignedManagerId || ""}
                onChange={(event) => updateApplication(app._id, { assignedManagerId: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs outline-none"
              >
                <option value="">Unassigned</option>
                {managers
                  .filter((manager) => manager.active)
                  .map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.username}
                    </option>
                  ))}
              </select>
              <select
                value={app.status || "pending"}
                onChange={(event) => updateApplication(app._id, { status: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={app.assignmentStatus || "unassigned"}
                onChange={(event) => updateApplication(app._id, { assignmentStatus: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs outline-none"
              >
                {assignmentOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="flex gap-4 text-sm">
                <Link href={`/admin/dashboard/applications/${app._id}`} className="text-orange-400 hover:underline">
                  View
                </Link>
                <button type="button" onClick={() => removeApplication(app._id)} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && apps.length === 0 ? (
          <div className="rounded-[1.5rem] border border-white/5 bg-slate-900 p-10 text-center text-slate-500">
            No collection requests found.
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto rounded-[2rem] border border-white/5 bg-slate-900 xl:block">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="bg-white/5 text-orange-500 text-[10px] font-black uppercase tracking-widest">
              <th className="p-6">Customer</th>
              <th className="p-6">Package</th>
              <th className="p-6">Location</th>
              <th className="p-6">Manager</th>
              <th className="p-6">Status</th>
              <th className="p-6">Progress</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {apps.map((app) => (
              <tr key={app._id} className="hover:bg-white/5 transition-all group">
                <td className="p-6">
                  <Link href={`/admin/dashboard/applications/${app._id}`} className="font-bold text-white hover:text-orange-400 transition">
                    {app.fullName || app.name || "N/A"}
                  </Link>
                  <p className="text-xs text-slate-500">{app.mobile || app.phone || "N/A"}</p>
                  <p className="text-xs text-slate-500">
                    {app.requestedAt ? new Date(app.requestedAt).toLocaleString() : "N/A"}
                  </p>
                </td>
                <td className="p-6 font-mono text-orange-400">{app.package || "N/A"}</td>
                <td className="p-6 text-sm text-slate-400">
                  <p>{app.location || app.address || "N/A"}</p>
                  {app.latitude && app.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${app.latitude},${app.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      View Map
                    </a>
                  ) : null}
                </td>
                <td className="p-6">
                  <select
                    value={app.assignedManagerId || ""}
                    onChange={(event) => updateApplication(app._id, { assignedManagerId: event.target.value })}
                    className="bg-slate-800 border border-white/10 rounded-lg text-xs px-3 py-2 outline-none w-44"
                  >
                    <option value="">Unassigned</option>
                    {managers
                      .filter((manager) => manager.active)
                      .map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.username}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="p-6">
                  <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${statusColors[app.status] || statusColors.pending}`}>
                      {(app.status || "pending").toUpperCase()}
                    </span>
                    <select
                      value={app.status || "pending"}
                      onChange={(event) => updateApplication(app._id, { status: event.target.value })}
                      className="block bg-slate-800 border border-white/10 rounded-lg text-xs px-3 py-2 outline-none"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-6">
                  <select
                    value={app.assignmentStatus || "unassigned"}
                    onChange={(event) => updateApplication(app._id, { assignmentStatus: event.target.value })}
                    className="bg-slate-800 border border-white/10 rounded-lg text-xs px-3 py-2 outline-none"
                  >
                    {assignmentOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/dashboard/applications/${app._id}`} className="text-xs text-orange-400 hover:underline">
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeApplication(app._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && apps.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-500">
                  No collection requests found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
