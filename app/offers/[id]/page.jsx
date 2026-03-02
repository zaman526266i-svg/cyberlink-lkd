import Image from "next/image";
import { notFound } from "next/navigation";

async function getOffer(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/offers`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) return null;

  return data.data.offers.find((offer) => offer.id === Number(id));
}

export default async function OfferDetails({ params }) {
  const { id } = await params;

  const offer = await getOffer(id);

  if (!offer) {
    notFound();
  }

  return (
    <div className="min-h-screen text-slate-800 pb-24 bg-white">

      {/* 🔥 HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          className="object-cover opacity-100"
          priority
        />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tight text-slate-900 bg-white/70 rounded-xl px-6 py-3 inline-block">
            {offer.title}
          </h1>
        </div>
      </section>

      {/* 🔥 CONTENT SECTION */}
      <div className="container mx-auto px-6 lg:px-16 mt-16">

        <div className="bg-white text-slate-800 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(30,64,175,0.12)] border border-blue-200">

          <h2 className="text-3xl font-black mb-6 uppercase">
            Campaign Details
          </h2>

          <p className="text-lg leading-relaxed font-medium whitespace-pre-line">
            {offer.description}
          </p>

          {offer.link && offer.link !== "#" && (
            <div className="mt-10">
              <a
                href={offer.link}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition-all"
              >
                Visit Offer
              </a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
