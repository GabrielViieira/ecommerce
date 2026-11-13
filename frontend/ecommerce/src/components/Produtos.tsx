import React, { useEffect, useState, useRef } from "react";
import {
  addProductsService,
  createProdService,
  deleteProdService,
  editProdService,
  getProductsService,
  getCategoriesService,
  type Category,
} from "../services/APIservice";
import { useAuth } from "../context/AuthContext";
import Toast from "./notify";
import { Link } from "react-router";
import {
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  X,
  Package,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import FavoriteButton from "./FavoriteButton";

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

type ProdutosGridProps = {
  itemsPerPage: number;
};

export default function ProdutosGrid({ itemsPerPage }: ProdutosGridProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

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
    const loadProducts = async () => {
      try {
        const response = await getProductsService(itemsPerPage);
        setProdutos(response);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesService();
        console.log("Categories loaded:", response);
        setCategories(response || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (isOpen || isEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, isEdit]);

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

  // Filter products by category
  const filteredProducts = React.useMemo(() => {
    let result = [...produtos];

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoria?.includes(categoryFilter));
    }

    return result;
  }, [produtos, categoryFilter]);

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

  const handleDelete = async (_id: string) => {
    const confirmed = confirm("Do you want to delete this product?");

    if (!confirmed) return;

    try {
      await deleteProdService(_id);

      setProdutos((prev) => prev.filter((item) => item._id !== _id));

      setToast({
        show: true,
        msg: "Product deleted successfully!",
        type: "info",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProd = async (produto: Produto) => {
    try {
      const { _id, ...data } = produto;

      const response = await createProdService(data as any);

      setProdutos((prev) => [...prev, response]);

      setIsOpen(false);

      setProduto({
        _id: "",
        title: "",
        price: 0,
        desc: "",
        image: "",
        quantity: 0,
        isFeatured: false,
        discount: 0,
        categoria: [],
      } as Produto);

      setToast({
        show: true,
        msg: "Product created successfully!",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
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
      setNewProd({
        ...newProd,
        price: floatValue,
      });
    } else {
      setProduto({
        ...produto,
        price: floatValue,
      });
    }
  };

  const handleEditProd = async (newprod: Produto) => {
    try {
      await editProdService(newProd._id!, newprod);

      setProdutos((prev) =>
        prev.map((item) =>
          item._id === newProd._id ? { ...item, ...newprod } : item,
        ),
      );

      setIsEdit(false);

      setToast({
        show: true,
        msg: "Product updated successfully!",
        type: "info",
        time: 4000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inputStyle =
    "w-full bg-[#181818] border border-[#303030] rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors";

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-2">
              Explore
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Products
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Category Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="flex items-center gap-2 w-full sm:w-auto px-5 py-3 bg-[#181818] border border-[#303030] rounded-lg text-sm font-semibold text-white hover:bg-[#1f1f1f] transition-colors cursor-pointer"
                aria-expanded={isCategoryDropdownOpen}
                aria-haspopup="listbox"
              >
                <Package size={18} />
                <span>
                  {categoryFilter === "all" ? "All Categories" : categoryFilter}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-56 bg-[#151515] border border-[#303030] rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      categoryFilter === "all"
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-zinc-400 hover:bg-[#1f1f1f] hover:text-white"
                    }`}
                  >
                    All Categories
                  </button>
                  <hr className="border-[#303030] my-1" />
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setCategoryFilter(cat.name);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                        categoryFilter === cat.name
                          ? "bg-purple-600/20 text-purple-300"
                          : "text-zinc-400 hover:bg-[#1f1f1f] hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {["admin", "editor"].includes(user?.roles) && (
              <button
                onClick={() => {
                  setIsOpen(true);
                  setIsEdit(false);
                }}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <Plus size={18} />
                Add Product
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Management
                </p>

                <h2 className="text-2xl font-semibold text-white">
                  Add Product
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  placeholder="Product title"
                  className={inputStyle}
                  type="text"
                  value={produto.title}
                  onChange={(e) =>
                    setProduto({
                      ...produto,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Product description"
                  className={inputStyle}
                  type="text"
                  value={produto.desc}
                  onChange={(e) =>
                    setProduto({
                      ...produto,
                      desc: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Quantity"
                  className={inputStyle}
                  type="number"
                  value={produto.quantity || ""}
                  onChange={(e) =>
                    setProduto({
                      ...produto,
                      quantity: +e.target.value,
                    })
                  }
                />

                <div>
                  <label className="text-xs text-zinc-500 mb-2 block">
                    Price
                  </label>

                  <input
                    placeholder="0.00"
                    className={inputStyle}
                    type="text"
                    value={
                      produto.price > 0
                        ? produto.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : ""
                    }
                    onChange={(e) => handlePriceChange(e, false)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Image URL"
                  value={produto.image}
                  className={inputStyle}
                  onChange={(e) =>
                    setProduto({
                      ...produto,
                      image: e.target.value,
                    })
                  }
                />

                <div>
                  <label className="text-xs text-zinc-500 mb-2 block">
                    Categories
                    <span className="text-zinc-600 ml-2">
                      ({categories.length} available)
                    </span>
                  </label>
                  <div className="w-full bg-[#181818] border border-[#303030] rounded-lg p-3 min-h-[80px] focus-within:border-purple-500 transition-colors">
                    {categories.length === 0 ? (
                      <p className="text-sm text-zinc-600">
                        No categories available
                      </p>
                    ) : (
                      <>
                        <div
                          className="flex flex-wrap gap-2 mb-2"
                          role="group"
                          aria-label="Selected categories"
                        >
                          {produto.categoria.map((cat, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
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
                                aria-label={`Remove ${cat}`}
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
                            const isSelected = produto.categoria.includes(
                              cat.name,
                            );
                            return (
                              <label
                                key={cat._id}
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                    : "border-[#303030] text-zinc-400 hover:border-purple-500/50 hover:text-white"
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
                                  className="w-4 h-4 accent-purple-500 border-[#303030] bg-[#181818] rounded"
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

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleCreateProd(produto)}
                    className="flex-1 bg-white text-black py-3 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Create Product
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 border border-[#333] text-zinc-400 rounded-lg hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEdit && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsEdit(false)}
                className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                  Management
                </p>

                <h2 className="text-2xl font-semibold text-white">
                  Edit Product
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Product Name
                  </label>

                  <input
                    type="text"
                    className={inputStyle}
                    placeholder="Product name"
                    value={newProd.title}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Description
                  </label>

                  <input
                    type="text"
                    className={inputStyle}
                    placeholder="Description"
                    value={newProd.desc}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        desc: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">
                      Quantity
                    </label>

                    <input
                      type="number"
                      className={inputStyle}
                      value={newProd.quantity}
                      onChange={(e) =>
                        setNewProd({
                          ...newProd,
                          quantity: +e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">
                      Price
                    </label>

                    <input
                      type="text"
                      className={inputStyle}
                      value={
                        newProd.price > 0
                          ? newProd.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })
                          : ""
                      }
                      onChange={(e) => handlePriceChange(e, true)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Image URL
                  </label>

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProd.image}
                    className={inputStyle}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Categories
                    <span className="text-zinc-600 ml-2">
                      ({categories.length} available)
                    </span>
                  </label>
                  <div className="w-full bg-[#181818] border border-[#303030] rounded-lg p-3 min-h-[80px] focus-within:border-purple-500 transition-colors">
                    {categories.length === 0 ? (
                      <p className="text-sm text-zinc-600">
                        No categories available
                      </p>
                    ) : (
                      <>
                        <div
                          className="flex flex-wrap gap-2 mb-2"
                          role="group"
                          aria-label="Selected categories"
                        >
                          {newProd.categoria.map((cat, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                            >
                              {cat}
                              <button
                                type="button"
                                onClick={() =>
                                  setNewProd({
                                    ...newProd,
                                    categoria: newProd.categoria.filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  })
                                }
                                className="hover:text-white transition-colors"
                                aria-label={`Remove ${cat}`}
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
                            const isSelected = newProd.categoria.includes(
                              cat.name,
                            );
                            return (
                              <label
                                key={cat._id}
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                    : "border-[#303030] text-zinc-400 hover:border-purple-500/50 hover:text-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    setNewProd({
                                      ...newProd,
                                      categoria: isSelected
                                        ? newProd.categoria.filter(
                                            (c) => c !== cat.name,
                                          )
                                        : [...newProd.categoria, cat.name],
                                    })
                                  }
                                  className="w-4 h-4 accent-purple-500 border-[#303030] bg-[#181818] rounded"
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

                <div className="flex gap-3 mt-5 pt-5 border-t border-[#303030]">
                  <button
                    onClick={() => setIsEdit(false)}
                    className="flex-1 py-3 border border-[#333] text-zinc-400 rounded-lg hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleEditProd(newProd)}
                    className="flex-1 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.slice(0, itemsPerPage).map((produto) => {
            const temDesconto = produto.discount > 0;

            const precoFinal = temDesconto
              ? produto.price * (1 - produto.discount / 100)
              : produto.price;

            return (
              <article key={produto._id} className="group relative">
                {/* IMAGE */}

                <Link
                  to={`/pagina-produto/${produto._id}`}
                  className="relative block aspect-4/5 bg-[#1a1a1a] overflow-hidden rounded-xl border border-[#292929]"
                >
                  {produto.image ? (
                    <img
                      src={produto.image}
                      alt={produto.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                      <ImageIcon size={28} />

                      <span className="text-xs">No image available</span>
                    </div>
                  )}

                  {temDesconto && (
                    <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full">
                      {produto.discount}% OFF
                    </span>
                  )}
                </Link>

                {/* INFO */}

                <div className="pt-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white line-clamp-1 group-hover:text-zinc-300 transition-colors">
                        {produto.title}
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2 min-h-10">
                        {produto.desc}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}

                  <div className="mt-4">
                    {temDesconto ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-600 line-through">
                          ${produto.price.toFixed(2)}
                        </span>

                        <span className="text-lg font-semibold text-white">
                          ${precoFinal.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-white">
                        ${produto.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* STOCK */}

                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                    <Package size={14} />
                    {produto.quantity} available
                  </div>

                  {/* BUTTON */}

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleAdd(produto._id)}
                      className="flex-1 py-3 border border-[#383838] rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
                    >
                      <ShoppingCart size={17} />
                      Add to Cart
                    </button>

                    <FavoriteButton productId={produto._id} size={20} />
                  </div>

                  {/* ADMIN */}

                  {["admin", "editor"].includes(user?.roles) && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setNewProd(produto);
                          setIsEdit(true);
                          setIsOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs border border-[#303030] rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(produto._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs border border-[#303030] rounded-lg text-zinc-400 hover:text-red-400 hover:border-red-900 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-[#333] rounded-xl">
            <Package size={36} className="text-zinc-600 mb-4" />

            <h3 className="text-white font-medium">No products found</h3>

            <p className="text-sm text-zinc-500 mt-2">
              {categoryFilter !== "all"
                ? `Nenhum produto encontrado na categoria "${categoryFilter}".`
                : "Products will appear here when available."}
            </p>
          </div>
        )}
      </div>

      {/* TOAST */}

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
    </>
  );
}
