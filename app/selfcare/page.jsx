"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import usePublicContent from '@/lib/usePublicContent';

export default function SelfcarePage() {
    const { data: selfcareData, loading } = usePublicContent("selfcare", {
        header: {},
        loginSection: { benefits: [] },
    });
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white font-hind selection:text-white selection:bg-orange-500 pb-24">
            
            {/* ১. ডার্ক হেডার সেকশন (সার্কিট ব্যাকগ্রাউন্ড লুক) */}
            <section className="relative h-[300px] lg:h-[400px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={selfcareData.header.bgImage} 
                        className="w-full h-full object-cover opacity-100" 
                        alt="Selfcare BG" 
                    />
                    
                </div>

                <div className="container mx-auto px-6 lg:px-20 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                        <h1  className="text-5xl lg:text-8xl font-black mb-4 text-white font-poppins tracking-tighter uppercase italic">
                            Login to <span className="text-blue-700">Selfcare</span>
                        </h1>
                        <p className="text-white text-lg lg:text-xl font-bold leading-relaxed font-hind  rounded-xl p-3 inline-block">
                            {selfcareData.header.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-10 relative z-20">
                
                {/* ২. মেইন লগইন কন্টেইনার (Split Layout) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-white rounded-[2.5rem] mt-[-60px]  border border-orange-200 overflow-hidden flex flex-col lg:flex-row"
                >
                    
                    {/* বাম পাশ: ওয়েলকাম এবং বেনিফিটস */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-orange-100 flex flex-col justify-center">
                        <h2 className="text-3xl lg:text-5xl font-black text-blue-600 mb-4 font-poppins">
                            {selfcareData.loginSection.welcomeTitle}
                        </h2>
                        <p className="text-slate-500 text-lg mb-10 font-medium">
                            {selfcareData.loginSection.welcomeDesc}
                        </p>

                        <div className="space-y-5">
                            <p className="text-xs font-black text-orange-400 uppercase tracking-widest ml-1 mb-4">Opportunity</p>
                            {selfcareData.loginSection.benefits.map((benefit, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="text-blue-500 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={20} strokeWidth={3} />
                                    </div>
                                    <span className="text-base lg:text-lg font-bold text-slate-700">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ডান পাশ: লগইন ফর্ম */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-16 bg-slate-50/30 flex flex-col justify-center">
                        <form className="space-y-8">
                            {/* Customer ID Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 font-poppins">Customer ID</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: 123456" 
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-lg font-bold font-poppins text-slate-800"
                                        onChange={(e) => setId(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 font-poppins">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="Type your password" 
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-lg font-bold font-poppins text-slate-800"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Login Button */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-95 text-xl font-poppins uppercase tracking-wider">
                                Login <ArrowRight size={24} strokeWidth={3} />
                            </button>

                            <div className="flex items-center justify-center gap-2 text-slate-400 mt-6">
                                <ShieldCheck size={16} className="text-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Protected by 256-bit encryption</span>
                            </div>
                        </form>
                    </div>

                </motion.div>
            </div>

        </div>
    );
}
