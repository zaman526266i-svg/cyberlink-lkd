"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Lottie from "lottie-react";
import { motion, useMotionValue, useTransform } from 'framer-motion';
import usePublicContent from "@/lib/usePublicContent";
// Swiper ইমপোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-fade';


// আইকনসমূহ
import {
    Check, Facebook, Home, Shield, Briefcase, Server,
    UploadCloud, Settings, Database, Globe, MapPin, Search, Map, ChevronDown
} from 'lucide-react';
import ServicesPage from '../services/page';


// --- লটি হেল্পার কম্পোনেন্ট ---
const LottieComponent = ({ url }) => {
    const [animationData, setAnimationData] = useState(null);
    useEffect(() => {
        if (url && url.endsWith('.json')) {
            fetch(url).then(res => res.json()).then(data => setAnimationData(data))
                .catch(err => console.error("Lottie error:", err));
        }
    }, [url]);
    if (!animationData) return <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>;
    return <Lottie animationData={animationData} loop={true} className="w-full h-full object-contain" />;
};

// আইকন ম্যাপার
const getIcon = (iconName) => {
    const icons = {
        home: <Home size={30} />, shield: <Shield size={30} />,
        briefcase: <Briefcase size={30} />, server: <Server size={30} />,
        network: <UploadCloud size={30} />, settings: <Settings size={30} />,
        database: <Database size={30} />, globe: <Globe size={30} />,
    };
    return icons[iconName] || <Globe size={30} />;
};

// সেকশন
const SectionBorder = () => (
    <div className="w-full flex justify-center py-10">
        <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
    </div>
);

export default function HomePage() {
    const { data: homeData, loading: homeLoading } = usePublicContent("home", {
        heroSlides: [],
        coverageBanner: {},
        featureCards: [],
        regularPlans: [],
        smePlans: [],
    });
    // ৩ডি 
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - (rect.left + rect.width / 2));
        y.set(event.clientY - (rect.top + rect.height / 2));
    }
    function handleMouseLeave() { x.set(0); y.set(0); }

    if (homeLoading) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen font-hind selection:bg-blue-600 selection:text-white">
         {/* ১. Hero Section (Fully Responsive Slider) */}
