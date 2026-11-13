import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Package,
    ShoppingBag,
    ChevronRight,
    Loader2,
    CalendarDays,
    ReceiptText
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import HeaderComp from "../components/header";
import { getHistory } from "../services/APIservice";

type OrderStatus =
    | "Pendente"
    | "Pago"
    | "Enviado"
    | "Cancelado";

interface OrderItem {
    productId: {
        title?: string;
    } | null;

    image?: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
}

interface Order {
    _id: string;
    valorTotal: number;
    status: OrderStatus;
    createdAt: string;
    items: OrderItem[];
}

export default function HistoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getHistory();

                const history =
                    response.data || response || [];

                setOrders(history);
            } catch (error) {
                console.error(
                    "Erro ao buscar histórico:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user?._id]);

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case "Pago":
                return {
                    label: "Pago",
                    className:
                        "bg-(--success-bg) text-(--success) border-(--success)",
                };

            case "Pendente":
                return {
                    label: "Pendente",
                    className:
                        "bg-(--warning-bg) text-(--warning) border-(--warning)",
                };

            case "Cancelado":
                return {
                    label: "Cancelado",
                    className:
                        "bg-(--error-bg) text-(--error-text) border-(--error)",
                };

            case "Enviado":
                return {
                    label: "Enviado",
                    className:
                        "bg-(--surface-high) text-(--text-main) border-(--border-light)",
                };
        }
    };

    if (loading) {
        return (
            <>
                <HeaderComp />

                <main className="min-h-screen bg-(--site-bg) flex items-center justify-center">

                    <div className="flex flex-col items-center gap-4">

                        <Loader2
                            size={32}
                            className="animate-spin text-(--primary-accent)"
                        />

                        <p className="text-sm text-(--text-secondary)">
                            Carregando seus pedidos...
                        </p>

                    </div>

                </main>
            </>
        );
    }

    return (
        <>
            <HeaderComp />

            <main className="min-h-screen bg-(--site-bg) text-(--text-main)">

                <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">

                    {/* HEADER */}

                    <section className="mb-10">

                        <div className="flex items-center gap-3 mb-3">

                            <div className="w-10 h-10 rounded-xl bg-(--surface) border border-(--border-color) flex items-center justify-center">

                                <ShoppingBag
                                    size={19}
                                    className="text-(--text-secondary)"
                                />

                            </div>

                            <div>

                                <p className="text-[10px] uppercase tracking-[0.2em] text-(--text-muted)">
                                    Histórico
                                </p>

                                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                                    Meus Pedidos
                                </h1>

                            </div>

                        </div>

                        <p className="text-sm text-(--text-secondary)">
                            Acompanhe todas as suas compras e pedidos realizados.
                        </p>

                    </section>

                    {/* SEM PEDIDOS */}

                    {orders.length === 0 ? (

                        <section className="min-h-75 flex flex-col items-center justify-center text-center bg-(--card-bg) border border-dashed border-(--border-color) rounded-2xl px-6">

                            <div className="w-14 h-14 rounded-full bg-(--surface) flex items-center justify-center mb-5">

                                <Package
                                    size={25}
                                    className="text-(--text-muted)"
                                />

                            </div>

                            <h2 className="font-semibold text-lg">
                                Nenhum pedido encontrado
                            </h2>

                            <p className="text-sm text-(--text-muted) mt-2 max-w-sm">
                                Você ainda não realizou nenhuma compra.
                                Quando fizer seu primeiro pedido,
                                ele aparecerá aqui.
                            </p>

                            <button
                                onClick={() => navigate("/home")}
                                className="mt-6 bg-(--primary-accent) text-(--primary-text) px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-(--primary-hover) transition-colors cursor-pointer"
                            >
                                Começar a comprar
                            </button>

                        </section>

                    ) : (

                        <section className="flex flex-col gap-5">

                            {orders.map((order) => {

                                const status =
                                    getStatusStyle(order.status);

                                return (

                                    <article
                                        key={order._id}
                                        className="group bg-(--card-bg) border border-(--border-color) rounded-2xl overflow-hidden transition-all duration-300 hover:border-(--border-light)"
                                    >

                                        {/* HEADER DO PEDIDO */}

                                        <div className="p-5 md:p-6 border-b border-(--border-color)">

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                                <div>

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <ReceiptText
                                                            size={15}
                                                            className="text-(--text-muted)"
                                                        />

                                                        <span className="text-[10px] uppercase tracking-widest text-(--text-muted)">
                                                            Pedido
                                                        </span>

                                                    </div>

                                                    <p className="font-mono text-sm font-semibold text-(--text-main)">
                                                        #
                                                        {order._id
                                                            .substring(0, 12)
                                                            .toUpperCase()}
                                                    </p>

                                                </div>

                                                <div className="flex flex-col sm:items-end gap-2">

                                                    <span
                                                        className={`w-fit px-3 py-1 rounded-full border text-[11px] font-semibold ${status.className}`}
                                                    >
                                                        {status.label}
                                                    </span>

                                                    <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">

                                                        <CalendarDays
                                                            size={13}
                                                        />

                                                        {formatDate(
                                                            order.createdAt
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        {/* PRODUTOS */}

                                        <div className="p-5 md:p-6">

                                            <p className="text-xs font-semibold text-(--text-secondary) mb-4">

                                                {order.items.length}{" "}

                                                {order.items.length === 1
                                                    ? "produto"
                                                    : "produtos"}

                                            </p>

                                            <div className="flex flex-col gap-3">

                                                {order.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${item.name}-${index}`}
                                                            className="flex items-center justify-between gap-4 bg-(--surface-lowest) border border-(--border-color) rounded-xl p-3 md:p-4"
                                                        >

                                                            {/* INFO PRODUTO */}

                                                            <div className="flex items-center gap-3 min-w-0">

                                                                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-(--surface) border border-(--border-color)">

                                                                    {item.image ? (

                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="w-full h-full object-cover"
                                                                        />

                                                                    ) : (

                                                                        <div className="w-full h-full flex items-center justify-center">

                                                                            <Package
                                                                                size={18}
                                                                                className="text-(--text-muted)"
                                                                            />

                                                                        </div>

                                                                    )}

                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="text-sm font-medium text-(--text-main) truncate">

                                                                        {item.name ||
                                                                            item
                                                                                .productId
                                                                                ?.title ||
                                                                            "Produto removido"}

                                                                    </p>

                                                                    <p className="text-xs text-(--text-muted) mt-1">

                                                                        Quantidade:{" "}

                                                                        <span className="text-(--text-secondary)">

                                                                            {
                                                                                item.quantity
                                                                            }

                                                                        </span>

                                                                    </p>

                                                                </div>

                                                            </div>

                                                            {/* PREÇO */}

                                                            <div className="text-right shrink-0">

                                                                <p className="text-[10px] text-(--text-muted) mb-1">

                                                                    Subtotal

                                                                </p>

                                                                <p className="text-sm font-semibold text-(--text-main)">

                                                                    {formatPrice(
                                                                        item.priceAtPurchase *
                                                                        item.quantity
                                                                    )}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                        {/* FOOTER */}

                                        <div className="bg-(--surface-lowest) border-t border-(--border-color) px-5 md:px-6 py-4">

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                                <div>

                                                    <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">
                                                        Total do pedido
                                                    </p>

                                                    <p className="text-xl font-semibold mt-1">

                                                        {formatPrice(
                                                            order.valorTotal
                                                        )}

                                                    </p>

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/tracking"
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-(--surface) border border-(--border-color) text-sm font-medium hover:bg-(--surface-hover) hover:border-(--border-light) transition-all cursor-pointer"
                                                >

                                                    Acompanhar pedido

                                                    <ChevronRight
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                );
                            })}

                        </section>

                    )}

                </div>

            </main>
        </>
    );
}