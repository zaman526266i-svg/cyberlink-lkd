import Link from "next/link";

function getStatusCopy(status) {
  if (status === "valid") return { title: "Payment Successful", tone: "text-emerald-400" };
  if (status === "failed") return { title: "Payment Failed", tone: "text-red-400" };
  if (status === "cancelled") return { title: "Payment Cancelled", tone: "text-amber-400" };
  return { title: "Payment Pending", tone: "text-cyan-400" };
}

export default async function PaymentStatusPage({ searchParams }) {
  const params = await searchParams;
  const status = String(params?.status || "pending").toLowerCase();
  const tranId = String(params?.tranId || "");
  const copy = getStatusCopy(status);

  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">SSLCommerz</p>
        <h1 className={`text-3xl font-black ${copy.tone}`}>{copy.title}</h1>
        <p className="text-slate-300">
          Transaction ID: <span className="font-bold">{tranId || "N/A"}</span>
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link href="/" className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold">
            Back to Home
          </Link>
          <Link href="/pay-bill" className="px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 font-bold">
            Pay Another Bill
          </Link>
        </div>
      </div>
    </section>
  );
}

