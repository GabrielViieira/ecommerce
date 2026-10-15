import { useEffect, useState } from "react"
import { addProductsService, getOnSales } from "../services/APIservice"
import type { ProdUI } from "../model/prodModel"
import Toast from "./notify"
import { Link } from "react-router"
import { ShoppingCart, Tag } from "lucide-react"

export default function PromocoesList() {
    const [promoProducts, setPromoProducts] = useState<ProdUI[]>([])

    const [toast, setToast] = useState<{
        show: boolean
        msg: string
        type: "success" | "error" | "info"
        time?: number
    }>({
        show: false,
        msg: "",
        type: "success",
        time: 3000
    })

    const handleAdd = async (_id: string) => {
        try {
            await addProductsService({
                productId: _id
            })

            setToast({
                show: true,
                msg: "Product added to cart!",
                type: "info",
                time: 4000
            })

        } catch (error) {
            console.error(error)

            setToast({
                show: true,
                msg: "Unable to add product to cart.",
                type: "error",
                time: 4000
            })
        }
    }

    useEffect(() => {
        const OnSale = async () => {
            try {
                const response = await getOnSales()
                setPromoProducts(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        OnSale()
    }, [])

    return (
        <main className="w-full">

            <section>

                <div className="flex items-center justify-between gap-4 mb-8">

                    <div className="flex items-center gap-3">

                        <div className="p-2 rounded-lg bg-(--accent)/10">
                            <Tag
                                size={20}
                                className="text-(--accent)"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-(--text-h)">
                                Promotions
                            </h2>

                            <p className="text-sm text-(--text) opacity-60 mt-1">
                                Discover our best deals and special offers
                            </p>
                        </div>

                    </div>

                    <span className="text-xs text-(--accent) border border-(--accent)/30 px-3 py-1.5 rounded-full">
                        On Sale
                    </span>

                </div>


                {promoProducts.length > 0 ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {promoProducts.map(product => {

                            const precoFinal =
                                product.price *
                                (1 - product.discount / 100)

                            const temEstoque =
                                product.quantity > 0

                            return (

                                <article
                                    key={product._id}
                                    className="
                                    group flex flex-col
                                    relative overflow-hidden
                                    rounded-xl
                                    border border-(--border)
                                    bg-(--dark-bg)
                                    transition-all duration-300
                                    hover:border-(--accent)
                                    hover:-translate-y-1
                                    "
                                >

                                    <span
                                        className="
                                        absolute top-3 left-3 z-10
                                        bg-red-500 text-white
                                        text-xs font-bold
                                        px-3 py-1 rounded-full
                                        "
                                    >
                                        -{product.discount}% OFF
                                    </span>


                                    <Link
                                        to={`/pagina-produto/${product._id}`}
                                        title={`View ${product.title}`}
                                        className="
                                        aspect-square w-full
                                        bg-black/30
                                        flex items-center justify-center
                                        overflow-hidden
                                        cursor-pointer
                                        "
                                    >

                                        {product.image ? (

                                            <img
                                                src={product.image}
                                                alt={product.title}
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


                                    <div className="flex flex-col flex-1 p-5">

                                        <h3 className="font-semibold text-(--text-h) line-clamp-1">
                                            {product.title}
                                        </h3>


                                        <p className="text-sm text-(--text) opacity-60 line-clamp-2 mt-2 min-h-10">
                                            {product.desc}
                                        </p>


                                        <div className="mt-auto pt-5">

                                            <div className="flex flex-col">

                                                <span className="text-xs text-gray-500 line-through">
                                                    ${product.price.toFixed(2)}
                                                </span>

                                                <div className="text-xl font-bold text-(--accent)">
                                                    ${precoFinal.toFixed(2)}
                                                </div>

                                            </div>


                                            <div className="flex justify-between mt-3 text-xs">

                                                <span className="opacity-50">
                                                    Stock
                                                </span>

                                                <span
                                                    className={
                                                        temEstoque
                                                            ? "text-green-400"
                                                            : "text-red-400"
                                                    }
                                                >
                                                    {temEstoque
                                                        ? `${product.quantity} available`
                                                        : "Out of stock"
                                                    }
                                                </span>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    handleAdd(product._id!)
                                                }
                                                disabled={!temEstoque}
                                                className={`
                                                w-full mt-5 py-3
                                                rounded-lg
                                                flex items-center
                                                justify-center gap-2
                                                text-sm font-medium
                                                transition-all
                                                ${
                                                    temEstoque
                                                        ? `
                                                        bg-(--accent)
                                                        text-white
                                                        hover:brightness-110
                                                        active:scale-[0.98]
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

                                                {temEstoque
                                                    ? "Add to Cart"
                                                    : "Out of Stock"
                                                }

                                            </button>

                                        </div>

                                    </div>

                                </article>
                            )
                        })}

                    </div>

                ) : (

                    <div
                        className="
                        min-h-60
                        flex flex-col
                        items-center justify-center
                        border border-(--border)
                        rounded-xl
                        bg-(--dark-bg)
                        "
                    >

                        <Tag
                            size={30}
                            className="text-(--accent) opacity-40 mb-3"
                        />

                        <p className="text-center opacity-60 font-medium">
                            No promotions available
                        </p>

                    </div>

                )}

            </section>


            {toast.show && (
                <Toast
                    message={toast.msg}
                    type={toast.type}
                    duration={toast.time}
                    onClose={() =>
                        setToast({
                            ...toast,
                            show: false
                        })
                    }
                />
            )}

        </main>
    )
}