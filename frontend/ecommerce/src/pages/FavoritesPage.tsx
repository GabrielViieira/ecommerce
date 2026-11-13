import { useEffect, useState } from "react";
import HeaderComp from "../components/header";
import {
  getProductsService,
  addProductsService,
  toggleFavoriteService,
} from "../services/APIservice";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/notify";
import { Link } from "react-router";
import { Heart, ShoppingCart, Loader2, Package } from "lucide-react";
import { getGuestFavorites, toggleGuestFavorite } from "../services/favService";

type Produto = {
  _id: string;
  title: string;
  desc: string;
  image: string;
  quantity: number;
  price: number;
  isFeatured: boolean;
  discount: number;
  categoria: string[];
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

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

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        let ids: string[] = [];

        if (user) {
          // Authenticated user - fetch from backend
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/favorites`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            // data is an array of product documents, extract _id
            ids = data.map((item: any) =>
              typeof item === "string" ? item : item._id,
            );
          }
        } else {
          // Guest user - use localStorage
          ids = getGuestFavorites();
        }

        if (ids.length > 0) {
          const response = await getProductsService(100);
          const allProducts: Produto[] = Array.isArray(response)
            ? response
            : response.data || [];
          const favProducts = allProducts.filter((p: Produto) =>
            ids.includes(p._id),
          );
          setProducts(favProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        setToast({
          show: true,
          msg: "Erro ao carregar favoritos",
          type: "error",
          time: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleToggleFavorite = async (productId: string) => {
    setRemoving(productId);
    try {
      if (!user) {
        // Guest user - use localStorage
        const newFavorites = toggleGuestFavorite(productId);
        const isNowFavorite = newFavorites.includes(productId);

        if (isNowFavorite) {
          const response = await getProductsService(100);
          const allProducts: Produto[] = Array.isArray(response)
            ? response
            : response.data || [];
          const newlyAdded = allProducts.find(
            (p: Produto) => p._id === productId,
          );
          if (newlyAdded) {
            setProducts((prev) => [...prev, newlyAdded]);
          }
        } else {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
        }

        setToast({
          show: true,
          msg: isNowFavorite
            ? "Adicionado aos favoritos!"
            : "Removido dos favoritos",
          type: "success",
          time: 3000,
        });
      } else {
        // Authenticated user - use API
        const result = await toggleFavoriteService(productId);
        // result.items is an array of product documents (populated)
        const items = result?.items || [];
        // Extract IDs from objects or use strings directly
        const itemIds = items.map((item: any) =>
          typeof item === "string" ? item : item._id,
        );
        const isNowFavorite = itemIds.includes(productId);

        if (isNowFavorite) {
          const response = await getProductsService(100);
          const allProducts: Produto[] = Array.isArray(response)
            ? response
            : response.data || [];
          const newlyAdded = allProducts.find(
            (p: Produto) => p._id === productId,
          );
          if (newlyAdded) {
            setProducts((prev) => [...prev, newlyAdded]);
          }
        } else {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
        }

        setToast({
          show: true,
          msg: isNowFavorite
            ? "Adicionado aos favoritos!"
            : "Removido dos favoritos",
          type: "success",
          time: 3000,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({
        show: true,
        msg: "Erro ao atualizar favorito",
        type: "error",
        time: 3000,
      });
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addProductsService({ productId });
      setToast({
        show: true,
        msg: "Adicionado ao carrinho!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        show: true,
        msg: "Erro ao adicionar ao carrinho",
        type: "error",
        time: 4000,
      });
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <>
        <HeaderComp />
        <main className="min-h-screen bg-(--site-bg) flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="animate-spin text-(--primary-accent)"
              size={32}
            />
            <p className="text-sm text-(--text-secondary)">
              Carregando favoritos...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderComp />

      <main className="min-h-screen bg-(--site-bg) text-(--text-main) overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12 xl:px-20">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted) mb-2">
              Sua lista
            </p>
            <h1 className="text-3xl font-semibold text-(--text-main) tracking-tight">
              Favoritos
            </h1>
            <p className="text-sm text-(--text-muted) mt-1">
              {products.length} produto{products.length !== 1 ? "s" : ""} salvo
              {products.length !== 1 ? "s" : ""}
              {!user ? " (visíveis por sessão)" : ""}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((produto) => {
                const temDesconto = produto.discount > 0;
                const precoFinal = temDesconto
                  ? produto.price * (1 - produto.discount / 100)
                  : produto.price;
                const temEstoque = produto.quantity > 0;
                const isRemoving = removing === produto._id;
                const isFav = products.some((p) => p._id === produto._id);

                return (
                  <article
                    key={produto._id}
                    className="group relative flex flex-col h-120"
                  >
                    <Link
                      to={`/pagina-produto/${produto._id}`}
                      className="relative block aspect-8/15 bg-(--surface-lowest) overflow-hidden rounded-lg border border-(--border-color) transition-transform hover:scale-[1.02]"
                    >
                      {produto.image ? (
                        <img
                          src={produto.image}
                          alt={produto.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-(--text-muted) gap-2">
                          <Package size={22} />
                          <span className="text-xs">Sem imagem</span>
                        </div>
                      )}

                      {temDesconto && (
                        <span className="absolute top-2 left-2 bg-(--error-bg) text-(--error-text) text-[10px] font-bold tracking-wider px-2 py-1 rounded-full">
                          {produto.discount}% OFF
                        </span>
                      )}

                      {!temEstoque && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-(--error-bg) text-(--error-text) px-3 py-1.5 rounded-md text-xs font-semibold">
                            Esgotado
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="pt-3 flex flex-col gap-2">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/pagina-produto/${produto._id}`}
                            className="font-medium text-(--text-main) text-sm line-clamp-1 hover:text-(--primary-accent) transition-colors"
                          >
                            {produto.title}
                          </Link>
                          <p className="text-xs text-(--text-muted) mt-1 line-clamp-2 min-h-7">
                            {produto.desc}
                          </p>
                        </div>
                      </div>

                      <div>
                        {temDesconto ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] text-(--text-muted) line-through">
                              {formatPrice(produto.price)}
                            </span>
                            <span className="text-sm font-semibold text-(--success)">
                              {formatPrice(precoFinal)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-(--primary-accent)">
                            {formatPrice(produto.price)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-(--text-muted)">
                        <Package size={12} />
                        {temEstoque ? (
                          <span className="text-(--success)">
                            {produto.quantity} unidades
                          </span>
                        ) : (
                          <span className="text-(--error)">Esgotado</span>
                        )}
                      </div>

                      {produto.categoria && produto.categoria.length > 0 && (
                        <span className="text-[10px] text-(--text-muted) ml-2">
                          {produto.categoria[0]}
                        </span>
                      )}

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAddToCart(produto._id)}
                          disabled={!temEstoque}
                          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                            temEstoque
                              ? "bg-(--primary-accent) text-(--primary-text) hover:bg-(--primary-hover) cursor-pointer active:scale-[0.98]"
                              : "bg-(--surface-high) text-(--text-disabled) cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart size={13} />
                          {temEstoque ? "Adicionar" : "Esgotado"}
                        </button>

                        <button
                          onClick={() => handleToggleFavorite(produto._id)}
                          disabled={isRemoving}
                          className={`p-2 rounded-md flex items-center justify-center transition-all ${
                            isRemoving
                              ? "bg-(--surface-high) text-(--text-disabled) cursor-not-allowed"
                              : "text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          }`}
                          aria-label={
                            isFav
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                          title={
                            isFav
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          {isRemoving ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Heart
                              size={18}
                              className={isFav ? "fill-current" : ""}
                              strokeWidth={isFav ? 0 : 2}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center px-6 border border-dashed border-(--border-color) rounded-xl">
              <Heart size={48} className="text-(--text-muted) mb-4" />
              <h3 className="text-lg font-medium text-(--text-main)">
                Nenhum favorito ainda
              </h3>
              <p className="text-sm text-(--text-muted) mt-2 max-w-sm">
                Produtos que você marcar com o coração aparecerão aqui.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-(--primary-accent) text-(--primary-text) rounded-md text-sm font-medium hover:bg-(--primary-hover) transition-colors"
              >
                <Package size={16} />
                Explorar produtos
              </Link>
            </div>
          )}
        </div>

        {toast.show && (
          <Toast
            message={toast.msg}
            type={toast.type}
            duration={toast.time}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </main>
    </>
  );
}
