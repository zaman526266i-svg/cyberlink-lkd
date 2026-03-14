"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Map, ChevronDown } from "lucide-react";

export default function CoveragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [coverageData, setCoverageData] = useState({
    header: { title: "", description: "", bgVideo: "" },
    regions: [],
  });
  const [openRegions, setOpenRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/coverage", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success || !data.data) {
          throw new Error(data.error || "Unable to load coverage.");
        }
        setCoverageData(data.data);
        setOpenRegions((data.data.regions || []).map((region) => region.id));
      } catch (loadError) {
        setError(loadError.message || "Failed to load coverage.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleRegion = (id) => {
    if (openRegions.includes(id)) {
      setOpenRegions(openRegions.filter((regionId) => regionId !== id));
      return;
    }
    setOpenRegions([...openRegions, id]);
  };

  const filteredRegions = useMemo(
    () =>
      coverageData.regions
        .map((region) => ({
          ...region,
          areas: region.areas.filter((area) =>
            area.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((region) => region.areas.length > 0),
    [coverageData, searchQuery]
  );

  return (
    <div className="min-h-screen bg-white font-hind selection:text-white selection:bg-blue-600">
      <section className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden">
        <img
          src="/header/covarage.png"
          alt="Coverage banner"
          className="absolute inset-0 w-full h-full object-cover "
        />
     
        <div className="relative z-10 text-center px-6 py-3">
     <h1 className="text-4xl lg:text-7xl font-black text-white italic font-poppins tracking-tighter uppercase  drop-shadow-2xl">
  {coverageData.header.title}
</h1>

        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-10 relative z-20">
        <div className="flex justify-center mt-12 mb-20">
          <div className="relative w-full max-w-2xl">
            <div className="flex items-center  bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-[0_15px_40px_-15px_rgba(124,45,18,0.2)] focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
              <div className="pl-6 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="আপনার এরিয়া বা অঞ্চলের নাম লিখুন..."
                className="w-full bg-transparent py-5 px-4 outline-none text-lg text-gray-800 font-hind"
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="pr-6">
                <MapPin size={24} className="text-blue-600 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {filteredRegions.map((region) => {
            const isOpen = openRegions.includes(region.id);

            return (
              <motion.div
                key={`${region.id}-${region.name}`}
                initial={false}
                className="bg-white/70 backdrop-blur-md border border-blue-200 rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_-10px_rgba(124,45,18,0.12)] hover:shadow-[0_25px_60px_-12px_rgba(124,45,18,0.2)] transition-all duration-500"
              >
                <div
                  className="flex items-center justify-between p-6 lg:p-8 cursor-pointer select-none hover:bg-blue-50/50 transition-colors"
                  onClick={() => toggleRegion(region.id)}
                >
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="bg-blue-600 p-3 lg:p-4 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                      <Map size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-3xl font-black font-poppins text-gray-900 tracking-tight uppercase">
                        {region.name}
                      </h2>
                      <p className="text-gray-500 text-xs lg:text-sm font-medium font-hind">
                        {region.subtitle}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-blue-500 bg-blue-100 p-2 lg:p-3 rounded-full border border-blue-200 shadow-sm"
                  >
                    <ChevronDown size={24} strokeWidth={3} />
                  </motion.button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-6 lg:px-8 pb-10">
                        <div className="pt-2 border-t border-blue-100" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
                          {region.areas.map((area) => (
                            <motion.div
                              key={`${region.id}-${area}`}
                              whileHover={{ scale: 1.05, y: -3 }}
                              className="relative group bg-white border border-blue-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
                            >
                              <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                                  <path
                                    d="M0 20H100M0 50H100M0 80H100M30 0V100M70 0V100"
                                    stroke="gray"
                                    strokeWidth="0.5"
                                  />
                                </svg>
                              </div>
                              <div className="relative z-10 bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <MapPin size={16} strokeWidth={3} />
                              </div>
                              <span className="relative z-10 text-gray-700 font-bold group-hover:text-gray-900 transition-colors text-sm font-hind">
                                {area}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        {loading ? <p className="text-slate-600 mt-8">Loading coverage...</p> : null}
        {error ? <p className="text-red-600 mt-8">{error}</p> : null}
        {!loading && !error && filteredRegions.length === 0 ? (
          <p className="text-slate-600 mt-8">No coverage data found.</p>
        ) : null}
      </div>
    </div>
  );
}
