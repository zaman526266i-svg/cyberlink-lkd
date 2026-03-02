"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Search, ChevronRight } from 'lucide-react';
import usePublicContent from '@/lib/usePublicContent';

const ArticlesPage = () => {
  const { data: articlesData, loading } = usePublicContent("articles", {
    header: {},
    categories: [],
    articles: [],
  });
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All" 
    ? articlesData.articles 
    : articlesData.articles.filter(art => art.category === activeCategory);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen font-hind py-3 bg-white selection:text-white selection:bg-orange-500">
      
      {/* ১. প্রিমিয়াম হেডার সেকশন */}
      <section className="relative h-[350px] lg:h-[450px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            src={articlesData.header.bgVideo} 
            autoPlay muted loop playsInline 
            className="w-full h-full object-cover opacity-100" 
          />
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative z-10 pt-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <h1 className="text-5xl lg:text-8xl font-black mb-6 text-slate-900 font-poppins tracking-tighter uppercase italic">
              Tech <span className="text-[#BFFF00]">Articles</span>
            </h1>
            <p className="text-slate-800 text-lg lg:text-xl font-medium leading-relaxed max-w-xl opacity-90 bg-white/70 rounded-xl p-3">
              {articlesData.header.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ২. ক্যাটাগরি ও কন্টেন্ট সেকশন */}
      <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-12 lg:-mt-16">
        
        {/* ক্যাটাগরি পিলস */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12">
          {articlesData.categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg 
              ${activeCategory === cat 
                ? 'bg-[#BFFF00] text-[#070b14] scale-105 shadow-[#BFFF00]/20' 
                : 'bg-white text-slate-600 hover:bg-[#BFFF00]/10 hover:text-[#BFFF00] border border-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ৩. আর্টিকেল কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group h-full border border-white"
            >
              {/* আর্টিকেল ইমেজ */}
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={article.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={article.title} 
                />
                {/* ক্যাটাগরি ব্যাজ */}
                <div className="absolute top-5 left-5 bg-[#BFFF00] text-[#070b14] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {article.category}
                </div>
              </div>

              {/* আর্টিকেল টেক্সট */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 group-hover:text-[#BFFF00] transition-colors leading-tight tracking-tight">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-8 flex-grow font-medium">
                  {article.excerpt}
                </p>

                {/* বাটন */}
                <div className="mt-auto">
                  <button className="w-full bg-slate-50 text-slate-900 hover:bg-[#BFFF00] hover:text-[#070b14] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-slate-100">
                    আর্টিকেল পড়ুন
                    <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ৪. লোড মোর বাটন (যদি অনেক থাকে) */}
        {filteredArticles.length > 0 && (
          <div className="mt-16 text-center">
            <button className="bg-white/10 hover:bg-[#BFFF00] text-[#BFFF00] hover:text-[#070b14] border-2 border-[#BFFF00]/50 px-12 py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-xl uppercase tracking-tighter">
              আরও দেখুন
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ArticlesPage;
