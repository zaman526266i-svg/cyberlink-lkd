"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Search, ChevronRight } from 'lucide-react';
import usePublicContent from '@/lib/usePublicContent';
import PageBanner from '@/components/PageBanner';

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
    return <div className="min-h-screen bg-[#020b18] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen font-hind pb-20 bg-slate-50 selection:text-[#082453] selection:bg-[#BFFF00]">
      
      <PageBanner src="/banner/article.png" alt="Tech articles cover" align="left">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl lg:text-7xl font-black mb-4 text-white font-poppins tracking-tighter uppercase italic drop-shadow-2xl">
            Tech <span className="text-[#BFFF00] drop-shadow-sm">Articles</span>
          </h1>
          <p className="text-slate-100 text-lg lg:text-xl font-medium max-w-xl leading-relaxed drop-shadow-md">
            {articlesData.header.description || "ইন্টারনেট জগত সম্পর্কে আরও জানুন। আমাদের টেকনিক্যাল টিম নিয়মিত আপনাদের জন্য প্রয়োজনীয় টিপস এবং গাইড শেয়ার করে থাকে।"}
          </p>
        </motion.div>
      </PageBanner>

      {/* ২. ক্যাটাগরি ও কন্টেন্ট সেকশন (Overlapping) */}
      <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-24 lg:-mt-28">
        
        {/* ক্যাটাগরি পিলস */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
          {articlesData.categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] 
              ${activeCategory === cat 
                ? 'bg-[#BFFF00] text-[#020b18] scale-105' 
                : 'bg-white text-[#0f172a] hover:bg-[#BFFF00] hover:text-[#020b18]'}`}
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col group h-full border border-slate-100 transition-all duration-300"
            >
              {/* আর্টিকেল ইমেজ */}
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={article.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={article.title} 
                />
                {/* ক্যাটাগরি ব্যাজ */}
                <div className="absolute top-5 left-5 bg-[#BFFF00] text-[#020b18] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {article.category}
                </div>
              </div>

              {/* আর্টিকেল টেক্সট */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-black text-[#0f172a] mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-8 flex-grow font-medium">
                  {article.excerpt}
                </p>

                {/* বাটন */}
                <div className="mt-auto">
                  <button className="w-full bg-[#f0f5ff] text-[#2563eb] hover:bg-[#BFFF00] hover:text-[#020b18] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-transparent">
                    আর্টিকেল পড়ুন
                    <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ৪. লোড মোর বাটন */}
        {filteredArticles.length > 0 && (
          <div className="mt-16 text-center">
            <button className="bg-white hover:bg-[#020b18] text-[#020b18] hover:text-white border-2 border-[#020b18]/10 hover:border-[#020b18] px-12 py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-xl uppercase tracking-tighter">
              আরও দেখুন
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ArticlesPage;