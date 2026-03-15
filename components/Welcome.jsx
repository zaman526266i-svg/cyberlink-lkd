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
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/78 px-4 py-6 backdrop-blur-md"
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
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/15 bg-[#03152d] shadow-[0_32px_120px_rgba(1,12,30,0.68)]"
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
              <div className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100">
                    Best ISP Experience
                  </div>
                </div>

                <div className="relative mt-6 space-y-5">
                  <div className="relative h-14 w-36 sm:h-16 sm:w-44">
                    <Image
                      src="/Navlogo/logo (2).png"
                      alt="Cyberlink logo"
                      fill
                      priority
                      className="object-contain object-left"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="max-w-lg text-3xl font-black leading-tight text-white sm:text-[2.45rem]">
                      Bangladesh's premium internet experience.
                    </h2>
                    <p className="max-w-md text-sm leading-6 text-slate-200 sm:text-[15px]">
                      Fast, stable and professionally managed connectivity for home and business users.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-xl font-black text-white">24/7</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                        Support
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-xl font-black text-white">IPv6</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                        Ready
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-3.5">
                      <p className="text-xl font-black text-white">99%</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                        Reliability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/pricing"
                    onClick={closePopup}
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    View Packages
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closePopup}
                    className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[260px] border-t border-white/10 bg-[radial-gradient(circle_at_top,#1d4ed833,transparent_48%),linear-gradient(180deg,#0a2446_0%,#071428_100%)] p-6 sm:p-7 lg:min-h-full lg:border-l lg:border-t-0 lg:p-8">
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
