import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Truck,
    ChevronDown,
    ChevronUp,
    Tag,
    Package,
    Loader2,
} from "lucide-react";

import {
    getProdById,
    addProductsService,
} from "../services/APIservice";

import HeaderComp from "../components/header";
import type { ProdUI } from "../model/prodModel";
import { useParams } from "react-router";
import Toast from "../components/notify";

type FreightResult = {
    valor: string;
    prazo: string;
};

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<ProdUI | null>(null);
    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] = useState("");
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const [cep, setCep] = useState("");
    const [freightResult, setFreightResult] =
        useState<FreightResult | null>(null);

    const [thumbnails, setThumbnails] = useState<string[]>([]);

    const [toast, setToast] = useState<{
        show: boolean;
        msg: string;
        type: "success" | "error" | "warning" | "info";
        time?: number;
    }>({
        show: false,
        msg: "",
        type: "success",
        time: 3000,
    });

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const response = await getProdById(id);

                const prodData = response.data || response;

                setProduct(prodData);

                const mainImage =
                    prodData.image ||
                    "https://placehold.co/800x800/1b1c1c/e4e2e1?text=Sem+Imagem";

                setActiveImage(mainImage);

                setThumbnails([
                    mainImage,
                    mainImage,
                    mainImage,
                ]);
            } catch (error) {
                console.error(
                    "Erro ao carregar produto:",
                    error
                );

                setToast({
                    show: true,
                    msg: "Não foi possível carregar o produto.",
                    type: "error",
                    time: 4000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const formatPrice = (price: number) => {
        return price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleAddToCart = async () => {
        if (!product?._id) return;

        try {
            await addProductsService({
                productId: product._id,
            });

            setToast({
                show: true,
                msg: "Produto adicionado ao carrinho!",
                type: "success",
                time: 4000,
            });
        } catch (error) {
            console.error(
                "Erro ao adicionar produto:",
                error
            );

            setToast({
                show: true,
                msg: "Não foi possível adicionar o produto.",
                type: "error",
                time: 4000,
            });
        }
    };

    const handleCepChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value.replace(/\D/g, "");

        const formattedCep = value
            .slice(0, 8)
            .replace(/^(\d{5})(\d)/, "$1-$2");

        setCep(formattedCep);

        setFreightResult(null);
    };

    const handleCalculateFreight = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const cleanCep = cep.replace(/\D/g, "");

        if (cleanCep.length !== 8) {
            setToast({
                show: true,
                msg: "Digite um CEP válido com 8 números.",
                type: "warning",
                time: 4000,
            });

            return;
        }

        const firstDigit = Number(cleanCep.charAt(0));

        const isNearbyRegion =
            firstDigit === 0 ||
            firstDigit === 1;

        setFreightResult({
            valor: isNearbyRegion
                ? "R$ 12,90"
                : "R$ 24,50",

            prazo: isNearbyRegion
                ? "3 dias úteis"
                : "7 dias úteis",
        });
    };

    if (loading) {
        return (
            <>
                <HeaderComp />

                <main className="min-h-screen bg-(--site-bg) flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2
                            className="animate-spin text-(--primary-accent)"
                            size={32}
                        />

                        <p className="text-sm text-(--text-secondary)">
                            Carregando detalhes do produto...
                        </p>
                    </div>
                </main>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <HeaderComp />

                <main className="min-h-screen bg-(--site-bg) flex items-center justify-center p-6">
                    <div className="text-center">
                        <Package
                            size={40}
                            className="mx-auto mb-4 text-(--text-muted)"
                        />

                        <h2 className="text-xl font-semibold text-(--text-main)">
                            Produto não encontrado
                        </h2>

                        <p className="text-sm text-(--text-muted) mt-2">
                            Este produto pode ter sido removido.
                        </p>
                    </div>
                </main>
            </>
        );
    }

    const temDesconto = product.discount > 0;

    const precoFinal = temDesconto
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const temEstoque = product.quantity > 0;

    return (
        <>
            <HeaderComp />

            <main className="min-h-screen bg-(--site-bg) text-(--text-main) py-8 md:py-12 px-4">
                <div className="w-full max-w-7xl mx-auto">

                    <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5 md:p-8 lg:p-10 shadow-2xl">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

                            <section className="flex flex-col-reverse sm:flex-row gap-4">

                                <div className="flex sm:flex-col gap-3">

                                    {thumbnails.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setActiveImage(image)
                                            }
                                            className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                                activeImage === image
                                                    ? "border-(--primary-accent)"
                                                    : "border-(--border-color) hover:border-(--border-light)"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Imagem ${
                                                    index + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}

                                </div>

                                <div className="flex-1">

                                    <div className="relative aspect-square max-h-130 bg-(--surface-lowest) border border-(--border-color) rounded-xl overflow-hidden group">

                                        {temDesconto && (
                                            <span className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-(--error-bg) text-(--error-text) px-3 py-1.5 rounded-lg text-xs font-bold">
                                                <Tag size={13} />

                                                {product.discount}% OFF
                                            </span>
                                        )}

                                        <img
                                            src={activeImage}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                    </div>

                                </div>

                            </section>

                            <section className="flex flex-col">

                                <div className="mb-6">

                                    {temDesconto && (
                                        <span className="inline-flex mb-3 text-xs font-semibold text-(--success)">
                                            Oferta especial disponível
                                        </span>
                                    )}

                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-(--text-main)">
                                        {product.title}
                                    </h1>

                                    <div className="flex items-center gap-2 mt-4 text-sm">

                                        <Package
                                            size={16}
                                            className="text-(--text-muted)"
                                        />

                                        {temEstoque ? (
                                            <span className="text-(--success)">
                                                Em estoque • {product.quantity} unidades
                                            </span>
                                        ) : (
                                            <span className="text-(--error)">
                                                Produto esgotado
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <div className="bg-(--surface-lowest) border border-(--border-color) rounded-xl p-5 mb-6">

                                    {temDesconto ? (
                                        <>
                                            <p className="text-sm text-(--text-muted) line-through">
                                                De {formatPrice(product.price)}
                                            </p>

                                            <div className="flex items-end gap-2 mt-1">

                                                <span className="text-3xl md:text-4xl font-bold text-(--success)">
                                                    {formatPrice(precoFinal)}
                                                </span>

                                                <span className="text-xs text-(--text-muted) mb-2">
                                                    à vista
                                                </span>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-end gap-2">

                                                <span className="text-3xl md:text-4xl font-bold text-(--primary-accent)">
                                                    {formatPrice(product.price)}
                                                </span>

                                                <span className="text-xs text-(--text-muted) mb-2">
                                                    à vista
                                                </span>

                                            </div>
                                        </>
                                    )}

                                </div>
                                <div className="border-t border-(--border-color) pt-6 mb-6">

                                    <h2 className="font-semibold text-(--text-main) mb-3">
                                        Sobre este produto
                                    </h2>

                                    <p
                                        className={`text-sm leading-relaxed text-(--text-secondary) ${
                                            !isDescExpanded
                                                ? "line-clamp-5"
                                                : ""
                                        }`}
                                    >
                                        {product.desc ||
                                            "Nenhuma descrição detalhada foi fornecida para este produto."}
                                    </p>

                                    {product.desc &&
                                        product.desc.length > 150 && (
                                            <button
                                                onClick={() =>
                                                    setIsDescExpanded(
                                                        !isDescExpanded
                                                    )
                                                }
                                                className="mt-3 flex items-center gap-1 text-xs font-semibold text-(--primary-accent) hover:text-(--primary-hover) transition-colors cursor-pointer"
                                            >
                                                {isDescExpanded ? (
                                                    <>
                                                        Ver menos

                                                        <ChevronUp
                                                            size={14}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        Ler mais

                                                        <ChevronDown
                                                            size={14}
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                </div>

                                {/* FRETE */}

                                <div className="border-t border-(--border-color) pt-6 mb-6">

                                    <h2 className="flex items-center gap-2 font-semibold text-(--text-main) mb-4">

                                        <Truck
                                            size={18}
                                            className="text-(--text-secondary)"
                                        />

                                        Calcular frete

                                    </h2>

                                    <form
                                        onSubmit={handleCalculateFreight}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >

                                        <input
                                            type="text"
                                            value={cep}
                                            onChange={handleCepChange}
                                            placeholder="Digite seu CEP"
                                            maxLength={9}
                                            className="flex-1 bg-(--input-bg) border border-(--border-color) rounded-lg px-4 py-3 text-sm text-(--text-main) outline-none transition-colors focus:border-(--border-light)"
                                        />

                                        <button
                                            type="submit"
                                            className="bg-(--surface-high) hover:bg-(--surface-hover) border border-(--border-color) px-5 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                        >
                                            Calcular
                                        </button>

                                    </form>

                                    {freightResult && (
                                        <div className="mt-4 bg-(--surface-lowest) border border-(--border-color) rounded-lg p-4 animate-in fade-in slide-in-from-top-2">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-xs text-(--text-muted)">
                                                        Entrega padrão
                                                    </p>

                                                    <p className="text-sm font-semibold text-(--text-main) mt-1">
                                                        {freightResult.prazo}
                                                    </p>

                                                </div>

                                                <span className="font-bold text-(--success)">
                                                    {freightResult.valor}
                                                </span>

                                            </div>

                                        </div>
                                    )}

                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!temEstoque}
                                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                                        temEstoque
                                            ? "bg-(--primary-accent) text-(--primary-text) hover:bg-(--primary-hover) cursor-pointer active:scale-[0.99]"
                                            : "bg-(--surface-high) text-(--text-disabled) cursor-not-allowed"
                                    }`}
                                >

                                    <ShoppingCart size={19} />

                                    {temEstoque
                                        ? "Adicionar ao Carrinho"
                                        : "Produto Esgotado"}

                                </button>

                            </section>

                        </div>

                    </div>

                </div>
            </main>

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