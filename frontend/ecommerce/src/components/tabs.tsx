import { useState, useEffect, useRef } from "react";
import DestaquesComp from "./Destaques";
import ProdutosGrid from "./Produtos";
import PromocoesList from "./Promoçoes";
import gsap from "gsap";

export default function TabsComp() {
  const [activeTab, setActiveTab] = useState("destaques");
  const contentRef = useRef<HTMLDivElement>(null);

  const prevTabRef = useRef<string>(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab && contentRef.current) {
      prevTabRef.current = activeTab;
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const tabs = [
    { id: "destaques", label: "Featured" },
    { id: "produtos", label: "Products" },
    { id: "promocoes", label: "Deals" },
  ];

  return (
    <main className="w-full max-w-300 mx-auto px-4 md:px-8 lg:px-12">
      <nav className="flex justify-center mt-14 border-b border-(--border-light) bg-(--surface-lowest)">
        <div className="flex items-center gap-3 md:gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer rounded-full relative ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-(--primary-accent) to-(--accent) text-(--primary-text) shadow-lg shadow-(--primary-accent)/30"
                  : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--surface-low)/50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 bg-(--primary-text) rounded-full opacity-80" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <section className="py-10 md:py-14" ref={contentRef}>
        {activeTab === "destaques" && (
          <div className="space-y-6">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Curated for you
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
                Featured Products
              </h2>
            </div>

            <DestaquesComp itemsPerPage={10} />
          </div>
        )}

        {activeTab === "produtos" && (
          <div className="space-y-6">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Explore
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
                All Products
              </h2>
            </div>

            <ProdutosGrid itemsPerPage={8} />
          </div>
        )}

        {activeTab === "promocoes" && (
          <div className="space-y-6">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Limited offers
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
                Current Deals
              </h2>
            </div>

            <PromocoesList />
          </div>
        )}
      </section>
    </main>
  );
}