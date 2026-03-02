"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, Smartphone, ArrowRight, User, ChevronRight, CheckCircle2
} from 'lucide-react';
import usePublicContent from '@/lib/usePublicContent';

export default function PayBillPage() {
    const { data: payBillData, loading } = usePublicContent("payBill", {
        paymentMethods: [],
        banks: [],
    });
    const [customerId, setCustomerId] = useState("");

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen my-4 bg-white font-hind selection:text-white selection:bg-blue-600">

            {/* ১. হেডার সেকশন - প্যাডিং কমিয়ে চওড়া করা হয়েছে */}
            <section className="relative h-[250px] lg:h-[350px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg"
                        className="w-full h-full object-cover opacity-50"
                        alt="Pay Bill Header"
                    />
                    
                </div>

                <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl">
                        <h1 className="text-4xl lg:text-6xl font-black mb-3 text-slate-900 font-poppins tracking-tight uppercase">
                            How to <span className="text-blue-700">Pay?</span>
                        </h1>
                        <p className="text-slate-800 text-base lg:text-lg font-medium leading-relaxed font-hind opacity-90 bg-white/70 rounded-xl p-3 inline-block">
                            সহজ কিছু ধাপ অনুসরণ করে আপনার মাসিক ইন্টারনেট বিল পরিশোধ করুন।
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* মেইন কন্টেইনার - গ্যাপ কমিয়ে চওড়া (max-w-[1400px]) করা হয়েছে */}
            <div className="max-w-[1400px] mx-auto px-4 lg:px-6 relative z-20">

                {/* ২. কুইক পে কার্ড */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-6 lg:p-8 -mt-12 shadow-[0_15px_40px_rgba(124,45,18,0.1)] border border-blue-200/50"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-2 text-blue-600">
                                <CreditCard size={28} strokeWidth={2.5} />
                                <h2 className="text-xl font-black uppercase tracking-tight font-poppins">Quick Pay</h2>
                            </div>
                            <p className="text-slate-500 text-sm font-medium font-hind">আইডি দিন এবং দ্রুত বিল পরিশোধ করুন।</p>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-grow relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Ex: 123456"
                                        className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-all text-base font-bold font-poppins"
                                        onChange={(e) => setCustomerId(e.target.value)}
                                    />
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap font-poppins text-sm">
                                    Pay Now <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ৩. পেমেন্ট গাইডসমূহ - চওড়া এবং স্মার্ট কার্ড */}
                <div className="mt-20 space-y-12">
                    {payBillData.paymentMethods.map((method, index) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-blue-200/50"
                        >
                            <div className={`flex flex-col lg:flex-row items-stretch ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6 lg:p-10 border-b lg:border-b-0 border-blue-100">
                                    <img
                                        src={method.appImage}
                                        className="max-w-full h-auto max-h-[380px] object-contain drop-shadow-2xl rounded-2xl"
                                        alt={method.name}
                                    />
                                </div>

                                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black mb-4 tracking-[0.2em] font-poppins uppercase w-fit">
                                        Instruction Guide
                                    </div>
                                    <h2 className="text-2xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight font-hind">
                                        পেমেন্ট করুন <span className="text-blue-600">{method.name}</span> দিয়ে
                                    </h2>
                                    <div className="space-y-2">
                                        {method.steps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 lg:p-3 bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-200 transition-all group">
                                                <span className="w-7 h-7 lg:w-8 lg:h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center font-black shrink-0 shadow-sm border border-blue-100 text-xs lg:text-sm font-poppins">{i + 1}</span>
                                                <p className="text-sm lg:text-base font-bold text-slate-700 leading-tight font-hind">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ৪. কার্ড পেমেন্ট সেকশন - চওড়া করা হয়েছে */}
                <section className="mt-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full bg-white rounded-[2.5rem] p-8 lg:p-14 shadow-2xl relative overflow-hidden group border border-blue-200/50"
                    >
                        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full pointer-events-none z-0">
                            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[300px] h-[200px] lg:w-[550px] lg:h-[350px] bg-blue-50/40 rounded-[2.5rem] border border-blue-100 rotate-[-8deg] group-hover:rotate-0 transition-transform duration-1000"></div>
                        </div>

                        <div className="relative z-10 w-full lg:w-3/5">
                            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 mb-8 font-poppins tracking-tight leading-tight">
                                Want to pay with <span className="text-blue-600">Master/Visa</span> card?
                            </h2>
                            <div className="flex items-center gap-4 mb-10">
                                <input type="checkbox" id="visa-pay-terms" className="w-6 h-6 rounded-md border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all" />
                                <label htmlFor="visa-pay-terms" className="text-sm lg:text-base text-slate-600 font-medium font-hind">
                                    I read and agreed to the <span className="text-blue-600 font-bold mx-1 cursor-pointer hover:underline transition-all">Terms conditions</span>, <span className="text-blue-600 font-bold mx-1 cursor-pointer hover:underline transition-all">Return & refund</span> & <span className="text-blue-600 font-bold mx-1 cursor-pointer hover:underline transition-all">Privacy policy</span>
                                </label>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-4.5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)] flex items-center gap-3 active:scale-95 whitespace-nowrap font-poppins text-lg uppercase tracking-widest">
                                Pay Now <ArrowRight size={22} strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* ৫. ব্যাংক সেকশন - স্লিম এবং স্মার্ট কার্ড ডিজাইন */}
                <div className="mt-24">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-3 font-poppins uppercase tracking-tighter">
                            Bank <span className="text-blue-600">Transfer</span>
                        </h2>
                        <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_#ea580c]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {payBillData.banks.map((bank) => (
                            <motion.div
                                key={bank.id}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-lg border border-blue-50 hover:border-blue-500 transition-all group flex flex-col justify-between"
                            >
                                {/* উপরের অংশ: লোগো ও টাইটেল */}
                                <div>
                                    <div className="bg-blue-50/50 p-2.5 rounded-xl mb-4 w-fit group-hover:bg-blue-600 transition-colors duration-300">
                                        <img
                                            src={bank.logo}
                                            className="h-6 w-auto object-contain group-hover:brightness-200 group-hover:contrast-200"
                                            alt={bank.bankName}
                                        />
                                    </div>
                                    <h3 className="text-lg font-black mb-5 text-slate-900 font-poppins uppercase tracking-tight leading-none">
                                        {bank.bankName}
                                    </h3>
                                </div>

                                {/* নিচের অংশ: ব্যাংক ইনফরমেশন (গ্যাপ কমিয়ে স্লিম করা হয়েছে) */}
                                <div className="space-y-2.5">
                                    {[
                                        { label: "Account Name", value: bank.accountName },
                                        { label: "Account No", value: bank.accountNo },
                                        { label: "Routing No", value: bank.routing },
                                        { label: "Branch", value: bank.branch }
                                    ].map((info, idx) => (
                                        <div key={idx} className="flex flex-col border-b border-blue-50/50 pb-1">
                                            <span className="text-[9px] uppercase font-black text-blue-400 tracking-widest font-poppins">
                                                {info.label}
                                            </span>
                                            <span className="text-xs font-bold text-slate-600 uppercase font-hind">
                                                {info.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

