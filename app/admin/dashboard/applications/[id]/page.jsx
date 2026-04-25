"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function ApplicationDetails({ params }) {
  const { id } = use(params);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    status: "pending",
    assignmentStatus: "unassigned",
    notes: "",
  });

  useEffect(() => {
    const loadApplication = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/apply?id=${id}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Unable to load request.");
        setApp(data.data);
        setForm({
          status: data.data.status || "pending",
          assignmentStatus: data.data.assignmentStatus || "unassigned",
          notes: data.data.notes || "",
        });
      } catch (loadError) {
        setError(loadError.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadApplication();
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/apply", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Update failed.");
      setApp(data.data);
    } catch (saveError) {
      window.alert(saveError.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading request details...</p>;
  }

  if (error || !app) {
    return <p className="text-red-400">{error || "Request not found."}</p>;
  }

  const mapHref =
    app.latitude && app.longitude
      ? `https://www.google.com/maps?q=${app.latitude},${app.longitude}`
      : app.mapLink || "";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">Collection Request Details</h1>
          <p className="text-slate-400">Request ID: {app._id}</p>
        </div>
        <Link href="/admin/dashboard/applications" className="text-orange-400 hover:underline text-sm">
          Back to list
        </Link>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Field label="Full Name" value={app.fullName} />
        <Field label="Email" value={app.email} />
        <Field label="Mobile" value={app.mobile || app.phone} />
        <Field label="NID" value={app.nid || "Not Provided"} />
        <Field label="Package" value={app.package} highlight />
        <Field label="Location" value={app.location} />
        <Field label="Flat No" value={app.flatNo} />
        <Field label="House No" value={app.houseNo} />
        <Field label="Road No" value={app.roadNo} />
        <Field label="Area" value={app.area} />
        <Field label="Landmark" value={app.landmark} />
        <Field label="Referred By" value={app.reference || "Not Provided"} />
        <Field label="Assigned Manager" value={app.assignedManagerName || "Unassigned"} />
        <Field label="Requested At" value={app.requestedAt ? new Date(app.requestedAt).toLocaleString() : "N/A"} />
        <Field label="Last Updated" value={app.updatedAt ? new Date(app.updatedAt).toLocaleString() : "N/A"} />
        <div className="md:col-span-2">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Customer Location (Lat/Lng)</p>
          {mapHref ? (
            <a href={mapHref} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-semibold">
              {app.latitude && app.longitude ? `${app.latitude}, ${app.longitude}` : "Open map link"}
            </a>
          ) : (
            <p className="font-semibold">N/A</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/5 space-y-4">
        <h2 className="text-2xl font-black">Update Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3"
            >
              {["pending", "reviewed", "approved", "connected", "completed", "rejected"].map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Assignment Progress</label>
            <select
              value={form.assignmentStatus}
              onChange={(event) => setForm((prev) => ({ ...prev, assignmentStatus: event.target.value }))}
              className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3"
            >
              {["unassigned", "assigned", "in_progress", "completed", "rejected"].map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Notes</label>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            rows={4}
            className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3"
            placeholder="Add manager/admin notes..."
          />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 px-6 py-3 rounded-xl font-bold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, highlight }) {
  return (
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-orange-400" : "text-white"}`}>{value || "N/A"}</p>
    </div>
  );
}
