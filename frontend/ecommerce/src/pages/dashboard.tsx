import { useEffect, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    bestSelling,
    createSlideService,
    deleteSlideService,
    editProdService,
    editSlideService,
    getMonthValue,
    getPayments,
    getProductsService,
    getSlidesService
} from "../services/APIservice";
import { Star, Sliders, Image as ImageIcon } from "lucide-react";
import type { ProdUI } from "../model/prodModel";
import HeaderComp from "../components/header";
import Toast from "../components/notify";

type SaleUI = {
    _id: string;
    userId?: {
        _id: string;
        username: string;
    };
    items: {
        productId: string;
        name: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    valorTotal: number;
    createdAt: string;
    status?: string;
    discount: number;
};

type GraphData = {
    month: string;
    pedidos: number;
};

type AnimationEasing =
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | "linear"
    | "spring";

type ControlsType = {
    isAnimationActive: boolean | "auto";
    animationBegin: number;
    animationDuration: number;
    animationEasing: AnimationEasing;
    replayKey: number;
};

type Slide = {
    _id?: string;
    imageUrl?: string;
    active?: boolean;
};

type ToastType = "success" | "error";

export default function Dashboard(props: Partial<ControlsType>) {
    const [sales, setSales] = useState<SaleUI[]>([]);
    const [topProducts, setTopProducts] = useState<ProdUI[]>([]);
    const [dataBar, setDataBar] = useState<GraphData[]>([]);

    const animationBegin = props.animationBegin ?? 0;
    const animationDuration = props.animationDuration ?? 850;
    const animationEasing = props.animationEasing ?? "ease-out";
    const replayKey = props.replayKey ?? 0;
    const isAnimationActive = props.isAnimationActive ?? true;

    const [isScrolling, setIsScrolling] = useState(false);
    const [startY, setStartY] = useState(0);
    const [initialScrollTop, setInitialScrollTop] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    const [discount, setDiscount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<ProdUI | null>(null);

    const [slideIds, setSlideIds] = useState<string[]>(["", "", ""]);

    const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

    const [slideLink1, setSlideLink1] = useState("");
    const [slideLink2, setSlideLink2] = useState("");
    const [slideLink3, setSlideLink3] = useState("");

    const [toast, setToast] = useState<{
        show: boolean;
        msg: string;
        type: ToastType;
        time?: number;
    }>({
        show: false,
        msg: "",
        type: "success",
        time: 3000
    });

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!scrollRef.current) return;

        setIsScrolling(true);
        setStartY(e.pageY);
        setInitialScrollTop(scrollRef.current.scrollTop);
    };

    const handleMouseLeaveOrUp = () => {
        setIsScrolling(false);
    };

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!isScrolling || !scrollRef.current) return;

        e.preventDefault();

        const distance = e.pageY - startY;

        scrollRef.current.scrollTop =
            initialScrollTop - distance * 2;
    };

    const loadSales = async () => {
        try {
            const salesData = await getPayments();

            setSales(
                Array.isArray(salesData)
                    ? salesData
                    : salesData.data || []
            );

            const productsData = await bestSelling();

            setTopProducts(
                Array.isArray(productsData)
                    ? productsData
                    : productsData.data || []
            );
        } catch (error) {
            console.error(
                "Erro ao carregar vendas ou produtos:",
                error
            );
        }
    };

    const loadGraph = async () => {
        try {
            const response = await getMonthValue();

            setDataBar(
                Array.isArray(response)
                    ? response
                    : response.data || []
            );
        } catch (error) {
            console.error(
                "Erro ao carregar gráfico:",
                error
            );
        }
    };

    const loadBannersData = async () => {
        try {
            const response = await getSlidesService(true);

            const slides: Slide[] = Array.isArray(response)
                ? response
                : (response as any[] | any) || [];

            const newLinks = ["", "", ""];
            const newIds = ["", "", ""];

            slides.slice(0, 3).forEach((slide, index) => {
                newLinks[index] = slide.imageUrl || "";
                newIds[index] = slide._id || "";
            });

            setSlideLink1(newLinks[0]);
            setSlideLink2(newLinks[1]);
            setSlideLink3(newLinks[2]);

            setSlideIds(newIds);
        } catch (error) {
            console.error(
                "Erro ao carregar banners:",
                error
            );
        }
    };

    useEffect(() => {
        loadGraph();
        loadSales();
        loadBannersData();
    }, []);

    const onToggleFeature = async (product: ProdUI) => {
        try {
            const response = await getProductsService(100);

            const allProducts: ProdUI[] =
                Array.isArray(response)
                    ? response
                    : response.data || [];

            const featuredCount = allProducts.filter(
                (item) => item.isFeatured
            ).length;

            if (product.isFeatured) {
                await editProdService(
                    product._id,
                    {
                        isFeatured: false
                    }
                );

                await loadSales();

                setToast({
                    show: true,
                    msg: "Produto removido dos destaques!",
                    type: "error",
                    time: 4000
                });

                return;
            }

            if (featuredCount >= 10) {
                setToast({
                    show: true,
                    msg: "Limite de 10 produtos em destaque atingido.",
                    type: "error",
                    time: 4000
                });

                return;
            }

            await editProdService(
                product._id,
                {
                    isFeatured: true
                }
            );

            await loadSales();

            setToast({
                show: true,
                msg: "Produto adicionado aos destaques!",
                type: "success",
                time: 4000
            });
        } catch (error) {
            console.error(error);

            setToast({
                show: true,
                msg: "Erro ao alterar destaque.",
                type: "error",
                time: 4000
            });
        }
    };

    const handleApplyDiscount = async (
        e: React.FormEvent<HTMLFormElement>,
        id: string,
        novoDesconto: number
    ) => {
        e.preventDefault();

        if (novoDesconto < 0 || novoDesconto > 100) {
            setToast({
                show: true,
                msg: "O desconto deve estar entre 0 e 100%.",
                type: "error",
                time: 4000
            });

            return;
        }

        try {
            const response = await editProdService(
                id,
                {
                    discount: novoDesconto
                }
            );

            if (response) {
                await loadSales();

                setToast({
                    show: true,
                    msg: "Desconto aplicado com sucesso!",
                    type: "success",
                    time: 4000
                });

                setSelectedProduct(null);
                setDiscount(0);
            }
        } catch (error) {
            console.error(error);

            setToast({
                show: true,
                msg: "Erro ao aplicar desconto.",
                type: "error",
                time: 4000
            });
        }
    };

    const handleSaveSlides = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const links = [
                slideLink1.trim(),
                slideLink2.trim(),
                slideLink3.trim()
            ];

            const updatedIds = [...slideIds];

            for (let i = 0; i < links.length; i++) {
                const url = links[i];
                const id = updatedIds[i];

                if (!url) continue;

                if (id) {
                    await editSlideService(
                        id,
                        {
                            imageUrl: url,
                            active: true
                        }
                    );
                } else {
                    const newSlide =
                        await createSlideService({
                            imageUrl: url,
                            active: true
                        });

                    updatedIds[i] = newSlide?._id || ""
                }
            }

            setSlideIds(updatedIds);

            setToast({
                show: true,
                msg: "Banners salvos com sucesso!",
                type: "success",
                time: 4000
            });

            setIsSlideModalOpen(false);

            await loadBannersData();
        } catch (error) {
            console.error(error);

            setToast({
                show: true,
                msg: "Erro ao salvar banners.",
                type: "error",
                time: 4000
            });
        }
    };

    const handleDeleteSlide = async (
        indexPosition: number
    ) => {
        const idToDelete =
            slideIds[indexPosition];

        const confirmed = confirm(
            "Deseja remover este banner?"
        );

        if (!confirmed) return;

        try {
            if (idToDelete) {
                await deleteSlideService(idToDelete);
            }

            const updatedIds = [...slideIds];

            updatedIds[indexPosition] = "";

            setSlideIds(updatedIds);

            if (indexPosition === 0) {
                setSlideLink1("");
            }

            if (indexPosition === 1) {
                setSlideLink2("");
            }

            if (indexPosition === 2) {
                setSlideLink3("");
            }

            setToast({
                show: true,
                msg: "Banner removido com sucesso!",
                type: "success",
                time: 4000
            });
        } catch (error) {
            console.error(error);

            setToast({
                show: true,
                msg: "Não foi possível remover o banner.",
                type: "error",
                time: 4000
            });
        }
    };

    return (
        <>
            <HeaderComp />

            <main className="min-h-screen bg-(--site-bg) text-(--text-main) border-x border-(--border-color) p-4 md:p-6">

                <div className="mx-auto max-w-360 grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* GRÁFICO */}

                    <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5">

                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest text-(--text-muted)">
                                Analytics
                            </p>

                            <h2 className="text-xl font-bold mt-1">
                                Vendas mensais
                            </h2>
                        </div>

                        <div className="w-full h-90">

                            <BarChart
                                key={replayKey}
                                width={600}
                                height={350}
                                data={dataBar}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -10,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border-color)"
                                />

                                <XAxis
                                    dataKey="month"
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                />

                                <YAxis
                                    stroke="var(--text-muted)"
                                    fontSize={12}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "var(--surface)",
                                        border:
                                            "1px solid var(--border-color)",
                                        borderRadius: "12px",
                                        color:
                                            "var(--text-main)"
                                    }}
                                />

                                <Bar
                                    dataKey="pedidos"
                                    fill="var(--primary-accent)"
                                    radius={[6, 6, 0, 0]}
                                    isAnimationActive={
                                        isAnimationActive !== false
                                    }
                                    animationBegin={
                                        animationBegin
                                    }
                                    animationDuration={
                                        animationDuration
                                    }
                                    animationEasing={
                                        animationEasing
                                    }
                                />

                            </BarChart>

                        </div>

                    </section>

                    {/* ÚLTIMAS VENDAS */}

                    <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5">

                        <div className="mb-6">

                            <p className="text-xs uppercase tracking-widest text-(--text-muted)">
                                Recent activity
                            </p>

                            <h2 className="text-xl font-bold mt-1">
                                Últimas vendas
                            </h2>

                        </div>

                        <div
                            ref={scrollRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={
                                handleMouseLeaveOrUp
                            }
                            onMouseUp={
                                handleMouseLeaveOrUp
                            }
                            onMouseMove={
                                handleMouseMove
                            }
                            className={`max-h-90 overflow-y-auto rounded-xl border border-(--border-color) select-none ${
                                isScrolling
                                    ? "cursor-grabbing"
                                    : "cursor-grab"
                            }`}
                        >

                            <table className="w-full text-left">

                                <thead className="sticky top-0 bg-(--surface) z-10">

                                    <tr className="text-xs uppercase text-(--text-muted)">

                                        <th className="px-4 py-3">
                                            Usuário
                                        </th>

                                        <th className="px-4 py-3">
                                            Valor
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Data
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {sales.length > 0 ? (

                                        sales.map((sale) => (

                                            <tr
                                                key={sale._id}
                                                className="border-t border-(--border-color) hover:bg-(--surface-hover) transition-colors"
                                            >

                                                <td className="px-4 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-9 h-9 rounded-full bg-(--primary-accent) text-(--primary-text) flex items-center justify-center font-bold">

                                                            {sale.userId?.username
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "?"}

                                                        </div>

                                                        <span className="text-sm font-medium">

                                                            {sale.userId?.username ||
                                                                "Usuário removido"}

                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-4 py-4 font-bold text-(--success)">

                                                    R$ {sale.valorTotal.toFixed(2)}

                                                </td>

                                                <td className="px-4 py-4 text-xs text-(--text-muted) text-right">

                                                    {new Date(
                                                        sale.createdAt
                                                    ).toLocaleDateString(
                                                        "pt-BR",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan={3}
                                                className="text-center p-10 text-(--text-muted)"
                                            >
                                                Nenhuma venda registrada.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

                {/* SEÇÃO INFERIOR */}

                <div className="mx-auto max-w-360 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">

                    {/* PRODUTOS */}

                    <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5">

                        <div className="mb-5">

                            <p className="text-xs uppercase tracking-widest text-(--text-muted)">
                                Products
                            </p>

                            <h2 className="text-xl font-bold mt-1">
                                Produtos mais vendidos
                            </h2>

                        </div>

                        {topProducts.length > 0 ? (

                            <div className="flex flex-col border border-(--border-color) rounded-xl overflow-hidden">

                                {topProducts.map(
                                    (prod) => (

                                        <div
                                            key={prod._id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-(--border-color) last:border-b-0 hover:bg-(--surface-hover) transition-colors"
                                        >

                                            <div className="min-w-0">

                                                <p className="font-semibold truncate">

                                                    {prod.title}

                                                </p>

                                                <p className="text-xs text-(--text-muted) mt-1">

                                                    Estoque: {prod.quantity}

                                                </p>

                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">

                                                <button
                                                    onClick={() =>
                                                        onToggleFeature(
                                                            prod
                                                        )
                                                    }
                                                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                                                        prod.isFeatured
                                                            ? "bg-(--primary-accent) text-(--primary-text)"
                                                            : "bg-(--surface) text-(--text-muted) hover:bg-(--surface-hover)"
                                                    }`}
                                                >

                                                    <Star
                                                        size={18}
                                                        fill={
                                                            prod.isFeatured
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />

                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedProduct(
                                                            prod
                                                        );

                                                        setDiscount(
                                                            prod.discount ||
                                                                0
                                                        );
                                                    }}
                                                    className="px-4 py-2.5 bg-(--primary-accent) text-(--primary-text) rounded-xl text-xs font-bold hover:bg-(--primary-hover) transition-colors cursor-pointer"
                                                >
                                                    Desconto
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="p-10 text-center border border-dashed border-(--border-color) rounded-xl text-(--text-muted)">

                                Nenhum produto vendido.

                            </div>

                        )}

                    </section>

                    {/* BANNERS */}

                    <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 flex flex-col items-center text-center h-fit">

                        <div className="w-14 h-14 rounded-2xl bg-(--surface) flex items-center justify-center mb-4">

                            <Sliders
                                size={26}
                                className="text-(--text-main)"
                            />

                        </div>

                        <h3 className="font-bold text-lg">
                            Layout da Home
                        </h3>

                        <p className="text-xs text-(--text-muted) leading-relaxed mt-2 mb-6">

                            Gerencie os banners exibidos
                            no carrossel principal.

                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setIsSlideModalOpen(true)
                            }
                            className="w-full bg-(--primary-accent) text-(--primary-text) font-bold py-3 rounded-xl text-sm hover:bg-(--primary-hover) transition-colors cursor-pointer flex justify-center items-center gap-2"
                        >

                            <ImageIcon size={18} />

                            Modificar Banners

                        </button>

                    </section>

                </div>

                {/* MODAL DESCONTO */}

                {selectedProduct && (

                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

                        <div className="w-full max-w-sm bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-2xl">

                            <h3 className="text-lg font-bold">
                                Definir desconto
                            </h3>

                            <p className="text-xs text-(--text-muted) mt-2 truncate">

                                Produto:
                                <span className="ml-1 text-(--text-main)">

                                    {selectedProduct.title}

                                </span>

                            </p>

                            <form
                                onSubmit={(e) =>
                                    handleApplyDiscount(
                                        e,
                                        selectedProduct._id,
                                        discount
                                    )
                                }
                                className="flex flex-col gap-4 mt-6"
                            >

                                <div className="flex items-center gap-3 bg-(--input-bg) border border-(--border-color) rounded-xl px-4 py-3">

                                    <span className="text-(--text-muted)">
                                        %
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="w-full bg-transparent outline-none text-(--text-main)"
                                    />

                                </div>

                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedProduct(null)
                                        }
                                        className="py-3 bg-(--surface) rounded-xl text-sm font-bold hover:bg-(--surface-hover) cursor-pointer"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="py-3 bg-(--primary-accent) text-(--primary-text) rounded-xl text-sm font-bold hover:bg-(--primary-hover) cursor-pointer"
                                    >
                                        Salvar
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {/* MODAL BANNERS */}

                {isSlideModalOpen && (

                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

                        <div className="w-full max-w-md bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-2xl">

                            <div className="flex items-center gap-3 pb-4 border-b border-(--border-color)">

                                <ImageIcon size={20} />

                                <h3 className="text-lg font-bold">

                                    Configurar Carrossel

                                </h3>

                            </div>

                            <form
                                onSubmit={handleSaveSlides}
                                className="flex flex-col gap-5 mt-6"
                            >

                                {[
                                    {
                                        label: "Slide 1",
                                        value: slideLink1,
                                        setValue: setSlideLink1,
                                        index: 0
                                    },
                                    {
                                        label: "Slide 2",
                                        value: slideLink2,
                                        setValue: setSlideLink2,
                                        index: 1
                                    },
                                    {
                                        label: "Slide 3",
                                        value: slideLink3,
                                        setValue: setSlideLink3,
                                        index: 2
                                    }
                                ].map((slide) => (

                                    <div
                                        key={slide.index}
                                        className="flex flex-col gap-2"
                                    >

                                        <div className="flex justify-between">

                                            <label className="text-xs font-bold text-(--text-secondary)">

                                                {slide.label}

                                            </label>

                                            {(slideIds[
                                                slide.index
                                            ]) && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteSlide(
                                                            slide.index
                                                        )
                                                    }
                                                    className="text-xs text-(--error) cursor-pointer"
                                                >
                                                    Remover
                                                </button>

                                            )}

                                        </div>

                                        <input
                                            type="text"
                                            value={slide.value}
                                            onChange={(e) =>
                                                slide.setValue(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="URL da imagem"
                                            className="w-full bg-(--input-bg) border border-(--border-color) rounded-xl px-4 py-3 text-xs outline-none focus:border-(--border-light)"
                                        />

                                    </div>

                                ))}

                                <div className="bg-(--surface) border border-(--border-color) rounded-xl p-4 text-center">

                                    <p className="text-xs font-bold">

                                        Dimensões recomendadas

                                    </p>

                                    <p className="text-lg font-black mt-1">

                                        1920 × 260 px

                                    </p>

                                    <p className="text-xs text-(--text-muted) mt-1">

                                        Utilize imagens horizontais.

                                    </p>

                                </div>

                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsSlideModalOpen(false)
                                        }
                                        className="py-3 bg-(--surface) rounded-xl font-bold text-sm hover:bg-(--surface-hover) cursor-pointer"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="py-3 bg-(--primary-accent) text-(--primary-text) rounded-xl font-bold text-sm hover:bg-(--primary-hover) cursor-pointer"
                                    >
                                        Salvar
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </main>

            {toast.show && (

                <Toast
                    message={toast.msg}
                    type={toast.type}
                    duration={toast.time}
                    onClose={() =>
                        setToast((prev) => ({
                            ...prev,
                            show: false
                        }))
                    }
                />

            )}
        </>
    );
}