"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const QuickPayModal = ({ isOpen, onClose }) => {
  const [customerId, setCustomerId] = useState("");
  const [paying, setPaying] = useState(false);

  const startQuickPay = async () => {
    const normalizedCustomerId = customerId.trim();
    if (!normalizedCustomerId) {
      window.alert("Please enter customer ID.");
      return;
    }

    setPaying(true);
    try {
      const response = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowType: "monthly_bill",
          customerId: normalizedCustomerId,
          source: "navbar_quick_pay",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.data?.gatewayUrl) {
        throw new Error(data.error || "Unable to start payment.");
      }
      window.location.href = data.data.gatewayUrl;
    } catch (error) {
      window.alert(error.message || "Unable to start payment.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ১. স্মার্ট ব্যাকড্রপ (High Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070b14]/70 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          />

          {/* ২. মেইন লাক্সারি কার্ড */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] z-[210] overflow-hidden font-hind"
          >
            {/* ৩. কার্ডের ওপরের স্টাইলিশ অংশ */}
            <div className="relative h-28 bg-gradient-to-br from-orange-500 to-orange-700 flex items-center px-10 overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white shadow-inner">
                   <Zap size={24} fill="currentColor" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white font-poppins tracking-tight leading-none uppercase">Quick Pay</h2>
                   <p className="text-orange-50/80 text-[10px] font-bold mt-1 uppercase tracking-[0.15em]">Instant Bill Payment</p>
                </div>
              </div>

              {/* ক্লোজ বাটন */}
              <button 
                onClick={onClose}
                className="absolute top-5 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all border border-white/10"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* ৪. কন্টেন্ট এরিয়া */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-500 font-black text-[10px] uppercase tracking-widest font-poppins ml-1">Customer ID</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ex: 123456" 
                      value={customerId}
                      onChange={(event) => setCustomerId(event.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-orange-500 focus:bg-white transition-all text-lg font-bold font-poppins text-slate-800 placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* ৫. অরেঞ্জ বাটন */}
                <button
                  type="button"
                  onClick={startQuickPay}
                  disabled={paying}
                  className="relative group/btn w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(234,88,12,0.4)] transition-all active:scale-[0.97] text-lg font-poppins overflow-hidden uppercase tracking-wider"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <span>{paying ? "Processing..." : "Pay Now"}</span>
                  <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* ৬. সিকিউরিটি নোট */}
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">100% Secure Transaction</span>
              </div>

              {/* ৭. পেমেন্ট লোগো (SSLCOMMERZ ফিক্সড) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                 <div className="flex items-center justify-between">
                    {/* bKash */}
                    <img src="https://i.ibb.co.com/zTBG81r0/photo-2025-12-03-01-02-18.jpg" alt="bkash" className="h-6 w-auto object-contain" />
                    
                    <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                    
                    <div className="flex items-center gap-3">
                        {/* Visa */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-4 w-auto object-contain" />
                        {/* Mastercard (ফিক্স করা হয়েছে) */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" className="h-5 w-auto object-contain" />
                    </div>

                    {/* SSLCOMMERZ (আপনার ছবি অনুযায়ী বড় এবং ক্লিয়ার বক্স) */}
                    <div className="bg-[#002147] px-3 py-1.5 rounded-lg shadow-sm flex items-center justify-center">
                        <span className="text-white font-black italic text-[10px] tracking-tighter leading-none">SSLCOMMERZ</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickPayModal;