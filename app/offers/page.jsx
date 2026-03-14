"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
        const response = await fetch("/api/offers", { cache: "no-store" });
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
    <div className="min-h-screen font-hind selection:text-white selection:bg-blue-600 pb-24 bg-white">
      <section className="relative min-h-[450px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {offersData.header.bgImage ? (
            <img
              src={offersData.header.bgImage}
              alt="Offers Background"
              className="w-full h-full object-cover "
            />
          ) : null}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10  pb-32 lg:pb-64">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black mb-4 text-white font-poppins tracking-tighter uppercase drop-shadow-2xl leading-tight">
              {offersData.header.title}
            </h1>
            <p className="text-white text-sm sm:text-lg lg:text-xl leading-relaxed font-medium  drop-shadow-md max-w-2xl  rounded-xl p-3 inline-block">
              {offersData.header.description}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 -mt-16 sm:-mt-20 lg:-mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offersData.offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white border border-blue-200 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(30,64,175,0.12)] flex flex-col group h-full"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors font-hind leading-tight uppercase tracking-tight">
                  {offer.title}
                </h3>

                <div className="w-12 h-1 bg-blue-500 mb-4 group-hover:w-full transition-all duration-700 rounded-full" />

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 flex-grow line-clamp-3 font-hind font-medium">
                  {offer.description}
                </p>

              <div className="mt-auto">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 group/btn transition-all duration-300 shadow-sm"
                  >
                    <span className="uppercase tracking-wider text-xs font-poppins">Learn More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover/btn:translate-x-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {loading ? <p className="text-slate-600 mt-6">Loading offers...</p> : null}
        {error ? <p className="text-red-300 mt-6">{error}</p> : null}
        {!loading && !error && offersData.offers.length === 0 ? (
          <p className="text-slate-600 mt-6">No active offers found.</p>
        ) : null}
      </div>
    </div>
  );
}
