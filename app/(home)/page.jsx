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
<section className="relative w-full min-h-[92svh] lg:h-[720px] overflow-hidden">

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

                        {slide.type === 'games' ? (
                            <div
                                className="w-full h-full bg-cover bg-center scale-110"
                                style={{ backgroundImage: `url(${slide.image || slide.bgImage})` }}
                            />
                        ) : slide.bgImage && (slide.bgImage.endsWith('.mp4') || slide.bgImage.includes('video')) ? (
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
                                style={{ backgroundImage: `url(${slide.bgImage})` }}
                            />
                        )}

                        {/* Main Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-[#04152d]/45 to-[#020617]/20"></div>

                    </div>

                    {/* =========== Content Area ============*/}
                    <div className="relative z-20 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center px-4 pt-10 sm:px-6 md:px-8 lg:px-10 lg:pt-0">

                        {/* ========= PACKAGES TYPE ========= */}
                        {slide.type === 'packages' && (
                            <div className="flex min-h-[72svh] w-full flex-col items-center justify-center gap-8 lg:min-h-[620px] lg:flex-row lg:gap-10">

                                <div className="order-2 w-full text-center text-white lg:order-1 lg:w-[80%]">
                                    <h1 className="mx-auto max-w-5xl text-4xl font-black italic leading-[1.02] font-poppins drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.4rem]">
                                        {slide.title}
                                    </h1>

                                    <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-200 font-hind sm:text-lg md:text-xl lg:mt-6 lg:text-2xl">
                                        {slide.subtitle}
                                    </p>

                                    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:mt-10">
                                        {slide.items?.map((item, i) => (
                                            <div
                                                key={i}
                                                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-lg backdrop-blur-md transition-all hover:bg-orange-600 sm:p-5 lg:rounded-[1.6rem] font-poppins"
                                            >
                                                <div className="text-lg font-black italic sm:text-xl lg:text-2xl">
                                                    {item.label}
                                                </div>
                                                <div className="mt-1.5 text-[11px] font-bold uppercase opacity-80 sm:text-xs lg:text-[13px]">
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
                            <div className="flex min-h-[72svh] w-full flex-col items-center justify-center gap-8 px-2 sm:px-4 lg:min-h-[620px] lg:flex-row lg:gap-12">
                                <Image
                                    src="/banner/cyberlink banner.png"
                                    alt={slide.title}
                                    width={1400}
                                    height={900}
                                    className="h-auto w-full max-w-[86%] object-contain sm:max-w-[82%] md:max-w-[78%] lg:max-w-[80%] xl:max-w-[86%]"
                                />
                            </div>
                        )}

                        {/* ========= IPV6 TYPE ========= */}
                        {slide.type === 'ipv6' && (
                            <div className="flex min-h-[72svh] w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[620px] lg:px-8">
                                <div className="grid w-full max-w-[86rem] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
                                    <div className="order-2 text-center text-white lg:order-1 lg:text-left">
                                        <div className="inline-flex rounded-full border border-cyan-300/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100 sm:px-5 sm:py-2.5 sm:text-xs">
                                            Next Generation Network
                                        </div>
                                        <h2 className="mt-4 bg-[linear-gradient(90deg,#ffffff_0%,#9bdcff_45%,#d4b4ff_100%)] bg-clip-text text-5xl font-black uppercase leading-none text-transparent sm:text-6xl md:text-7xl lg:text-[5.6rem]">
                                            {slide.title}
                                        </h2>
                                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8 lg:mx-0 lg:text-[1.35rem]">
                                            Faster addressing, smoother routing and a stronger internet foundation for every modern device.
                                        </p>

                                        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                                            <span className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
                                                IPv6 Ready
                                            </span>
                                            <span className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
                                                Stable Routing
                                            </span>
                                            <span className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
                                                Future Secure
                                            </span>
                                        </div>

                                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                                            <Link
                                                href="/connection"
                                                className="inline-block w-full rounded-2xl bg-[linear-gradient(90deg,#06b6d4_0%,#7c3aed_100%)] px-8 py-4 text-sm font-black uppercase text-white shadow-[0_16px_40px_rgba(76,29,149,0.35)] transition hover:scale-[1.02] sm:w-auto"
                                            >
                                                Get Connection
                                            </Link>
                                            <Link
                                                href="/pricing"
                                                className="inline-block w-full rounded-2xl border border-white/20 px-8 py-4 text-sm font-black uppercase text-white transition hover:border-white/40 sm:w-auto"
                                            >
                                                View Plans
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="order-1 flex items-center justify-center lg:order-2">
                                        <div className="relative w-full max-w-[24rem] sm:max-w-[32rem] md:max-w-[38rem] lg:max-w-[50rem]">
                                            <div className="absolute inset-0 rounded-full bg-cyan-400/18 blur-3xl" />
                                            <div className="absolute -bottom-4 right-0 h-32 w-32 rounded-full bg-violet-500/25 blur-3xl sm:h-40 sm:w-40" />
                                            <Image
                                                src="/banner/cyberlink_web_banner_01.png"
                                                alt="IPv6 Banner"
                                                width={1600}
                                                height={1600}
                                                className="relative mx-auto h-auto w-full object-contain"
                                            />
                                        </div>
                                    </div>
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




