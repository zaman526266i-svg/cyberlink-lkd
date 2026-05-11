/**
 * Full-bleed hero strip with fixed reduced height.
 * Used `object-fill` so the image takes 100% width and 100% height,
 * showing the full image without cropping (note: this may stretch the image).
 */
export default function PageBanner({ src, alt = "", align = "left", children, className = "" }) {
  const center = align === "center";

  return (
    <section className={`relative w-full overflow-hidden bg-[#0a1628] border-t border-gray-700 ${className}`}>
      {/* 75% reduced height across all breakpoints */}
      <div className="relative w-full h-[clamp(300px,42svh,510px)] sm:h-[clamp(330px,45svh,540px)] md:h-[clamp(360px,48svh,570px)] lg:h-[clamp(390px,51svh,600px)]">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-fill"
          decoding="async"
          sizes="100vw"
        />
      </div>
      <div
        className={`pointer-events-none absolute inset-0 z-10 flex px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 ${
          center ? "items-center justify-center" : "items-center justify-start"
        }`}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[1600px]">
          <div
            className={`${
              center ? "mx-auto max-w-4xl text-center" : "max-w-3xl text-left"
            } [&_h1]:drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] [&_h2]:drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] [&_p]:drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] [&_span]:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}