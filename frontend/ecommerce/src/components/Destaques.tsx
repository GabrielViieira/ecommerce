import { useEffect, useState } from "react";
import { addProductsService, getFeatures } from "../services/APIservice";
import Toast from "./notify";
import { Link } from "react-router";
import { ShoppingCart, Star } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

type Prod = {
  _id: string;
  title: string;
  quantity: number;
  image: string;
  price: number;
  isFeatuered: boolean;
  discount: number;
};

type ProdutosGridProps = {
  itemsPerPage: number;
};

export default function DestaquesComp({ itemsPerPage }: ProdutosGridProps) {
  const [prod, setProd] = useState<Prod[]>([]);

  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error" | "info";
    time?: number;
  }>({
    show: false,
    msg: "",
    type: "success",
    time: 3000,
  });

  const loadProds = async () => {
    try {
      const response = await getFeatures();
      console.log(response);
      setProd(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProds();
  }, []);

  const handleAdd = async (_id: string) => {
    try {
      await addProductsService({
        productId: _id,
      });

      setToast({
        show: true,
        msg: "Product added to cart!",
        type: "info",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-(--accent)/10">
          <Star size={20} className="text-(--accent)" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-(--text-h)">
            Featured Products
          </h2>

          <p className="text-sm text-(--text) opacity-60">
            Explore our featured products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prod.length > 0 ? (
          prod.slice(0, itemsPerPage).map((items) => {
            const temDesconto = items.discount > 0;

            const precoFinal = temDesconto
              ? items.price * (1 - items.discount / 100)
              : items.price;

            const temEstoque = items.quantity > 0;

            return (
              <div
                key={items._id}
                className="
                                group flex flex-col
                                border border-(--border)
                                rounded-xl overflow-hidden
                                bg-(--dark-bg)
                                transition-all duration-300
                                hover:border-(--accent)
                                hover:-translate-y-1
                                relative
                                "
              >
                {temDesconto && (
                  <span
                    className="
                                        absolute top-3 left-3
                                        bg-red-500 text-white
                                        text-xs font-bold
                                        px-3 py-1 rounded-full
                                        z-10
                                        "
                  >
                    -{items.discount}% OFF
                  </span>
                )}

                <Link
                  to={`/pagina-produto/${items._id}`}
                  title={`View ${items.title}`}
                  className="
                                    aspect-square w-full
                                    bg-black/30
                                    flex items-center justify-center
                                    overflow-hidden
                                    cursor-pointer
                                    "
                >
                  {items.image ? (
                    <img
                      src={items.image}
                      alt={items.title}
                      className="
                                            w-full h-full
                                            object-cover
                                            group-hover:scale-105
                                            transition-transform
                                            duration-500
                                            "
                    />
                  ) : (
                    <span className="text-sm opacity-40">
                      No image available
                    </span>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-(--text-h) line-clamp-1">
                    {items.title}
                  </h3>

                  <div className="mt-auto pt-5">
                    {temDesconto ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">
                          ${items.price.toFixed(2)}
                        </span>

                        <div className="text-xl font-bold text-(--accent)">
                          ${precoFinal.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-(--accent)">
                        ${items.price.toFixed(2)}
                      </div>
                    )}

                    <div className="flex justify-between mt-3 text-xs">
                      <span className="opacity-50">Stock</span>

                      <span
                        className={
                          temEstoque ? "text-green-400" : "text-red-400"
                        }
                      >
                        {temEstoque
                          ? `${items.quantity} available`
                          : "Out of stock"}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => handleAdd(items._id)}
                        disabled={!temEstoque}
                        className={`
                                                flex-1 py-3
                                                rounded-lg
                                                flex items-center justify-center gap-2
                                                text-sm font-medium
                                                transition-all
                                                ${
                                                  temEstoque
                                                    ? `
                                                        bg-(--accent)
                                                        text-white
                                                        hover:brightness-110
                                                        cursor-pointer
                                                        `
                                                    : `
                                                        bg-white/5
                                                        text-white/40
                                                        cursor-not-allowed
                                                        `
                                                }
                                                `}
                      >
                        <ShoppingCart size={16} />

                        {temEstoque ? "Add to Cart" : "Out of Stock"}
                      </button>

                      <FavoriteButton productId={items._id} size={20} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="
                    col-span-full
                    flex flex-col
                    items-center justify-center
                    h-60
                    border border-(--border)
                    rounded-xl
                    bg-(--dark-bg)
                    "
          >
            <Star size={30} className="text-(--accent) opacity-40 mb-3" />

            <p className="text-center opacity-60 font-medium">
              No featured products available
            </p>
          </div>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.msg}
          type={toast.type}
          duration={toast.time}
          onClose={() =>
            setToast({
              ...toast,
              show: false,
            })
          }
        />
      )}
    </main>
  );
}