<section className="relative w-full h-[100vh] lg:h-[600px] overflow-hidden">

    <Swiper
        modules={[Autoplay, EffectFade]}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
    >
        {homeData.heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full overflow-hidden">

                    {/* ========== Background Media ========== */}
                    <div className="absolute inset-0">

                        {slide.bgImage && (slide.bgImage.endsWith('.mp4') || slide.bgImage.includes('video')) ? (
                            <video
                                src={slide.bgImage}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover scale-110"
                            />
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center scale-110"
                                style={{ backgroundImage: `url(${slide.bgImagbae})` }}
                            />
                        )}

                        {/* Main Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/10"></div>

                    </div>

                    {/* =========== Content Area ============*/}
                    <div className="relative z-20 container mx-auto px-4 lg:px-10 h-full flex items-center justify-center pt-10 lg:pt-0">

                        {/* ========= PACKAGES TYPE ========= */}
                        {slide.type === 'packages' && (
                            <div className="flex flex-col lg:flex-row items-center w-full gap-8 lg:gap-10">

                                <div className="w-full lg:w-3/5 text-center text-white order-2 lg:order-1">
                                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-3 italic leading-tight font-poppins drop-shadow-2xl">
                                        {slide.title}
                                    </h1>

                                    <p className="text-sm sm:text-lg lg:text-xl mb-6 lg:mb-10 text-gray-200 max-w-xl mx-auto font-hind">
                                        {slide.subtitle}
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
                                        {slide.items?.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/10 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-white/20 text-center hover:bg-orange-600 transition-all cursor-pointer shadow-lg font-poppins"
                                            >
                                                <div className="text-lg lg:text-xl font-black italic">
                                                    {item.label}
                                                </div>
                                                <div className="text-[10px] font-bold opacity-80 mt-0.5 uppercase">
                                                    {item.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* ========= GAMES TYPE ========= */}
                        {slide.type === 'games' && (
                            <div className="grid w-full grid-cols-1 items-center gap-6 px-2 sm:px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                                <div className="order-2 rounded-[2rem] border border-white/15 bg-black/25 p-4 backdrop-blur-sm sm:p-6 lg:order-1 lg:p-8">
                                    <div className="mb-4 inline-flex rounded-full border border-orange-400/30 bg-orange-500/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-orange-200">
                                        Gaming Zone
                                    </div>
                                    <h2 className="max-w-2xl text-center text-3xl font-black leading-tight text-white drop-shadow-2xl sm:text-4xl lg:text-left lg:text-6xl">
                                        {slide.title}
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-xl text-center text-sm text-slate-200 sm:text-base lg:mx-0 lg:text-left lg:text-lg">
                                        Download your favorite games faster and enjoy smoother gameplay with a high-speed connection built for low latency.
                                    </p>
                                    <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:mt-8">
                                        {slide.logos?.map((logo, index) => (
                                            <div
                                                key={`${logo.img}-${index}`}
                                                className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg"
                                            >
                                                <Image
                                                    src={logo.img}
                                                    alt={`Game logo ${index + 1}`}
                                                    width={96}
                                                    height={96}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2">
                                    <Image
                                        src="/banner/cyberlink banner.png"
                                        alt="Game Banner"
                                        width={1600}
                                        height={1600}
                                        className="mx-auto w-full max-w-[780px] object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ========= IPV6 TYPE ========= */}
                        {slide.type === 'ipv6' && (
                            <div className="flex w-full flex-col items-center gap-6 px-2 sm:px-4 lg:flex-row lg:gap-12">
                                <div className="order-2 w-full text-center text-white lg:order-1 lg:w-1/2 lg:text-left">
                                    <div className="mb-4 inline-flex rounded-full border border-blue-200/25 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-100">
                                        Next Generation Network
                                    </div>
                                    <h2 className="mb-4 text-3xl font-black font-poppins uppercase leading-tight sm:text-5xl lg:text-6xl">
                                        {slide.title}
                                    </h2>
                                    <p className="mx-auto mb-6 max-w-xl text-sm text-slate-200 sm:text-lg lg:mx-0">
                                        {slide.subtitle}
                                    </p>
                                    <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                                        {slide.features?.map((feature) => (
                                            <span
                                                key={feature}
                                                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href="/connection"
                                        className="inline-block w-full rounded-xl bg-orange-600 px-8 py-3 text-sm font-black uppercase text-white hover:bg-orange-700 sm:w-auto"
                                    >
                                        Get Connection
                                    </Link>
                                </div>
                                <div className="order-1 w-full lg:order-2 lg:w-1/2">
                                    <Image
                                        src="/banner/cyberlink_web_banner_01.png"
                                        alt="IPv6 Banner"
                                        width={1600}
                                        height={1600}
                                        className="mx-auto w-full max-w-sm object-contain sm:max-w-md lg:max-w-xl"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>
</section>
            <div className="bg-white">
            {/* 2. Solutions Section */}
            <section className="py-5 lg:py-10 px-4 lg:px-10">
                <SectionBorder />
                <div className="container mx-auto text-center">
            
                 <ServicesPage></ServicesPage>
                </div>
            </section>
            {/* ৩. Coverage Section (3D) */}
            <section className="py-5 lg:py-10 px-4 lg:px-10">
                <SectionBorder />
                <div className="container mx-auto">
                    <motion.div
                        style={{ rotateX, rotateY, perspective: 1200 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                        className="relative flex flex-col lg:flex-row overflow-hidden rounded-[3rem] shadow-2xl border border-blue-200 cursor-pointer group bg-white"
                    >
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0b3a82] to-[#082453] p-10 lg:p-16 text-white text-center">
                            <h3 className="text-xl font-bold mb-1 text-blue-200 uppercase tracking-widest">Network</h3>
                            <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tighter uppercase font-poppins">{homeData?.coverageBanner?.overlayText}</h2>
                            <p className="text-blue-100 mb-10 max-w-sm leading-relaxed mx-auto">{homeData?.coverageBanner?.description}</p>
                            <button className="bg-white text-[#0b3a82] hover:bg-blue-50 px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">See Map</button>
                        </div>
                        <div className="w-full lg:w-1/2 relative min-h-[300px] overflow-hidden">
                            <video src={homeData?.coverageBanner?.bgImage} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081d44]/70 via-transparent to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* ৪. Feature Cards */}
            <section className="py-5 lg:py-10 px-4 lg:px-10">
                <SectionBorder />
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {homeData.featureCards?.map((card, index) => (
                            <motion.div key={card.id} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} whileHover={{ y: -10 }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col group border border-blue-200 hover:border-blue-400 transition-all duration-300">
                                <div className={`relative h-52 w-full ${card.bgColor} flex items-center justify-center p-6`}>
                                    {card.videoUrl?.endsWith('.json') ? <LottieComponent url={card.videoUrl} /> : <video src={card.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-contain mix-blend-multiply" />}
                                </div>
                                <div className="py-8 px-4 text-center">
                                    <h3 className="text-xl lg:text-2xl font-black text-slate-900 font-poppins">{card.title}</h3>
                                    <div className="mt-3 w-10 h-1 bg-blue-600 mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* 5. Pricing Section */}
            <section className="py-5 lg:py-10 px-4 lg:px-10">
               
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-4 font-poppins tracking-tighter uppercase">Pricing <span className="text-blue-700">Plans</span></h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6 shadow-lg shadow-blue-500/20"></div>
                    </div>
                    <div className="space-y-6 max-w-6xl mx-auto">
                        {homeData.regularPlans?.map((plan) => (
                            <motion.div key={plan.id} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} viewport={{ once: true }} className="bg-white border border-blue-200 rounded-[2.5rem] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between group hover:border-blue-500 transition-all duration-300 shadow-xl">
                                <div className="w-full lg:w-1/4 text-center flex flex-col items-center">
                                    <h3 className="text-2xl font-black text-slate-900 mb-1 font-poppins uppercase tracking-tighter">{plan.name}</h3>
                                    <p className="text-blue-900/60 text-[10px] font-black uppercase tracking-widest mb-6">Digital Journey Start</p>
                                    <div className="bg-blue-600 text-white px-10 py-3 rounded-full text-xl font-black italic shadow-lg shadow-blue-600/30">{plan.speed}</div>
                                </div>
                                <div className="w-full lg:w-2/4 grid grid-cols-1 md:grid-cols-2 gap-4 py-8 lg:py-0 border-y lg:border-y-0 lg:border-x border-blue-100 lg:px-12">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                            <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} strokeWidth={4} /></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full lg:w-1/4 text-center">
                                    <div className="mb-6"><span className="text-4xl lg:text-5xl font-black text-slate-900">TK {plan.price}</span><span className="text-blue-700 text-xs font-black uppercase ml-1">/Mo</span></div>
                                   <Link href={`/connection?package=${encodeURIComponent(plan.speed)}`}>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap font-poppins text-xs">Buy Now</button>
                                   </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            </div>
        </div>
    );
}




