"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCcw, Wallet, Undo2, Clock, 
  ShieldCheck, HelpCircle, ArrowRight, PhoneCall 
} from 'lucide-react';

const RefundPolicyPage = () => {
  // রিফান্ড পলিসির ডাটা
  const refundData = [
    {
      id: 1,
      title: "সার্ভিস ক্যানসেলেশন",
      icon: <Undo2 className="text-[#BFFF00]" />,
      content: "গ্রাহক চাইলে যেকোনো সময় সার্ভিস বন্ধ করার অনুরোধ করতে পারেন। তবে মাসের মাঝামাঝি সময়ে সার্ভিস বন্ধ করলে ওই মাসের বিল ফেরতযোগ্য হবে না।"
    },
    {
      id: 2,
      title: "রিফান্ড পাওয়ার যোগ্যতা",
      icon: <Wallet className="text-[#BFFF00]" />,
      content: "যদি কোনো গ্রাহক ভুলবশত একই বিল দুইবার পে করে ফেলেন অথবা আমাদের কোনো যান্ত্রিক ত্রুটির কারণে দীর্ঘ সময় ইন্টারনেট বন্ধ থাকে, তবে তারা নির্দিষ্ট প্রমাণের ভিত্তিতে রিফান্ড দাবি করতে পারবেন।"
    },
    {
      id: 3,
      title: "রাউটার ও ইকুইপমেন্ট রিটার্ন",
      icon: <RefreshCcw className="text-[#BFFF00]" />,
      content: "আমাদের পক্ষ থেকে দেওয়া কোনো রাউটার বা ONU নষ্ট বা ত্রুটিপূর্ণ হলে ৭ দিনের মধ্যে তা পরিবর্তন বা রিটার্ন করা যাবে। তবে গ্রাহকের অবহেলার কারণে নষ্ট হলে তা গ্রহণযোগ্য হবে না।"
    },
    {
      id: 4,
      title: "প্রসেসিং সময়",
      icon: <Clock className="text-[#BFFF00]" />,
      content: "রিফান্ড রিকোয়েস্ট অনুমোদনের পর ৭ থেকে ১০ কর্মদিবসের মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক একাউন্টে টাকা পাঠিয়ে দেওয়া হবে।"
    }
  ];

  return (
    <div className="min-h-screen font-hind pb-24 bg-white">
      
      {/* ১. হেডার সেকশন */}
      <section className="relative h-[350px] lg:h-[450px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" 
            className="w-full h-full object-cover opacity-100" 
            alt="Refund Header" 
          />
          
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <h1 className="text-5xl lg:text-8xl font-black mb-6 text-slate-900 font-poppins tracking-tighter uppercase italic leading-none">
              Return & <span className="text-[#BFFF00]">Refund</span>
            </h1>
            <p className="text-slate-800 text-lg lg:text-xl font-medium leading-relaxed max-w-xl opacity-90 bg-white/70 rounded-xl p-3">
              আমাদের রিফান্ড এবং রিটার্ন পলিসি সম্পর্কে পরিষ্কার ধারণা নিন। গ্রাহক সন্তুষ্টিই আমাদের সর্বোচ্চ অগ্রাধিকার।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="container mx-auto px-4 lg:px-10 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* বাম পাশে রিফান্ড পলিসি কার্ডস */}
          <div className="lg:col-span-8 space-y-8">
            {refundData.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-white group hover:border-[#BFFF00]/50 transition-all duration-500"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-4 bg-[#414b41] rounded-2xl group-hover:bg-[#BFFF00] group-hover:text-[#414b41] transition-all duration-500 shadow-xl text-white">
                    {item.icon}
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-black text-slate-900 font-hind tracking-tight uppercase">
                    {item.title}
                  </h2>
                </div>
                <p className="text-slate-600 text-lg lg:text-xl leading-relaxed font-bold font-hind">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ডান পাশে কুইক হেল্প সাইডবার */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <HelpCircle className="text-orange-500" size={24} />
                  <h3 className="text-xl font-black text-slate-900 uppercase font-poppins">How to request?</h3>
                </div>
                <p className="text-slate-500 font-bold mb-8 font-hind leading-relaxed">
                  রিফান্ড বা রিটার্ন রিকোয়েস্ট করতে আপনার পেমেন্ট ইনভয়েস সহ আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।
                </p>
                <button className="w-full bg-[#BFFF00] text-[#070b14] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#a6de00] transition-all shadow-lg shadow-[#BFFF00]/20 flex items-center justify-center gap-2 active:scale-95">
                  Request Refund <ArrowRight size={18} />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-1000"></div>
            </motion.div>

            {/* সাপোর্ট কন্টাক্ট কার্ড */}
            <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent opacity-50"></div>
               <h4 className="text-xl font-black mb-4 font-poppins text-[#BFFF00] flex items-center gap-2">
                 <PhoneCall size={20} /> 24/7 Helpline
               </h4>
               <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed font-hind">
                  জরুরী প্রয়োজনে আমাদের বিলিং ডিপার্টমেন্টে সরাসরি কথা বলুন।
               </p>
               <div className="space-y-4">
                  <div className="text-2xl font-black text-white font-poppins tracking-tighter hover:text-[#BFFF00] transition-colors cursor-pointer">
                    09638 121 121
                  </div>
                  <div className="text-sm font-bold text-gray-400 font-poppins">
                    billing@cyberlinkcomuinication.com
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
