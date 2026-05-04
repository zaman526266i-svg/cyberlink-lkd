"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Send, 
  User, MessageSquare, Tag, Globe 
} from 'lucide-react';
import usePublicContent from '@/lib/usePublicContent';

export default function ContactPage() {
    const { data: contactData, loading } = usePublicContent("contact", {
        header: {},
        info: { phones: [], enquiries: [] },
    });

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white font-hind selection:text-white selection:bg-blue-600">
            
            {/* ১. হেডার সেকশন - নীল/ডার্ক ওভারলেসহ (ভিডিওর সাথে মিল রেখে) */}
            <section className="relative h-[300px] lg:h-[450px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="header/contact-us.jpg"
                        alt="Contact banner"
                        className="w-full h-full object-cover opacity-100"
                    />
                </div>

               
            </section>

            <div className="container mx-auto px-4 lg:px-10 relative z-20">
                
                {/* ২. মেইন কন্টাক্ট কন্টেইনার (Split Card) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-white rounded-[2.5rem] mt-[-60px] shadow-[0_30px_70px_rgba(124,45,18,0.15)] border border-blue-200 overflow-hidden flex flex-col lg:flex-row"
                >
                    
                    {/* বাম পাশ: কন্টাক্ট ইনফরমেশন (ডার্ক ব্লু থিম) */}
                    <div className="w-full lg:w-[35%] bg-[#1a2235] p-8 lg:p-12 text-white relative overflow-hidden">
                        {/* গ্রাফিক ডেকোরেশন */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full"></div>
                        
                        <h2 className="text-2xl lg:text-3xl font-black mb-10 flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                            {contactData.info.title}
                        </h2>

                        <div className="space-y-8 relative z-10">
                            {/* ফোন */}
                            <div className="flex gap-5">
                                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 shrink-0"><Phone size={24} /></div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Phone Numbers</p>
                                    {contactData.info.phones.map((p, i) => (
                                        <p key={i} className="text-lg font-bold hover:text-blue-400 cursor-pointer transition-colors">{p}</p>
                                    ))}
                                </div>
                            </div>

                            {/* ইমেইল */}
                            <div className="flex gap-5">
                                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 shrink-0"><Mail size={24} /></div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">General Email</p>
                                    <p className="text-lg font-bold hover:text-blue-400 cursor-pointer transition-colors">{contactData.info.email}</p>
                                </div>
                            </div>
                            <div>
                                <p>Mailing Address : House-44, Word No-32, Vill-Baliwara, National University, Gazipur</p>
                            </div>

                            {/* এনকোয়ারি লিস্টসমূহ */}
                            <div className="pt-6 space-y-5 border-t border-white/5">
                                {contactData.info.enquiries.map((enq, i) => (
                                    <div key={i} className="group">
                                        <p className="text-blue-400 text-xs font-black uppercase tracking-wider mb-1">{enq.label}</p>
                                        <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{enq.email}</p>
                                    </div>
                                ))}
                            </div>

                            {/* সোশ্যাল লিংকস */}
                            <div className="pt-8 flex gap-4">
                                <button className="flex-grow bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all text-sm">Message Us</button>
                                <button className="px-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all flex items-center justify-center"><Globe size={20} /></button>
                            </div>
                            
                        </div>
                    </div>

                    {/* ডান পাশ: কন্টাক্ট ফর্ম (হোয়াইট/অরেঞ্জ থিম) */}
                    <div className="w-full lg:w-[65%] p-8 lg:p-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Send us a message</h2>
                        <p className="text-slate-500 mb-10 font-medium">আপনার যেকোনো মতামত বা জিজ্ঞাসার জন্য নিচের ফর্মটি পূরণ করুন।</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                                        <input type="text" placeholder="John" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" />
                                    </div>
                                </div>
                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input type="text" placeholder="Doe" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" placeholder="example@mail.com" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" />
                                </div>
                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input type="text" placeholder="01XXX-XXXXXX" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Subject</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                                    <input type="text" placeholder="How can we help?" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold" />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Message</label>
                                    <span className="text-[10px] text-slate-400 font-bold">Max 500 chars</span>
                                </div>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 text-blue-300" size={18} />
                                    <textarea rows="4" placeholder="আপনার বার্তাটি এখানে লিখুন..." className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold resize-none"></textarea>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95 w-full md:w-auto uppercase tracking-widest text-sm">
                                Submit Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                </motion.div>

                {/* ৩. ম্যাপ সেকশন (নিচে চওড়া ম্যাপের জন্য জায়গা) */}
 <div className="mt-16 bg-white p-2 rounded-[2.5rem] shadow-xl border border-blue-200 h-[300px] lg:h-[450px] overflow-hidden group">
    <iframe 
        /* এই লিঙ্কটি আপনার দেওয়া অ্যাড্রেসকে ম্যাপের হেডারে স্পষ্টভাবে দেখাবে */
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.4026350352125!2d90.3899013759325!3d23.94801118120677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755e1ace7f6929f%3A0x1927b27208e45689!2sNational%20University!5e0!3m2!1sen!2sbd!4v1709123456789!5m2!1sen!2sbd" 
        className="w-full h-full rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
</div>

            </div>
        </div>
    );
}

