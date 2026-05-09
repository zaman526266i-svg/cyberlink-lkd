/**
 * Full-bleed hero strip: image fills width (no side letterboxing), height capped so it is not overly tall.
 * object-cover keeps edges filled; center focal point. Height is ~2× the previous compact strip. No dimming overlay on the image.
 */
export default function PageBanner({ src, alt = "", align = "left", children, className = "" }) {
  const center = align === "center";

  return (
    <section className={`relative w-full overflow-hidden bg-[#0a1628] ${className}`}>
      <div className="relative w-full h-[clamp(400px,56svh,680px)] sm:h-[clamp(440px,60svh,720px)] md:h-[clamp(480px,64svh,760px)] lg:h-[clamp(520px,68svh,800px)]">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
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
