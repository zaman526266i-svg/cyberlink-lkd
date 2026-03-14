"use client";
import React from "react";
import { motion } from "framer-motion";
import usePublicContent from "@/lib/usePublicContent";

export default function AboutPage() {
const { data: aboutData, loading } = usePublicContent("about", {
 aboutHeader: {},
 mainDescription: "",
 missionVision: [],
 partners: [],
 });

 if (loading) {
 return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;
 }

 return (
 <div
 className="min-h-screen   font-hind selection:text-white selection:bg-cyan-600"
 >
 <section className="relative h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
<img
 src="/header/about-section.png"
 alt="About banner"
 className="absolute inset-0 w-full h-full object-cover opacity-100"
 />


 <div className="relative z-10 text-center px-6">
 <motion.h1
initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-5xl lg:text-8xl font-black italic tracking-tighter text-white 
  drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] font-poppins uppercase  rounded-xl px-5 py-2 inline-block"
 >
 {aboutData.aboutHeader.title}
<div className="w-24 h-1.5 bg-cyan-400 mx-auto mt-4 rounded-full" />
</motion.h1>
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: "120px" }}
 className="h-2 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.35)]"
 />
 </div>
 </section>

<div className="container mx-auto px-6 lg:px-20 -mt-20 relative z-20">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
className="bg-white/95 backdrop-blur-xl border border-cyan-100 p-8 lg:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(103,232,249,0.1)] mb-16"
 >
 <p className="text-slate-700 text-lg lg:text-2xl leading-relaxed text-center max-w-5xl mx-auto font-medium">
 {aboutData.mainDescription}
</p>

 <div className="mt-12 flex justify-center">
 <div className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm lg:text-lg tracking-widest font-poppins shadow-lg shadow-cyan-600/30 uppercase italic">
{aboutData.aboutHeader.license}
 </div>
 </div>
</motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
 {aboutData.missionVision.map((item, i) => (
 <motion.div
key={i}
 whileHover={{ y: -10 }}
          
 className="bg-white/70 backdrop-blur-md border border-cyan-100 p-12 rounded-[2.5rem] shadow-xl group hover:border-blue-500 transition-all duration-500 relative overflow-hidden"
 >
            {/* ২. প্যাটার্ন ইমেজ ব্যবহার (ঐচ্ছিক) */}
            <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url('/bg/card_pattern.png')` }}
            />

 <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-50 rounded-full group-hover:scale-150 transition-transform" />

 <h3 className="text-3xl lg:text-4xl font-black text-blue-600 mb-6 font-poppins italic uppercase tracking-tighter">
</h3>
<p className="text-slate-600 text-lg lg:text-xl leading-relaxed font-bold relative z-10">{item.desc}</p>
</motion.div>
))}
 </div>

    {/* ৪. Partners সেকশনে একটি হালকা রেডিয়াল ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট */}
 <div className="text-center relative py-16 px-10 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0,rgba(255,255,255,1)_60%)]">
 <h2 className="text-4xl lg:text-6xl font-black mb-4 font-poppins text-slate-900 tracking-tight">
 Partners & <span className="text-blue-600">Members</span>
 </h2>
 <div className="w-24 h-1.5 bg-blue-600 mx-auto mb-16 rounded-full" />

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 relative z-10">
 {aboutData.partners.map((partner, i) => (
 <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="relative group">
            {/* ৫. Partners গ্লো কালার Cyan করা হয়েছে */}
<div className="absolute inset-0 bg-cyan-500/10 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

<div className="relative z-10 bg-white border border-cyan-100 p-8 h-32 lg:h-40 rounded-[2.5rem] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-400">
<img
 src={partner.logo}
 alt={partner.name}
className="h-10 lg:h-14 w-auto object-contain transition-all duration-500"
 />
 </div>
 </motion.div>
))}
 </div>
</div>
 </div>
</div>
);
}
