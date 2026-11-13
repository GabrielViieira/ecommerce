import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSlidesService } from "../services/APIservice";
import { Link } from "react-router";
import type { SlideUI } from "../model/slideModel";

export default function BannerComp() {
  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const [slides, setSlides] = useState<SlideUI[]>([]);
  const [loading, setLoading] = useState(true);

  const goToPrev = () => emblaApi?.scrollPrev();
  const goToNext = () => emblaApi?.scrollNext();

  type EmblaApiType = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

  const goTo = (index: number) => emblaApi?.scrollTo(index);

  const setupSnaps = (api: EmblaApiType) => {
    setScrollSnaps(api.scrollSnapList());
  };

  const setActiveSnap = (api: EmblaApiType) => {
    setSelectedSnap(api.selectedScrollSnap());
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getSlidesService();

        if (!data || data.length === 0) {
          setSlides([
            {
              _id: "mock1",
              imageUrl: "https://picsum.photos/1600/700?random=1",
              active: true,
            },
            {
              _id: "mock2",
              imageUrl: "https://picsum.photos/1600/700?random=2",
              active: true,
            },
            {
              _id: "mock3",
              imageUrl: "https://picsum.photos/1600/700?random=3",
              active: true,
            },
          ]);
        } else {
          setSlides(data);
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error);

        setSlides([
          {
            _id: "mock1",
            imageUrl: "https://picsum.photos/1600/700?random=1",
            active: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (!emblaApi || loading) return;

    setupSnaps(emblaApi);
    setActiveSnap(emblaApi);

    const onReInit = () => {
      setupSnaps(emblaApi);
      setActiveSnap(emblaApi);
    };

    emblaApi.on("reInit", onReInit);
    emblaApi.on("select", setActiveSnap);

    if (slides.length > 1) {
      autoplay.current.play();
    } else {
      autoplay.current.stop();
    }

    return () => {
      emblaApi.off("reInit", onReInit);
      emblaApi.off("select", setActiveSnap);
      autoplay.current.stop();
    };
  }, [emblaApi, slides.length, loading]);

  if (loading) {
    return (
      <div className="mx-auto mt-8 h-[65vh] w-full max-w-360 animate-pulse bg-gradient-to-r from-(--site-bg) to-(--surface-low) border border-(--border-light)" />
    );
  }

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-360 overflow-hidden rounded-2xl shadow-2xl border border-(--border-light)">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((slide, _index) => {
              const content = (
                <div className="relative h-[55vh] min-h-100 flex-[0_0_100%] overflow-hidden">
                  <img
                    src={slide.imageUrl}
                    alt="Featured product"
                    draggable="false"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-1000"
                  />

                  {/* Elegant black overlay with fine transparency */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />

                  {/* Subtle silver shimmer effect */}
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-tr from-(--primary-accent)/15 to-transparent rounded-full filter blur-3xl animate-pulse-subtle" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-2xl px-6 text-center animate-fade-in">
                      <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.3em] text-(--primary-accent)/70">
                        Featured Collection
                      </span>

                      <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl bg-gradient-to-r from-white to-(--primary-accent) bg-clip-text text-transparent">
                        Discover Something New
                      </h1>

                      <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-(--text-secondary) md:text-base">
                        Explore our curated selection and discover products made
                        for your everyday life.
                      </p>

                      {slide.linkTo && (
                        <Link
                          to={slide.linkTo}
                          className="
                            mt-8 inline-block px-7 py-3 text-xs font-semibold uppercase tracking-wider
                            text-(--primary-text) bg-gradient-to-r from-(--primary-accent) to-(--accent)
                            rounded-lg shadow-md
                            transition-all duration-200
                            hover:scale-105 hover:shadow-lg hover:shadow-(--primary-accent)/30
                          "
                        >
                          Explore Collection
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );

              return slide.linkTo ? (
                <Link
                  key={slide._id}
                  to={slide.linkTo}
                  className="flex-[0_0_100%]"
                >
                  {content}
                </Link>
              ) : (
                <div key={slide._id} className="flex-[0_0_100%]">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* Neo-sleek navigation buttons */}
        <button
          type="button"
          onClick={goToPrev}
          className="
            absolute left-6 top-1/2 z-20 -translate-y-1/2
            flex items-center justify-center w-12 h-12
            rounded-full border border-(--border-light) bg-black/60 text-(--text-secondary)
            backdrop-blur-sm transition-all duration-200
            hover:border-(--primary-accent) hover:bg-(--primary-accent)/20 hover:text-(--primary-accent)
            group
          "
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={goToNext}
          className="
            absolute right-6 top-1/2 z-20 -translate-y-1/2
            flex items-center justify-center w-12 h-12
            rounded-full border border-(--border-light) bg-black/60 text-(--text-secondary)
            backdrop-blur-sm transition-all duration-200
            hover:border-(--primary-accent) hover:bg-(--primary-accent)/20 hover:text-(--primary-accent)
            group
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* Elegant pagination indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              className={`
                h-1 w-8 rounded-full
                transition-all duration-200 cursor-pointer
                bg-(--border-light) hover:bg-(--primary-accent)
                ${index === selectedSnap ? "w-10 bg-(--primary-accent)" : "w-4 opacity-50"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
