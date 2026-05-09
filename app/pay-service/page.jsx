"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, RefreshCw, Move, Wifi, 
  ArrowRight, Smartphone, User, CheckCircle2 
} from 'lucide-react';
import PageBanner from '@/components/PageBanner';

const PayServicePage = () => {
    // --- ডাটা সরাসরি এখানে সেট করা হলো ---
    const serviceList = [
        { id: 1, name: "New Connection", icon: <PlusCircle size={28} />, desc: "নতুন সংযোগের জন্য" },
        { id: 2, name: "Shift Connection", icon: <Move size={28} />, desc: "বাসা পরিবর্তনের জন্য" },
        { id: 3, name: "Reconnection", icon: <RefreshCw size={28} />, desc: "পুনরায় সংযোগের জন্য" },
        { id: 4, name: "Buy Router", icon: <Wifi size={28} />, desc: "রাউটার কেনার জন্য" }
    ];

    const paymentLogos = [
        "https://i.ibb.co.com/RRJzQty/p1.png",
        "https://i.ibb.co.com/RT7PPcFd/p2.png",
        "https://i.ibb.co.com/d094mm7M/p3.png",
        "https://i.ibb.co.com/FqD7j0P0/p4.png"
    ];

    const [selectedService, setSelectedService] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [estimatedAmount, setEstimatedAmount] = useState("");
    const [loadingAmount, setLoadingAmount] = useState(false);
    const [paying, setPaying] = useState(false);

    const serviceTypeMap = {
        "New Connection": "new_connection",
        "Shift Connection": "shift_connection",
        Reconnection: "reconnection",
        "Buy Router": "buy_router",
    };

    const fetchQuote = async (targetCustomerId, targetService) => {
        const serviceType = serviceTypeMap[targetService] || "";
        if (!targetCustomerId || !serviceType) {
            setEstimatedAmount("");
            return;
        }
        setLoadingAmount(true);
        try {
            const response = await fetch(
                `/api/payments/quote?flowType=monthly_bill&customerId=${encodeURIComponent(targetCustomerId)}&serviceType=${encodeURIComponent(serviceType)}`
            );
            const data = await response.json();
            if (response.ok && data.success) {
                setEstimatedAmount(String(data.data.amount || ""));
            } else {
                setEstimatedAmount("");
            }
        } catch {
            setEstimatedAmount("");
        } finally {
            setLoadingAmount(false);
        }
    };

    const handlePay = async (event) => {
        event.preventDefault();
        const serviceType = serviceTypeMap[selectedService] || "";
        if (!serviceType) {
            window.alert("Please select a service first.");
            return;
        }
        if (!customerId.trim()) {
            window.alert("Please enter your customer ID or phone.");
            return;
        }
        const manualAmount = Number(estimatedAmount);
        if (!Number.isFinite(manualAmount) || manualAmount <= 0) {
            window.alert("Please provide a valid payment amount.");
            return;
        }

        setPaying(true);
        try {
            const response = await fetch("/api/payments/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowType: "monthly_bill",
                    customerId: customerId.trim(),
                    serviceType,
                    manualAmount,
                    source: "pay_service_page",
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success || !data.data?.gatewayUrl) {
                throw new Error(data.error || "Could not create payment session.");
            }
            window.location.href = data.data.gatewayUrl;
        } catch (error) {
            window.alert(error.message || "Could not start payment.");
        } finally {
            setPaying(false);
        }
    };

    return (
        <div className="min-h-screen  bg-white font-hind selection:text-white selection:bg-blue-600 pb-24">
            
            <PageBanner src="https://i.ibb.co.com/svKg52mn/photo-2026-01-04-21-48-05.jpg" alt="Pay service header" align="left">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-5xl lg:text-8xl font-black mb-4 text-white font-poppins tracking-tighter uppercase italic drop-shadow-lg">
                        Pay Service
                    </h1>
                    <p className="text-white text-lg lg:text-xl font-bold leading-relaxed font-hind max-w-2xl drop-shadow-md">
                        আপনার প্রয়োজনীয় সার্ভিসটি সিলেক্ট করুন এবং সরাসরি অনলাইনে পেমেন্ট সম্পন্ন করুন।
                    </p>
                </motion.div>
            </PageBanner>

            <div className="container mx-auto px-4 lg:px-10 relative z-20">
                
                {/* ২. সার্ভিস সিলেকশন গ্রিড (৩ডি হোভার ইফেক্ট) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 -mt-16 mb-16">
                    {serviceList.map((service) => (
                        <motion.div 
                            key={service.id}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => {
                                setSelectedService(service.name);
                                fetchQuote(customerId.trim(), service.name);
                            }}
                            className={`cursor-pointer p-6 lg:p-10 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group
                            ${selectedService === service.name 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/40' 
                                : 'bg-white border-blue-100 text-slate-700 hover:border-blue-500'}`}
                        >
                            {/* শাইন ইফেক্ট */}
                            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000"></div>

                            <div className={`mb-4 p-4 rounded-2xl transition-colors ${selectedService === service.name ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xs lg:text-lg font-black uppercase tracking-tight font-poppins leading-tight">
                                {service.name}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                {/* ৩. পেমেন্ট ফর্ম কার্ড (Glassmorphism White) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 lg:p-16 shadow-[0_30px_70px_rgba(124,45,18,0.12)] border border-blue-200"
                >
                    <div className="text-center mb-12">
                        <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 font-poppins">Secured Portal</div>
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-2 font-poppins uppercase tracking-tighter">Payment Details</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <form onSubmit={handlePay} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* সার্ভিস সিলেকশন (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1 font-poppins">Selected Service</label>
                                <input 
                                    type="text" 
                                    value={selectedService || "Please select a service"} 
                                    readOnly 
                                    className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl py-4 px-6 outline-none font-black text-blue-900 font-poppins shadow-inner"
                                />
                            </div>

                            {/* আইডি বা ফোন */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 font-poppins">Customer ID / Phone</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: 017XXXXXXXX" 
                                        value={customerId}
                                        onChange={(event) => {
                                            const nextValue = event.target.value;
                                            setCustomerId(nextValue);
                                        }}
                                        onBlur={() => fetchQuote(customerId.trim(), selectedService)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* টাকা বা এমাউন্ট */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 font-poppins">Payment Amount (TK)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 text-2xl font-black">৳</div>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={estimatedAmount}
                                    onChange={(event) => setEstimatedAmount(event.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all text-3xl font-black text-slate-900"
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                {loadingAmount
                                    ? "Loading amount from server..."
                                    : "Default amount এসেছে server থেকে। চাইলে edit করে payment করতে পারবেন।"}
                            </p>
                        </div>

                        {/* পে বাটন */}
                        <button type="submit" disabled={paying} className="relative group/btn w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 transition-all active:scale-95 text-xl font-poppins uppercase tracking-widest overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                             <span>{paying ? "Processing..." : "Proceed to Pay"}</span> 
                             <ArrowRight size={24} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* পেমেন্ট পার্টনারস */}
                    <div className="mt-12 pt-10 border-t border-blue-100 flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 font-poppins">Secured Payment Partners</span>
                        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
                            {paymentLogos.map((logo, i) => (
                                <img key={i} src={logo} className="h-6 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" alt="partner" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default PayServicePage;
