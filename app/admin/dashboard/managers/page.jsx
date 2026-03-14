"use client";

import { useEffect, useState } from "react";

export default function ManagersPage() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const loadManagers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/managers", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to load managers.");
      setManagers(data.data || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load managers.");
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const createManager = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const response = await fetch("/api/admin/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not create manager.");
      setForm({ username: "", email: "", password: "" });
      setManagers((prev) => [data.data, ...prev]);
    } catch (createError) {
      window.alert(createError.message || "Could not create manager.");
    } finally {
      setCreating(false);
    }
  };

  const toggleManager = async (manager) => {
    const response = await fetch("/api/admin/managers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: manager._id, active: !manager.active }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      window.alert(data.error || "Could not update manager.");
      return;
    }
    setManagers((prev) => prev.map((item) => (item._id === manager._id ? data.data : item)));
  };

  const removeManager = async (id) => {
    if (!window.confirm("Delete this manager account? Assigned requests will be unassigned.")) {
      return;
    }
    const response = await fetch(`/api/admin/managers?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      window.alert(data.error || "Could not delete manager.");
      return;
    }
    setManagers((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black sm:text-4xl">Managers</h1>
        <p className="text-slate-400">Create managers and control who receives collection requests.</p>
      </div>

      <form onSubmit={createManager} className="grid grid-cols-1 gap-4 rounded-[1.5rem] border border-white/5 bg-slate-900 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          placeholder="Manager username"
          className="bg-slate-800 rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-orange-500"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Manager email"
          className="bg-slate-800 rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-orange-500"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password (min 6)"
          minLength={6}
          className="bg-slate-800 rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-orange-500"
          required
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-xl px-4 py-3 font-bold"
        >
          {creating ? "Creating..." : "Create Manager"}
        </button>
      </form>

      {loading ? <p className="text-slate-400">Loading managers...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}

      <div className="grid gap-4 lg:hidden">
        {managers.map((manager) => (
          <div key={manager._id} className="rounded-[1.5rem] border border-white/5 bg-slate-900 p-5">
            <div className="space-y-2">
              <p className="font-semibold">{manager.username}</p>
              <p className="text-sm text-slate-400">{manager.email || "N/A"}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500">{manager.role}</p>
              <p className="text-sm text-slate-400">
                {manager.createdAt ? new Date(manager.createdAt).toLocaleString() : "N/A"}
              </p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  manager.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}
              >
                {manager.active ? "ACTIVE" : "DISABLED"}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => toggleManager(manager)}
                className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold hover:bg-slate-700"
              >
                {manager.active ? "Disable" : "Enable"}
              </button>
              <button
                type="button"
                onClick={() => removeManager(manager._id)}
                className="flex-1 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && managers.length === 0 ? (
          <div className="rounded-[1.5rem] border border-white/5 bg-slate-900 p-8 text-center text-slate-500">
            No managers found.
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto rounded-[1.5rem] border border-white/5 bg-slate-900 lg:block">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-orange-500">
            <tr>
              <th className="p-5">Username</th>
              <th className="p-5">Email</th>
              <th className="p-5">Role</th>
              <th className="p-5">Created</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {managers.map((manager) => (
              <tr key={manager._id}>
                <td className="p-5 font-semibold">{manager.username}</td>
                <td className="p-5 text-slate-400">{manager.email || "N/A"}</td>
                <td className="p-5 text-slate-400">{manager.role}</td>
                <td className="p-5 text-slate-400 text-sm">
                  {manager.createdAt ? new Date(manager.createdAt).toLocaleString() : "N/A"}
                </td>
                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      manager.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {manager.active ? "ACTIVE" : "DISABLED"}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleManager(manager)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
                  >
                    {manager.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeManager(manager._id)}
                    className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && managers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No managers found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
