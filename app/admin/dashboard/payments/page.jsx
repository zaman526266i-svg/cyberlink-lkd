"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byStatus: {}, byFlowType: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/payments?q=${encodeURIComponent(query)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load payments.");
      }
      setPayments(data.data || []);
      setSummary(data.summary || { total: 0, byStatus: {}, byFlowType: {} });
    } catch (loadError) {
      setError(loadError.message || "Failed to load payments.");
      setPayments([]);
      setSummary({ total: 0, byStatus: {}, byFlowType: {} });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const submitSearch = async (event) => {
    event.preventDefault();
    await loadPayments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Payments</h1>
          <p className="text-slate-400">Track SSLCommerz transactions and reconciliation status.</p>
        </div>
        <div className="rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-right">
          <p className="text-xs uppercase text-slate-500 tracking-widest">Total Transactions</p>
          <p className="text-2xl font-black">{summary.total || 0}</p>
        </div>
      </div>

      <form onSubmit={submitSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by transaction ID / customer ID"
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
        />
        <button type="submit" className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["VALID", "FAILED", "CANCELLED"].map((status) => (
          <div key={status} className="rounded-2xl bg-slate-900 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">{status}</p>
            <p className="text-2xl font-black mt-2">{summary.byStatus?.[status] || 0}</p>
          </div>
        ))}
      </div>

      {loading ? <p className="text-slate-400">Loading payments...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[900px] bg-slate-900">
            <thead className="bg-slate-800 text-left text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-4 py-3">Tran ID</th>
                <th className="px-4 py-3">Flow</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item._id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-mono text-xs">{item.tranId}</td>
                  <td className="px-4 py-3">{item.flowType}</td>
                  <td className="px-4 py-3">{item.customerId || item.customer?.phone || "N/A"}</td>
                  <td className="px-4 py-3">{item.amount} {item.currency}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.riskLevel || "-"}</td>
                  <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

