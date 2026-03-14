"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Info, Check,
    FileCheck, Download, ExternalLink,
    Server, Zap, Globe
} from 'lucide-react';
import Link from 'next/link';

const BtrcTariffPage = () => {
    // বিটিআরসি অনুমোদিত ট্যারিফ ডাটা
    const tariffs = [
        {
            id: 1,
            packageName: "Ek Desh Ek Rate - 5Mbps",
            speed: "5 Mbps",
            charge: "500 TK",
            details: "BTRC Standard Broadband Rate",
            category: "Home"
        },
        {
            id: 2,
            packageName: "Ek Desh Ek Rate - 10Mbps",
            speed: "10 Mbps",
            charge: "800 TK",
            details: "BTRC Standard Broadband Rate",
            category: "Home"
        },
        {
            id: 3,
            packageName: "Ek Desh Ek Rate - 20Mbps",
            speed: "20 Mbps",
            charge: "1200 TK",
            details: "BTRC Standard Broadband Rate",
            category: "Home"
        }
    ];

    return (
        <div className="min-h-screen font-hind pb-24 bg-gradient-to-br from-[#BFFF00] via-[#0e270e] to-[#2bd22b]">

            {/* ১. প্রিমিয়াম হেডার সেকশন */}
            <section className="relative h-[350px] lg:h-[450px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg"
                        className="w-full h-full object-cover opacity-60 brightness-75"
                        alt="BTRC Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#414b41]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#414b41]"></div>
                </div>

                <div className="container mx-auto px-6 lg:px-20 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#BFFF00] text-[#070b14] rounded-lg text-xs font-black mb-6 tracking-widest font-poppins uppercase">
                            <ShieldCheck size={14} /> Official Tariff
                        </div>
                        <h1 className="text-4xl lg:text-8xl font-black mb-6 text-white font-poppins tracking-tighter uppercase italic leading-none">
                            BTRC <span className="text-[#BFFF00]">Tariff</span>
                        </h1>
                        <p className="text-gray-100 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl opacity-90">
                            বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন (বিটিআরসি) কর্তৃক অনুমোদিত ইন্টারনেট প্যাকেজ ও মূল্য তালিকা।
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ২. মেইন কন্টেন্ট এরিয়া */}
            <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* বাম পাশে মেইন ট্যারিফ টেবিল/লিস্ট */}
                    <div className="lg:col-span-8 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-white overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
                                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 font-hind tracking-tight uppercase">
                                    অনুমোদিত রেট চার্ট
                                </h2>
                                <button className="flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                                    <Download size={18} /> PDF ডাউনলোড
                                </button>
                            </div>

                            {/* ট্যারিফ কার্ড লিস্ট (টেবিলের আধুনিক রূপ) */}
                            <div className="space-y-4">
                                {tariffs.map((plan, index) => (
                                    <motion.div
                                        key={plan.id}
                                        whileHover={{ x: 5 }}
                                        className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-[#BFFF00] transition-all duration-300 gap-6"
                                    >
                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#414b41] shadow-md border border-gray-100 shrink-0">
                                                <Zap size={24} className="group-hover:text-[#BFFF00]" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 font-hind">{plan.packageName}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.details}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto md:gap-16">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Speed</p>
                                                <p className="text-xl font-black text-[#414b41] italic">{plan.speed}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Charge</p>
                                                <p className="text-2xl font-black text-green-600">{plan.charge}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                                <Info className="text-blue-500 shrink-0" size={24} />
                                <p className="text-sm font-bold text-blue-900 leading-relaxed font-hind">
                                    বিটিআরসি এর নির্দেশনা অনুযায়ী "এক দেশ এক রেট" পলিসি অনুসারে এই ট্যারিফ নির্ধারিত। ভ্যাট (VAT) সরকারি নিয়ম অনুযায়ী প্রযোজ্য হতে পারে।
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* ডান পাশে লিগ্যাল সাইডবার */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="bg-[#414b41] w-14 h-14 rounded-2xl flex items-center justify-center text-[#BFFF00] mb-8 shadow-lg">
                                    <FileCheck size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase font-poppins mb-4 tracking-tight">Certification</h3>
                                <p className="text-slate-500 font-bold mb-8 font-hind leading-relaxed">
                                    সাইবারলিংক কমিউনিকেশন বিটিআরসি অনুমোদিত ক্যাটাগরি-এ আইএসপি লাইসেন্সধারী প্রতিষ্ঠান।
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <Check size={16} className="text-green-500" strokeWidth={4} />
                                        License No: 05-56175
                                    </div>
                                    <button className="w-full bg-[#414b41] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                                        BTRC Website <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* কানেকশন প্রম্পট */}
                        <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#BFFF00]/10 blur-[60px] rounded-full"></div>
                            <h4 className="text-xl font-black mb-4 font-poppins text-[#BFFF00]">Ready to Connect?</h4>
                            <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed font-hind">
                                আমাদের যেকোনো প্যাকেজ সম্পর্কে বিস্তারিত জানতে বা নতুন সংযোগ নিতে কল করুন।
                            </p>
                            <Link
                                href="/contact"
                                className="w-full bg-[#BFFF00] text-[#070b14] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#a6de00] transition-all shadow-lg flex items-center justify-center active:scale-95 shadow-[#BFFF00]/20"
                            >
                                নতুন সংযোগ নিন
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BtrcTariffPage;