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
      delay: 4000,
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
      <div className="mx-auto mt-8 h-[65vh] w-full max-w-360 animate-pulse border border-(--border) bg-(--surface-container-lowest)" />
    );
  }

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-360 overflow-hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((slide) => {
              const content = (
                <div className="relative h-[55vh] min-h-100 flex-[0_0_100%] overflow-hidden">
                  <img
                    src={slide.imageUrl}
                    alt="Featured product"
                    draggable="false"
                    className="h-full w-full select-none object-cover transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-2xl px-6 text-center">
                      <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                        Featured Collection
                      </span>

                      <h1 className="text-4xl font-medium tracking-tight text-white md:text-6xl">
                        Discover Something New
                      </h1>

                      <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/70 md:text-base">
                        Explore our curated selection and discover products made
                        for your everyday life.
                      </p>

                      {slide.linkTo && (
                        <span className="mt-8 inline-block border border-white bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-transparent hover:text-white">
                          Explore Collection
                        </span>
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

        <button
          type="button"
          onClick={goToPrev}
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 cursor-pointer border border-white/20 bg-black/40 p-3 text-white/70 backdrop-blur-sm transition-all hover:border-white hover:bg-black/70 hover:text-white"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={goToNext}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 cursor-pointer border border-white/20 bg-black/40 p-3 text-white/70 backdrop-blur-sm transition-all hover:border-white hover:bg-black/70 hover:text-white"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              className={`h-0.5 cursor-pointer transition-all duration-300 ${
                index === selectedSnap
                  ? "w-10 bg-white"
                  : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
