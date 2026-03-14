import { notFound } from "next/navigation";
import { readContentByKey } from "@/lib/serverContent";

export default async function ServiceDetails({ params }) {
  const { slug } = await params;
  const serviceData = await readContentByKey("services");
  const services = serviceData?.content?.services || [];

  const service = services.find((s) => s.slug === slug);
  if (!service) return notFound();

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_52%,#ffffff_100%)] py-6 font-hind selection:bg-blue-600 selection:text-white lg:py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:space-y-10">

        {/* HERO CARD */}
        <div className="rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-blue-900 to-blue-700 p-8 text-white shadow-[0_24px_70px_-28px_rgba(30,64,175,0.55)] lg:p-10">
          <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-100">
            Service Details
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight lg:text-6xl">
            {service.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-blue-50/90 lg:text-lg">
            {service.desc}
          </p>
        </div>

        {/* OVERVIEW + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* OVERVIEW CARD */}
          <div className="lg:col-span-2 rounded-[2.5rem] border border-blue-100 bg-white p-8 text-slate-900 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)]">
            <h2 className="mb-4 text-2xl font-black text-slate-900">Overview</h2>
            <p className="leading-relaxed text-slate-600">
              {service.details?.overview || service.desc}
            </p>
          </div>

          {/* CTA CARD */}
          <div className="flex flex-col justify-between rounded-[2.5rem] border border-blue-200 bg-blue-50 p-8 shadow-[0_18px_50px_-30px_rgba(37,99,235,0.35)]">
            <div>
              <h3 className="mb-2 text-xl font-black text-slate-900">Get Started</h3>
              <p className="text-sm text-slate-600">
                Ready to move forward with this service?
              </p>
            </div>
            <button className="mt-6 rounded-xl bg-blue-700 py-4 font-black text-white transition-all hover:bg-blue-800">
              {service.cta?.label || "Contact Us"}
            </button>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)]">
          <h2 className="mb-6 text-2xl font-black text-slate-900">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300"
              >
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGIES */}
        {service.details?.technologies && (
          <div className="rounded-[2.5rem] border border-slate-800/10 bg-slate-950 p-8 text-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.75)]">
            <h2 className="mb-6 text-2xl font-black">Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {service.details.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm font-bold text-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
