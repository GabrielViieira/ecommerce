import { useState } from "react";
import DestaquesComp from "./Destaques";
import ProdutosGrid from "./Produtos";
import PromocoesList from "./Promoçoes";

export default function TabsComp() {
  const [activeTab, setActiveTab] = useState("destaques");

  const tabs = [
    { id: "destaques", label: "Featured" },
    { id: "produtos", label: "Products" },
    { id: "promocoes", label: "Deals" },
  ];

  return (
    <main className="w-full max-w-300 mx-auto px-4 md:px-8 lg:px-12">
      <nav className="flex justify-center mt-14 border-b border-(--border)">
        <div className="flex items-center gap-3 md:gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer rounded-full ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-(--text) hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <section className="py-10 md:py-14">
        {activeTab === "destaques" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text)">
                Curated for you
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight text-(--text-h)">
                Featured Products
              </h2>
            </div>

            <DestaquesComp itemsPerPage={10} />
          </div>
        )}

        {activeTab === "produtos" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text)">
                Explore
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight text-(--text-h)">
                All Products
              </h2>
            </div>

            <ProdutosGrid itemsPerPage={8} />
          </div>
        )}

        {activeTab === "promocoes" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text)">
                Limited offers
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight text-(--text-h)">
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
