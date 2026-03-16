import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgePercent, CheckCircle2, Sparkles } from "lucide-react";
import { readContentByKey } from "@/lib/serverContent";

async function getOffer(id) {
  const record = await readContentByKey("offers");
  const offers = record?.content?.offers || [];

  return offers.find((offer) => offer.id === Number(id)) || null;
}

function isExternalLink(url) {
  return /^https?:\/\//i.test(url || "");
}

export default async function OfferDetails({ params }) {
  const { id } = await params;
  const offer = await getOffer(id);

  if (!offer) {
    notFound();
  }

  const hasOfferLink = offer.link && offer.link !== "#" && offer.link !== "/#";
  const externalLink = isExternalLink(offer.link);

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,#f8fbff_0%,#edf5ff_45%,#ffffff_100%)] py-6 font-hind selection:bg-blue-600 selection:text-white lg:py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:space-y-10">
        <Link
          href="/offers"
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to offers
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-900/5 bg-slate-950 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.7)] min-h-[340px] lg:min-h-[540px]">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-blue-700/50" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-blue-100 backdrop-blur">
                <Sparkles size={14} />
                Limited Time Offer
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
                {offer.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[2.5rem] border border-blue-100 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] lg:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                <BadgePercent size={14} />
                Campaign Details
              </div>
              <p className="text-base leading-8 text-slate-600 whitespace-pre-line lg:text-lg">
                {offer.description}
              </p>
            </div>

            <div className="rounded-[2.5rem] border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-7 text-white shadow-[0_24px_60px_-28px_rgba(37,99,235,0.6)] lg:p-8">
              <h2 className="text-2xl font-black tracking-tight">Why this offer matters</h2>
              <div className="mt-5 space-y-3 text-sm text-blue-50/90">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                  <p>বর্তমান campaign-এর তথ্য এক জায়গায় সুন্দরভাবে দেখানো হচ্ছে, যাতে visitor দ্রুত decision নিতে পারে।</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                  <p>Offer page থেকে detail page-এ click করার পর live environment-এও route ঠিকভাবে open হবে।</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                  <p>Design এখন mobile আর desktop দুই জায়গাতেই cleaner, premium আর more readable.</p>
                </div>
              </div>

              {hasOfferLink ? (
                externalLink ? (
                  <a
                    href={offer.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Visit Offer
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <Link
                    href={offer.link}
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Visit Offer
                    <ArrowUpRight size={18} />
                  </Link>
                )
              ) : (
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Contact Our Team
                  <ArrowUpRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
