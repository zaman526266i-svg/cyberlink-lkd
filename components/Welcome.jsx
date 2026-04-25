"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";

const POPUP_STORAGE_KEY = "cyberlink_welcome_popup_seen_v2";

export default function WelcomePopup() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(POPUP_STORAGE_KEY);
  });
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");

  const closePopup = () => {
    window.localStorage.setItem(POPUP_STORAGE_KEY, "true");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (isAdminRoute) return null;

  return (
    <AnimatePresence>
        {open ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close welcome popup"
            className="absolute inset-0 cursor-default"
            onClick={closePopup}
            type="button"
          />

          <motion.div
            className="relative z-10 w-[min(100%,26rem)] overflow-hidden rounded-[24px] border border-white/15 bg-[#03152d] shadow-[0_32px_120px_rgba(1,12,30,0.68)] sm:w-full sm:max-w-3xl sm:rounded-[30px] max-h-[calc(100svh-2rem)] sm:max-h-[calc(100svh-3rem)]"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-blue-600/30 blur-3xl" />
            </div>

            <button
              onClick={closePopup}
              className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative flex flex-col justify-between overflow-hidden p-4 sm:p-7 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100">
                    Best ISP Experience
                  </div>
                </div>

                <div className="relative mt-4 space-y-4 sm:mt-6 sm:space-y-5">
                  <div className="relative h-12 w-32 sm:h-16 sm:w-44">
                    <Image
                      src="/Navlogo/logo (2).png"
                      alt="Cyberlink logo"
                      fill
                      priority
                      className="object-contain object-left"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="max-w-lg text-2xl font-black leading-tight text-white sm:text-[2.45rem]">
                      Bangladesh&apos;s premium internet experience.
                    </h2>
                    <p className="max-w-md text-[13px] leading-6 text-slate-200 sm:text-[15px]">
                      Fast, stable and professionally managed connectivity for home and business users.
                    </p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-lg font-black text-white sm:text-xl">24/7</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-slate-300 sm:text-[10px]">
                        Support
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-lg font-black text-white sm:text-xl">IPv6</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-slate-300 sm:text-[10px]">
                        Ready
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-lg font-black text-white sm:text-xl">99%</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-slate-300 sm:text-[10px]">
                        Reliability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                  <Link
                    href="/pricing"
                    onClick={closePopup}
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 sm:px-5 sm:py-3"
                  >
                    View Packages
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closePopup}
                    className="inline-flex items-center rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-5 sm:py-3"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[220px] border-t border-white/10 bg-[radial-gradient(circle_at_top,#1d4ed833,transparent_48%),linear-gradient(180deg,#0a2446_0%,#071428_100%)] p-4 sm:min-h-[260px] sm:p-7 lg:min-h-full lg:border-l lg:border-t-0 lg:p-8">
                <div className="absolute inset-0 opacity-65">
                  <Image
                    src="/welcome.svg"
                    alt="Cyberlink welcome background"
                    fill
                    priority
                    className="object-cover object-center mix-blend-screen"
                  />
                </div>

                <div className="relative flex h-full flex-col justify-between">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90">
                    <Sparkles size={14} className="text-cyan-300" />
                    Cyberlink
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200">
                        Why choose us
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-100">
                        <li>High-speed stable connection.</li>
                        <li>Quick local support team.</li>
                        <li>Premium service quality.</li>
                      </ul>
                    </div>

                    <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-4">
                      <p className="text-sm font-semibold text-white">
                        Trusted by modern home and business users.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">
                        Smooth setup, fast support, better experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
