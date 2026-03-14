"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, Clock, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

const TermsPage = () => {
  // শর্তাবলীর ডাটা
  const termsData = [
    {
      id: 1,
      title: "সাধারণ নিয়মাবলী",
      icon: <BookOpen className="text-orange-600" />,
      points: [
        "গ্রাহককে অবশ্যই আমাদের সার্ভিস এরিয়াতে থাকতে হবে।",
        "সংযোগ নেওয়ার সময় সঠিক তথ্য (নাম, ফোন, এনআইডি) প্রদান করতে হবে।",
        "একটি সংযোগ শুধুমাত্র একটি পরিবার বা অফিসের জন্য প্রযোজ্য।"
      ]
    },
    {
      id: 2,
      title: "বিল পরিশোধ সংক্রান্ত",
      icon: <Clock className="text-orange-600" />,
      points: [
        "প্রতি মাসের বিল পরবর্তী মাসের ৭ তারিখের মধ্যে পরিশোধ করতে হবে।",
        "বিল বকেয়া থাকলে নোটিশ ছাড়াই সংযোগ বিচ্ছিন্ন করার অধিকার কোম্পানি রাখে।",
        "অনলাইন পেমেন্ট (বিকাশ, নগদ, কার্ড) বা সরাসরি ব্যাংক ট্রান্সফার গ্রহণযোগ্য।"
      ]
    },
    {
      id: 3,
      title: "নিষিদ্ধ ব্যবহার",
      icon: <ShieldAlert className="text-red-500" />,
      points: [
        "ইন্টারনেট ব্যবহার করে কোনো বেআইনি বা অসামাজিক কাজ করা যাবে না।",
        "ব্যান্ডউইথ রিসেলিং বা পুনরায় বিক্রি করা সম্পূর্ণ নিষিদ্ধ।",
        "অন্যের প্রাইভেসি নষ্ট হয় এমন কোনো কাজে আমাদের নেটওয়ার্ক ব্যবহার করা যাবে না।"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFFF00] via-[#0e270e] to-[#2bd22b] text-slate-800 font-hind pb-24">
      
      {/* ১. হেডার সেকশন */}
      <section className="relative h-[300px] lg:h-[400px] flex items-center overflow-hidden bg-[#070b14]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" 
            className="w-full h-full object-cover opacity-30 brightness-110" 
            alt="Terms Header" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <h1 className="text-4xl lg:text-7xl font-black mb-4 text-white font-poppins tracking-tighter uppercase italic">
              Terms & <span className="text-orange-500">Conditions</span>
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl font-medium leading-relaxed font-hind">
              সাইবারলিংক কমিউনিকেশন এর সেবা ব্যবহারের ক্ষেত্রে গ্রাহক এবং আমাদের মধ্যকার আইনি শর্তাবলী ও নিয়মসমূহ।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ২. মেইন কন্টেন্ট সেকশন */}
      <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* বাম পাশে মেইন শর্তাবলী */}
          <div className="lg:col-span-8 space-y-8">
            {termsData.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-orange-200 group"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 font-hind uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.points.map((point, i) => (
                    <div key={i} className="flex gap-4 group/item">
                      <div className="mt-1.5 shrink-0">
                        <CheckCircle2 size={18} className="text-orange-500 opacity-60 group-hover/item:opacity-100" />
                      </div>
                      <p className="text-lg font-bold text-slate-600 leading-relaxed font-hind group-hover/item:text-slate-900 transition-colors">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ডান পাশে কুইক ইনফো/লিঙ্কস */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 border border-orange-200 shadow-xl"
            >
              <h3 className="text-xl font-black text-slate-900 mb-6 font-poppins uppercase tracking-widest border-b border-orange-100 pb-4">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-orange-600/20">
                  Join with Us <ArrowRight size={20} />
                </button>
                <button className="w-full border-2 border-orange-100 text-orange-600 py-4 rounded-2xl font-black hover:border-orange-500 transition-all flex items-center justify-center gap-3">
                  Download PDF
                </button>
              </div>
            </motion.div>

            <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800">
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               <h4 className="text-xl font-black mb-4 font-poppins text-orange-500">Need Help?</h4>
               <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed font-hind">
                  শর্তাবলী নিয়ে কোনো প্রশ্ন থাকলে আমাদের ২৪/৭ কাস্টমার কেয়ারে যোগাযোগ করুন।
               </p>
               <div className="flex items-center gap-3 text-white font-black text-lg font-poppins">
                  <Globe className="text-orange-500 animate-spin-slow" size={20} />
                  09638 121 121
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;