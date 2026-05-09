"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgePercent, Sparkles } from "lucide-react";

export default function OffersPage() {
  const [offersData, setOffersData] = useState({
    header: { title: "", description: "", bgImage: "" },
    offers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/offers");
        const data = await response.json();
        if (!response.ok || !data.success || !data.data) {
          throw new Error(data.error || "Unable to load offers.");
        }
        setOffersData(data.data);
      } catch (loadError) {
        setError(loadError.message || "Failed to load offers.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_22%),linear-gradient(180deg,#f7fbff_0%,#eef6ff_38%,#ffffff_100%)] pb-24 font-hind selection:bg-blue-600 selection:text-white">
      {offersData.header.bgImage ? (
        <PageBanner src={offersData.header.bgImage} alt="Offers background" align="left">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Exclusive Campaigns
            </div>
            <h1 className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-8xl">
              {offersData.header.title || "Offers & Campaigns"}
            </h1>
          </motion.div>
        </PageBanner>
      ) : (
        <section className="relative flex min-h-[280px] items-center bg-[#050a14] px-4 py-16 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-7xl"
          >
            <h1 className="text-4xl font-black uppercase text-white sm:text-6xl lg:text-8xl">
              {offersData.header.title || "Offers & Campaigns"}
            </h1>
          </motion.div>
        </section>
      )}

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white/80 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] backdrop-blur"
              >
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-blue-100" />
                  <div className="h-8 w-2/3 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-blue-100" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offersData.offers.map((offer, index) => (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-all"
              >
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm">
                    <BadgePercent size={14} />
                    New Offer
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                    {offer.title}
                  </h3>

                  <div className="my-4 h-1 w-14 rounded-full bg-blue-500 transition-all duration-500 group-hover:w-full" />

                  <p className="flex-grow text-sm font-medium leading-7 text-slate-600 sm:text-base">
                    {offer.description}
                  </p>

                  <Link
                    href={`/offers/${offer.id}`}
                    className="mt-7 inline-flex items-center justify-between rounded-[1.35rem] bg-slate-950 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-blue-600"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-5 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && offersData.offers.length === 0 ? (
          <div className="rounded-[2rem] border border-blue-100 bg-white px-6 py-10 text-center text-slate-600 shadow-sm">
            No active offers found.
          </div>
        ) : null}
      </div>
    </div>
  );
}
