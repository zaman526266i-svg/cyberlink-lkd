/**
 * Hero banner: full-width image at natural aspect ratio (`w-full h-auto`), no crop, no squeeze.
 * No overlay / opacity on the image — text uses drop-shadow only for readability.
 */
export default function PageBanner({ src, alt = "", align = "left", children, className = "" }) {
  const center = align === "center";

  return (
    <section className={`relative w-full overflow-hidden bg-neutral-100 ${className}`}>
      <div className="relative w-full leading-none">
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full max-w-full align-top"
          decoding="async"
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 z-10 flex px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-16 ${
            center ? "items-center justify-center text-center" : "items-center justify-start"
          }`}
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <div
              className={`${
                center ? "mx-auto max-w-4xl text-center" : "max-w-3xl text-left"
              } [&_h1]:drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] [&_h2]:drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] [&_p]:drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] [&_span]:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
