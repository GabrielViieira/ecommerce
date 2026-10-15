import { useState, useEffect } from "react";
import { Box, MapPin, Truck, Loader2, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getHistory } from "../services/APIservice";
import HeaderComp from "../components/header";
import { useAuth } from "../context/AuthContext";

type DeliveryStatus =
    | "processando"
    | "separado"
    | "transito";

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
}

interface Order {
    _id: string;
    valorTotal: number;
    createdAt: string;
    items: OrderItem[];
}

interface DeliveryStep {
    key: DeliveryStatus;
    title: string;
    icon: LucideIcon;
}

const steps: DeliveryStep[] = [
    {
        key: "processando",
        title: "Confirmado",
        icon: Box,
    },
    {
        key: "separado",
        title: "Embalado",
        icon: MapPin,
    },
    {
        key: "transito",
        title: "Em Trânsito",
        icon: Truck,
    },
];

export default function OrderTracking() {
    const { user } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentStatus, setCurrentStatus] =
        useState<DeliveryStatus>("processando");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getHistory();

                const history =
                    response.data || response || [];

                const lastThreeOrders =
                    history.slice(0, 3);

                setOrders(lastThreeOrders);
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

    useEffect(() => {
        if (orders.length === 0) return;

        const timer1 = setTimeout(() => {
            setCurrentStatus("separado");
        }, 4000);

        const timer2 = setTimeout(() => {
            setCurrentStatus("transito");
        }, 9000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [orders.length]);

    const currentIndex = steps.findIndex(
        (step) => step.key === currentStatus
    );

    const progress =
        currentIndex === 0
            ? 0
            : currentIndex === 1
                ? 50
                : 100;

    const formatPrice = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const getStatusMessage = () => {
        switch (currentStatus) {
            case "processando":
                return "⏳ Seu pedido está sendo processado pela equipe.";

            case "separado":
                return "📦 Seu pedido foi embalado e está aguardando coleta.";

            case "transito":
                return "🚚 Seu pedido está a caminho do endereço informado.";
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
                            Buscando seus pedidos...
                        </p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <HeaderComp />

            <main className="min-h-screen bg-(--site-bg) text-(--text-main) py-8 px-4 md:px-6">

                <div className="w-full max-w-3xl mx-auto">

                    <div className="mb-8">

                        <p className="text-xs uppercase tracking-widest text-(--text-muted)">
                            Histórico de compras
                        </p>

                        <h1 className="text-2xl md:text-3xl font-semibold mt-2">
                            Acompanhar pedidos
                        </h1>

                        <p className="text-sm text-(--text-secondary) mt-2">
                            Olá,{" "}

                            <span className="font-semibold text-(--text-main)">
                                {user?.username}
                            </span>

                            . Aqui você pode acompanhar suas últimas compras.
                        </p>

                    </div>

                    {orders.length > 0 ? (

                        <div className="flex flex-col gap-5">

                            {orders.map((order) => (

                                <article
                                    key={order._id}
                                    className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5 md:p-6 transition-colors hover:border-(--border-light)"
                                >

                                    {/* HEADER DO PEDIDO */}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-6 border-b border-(--border-color)">

                                        <div>

                                            <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">
                                                Código do pedido
                                            </p>

                                            <p className="font-mono text-sm font-bold text-(--text-main) mt-1">
                                                #
                                                {order._id
                                                    .substring(0, 8)
                                                    .toUpperCase()}
                                            </p>

                                        </div>

                                        <div className="sm:text-right">

                                            <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">
                                                Total do pedido
                                            </p>

                                            <p className="font-bold text-lg text-(--success) mt-1">
                                                {formatPrice(
                                                    order.valorTotal
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    {/* PRODUTOS */}

                                    <div className="mb-7">

                                        <p className="text-xs font-semibold text-(--text-secondary) mb-3">
                                            Produtos
                                        </p>

                                        <div className="flex flex-col gap-2">

                                            {order.items.map(
                                                (item, index) => (

                                                    <div
                                                        key={`${item.productId}-${index}`}
                                                        className="flex items-center justify-between bg-(--surface-lowest) border border-(--border-color) rounded-lg px-4 py-3"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <Package
                                                                size={16}
                                                                className="text-(--text-muted)"
                                                            />

                                                            <div>

                                                                <p className="text-sm font-medium text-(--text-main)">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-(--text-muted)">
                                                                    Quantidade:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                        <span className="text-xs font-semibold text-(--text-secondary)">
                                                            {formatPrice(
                                                                item.priceAtPurchase *
                                                                item.quantity
                                                            )}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                    {/* RASTREAMENTO */}

                                    <div>

                                        <div className="flex items-center gap-2 mb-6">

                                            <Truck
                                                size={18}
                                                className="text-(--text-secondary)"
                                            />

                                            <h2 className="font-semibold">
                                                Status da entrega
                                            </h2>

                                        </div>

                                        <div className="relative flex justify-between items-start w-full">

                                            {/* LINHA FUNDO */}

                                            <div className="absolute top-4 left-[16%] right-[16%] h-0.5 bg-(--surface-high) z-0" />

                                            {/* LINHA PROGRESSO */}

                                            <div
                                                className="absolute top-4 left-[16%] h-0.5 bg-(--primary-accent) transition-all duration-700 ease-out z-0"
                                                style={{
                                                    width:
                                                        progress === 0
                                                            ? "0%"
                                                            : progress === 50
                                                                ? "34%"
                                                                : "68%",
                                                }}
                                            />

                                            {steps.map(
                                                (
                                                    step: DeliveryStep,
                                                    index: number
                                                ) => {

                                                    const IconComponent =
                                                        step.icon;

                                                    const isCompleted =
                                                        index <=
                                                        currentIndex;

                                                    const isActive =
                                                        index ===
                                                        currentIndex;

                                                    return (

                                                        <div
                                                            key={step.key}
                                                            className="flex flex-col items-center relative z-10 w-1/3"
                                                        >

                                                            <div
                                                                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 ${isCompleted
                                                                        ? "bg-(--primary-accent) text-(--primary-text) border-(--primary-accent)"
                                                                        : "bg-(--surface-lowest) text-(--text-muted) border-(--border-color)"
                                                                    } ${isActive
                                                                        ? "ring-4 ring-white/5 scale-110"
                                                                        : ""
                                                                    }`}
                                                            >

                                                                <IconComponent
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                            </div>

                                                            <span
                                                                className={`text-[11px] font-semibold mt-3 transition-colors text-center ${isActive
                                                                        ? "text-(--text-main)"
                                                                        : isCompleted
                                                                            ? "text-(--text-secondary)"
                                                                            : "text-(--text-muted)"
                                                                    }`}
                                                            >
                                                                {
                                                                    step.title
                                                                }
                                                            </span>

                                                        </div>

                                                    );
                                                }
                                            )}

                                        </div>

                                        {/* STATUS */}

                                        <div className="mt-7 bg-(--surface-lowest) border border-(--border-color) rounded-xl px-4 py-3">

                                            <p className="text-xs text-center text-(--text-secondary)">
                                                {
                                                    getStatusMessage()
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    ) : (

                        <div className="bg-(--card-bg) border border-dashed border-(--border-color) rounded-2xl p-12 text-center">

                            <Package
                                size={38}
                                className="mx-auto mb-4 text-(--text-muted)"
                            />

                            <h2 className="font-semibold text-(--text-main)">
                                Nenhum pedido encontrado
                            </h2>

                            <p className="text-sm text-(--text-muted) mt-2">
                                Seus pedidos aparecerão aqui após uma compra.
                            </p>

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}