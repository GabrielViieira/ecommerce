import { useEffect, useState } from "react";
import {
  addProductsService,
  clearCart,
  decreItemService,
  getCartService,
} from "../services/APIservice";

import HeaderComp from "../components/header";
import { Link } from "react-router";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  PackageOpen,
  Loader2,
} from "lucide-react";

type Product = {
  _id: string;
  title: string;
  price: number;
  image?: string;
};

type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
};

type Cart = {
  _id: string;
  userId: string;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);

      const response = await getCartService();

      setCart(response.data || response);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleAdd = async (productId: string) => {
    try {
      setUpdatingProduct(productId);

      const response = await addProductsService({
        productId,
      });

      setCart(response.data || response);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleDec = async (productId: string) => {
    try {
      setUpdatingProduct(productId);

      const response = await decreItemService(productId);

      setCart(response.data || response);
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error);
    } finally {
      setUpdatingProduct(null);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Deseja realmente remover todos os produtos do carrinho?",
    );

    if (!confirmed) return;

    try {
      setClearingCart(true);

      await clearCart();

      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: [],
            }
          : prev,
      );
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    } finally {
      setClearingCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <>
        <HeaderComp />

        <main className="min-h-screen bg-(--background)">
          <div className="max-w-300 mx-auto px-4 md:px-8 py-16">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-(--surface) rounded-lg" />

              <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-32 rounded-xl bg-(--surface)"
                    />
                  ))}
                </div>

                <div className="h-64 rounded-xl bg-(--surface)" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!cart) {
    return (
      <>
        <HeaderComp />

        <main className="min-h-screen bg-(--background) flex items-center justify-center">
          <div className="text-center">
            <PackageOpen
              size={50}
              className="mx-auto mb-4 text-(--text-muted)"
            />

            <p className="text-(--text-secondary)">
              Nenhum carrinho encontrado.
            </p>

            <Link
              to="/home"
              className="
                inline-flex
                mt-5
                px-5
                py-2.5
                rounded-lg
                bg-(--primary-accent)
                text-(--primary-text)
                font-semibold
                text-sm
              "
            >
              Ir para a loja
            </Link>
          </div>
        </main>
      </>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <HeaderComp />

      <main className="min-h-screen bg-(--background) text-(--text-main)">
        <div className="w-full max-w-300 mx-auto px-4 md:px-8 lg:px-12 py-10">
          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Seu carrinho
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text-main)">
                Carrinho de compras
              </h1>

              <p className="mt-2 text-sm text-(--text-secondary)">
                {totalItems > 0
                  ? `${totalItems} ${totalItems === 1 ? "item" : "itens"} no seu carrinho`
                  : "Seu carrinho está vazio"}
              </p>
            </div>

            {cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={clearingCart}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  text-sm
                  text-(--error)
                  border
                  border-(--error)/30
                  rounded-lg
                  hover:bg-(--error)/10
                  transition-all
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {clearingCart ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Limpar carrinho
              </button>
            )}
          </div>

          {/* CARRINHO VAZIO */}

          {cart.items.length === 0 ? (
            <div
              className="
                border
                border-(--border-color)
                rounded-2xl
                bg-(--card-bg)
                py-20
                px-6
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  bg-(--surface)
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <ShoppingBag size={28} className="text-(--text-secondary)" />
              </div>

              <h2 className="text-xl font-semibold text-(--text-main)">
                Seu carrinho está vazio
              </h2>

              <p className="text-sm text-(--text-secondary) mt-2 max-w-sm">
                Parece que você ainda não adicionou nenhum produto ao carrinho.
              </p>

              <Link
                to="/home"
                className="
                  mt-6
                  px-6
                  py-3
                  bg-(--primary-accent)
                  text-(--primary-text)
                  rounded-lg
                  text-sm
                  font-semibold
                  hover:bg-(--primary-hover)
                  transition-all
                "
              >
                Continuar comprando
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              {/* PRODUTOS */}

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-(--text-main)">
                  Produtos
                </h2>

                {cart.items.map((item) => {
                  const subtotal = item.productId.price * item.quantity;

                  const isUpdating = updatingProduct === item.productId._id;

                  return (
                    <div
                      key={item._id}
                      className="
                        group
                        flex
                        flex-col
                        sm:flex-row
                        gap-5
                        p-4
                        border
                        border-(--border-color)
                        rounded-xl
                        bg-(--card-bg)
                        hover:bg-(--surface-hover)
                        transition-all
                      "
                    >
                      {/* IMAGEM */}

                      <Link
                        to={`/pagina-produto/${item.productId._id}`}
                        className="
                          w-full
                          sm:w-28
                          h-44
                          sm:h-28
                          shrink-0
                          bg-(--surface-lowest)
                          rounded-lg
                          overflow-hidden
                        "
                      >
                        {item.productId.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productId.title}
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-105
                              transition-transform
                              duration-300
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-full
                              h-full
                              flex
                              items-center
                              justify-center
                              text-xs
                              text-(--text-muted)
                            "
                          >
                            Sem imagem
                          </div>
                        )}
                      </Link>

                      {/* INFORMAÇÕES */}

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <Link to={`/pagina-produto/${item.productId._id}`}>
                              <h3
                                className="
                                  font-semibold
                                  text-(--text-main)
                                  hover:text-(--primary-accent)
                                  transition-colors
                                  truncate
                                "
                              >
                                {item.productId.title}
                              </h3>
                            </Link>

                            <p className="text-sm text-(--text-secondary) mt-1">
                              {formatPrice(item.productId.price)}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs text-(--text-muted)">
                              Subtotal
                            </p>

                            <p className="font-semibold text-(--text-main) mt-1">
                              {formatPrice(subtotal)}
                            </p>
                          </div>
                        </div>

                        {/* CONTROLES */}

                        <div
                          className="
                            mt-auto
                            pt-5
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              border
                              border-(--border-color)
                              rounded-lg
                              overflow-hidden
                              bg-(--surface-lowest)
                            "
                          >
                            <button
                              onClick={() => handleDec(item.productId._id)}
                              disabled={isUpdating}
                              className="
                                w-10
                                h-10
                                flex
                                items-center
                                justify-center
                                hover:bg-(--surface-hover)
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              <Minus size={16} />
                            </button>

                            <span
                              className="
                                w-10
                                text-center
                                text-sm
                                font-semibold
                              "
                            >
                              {isUpdating ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin mx-auto"
                                />
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <button
                              onClick={() => handleAdd(item.productId._id)}
                              disabled={isUpdating}
                              className="
                                w-10
                                h-10
                                flex
                                items-center
                                justify-center
                                hover:bg-(--surface-hover)
                                transition-colors
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <span className="text-xs text-(--text-muted)">
                            Quantidade: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* RESUMO */}

              <aside
                className="
                  lg:sticky
                  lg:top-24
                  border
                  border-(--border-color)
                  rounded-2xl
                  p-6
                  bg-(--card-bg)
                "
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                  Resumo do pedido
                </p>

                <h2 className="mt-2 text-xl font-semibold text-(--text-main)">
                  Resumo
                </h2>

                <div
                  className="
                    mt-6
                    space-y-4
                    pb-6
                    border-b
                    border-(--border-color)
                  "
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-(--text-secondary)">Produtos</span>

                    <span className="text-(--text-main)">{totalItems}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-(--text-secondary)">Frete</span>

                    <span className="text-(--text-muted)">
                      Calculado no checkout
                    </span>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    mt-6
                  "
                >
                  <span className="text-sm text-(--text-secondary)">Total</span>

                  <span className="text-2xl font-bold text-(--text-main)">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  to="/payments/checkout"
                  className="
                    mt-6
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-(--primary-accent)
                    text-(--primary-text)
                    py-3.5
                    rounded-lg
                    text-sm
                    font-bold
                    hover:bg-(--primary-hover)
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  Ir para pagamento
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/home"
                  className="
                    mt-4
                    block
                    text-center
                    text-xs
                    text-(--text-secondary)
                    hover:text-(--text-main)
                    transition-colors
                  "
                >
                  Continuar comprando
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
