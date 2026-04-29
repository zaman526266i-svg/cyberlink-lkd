"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowRight, 
  ShieldCheck,
  ChevronRight 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // --- সব পেজের সঠিক Path এখানে সেট করা হলো ---
  const footerColumns = [
    {
      title: "COMPANY",
      links: [
        { name: "About us", href: "/about" },
        { name: "Pricing", href: "/pricing" },
        { name: "Coverage area", href: "/coverage" },
        { name: "Bill Payment", href: "/pay-bill" }
      ]
    },
    {
      title: "SUPPORT",
      links: [
        { name: "How to Pay", href: "/pay-bill" },
        { name: "Self-care", href: "/selfcare" },
        { name: "Articles", href: "/articles" }, 
        { name: "Contact us", href: "/contact" }
      ]
    },
    {
      title: "QUICK LINKS",
      links: [
        { name: "Join Group", href: "https://facebook.com" }, 
        { name: "Like our Page", href: "https://facebook.com" },
        { name: "ERP", href: "/erp" },
        { name: "Pay Service", href: "/pay-service" }
      ]
    },
    {
      title: "LEGAL",
      links: [
        { name: "Terms & Conditions", href: "/terms" }, 
        { name: "Privacy Policy", href: "/privacy" },   
        { name: "Return & Refund", href: "/refund" },   
        { name: "BTRC Approved Tariff", href: "/btrc-tariff" } 
      ]
    }
  ];

  const paymentLogos = [
    "https://i.ibb.co.com/RRJzQty/p1.png",
    "https://i.ibb.co.com/RT7PPcFd/p2.png",
    "https://i.ibb.co.com/d094mm7M/p3.png",
    "https://i.ibb.co.com/FqD7j0P0/p4.png",
    "https://i.ibb.co.com/rGdg9Lvc/p5.png",
    "https://i.ibb.co.com/q3JtsCL9/p6.png",
    "https://i.ibb.co.com/QjY6dtfz/p7.png",
    "https://i.ibb.co.com/k2gM79Rd/p8.png"
  ];

  return (
    <footer className="relative bg-[#021833] pt-24 pb-12 overflow-hidden border-t border-orange-500/10 font-hind">
      
      {/* ব্যাকগ্রাউন্ড ইমেজ ও ওভারলে */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" 
          alt="Footer Background" 
          className="w-full h-full object-cover opacity-30 brightness-110 contrast-125" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#070b14]/80 to-[#070b14]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-1 bg-orange-600/30 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        
        {/* টপ সেকশন: লোগো ও নিউজলেটার */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="mb-8">
              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
                <div className="relative h-14 w-52 md:h-16 md:w-64">
                   <Image src="/Navlogo/logo (2).png" alt="Cyberlink Logo" fill className="object-contain" priority />
                </div>
              </Link>
            </motion.div>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-md font-medium">
              আমরা দিচ্ছি বাংলাদেশের অন্যতম দ্রুতগতির ব্রডব্যান্ড ইন্টারনেট এবং নেটওয়ার্ক সলিউশন। 
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} fill="currentColor" />, link: "#", color: "hover:bg-blue-600" },
                { icon: <Youtube size={20} fill="currentColor" />, link: "#", color: "hover:bg-red-600" },
                { icon: <Instagram size={20} />, link: "#", color: "hover:bg-pink-600" },
                { icon: <Linkedin size={20} fill="currentColor" />, link: "#", color: "hover:bg-blue-700" },
              ].map((social, index) => (
                <motion.a key={index} href={social.link} whileHover={{ y: -8, scale: 1.1 }} className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all shadow-xl ${social.color}`}>
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
              <h3 className="text-3xl font-black text-white mb-4 font-hind uppercase tracking-tighter">নিউজলেটারে সাবস্ক্রাইব করুন</h3>
              <p className="text-gray-400 mb-10 text-lg font-medium">সর্বশেষ আপডেট পেতে আপনার ইমেইল দিন।</p>
              <form className="relative flex flex-col sm:flex-row gap-4">
                <input type="email" placeholder="আপনার ইমেইল..." className="flex-grow bg-white/10 border border-white/10 rounded-2xl py-5 px-8 text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none" />
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-3">
                  <span>Send</span> <Send size={22} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* মিডল সেকশন: ডাইনামিক লিংক গ্রিড */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 border-t border-white/5 pt-20">
          {footerColumns.map((column, idx) => (
            <div key={idx} className="space-y-8">
              <h4 className="text-orange-500 font-black text-[11px] tracking-[0.3em] uppercase font-poppins flex items-center gap-2">
                <span className="w-6 h-[1px] bg-orange-500/50"></span>
                {column.title}
              </h4>
              <ul className="space-y-5">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-all duration-300 text-base font-bold flex items-center group font-hind"
                    >
                      <ChevronRight size={14} className="text-orange-600 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* কন্টাক্ট ও পেমেন্ট */}
        <div className="flex flex-col lg:flex-row justify-between items-center py-16 border-t border-white/5 gap-12">
          <div className="flex flex-wrap justify-center lg:justify-start gap-8">
            {[
              { icon: <Phone size={18} />, text: "09617888896", label: "Helpline" },
              { icon: <Mail size={18} />, text: "info@cyberlinkltd.com", label: "Email" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 p-4 pr-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group shadow-xl">
                <div className="p-3 rounded-xl bg-orange-600 text-white shadow-lg">{item.icon}</div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1 font-poppins">{item.label}</p>
                  <span className="text-base font-bold text-gray-200">{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 bg-white p-5 lg:p-6 rounded-[2.5rem] shadow-2xl flex-wrap justify-center">
           <Image src="/SSL.jpeg" alt="Payment Methods" width={400} height={40} className="object-contain" />
      </div>
        </div>

        {/* কপিরাইট বক্স */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:left-[100%] transition-all duration-1000"></div>
          <div className="text-center md:text-left relative z-10">
            <p className="text-gray-200 text-sm lg:text-lg font-bold font-poppins uppercase">
              © {currentYear} <span className="text-orange-500 italic tracking-tighter">CYBERLINK COMMUNICATION</span>. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2 font-medium font-hind">
              Secured with <ShieldCheck size={12} className="inline text-green-500" /> 256-bit Encryption | Developed by <span className="text-orange-500 font-bold hover:underline cursor-pointer">Optimus Technologies</span>
            </p>
          </div>
          <div className="flex gap-10 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] font-poppins relative z-10">
            <span>Stability</span><span>Security</span><span>Speed</span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;