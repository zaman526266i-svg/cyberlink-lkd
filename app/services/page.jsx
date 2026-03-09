"use client";

import Link from "next/link";
import usePublicContent from "@/lib/usePublicContent";

import {
  Home,
  Shield,
  Briefcase,
  Server,
  UploadCloud,
  Settings,
  Database,
  Globe
} from "lucide-react";

const getIcon = (iconName) => {
  const icons = {
    home: <Home size={32} />,
    shield: <Shield size={32} />,
    briefcase: <Briefcase size={32} />,
    server: <Server size={32} />,
    network: <UploadCloud size={32} />,
    settings: <Settings size={32} />,
    database: <Database size={32} />,
    globe: <Globe size={32} />
  };
  return icons[iconName] || <Globe size={32} />;
};

export default function ServicesPage() {
  const { data, loading } = usePublicContent("services", { services: [] });
  const services = data.services;

  if (loading) {
    return <div className="min-h-[40vh] text-slate-700 flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="relative my-3 py-6 lg:py-10 font-hind selection:bg-blue-600 selection:text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900">
            Our <span className="text-blue-700">Solutions</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Smart internet services for home, business, and enterprise connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block"
            >
              <div className="h-full bg-white rounded-[2.5rem] p-8 shadow-lg border border-blue-100 flex flex-col transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:border-blue-300">
                <div className="mb-6 p-4 flex items-center rounded-2xl bg-blue-50 text-blue-700 w-fit">
                  {getIcon(service.icon)}
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm grow">
                  {service.shortDesc}
                </p>

                <span className="mt-6 inline-flex items-center text-sm font-bold text-blue-700">
                  Explore Service
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
