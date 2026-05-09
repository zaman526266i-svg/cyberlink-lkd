"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, Lock, Database, 
  UserCheck, Bell, ArrowRight, FileText 
} from 'lucide-react';
import PageBanner from '@/components/PageBanner';

const PrivacyPolicyPage = () => {
  // গোপনীয়তা নীতির ডাটা
  const privacyData = [
    {
      id: 1,
      title: "তথ্য সংগ্রহ",
      icon: <Eye className="text-[#BFFF00]" />,
      content: "আমরা যখন আমাদের সেবা প্রদান করি, তখন গ্রাহকের নাম, ফোন নম্বর, জাতীয় পরিচয়পত্র এবং বর্তমান ঠিকানার মতো প্রয়োজনীয় তথ্য সংগ্রহ করি। এছাড়াও টেকনিক্যাল সাপোর্টের জন্য আপনার রাউটার এবং আইপি অ্যাড্রেস সংক্রান্ত তথ্য প্রয়োজন হতে পারে।"
    },
    {
      id: 2,
      title: "তথ্যের ব্যবহার",
      icon: <Database className="text-[#BFFF00]" />,
      content: "আপনার তথ্যগুলো শুধুমাত্র মাসিক বিলিং, নতুন অফার প্রদান এবং টেকনিক্যাল সমস্যা সমাধানের জন্য ব্যবহার করা হয়। আমরা আপনার অনুমতি ছাড়া কোনো তৃতীয় পক্ষের কাছে তথ্য শেয়ার করি না।"
    },
    {
      id: 3,
      title: "নিরাপত্তা ব্যবস্থা",
      icon: <Lock className="text-[#BFFF00]" />,
      content: "গ্রাহকের তথ্য সুরক্ষায় আমরা সর্বোচ্চ স্তরের এনক্রিপশন এবং সিকিউরিটি ফায়ারওয়াল ব্যবহার করি। আমাদের ডাটাবেসে আপনার তথ্য সম্পূর্ণ এনক্রিপ্টেড অবস্থায় থাকে।"
    },
    {
      id: 4,
      title: "কুকিজ (Cookies) নীতি",
      icon: <ShieldCheck className="text-[#BFFF00]" />,
      content: "আমাদের ওয়েবসাইটে ইউজার এক্সপেরিয়েন্স ভালো করতে আমরা কুকিজ ব্যবহার করি। এটি আমাদের বুঝতে সাহায্য করে গ্রাহক সাইটের কোন অংশগুলো বেশি পছন্দ করছেন।"
    }
  ];

  return (
    <div className="min-h-screen font-hind pb-24 bg-gradient-to-br from-[#BFFF00] via-[#0e270e] to-[#2bd22b]">
      
      <PageBanner src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" alt="Privacy policy" align="left">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl lg:text-8xl font-black mb-4 text-white font-poppins tracking-tighter uppercase italic drop-shadow-lg">
            Privacy <span className="text-[#BFFF00]">Policy</span>
          </h1>
          <p className="text-gray-100 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl drop-shadow-md">
            আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করাই আমাদের প্রধান লক্ষ্য। আমরা কীভাবে আপনার ডাটা ম্যানেজ করি তা বিস্তারিত জেনে নিন।
          </p>
        </motion.div>
      </PageBanner>

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* বাম পাশে পলিসি কার্ডস */}
          <div className="lg:col-span-8 space-y-6">
            {privacyData.map((policy, index) => (
              <motion.div 
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-white group hover:border-[#BFFF00]/50 transition-all duration-500"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-4 bg-[#414b41] rounded-2xl group-hover:bg-[#BFFF00] group-hover:text-[#414b41] transition-all duration-500 shadow-xl text-white">
                    {policy.icon}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 font-hind tracking-tight">
                    {policy.title}
                  </h2>
                </div>
                <p className="text-slate-600 text-lg lg:text-xl leading-relaxed font-bold font-hind">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ডান পাশে স্টাইলিশ সাইডবার */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white"
            >
              <div className="flex items-center gap-3 mb-8">
                <Bell className="text-[#BFFF00]" size={24} />
                <h3 className="text-xl font-black text-slate-900 uppercase font-poppins">Updates</h3>
              </div>
              <p className="text-slate-500 font-bold mb-6 font-hind">
                সর্বশেষ আপডেট: জানুয়ারি ১৯, ২০২৬। আমরা যেকোনো সময় এই নীতিমালায় পরিবর্তন আনার অধিকার রাখি।
              </p>
              <button className="w-full bg-[#BFFF00] text-[#070b14] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#a6de00] transition-all shadow-lg active:scale-95">
                পুরো ফাইল ডাউনলোড করুন
              </button>
            </motion.div>

            {/* সাপোর্ট কার্ড */}
            <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#BFFF00]/5 blur-[60px] rounded-full"></div>
               <h4 className="text-xl font-black mb-4 font-poppins text-[#BFFF00] flex items-center gap-2">
                 <UserCheck size={20} /> Data Support
               </h4>
               <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed font-hind">
                  আপনার তথ্য সংক্রান্ত যেকোনো সংশোধনী বা প্রশ্নের জন্য সরাসরি আমাদের প্রাইভেসি টিমের সাথে যোগাযোগ করুন।
               </p>
               <a href="mailto:privacy@dotinternet.com" className="flex items-center gap-3 text-white font-black text-lg hover:text-[#BFFF00] transition-colors">
                 info@cyberlinkltd.com
               </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;