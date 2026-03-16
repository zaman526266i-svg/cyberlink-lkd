"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Users, BarChart3, Settings, 
  ShieldCheck, Zap, Globe, Cpu, ArrowRight, MessageSquare 
} from 'lucide-react';

const ErpyPage = () => {
    // --- ERP মডিউল ডাটা ---
    const erpModules = [
        {
            id: 1,
            title: "Billing Management",
            desc: "সম্পূর্ণ অটোমেটেড বিলিং সিস্টেম যা আপনার ইনভয়েস এবং পেমেন্ট ট্র্যাক করবে নিখুঁতভাবে।",
            icon: <BarChart3 size={32} />
        },
        {
            id: 2,
            title: "Customer Portal",
            desc: "গ্রাহকদের জন্য ডেডিকেটেড সেলফ-সার্ভিস পোর্টাল যা ইউজার এক্সপেরিয়েন্স বাড়াবে অনেকগুণ।",
            icon: <Users size={32} />
        },
        {
            id: 3,
            title: "Inventory Control",
            desc: "আপনার স্টকের প্রতিটি রাউটার, ক্যাবল এবং হার্ডওয়্যারের রিয়েল-টাইম ডাটা মেইনটেইন করুন।",
            icon: <Database size={32} />
        },
        {
            id: 4,
            title: "Network Monitor",
            desc: "সিস্টেমের যেকোনো ত্রুটি বা ডাউন-টাইম মুহূর্তের মধ্যে ডিটেক্ট করার স্মার্ট সলিউশন।",
            icon: <Cpu size={32} />
        },
        {
            id: 5,
            title: "Master Admin",
            desc: "একজন সুপার কন্ট্রোলার থেকে ইউজার রোল, অনুমতি এবং সব মডিউলের অ্যাক্সেস কেন্দ্রীয়ভাবে ম্যানেজ করুন।",
            icon: <Settings size={32} />
        }
    ];

    return (
        <div className="min-h-screen  bg-white font-hind selection:text-white selection:bg-blue-600">
            
            {/* ১. লাক্সারি হেডার সেকশন */}
            <section className="relative h-[450px] lg:h-[550px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" 
                        className="w-full h-full object-cover " 
                        alt="ERP Header" 
                    />
                    
                </div>

                <div className="container mx-auto px-6  lg:px-20 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-block px-4 py-1 bg-blue-600 text-white rounded-lg text-xs font-black mb-6 tracking-[0.3em] font-poppins uppercase shadow-lg shadow-blue-600/20">
                            The Next-Gen ERP
                        </div>
                        <h1 className="text-5xl lg:text-9xl font-black mb-6 text-white font-poppins tracking-tighter uppercase italic leading-none">
                            ERP System
                        </h1>
                        
                    </motion.div>
                </div>
            </section>

            <div className="container py-10 mx-auto px-4 lg:px-10 relative z-20">
                
                {/* ২. ইন্ট্রো কার্ড */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-10 lg:p-16 -mt-20 shadow-[0_40px_100px_rgba(124,45,18,0.15)] border border-blue-200 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12"
                >
                    <div className="lg:w-2/3">
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 font-poppins tracking-tight">
                            Efficient Management <br />
                            <span className="text-blue-600">Without Compromise</span>
                        </h2>
                        <p className="text-slate-500 text-lg lg:text-xl font-medium leading-relaxed">
                            ERP শুধু একটি সফটওয়্যার নয়, এটি আপনার ব্যবসার প্রতিটি ধাপকে সহজতর করার একটি মাধ্যম। বিলিং থেকে শুরু করে সাপোর্ট এবং ইনভেন্টরি—সবকিছুই এখন হাতের মুঠোয়।
                        </p>
                    </div>
                    <div className="lg:w-1/3 flex justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-4">
                            GET DEMO <ArrowRight size={24} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>

                {/* ৩. মডিউল গ্রিড (৩ডি হোভার ইফেক্ট) */}
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-6xl font-black text-text-blue-300 mb-4 font-poppins uppercase tracking-tighter">Core <span className="text-blue-600">Modules</span></h2>
                        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full shadow-[0_0_20px_#ea580c]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {erpModules.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="bg-white border border-blue-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col items-center text-center"
                            >
                                <div className="mb-8 p-6 rounded-3xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 font-poppins uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm lg:text-base font-medium leading-relaxed mb-8 flex-grow">
                                    {item.desc}
                                </p>
                                <div className="w-12 h-1 bg-blue-100 rounded-full group-hover:w-full group-hover:bg-blue-500 transition-all duration-700"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ৪. ফিচার লিস্ট সেকশন (স্লিম প্রিমিয়াম ডিজাইন) */}
                <section className="mt-32 bg-[#111827] rounded-[4rem] p-10 lg:p-20 text-white relative overflow-hidden">
                    {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-7xl font-black mb-8 font-poppins tracking-tighter uppercase leading-none">
                                Why Choose <br />
                                <span className="text-blue-500 italic">ERP?</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { t: "Highly Secured", desc: "আমরা ব্যবহার করি লেটেস্ট এনক্রিপশন টেকনোলজি আপনার ডাটা সুরক্ষায়।", icon: <ShieldCheck /> },
                                    { t: "Lightning Fast", desc: "অপ্টিমাইজড ডাটাবেস এর মাধ্যমে কোনো ল্যাগ ছাড়াই সুপার ফাস্ট পারফরম্যান্স।", icon: <Zap /> },
                                    { t: "Global Access", desc: "পৃথিবীর যেকোনো প্রান্ত থেকে যেকোনো ডিভাইসে অ্যাক্সেস করার সুবিধা।", icon: <Globe /> }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black font-poppins mb-1">{feature.t}</h4>
                                            <p className="text-gray-400 font-medium">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-4 backdrop-blur-md shadow-2xl relative">
                            <img 
                                src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" 
                                alt="Dashboard Preview" 
                                className="w-full h-auto rounded-[2.5rem] opacity-80" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-[2.5rem]"></div>
                        </div>
                    </div>
                </section>

                {/* ৫. লাস্ট CTA (Contact Section) */}
                <div className="mt-32 text-center max-w-4xl mx-auto">
                    <div className="bg-white border border-blue-200 rounded-[3rem] p-10 lg:p-20 shadow-2xl shadow-blue-950/5">
                        <MessageSquare size={48} className="mx-auto text-blue-600 mb-6 animate-bounce" />
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-950 mb-6 font-poppins">Need a Custom <span className="text-blue-600">Solution?</span></h2>
                        <p className="text-slate-500 text-lg lg:text-xl font-bold mb-10 leading-relaxed">
                            আপনার ব্যবসার ধরণ অনুযায়ী আমাদের ERP কাস্টমাইজ করে নিতে পারেন। আমাদের বিশেষজ্ঞ টিমের সাথে আজই কথা বলুন।
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95">Contact Sales</button>
                            <button className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95">Pricing Details</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ErpyPage;

