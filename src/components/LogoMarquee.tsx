type Brand = { slug: string; name: string; src: string };

// Simple Icons CDN for most brands; self-hosted SVGs where Simple Icons
// removed the mark on a trademark request (Mercedes-Benz, Alfa Romeo).
const brands: Brand[] = [
  { slug: "mercedes", name: "Mercedes-Benz", src: "/brands/mercedes.svg" },
  { slug: "bmw", name: "BMW", src: "https://cdn.simpleicons.org/bmw/ffffff" },
  { slug: "audi", name: "Audi", src: "https://cdn.simpleicons.org/audi/ffffff" },
  { slug: "volkswagen", name: "Volkswagen", src: "https://cdn.simpleicons.org/volkswagen/ffffff" },
  { slug: "porsche", name: "Porsche", src: "https://cdn.simpleicons.org/porsche/ffffff" },
  { slug: "volvo", name: "Volvo", src: "https://cdn.simpleicons.org/volvo/ffffff" },
  { slug: "ferrari", name: "Ferrari", src: "https://cdn.simpleicons.org/ferrari/ffffff" },
  { slug: "lamborghini", name: "Lamborghini", src: "https://cdn.simpleicons.org/lamborghini/ffffff" },
  { slug: "maserati", name: "Maserati", src: "https://cdn.simpleicons.org/maserati/ffffff" },
  { slug: "alfaromeo", name: "Alfa Romeo", src: "/brands/alfaromeo.svg" },
  { slug: "fiat", name: "Fiat", src: "https://cdn.simpleicons.org/fiat/ffffff" },
  { slug: "skoda", name: "Škoda", src: "https://cdn.simpleicons.org/skoda/ffffff" },
];

// Horizontal fade mask so logos blur out toward the left + right edges.
const fadeMask =
  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

export default function LogoMarquee() {
  // Duplicate list so the translate reset is seamless.
  const items = [...brands, ...brands];
  return (
    <section aria-label="European vehicle brands we service">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        <h2 className="font-display text-center text-lg md:text-xl font-medium tracking-tight text-white/85 pt-10 md:pt-14 pb-10 md:pb-14">
          European brands we service
        </h2>
        <div
          className="relative overflow-hidden py-4 md:py-6"
          style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        >
          <div className="marquee-track gap-14 md:gap-24">
            {items.map((b, i) => (
              <div
                key={`${b.slug}-${i}`}
                className="flex items-center justify-center shrink-0"
              >
                <img
                  src={b.src}
                  alt={b.name}
                  title={b.name}
                  loading="eager"
                  className="h-16 md:h-20 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Faded hairline border — 70% viewport width, centered, fades to
          transparent at both ends. */}
      <div
        className="mx-auto h-px w-[70%] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-10 md:mt-14"
        aria-hidden
      />
    </section>
  );
}
