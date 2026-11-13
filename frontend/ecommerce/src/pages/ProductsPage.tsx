import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Grid,
  List,
  Package,
  Loader2,
  X,
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  Image as ImageIcon,
} from "lucide-react";
import HeaderComp from "../components/header";
import {
  getProductsService,
  getCategoriesService,
  type Category,
} from "../services/APIservice";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/notify";
import { Link } from "react-router";
import FavoriteButton from "../components/FavoriteButton";

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

type SortOption =
  "newest" | "oldest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function ProductsPage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [produto, setProduto] = useState<Produto>({
    _id: "",
    title: "",
    desc: "",
    image: "",
    quantity: 0,
    price: 0,
    isFeatured: false,
    discount: 0,
    categoria: [],
  });
  const [newProd, setNewProd] = useState<Produto>({} as Produto);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsService(100);
        setProdutos(response);
      } catch (error) {
        console.error("Error loading products:", error);
        setToast({
          show: true,
          msg: "Erro ao carregar produtos",
          type: "error",
          time: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesService();
        setCategories(response || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let result = [...produtos];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoria?.includes(categoryFilter));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "oldest":
          return 0; // No createdAt in type, fallback
        case "newest":
        default:
          return 0;
      }
    });

    return result;
  }, [produtos, searchQuery, sortBy, categoryFilter]);

  const handleAdd = async (_id: string) => {
    try {
      const { addProductsService } = await import("../services/APIservice");
      await addProductsService({ productId: _id });

      setToast({
        show: true,
        msg: "Produto adicionado ao carrinho!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
      setToast({
        show: true,
        msg: "Erro ao adicionar ao carrinho",
        type: "error",
        time: 4000,
      });
    }
  };

  const handleDelete = async (_id: string) => {
    const confirmed = confirm("Tem certeza que deseja excluir este produto?");

    if (!confirmed) return;

    try {
      const { deleteProdService } = await import("../services/APIservice");
      await deleteProdService(_id);

      setProdutos((prev) => prev.filter((item) => item._id !== _id));

      setToast({
        show: true,
        msg: "Produto excluído com sucesso!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
      setToast({
        show: true,
        msg: "Erro ao excluir produto",
        type: "error",
        time: 4000,
      });
    }
  };

  const handleCreateProd = async (produtoData: Produto) => {
    try {
      const { createProdService } = await import("../services/APIservice");
      const { _id, ...data } = produtoData;
      const response = await createProdService(data as any);

      setProdutos((prev) => [...prev, response]);
      setIsOpen(false);

      setProduto({
        _id,
        title: "",
        price: 0,
        desc: "",
        image: "",
        quantity: 0,
        isFeatured: false,
        discount: 0,
        categoria: [],
      });

      setToast({
        show: true,
        msg: "Produto criado com sucesso!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
      setToast({
        show: true,
        msg: "Erro ao criar produto",
        type: "error",
        time: 4000,
      });
    }
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing = false,
  ) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    const floatValue = Number(value) / 100;

    if (isEditing) {
      setNewProd({ ...newProd, price: floatValue });
    } else {
      setProduto({ ...produto, price: floatValue });
    }
  };

  const handleEditProd = async (newprod: Produto) => {
    try {
      const { editProdService } = await import("../services/APIservice");
      await editProdService(newProd._id!, newprod);

      setProdutos((prev) =>
        prev.map((item) =>
          item._id === newProd._id ? { ...item, ...newprod } : item,
        ),
      );

      setIsEdit(false);

      setToast({
        show: true,
        msg: "Produto atualizado com sucesso!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
      setToast({
        show: true,
        msg: "Erro ao atualizar produto",
        type: "error",
        time: 4000,
      });
    }
  };

  const inputStyle =
    "w-full bg-(--surface-lowest) border border-(--border-color) rounded-lg px-4 py-3 text-sm text-(--text-main) placeholder:text-(--text-muted) outline-none focus:border-(--primary-accent) transition-colors";

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
              Carregando produtos...
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
          {/* SEARCH & FILTERS SECTION */}
          <section className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-(--surface-lowest) border border-(--border-color) rounded-lg text-sm text-(--text-main) placeholder:text-(--text-muted) outline-none focus:border-(--primary-accent) transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-(--surface-lowest) border border-(--border-color) rounded-lg px-3 py-2 text-xs text-(--text-main) outline-none focus:border-(--primary-accent) transition-colors cursor-pointer appearance-none bg-no-repeat bg-right pr-8 h-9"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238e9192' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundPosition: "right 6px center",
                  }}
                >
                  <option value="newest">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                </select>

                {/* Category Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                    className="flex items-center gap-2 h-9 px-3 py-2 bg-(--surface-lowest) border border-(--border-color) rounded-lg text-xs text-(--text-main) outline-none focus:border-(--primary-accent) transition-colors cursor-pointer appearance-none"
                    aria-expanded={isCategoryDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <Package size={13} />
                    <span>
                      {categoryFilter === "all"
                        ? "Todas as categorias"
                        : categoryFilter}
                    </span>
                    <svg
                      className={`w-4 h-4 text-(--text-muted) transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-56 bg-(--card-bg) border border-(--border-color) rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                      <button
                        onClick={() => {
                          setCategoryFilter("all");
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          categoryFilter === "all"
                            ? "bg-(--primary-accent)/10 text-(--primary-accent)"
                            : "text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-main)"
                        }`}
                      >
                        Todas as categorias
                      </button>
                      <hr className="border-(--border-color) my-1" />
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => {
                            setCategoryFilter(cat.name);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            categoryFilter === cat.name
                              ? "bg-(--primary-accent)/10 text-(--primary-accent)"
                              : "text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-main)"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 border border-(--border-color) rounded-lg overflow-hidden h-9">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition-colors ${
                      viewMode === "grid"
                        ? "bg-(--primary-accent) text-(--primary-text)"
                        : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--surface-hover)"
                    }`}
                    aria-label="Visualização em grade"
                  >
                    <Grid size={13} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 transition-colors ${
                      viewMode === "list"
                        ? "bg-(--primary-accent) text-(--primary-text)"
                        : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--surface-hover)"
                    }`}
                    aria-label="Visualização em lista"
                  >
                    <List size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* ADD PRODUCT BUTTON (only for admins) */}
            {["admin", "editor"].includes(user?.roles) && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setIsEdit(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 bg-(--primary-accent) text-(--primary-text) rounded-md text-xs font-semibold hover:bg-(--primary-hover) transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Adicionar Produto
                </button>
              </div>
            )}
          </section>

          {/* PRODUCTS GRID */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredProducts.map((produto) => (
                <ProductCard
                  key={produto._id}
                  produto={produto}
                  onAdd={handleAdd}
                  onEdit={
                    isEdit
                      ? undefined
                      : () => {
                          setNewProd(produto);
                          setIsEdit(true);
                          setIsOpen(false);
                        }
                  }
                  onDelete={handleDelete}
                  formatPrice={formatPrice}
                  isAdmin={["admin", "editor"].includes(user?.roles)}
                />
              ))}
            </div>
          ) : (
            filteredProducts.map((produto) => (
              <ProductListItem
                key={produto._id}
                produto={produto}
                onAdd={handleAdd}
                onEdit={
                  isEdit
                    ? undefined
                    : () => {
                        setNewProd(produto);
                        setIsEdit(true);
                        setIsOpen(false);
                      }
                }
                onDelete={handleDelete}
                formatPrice={formatPrice}
                isAdmin={["admin", "editor"].includes(user?.roles)}
              />
            ))
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <Package size={48} className="text-(--text-muted) mb-4" />
              <h3 className="text-lg font-medium text-(--text-main)">
                Nenhum produto encontrado
              </h3>
              <p className="text-sm text-(--text-muted) mt-2 max-w-sm">
                {searchQuery
                  ? `Nenhum produto corresponde a "${searchQuery}". Tente outro termo.`
                  : "Nenhum produto cadastrado no momento."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-sm text-(--primary-accent) hover:text-(--primary-hover) font-medium underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </div>

        {/* CREATE/EDIT MODALS */}
        {isOpen && (
          <ProductModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Adicionar Produto"
            produto={produto}
            setProduto={setProduto}
            onSubmit={handleCreateProd}
            inputStyle={inputStyle}
            handlePriceChange={(e) => handlePriceChange(e, false)}
            categories={categories}
          />
        )}

        {isEdit && (
          <ProductModal
            isOpen={isEdit}
            onClose={() => setIsEdit(false)}
            title="Editar Produto"
            produto={newProd}
            setProduto={setNewProd}
            onSubmit={handleEditProd}
            inputStyle={inputStyle}
            handlePriceChange={(e) => handlePriceChange(e, true)}
            isEditing={true}
            categories={categories}
          />
        )}

        {/* TOAST */}
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

// Product Card Component
interface ProductCardProps {
  produto: Produto;
  onAdd: (_id: string) => void;
  onEdit?: () => void;
  onDelete?: (_id: string) => void;
  formatPrice: (price: number) => string;
  isAdmin: boolean;
}

function ProductCard({
  produto,
  onAdd,
  onEdit,
  onDelete,
  formatPrice,
  isAdmin,
}: ProductCardProps) {
  const temDesconto = produto.discount > 0;
  const precoFinal = temDesconto
    ? produto.price * (1 - produto.discount / 100)
    : produto.price;
  const temEstoque = produto.quantity > 0;

  return (
    <article className="group relative flex flex-col h-120">
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
            <ImageIcon size={22} />
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

        <div className="flex gap-2 w-full">
          <button
            onClick={() => onAdd(produto._id)}
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

          <FavoriteButton productId={produto._id} size={18} />
        </div>

        {isAdmin && (
          <div className="flex gap-1.5 mt-1">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] border border-(--border-color) rounded-md text-(--text-muted) hover:text-(--text-main) hover:border-(--border-light) transition-colors cursor-pointer"
            >
              <Pencil size={11} />
              Editar
            </button>
            <button
              onClick={() => onDelete?.(produto._id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] border border-(--border-color) rounded-md text-(--text-muted) hover:text-(--error) hover:border-(--error) transition-colors cursor-pointer"
            >
              <Trash2 size={11} />
              Excluir
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// Product List Item Component
interface ProductListItemProps {
  produto: Produto;
  onAdd: (_id: string) => void;
  onEdit?: () => void;
  onDelete?: (_id: string) => void;
  formatPrice: (price: number) => string;
  isAdmin: boolean;
}

function ProductListItem({
  produto,
  onAdd,
  onEdit,
  onDelete,
  formatPrice,
  isAdmin,
}: ProductListItemProps) {
  const temDesconto = produto.discount > 0;
  const precoFinal = temDesconto
    ? produto.price * (1 - produto.discount / 100)
    : produto.price;
  const temEstoque = produto.quantity > 0;

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 sm:p-3 hover:bg-(--surface-hover) transition-colors group">
      <Link
        to={`/pagina-produto/${produto._id}`}
        className="relative w-15 h-20 sm:w-15 sm:h-15 shrink-0 rounded-lg overflow-hidden bg-(--surface-lowest) border border-(--border-color)"
      >
        {produto.image ? (
          <img
            src={produto.image}
            alt={produto.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-(--text-muted)">
            <ImageIcon size={20} />
          </div>
        )}
        {temDesconto && (
          <span className="absolute top-1.5 left-1.5 bg-(--error-bg) text-(--error-text) text-[9px] font-bold px-1.5 py-0.5 rounded">
            {produto.discount}% OFF
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 w-full">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/pagina-produto/${produto._id}`}
              className="font-medium text-(--text-main) text-sm truncate hover:text-(--primary-accent) transition-colors"
            >
              {produto.title}
            </Link>
            <p className="text-xs text-(--text-muted) truncate">
              {produto.desc}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          {temDesconto ? (
            <div className="flex flex-col items-end">
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
          <Package size={11} />
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => onAdd(produto._id)}
              disabled={!temEstoque}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                temEstoque
                  ? "bg-(--primary-accent) text-(--primary-text) hover:bg-(--primary-hover) cursor-pointer active:scale-[0.98]"
                  : "bg-(--surface-high) text-(--text-disabled) cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={12} />
              {temEstoque ? "Adicionar" : "Esgotado"}
            </button>

            <FavoriteButton productId={produto._id} size={16} />
          </div>

          {isAdmin && (
            <div className="flex gap-1.5">
              <button
                onClick={onEdit}
                className="p-2 border border-(--border-color) rounded-md text-(--text-muted) hover:text-(--text-main) hover:border-(--border-light) hover:bg-(--surface-hover) transition-colors cursor-pointer flex-1"
                title="Editar"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => onDelete?.(produto._id)}
                className="p-2 border border-(--border-color) rounded-md text-(--text-muted) hover:text-(--error) hover:border-(--error) hover:bg-(--error-bg)/10 transition-colors cursor-pointer flex-1"
                title="Excluir"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Product Modal Component
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  produto: Produto;
  setProduto: React.Dispatch<React.SetStateAction<Produto>>;
  onSubmit: (produto: Produto) => void;
  inputStyle: string;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[];
  isEditing?: boolean;
}

function ProductModal({
  isOpen,
  onClose,
  title,
  produto,
  setProduto,
  onSubmit,
  inputStyle,
  handlePriceChange,
  categories,
  isEditing = false,
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-(--card-bg) border border-(--border-color) rounded-xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-main) transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-wider text-(--text-muted) mb-2">
            Gerenciamento
          </p>
          <h2 className="text-xl font-semibold text-(--text-main)">{title}</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(produto);
          }}
          className="flex flex-col gap-3"
        >
          <input
            placeholder="Título do produto"
            className={inputStyle}
            type="text"
            value={produto.title}
            onChange={(e) => setProduto({ ...produto, title: e.target.value })}
            required
          />

          <input
            placeholder="Descrição do produto"
            className={inputStyle}
            type="text"
            value={produto.desc}
            onChange={(e) => setProduto({ ...produto, desc: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Quantidade"
              className={inputStyle}
              type="number"
              value={produto.quantity || ""}
              onChange={(e) =>
                setProduto({
                  ...produto,
                  quantity: +e.target.value,
                })
              }
              min={0}
              required
            />

            <div>
              <label className="text-[10px] text-(--text-muted) mb-1.5 block">
                Preço
              </label>
              <input
                placeholder="0,00"
                className={inputStyle}
                type="text"
                value={
                  produto.price > 0
                    ? produto.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })
                    : ""
                }
                onChange={handlePriceChange}
                required
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="URL da imagem"
            value={produto.image}
            className={inputStyle}
            onChange={(e) => setProduto({ ...produto, image: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={produto.isFeatured}
                onChange={(e) =>
                  setProduto({ ...produto, isFeatured: e.target.checked })
                }
                className="w-3.5 h-3.5 rounded border border-(--border-color) text-(--primary-accent) focus:ring-(--primary-accent) bg-(--surface-lowest)"
              />
              <span className="text-xs text-(--text-secondary)">
                Produto em destaque
              </span>
            </label>

            <div>
              <label className="text-[10px] text-(--text-muted) mb-1.5 block">
                Desconto (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={produto.discount}
                onChange={(e) =>
                  setProduto({ ...produto, discount: +e.target.value })
                }
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-(--text-muted) mb-1.5 block">
              Categorias
              <span className="text-(--text-muted) ml-2">
                ({categories.length} disponíveis)
              </span>
            </label>
            <div className="w-full bg-(--surface-lowest) border border-(--border-color) rounded-lg p-3 min-h-20 focus-within:border-(--primary-accent) transition-colors">
              {categories.length === 0 ? (
                <p className="text-sm text-(--text-muted)">
                  Nenhuma categoria disponível
                </p>
              ) : (
                <>
                  <div
                    className="flex flex-wrap gap-2 mb-2"
                    role="group"
                    aria-label="Categorias selecionadas"
                  >
                    {produto.categoria.map((cat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-(--primary-accent)/20 text-(--primary-accent) text-xs rounded-full border border-(--primary-accent)/30"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() =>
                            setProduto({
                              ...produto,
                              categoria: produto.categoria.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                          className="hover:text-white transition-colors"
                          aria-label={`Remover ${cat}`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {categories.map((cat) => {
                      const isSelected = produto.categoria.includes(cat.name);
                      return (
                        <label
                          key={cat._id}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm cursor-pointer transition-all ${
                            isSelected
                              ? "bg-(--primary-accent)/20 border-(--primary-accent) text-(--primary-accent)"
                              : "border-(--border-color) text-(--text-muted) hover:border-(--primary-accent)/50 hover:text-(--text-main)"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              setProduto({
                                ...produto,
                                categoria: isSelected
                                  ? produto.categoria.filter(
                                      (c) => c !== cat.name,
                                    )
                                  : [...produto.categoria, cat.name],
                              })
                            }
                            className="w-4 h-4 accent-(--primary-accent) border-(--border-color) bg-(--surface-lowest) rounded"
                          />
                          <span>{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-(--border-color)">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-(--border-color) text-(--text-muted) rounded-md hover:text-(--text-main) hover:border-(--border-light) hover:bg-(--surface-hover) transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 bg-(--primary-accent) text-(--primary-text) rounded-md font-semibold hover:bg-(--primary-hover) transition-colors cursor-pointer"
            >
              {isEditing ? "Salvar Alterações" : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
