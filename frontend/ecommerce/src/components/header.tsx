import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProdByQuery } from "../services/APIservice";
import { Link } from "react-router";
import {
    Search,
    UserRound,
    ShoppingBag,
    X,
    Package,
} from "lucide-react";

type Product = {
    _id: string;
    image: string;
    title: string;
};

export default function HeaderComp() {
    const { user } = useAuth();

    const [query, setQuery] = useState("");
    const [product, setProduct] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleLogout = async () => {
        const confirmLogout = confirm("Would you like to log out?");

        if (!confirmLogout) return;

        try {
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (query.length <= 2) {
            setProduct([]);
            return;
        }

        const delayQuery = setTimeout(async () => {
            try {
                const response = await getProdByQuery(query);
                setProduct(response);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 500);

        return () => clearTimeout(delayQuery);
    }, [query]);

    return (
        <header className="sticky top-0 z-100 w-full border-b border-[#262626] bg-[#131313]/95 text-[#e4e2e1] backdrop-blur-md">
            <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between px-6 lg:px-12 xl:px-20">

                {/* Navigation */}
                <nav className="hidden flex-1 items-center gap-8 md:flex">
                    <Link
                        to="/home"
                        className="text-sm text-[#e4e2e1]/50 transition-colors duration-200 hover:text-[#e4e2e1]"
                    >
                        Home
                    </Link>

                    <Link
                        to="/favorites"
                        className="text-sm text-[#e4e2e1]/50 transition-colors duration-200 hover:text-[#e4e2e1]"
                    >
                        Favoritos
                    </Link>

                    <Link
                        to="/products"
                        className="text-sm text-[#e4e2e1]/50 transition-colors duration-200 hover:text-[#e4e2e1]"
                    >
                        Products
                    </Link>

                    <Link
                        to="/history"
                        className="text-sm text-[#e4e2e1]/50 transition-colors duration-200 hover:text-[#e4e2e1]"
                    >
                        History
                    </Link>
                </nav>

                {/* Logo */}
                <Link
                    to="/home"
                    className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-[0.3em] text-[#e4e2e1] transition-opacity hover:opacity-70"
                >
                    SILENT
                </Link>

                {/* Actions */}
                <div className="ml-auto flex flex-1 items-center justify-end gap-6">

                    {/* Search */}
                    <div className="relative">
                        <div className="group flex items-center">

                            <Search
                                size={19}
                                className="pointer-events-none absolute left-0 text-[#e4e2e1]/50 transition-colors group-focus-within:text-[#e4e2e1]"
                            />

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={handleInput}
                                className="
                                    w-36
                                    border-b
                                    border-transparent
                                    bg-transparent
                                    py-2
                                    pl-7
                                    pr-2
                                    text-sm
                                    text-[#e4e2e1]
                                    outline-none
                                    placeholder:text-[#e4e2e1]/40
                                    transition-all
                                    duration-300
                                    focus:w-60
                                    focus:border-[#e4e2e1]/30
                                    lg:w-44
                                "
                            />

                            {query && (
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setProduct([]);
                                    }}
                                    className="text-[#e4e2e1]/40 transition-colors hover:text-[#e4e2e1]"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {(product.length > 0 || query.length > 2) && (
                            <div className="absolute right-0 top-full mt-4 w-80 overflow-hidden border border-[#262626] bg-[#1b1c1c]">

                                {product.length > 0 ? (
                                    <ul>
                                        {product.map((produto) => (
                                            <li
                                                key={produto._id}
                                                className="border-b border-[#262626] last:border-0"
                                            >
                                                <Link
                                                    to={`/pagina-produto/${produto._id}`}
                                                    onClick={() => {
                                                        setQuery("");
                                                        setProduct([]);
                                                    }}
                                                    className="flex items-center gap-4 p-4 transition-colors hover:bg-[#262626]"
                                                >
                                                    {produto.image ? (
                                                        <img
                                                            src={produto.image}
                                                            alt={produto.title}
                                                            className="h-12 w-12 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center bg-[#262626]">
                                                            <Package
                                                                size={18}
                                                                className="text-[#e4e2e1]/40"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <span className="block truncate text-sm text-[#e4e2e1]">
                                                            {produto.title}
                                                        </span>

                                                        <span className="mt-1 block text-[10px] uppercase tracking-widest text-[#e4e2e1]/40">
                                                            View product
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-[#e4e2e1]/50">
                                            No products found
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <button className="cursor-pointer text-[#e4e2e1]/60 transition-colors hover:text-[#e4e2e1]">
                            <UserRound size={20} />
                        </button>

                        {isOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-2 mt-5 w-48 border border-[#262626] bg-[#1b1c1c] py-2">

                                <div className="border-b border-[#262626] px-4 py-3">
                                    <p className="truncate text-sm text-[#e4e2e1]">
                                        {user?.username || "Guest"}
                                    </p>

                                    <p className="mt-1 text-[10px] uppercase tracking-widest text-[#e4e2e1]/40">
                                        Account
                                    </p>
                                </div>

                                {user ? (
                                    <>
                                        <Link
                                            to={`/user/${user.username}`}
                                            className="block px-4 py-3 text-sm text-[#e4e2e1]/60 transition-colors hover:bg-[#262626] hover:text-[#e4e2e1]"
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            to="/history"
                                            className="block px-4 py-3 text-sm text-[#e4e2e1]/60 transition-colors hover:bg-[#262626] hover:text-[#e4e2e1]"
                                        >
                                            History
                                        </Link>

                                        <Link
                                            to="/tracking"
                                            className="block px-4 py-3 text-sm text-[#e4e2e1]/60 transition-colors hover:bg-[#262626] hover:text-[#e4e2e1]"
                                        >
                                            Orders
                                        </Link>

                                        <div className="mx-4 border-t border-[#262626]" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full cursor-pointer px-4 py-3 text-left text-sm text-[#e4e2e1]/50 transition-colors hover:bg-[#262626] hover:text-red-400"
                                        >
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/"
                                            className="block px-4 py-3 text-sm text-[#e4e2e1]/60 transition-colors hover:bg-[#262626] hover:text-[#e4e2e1]"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            className="block px-4 py-3 text-sm text-[#e4e2e1]/60 transition-colors hover:bg-[#262626] hover:text-[#e4e2e1]"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="text-[#e4e2e1]/60 transition-colors hover:text-[#e4e2e1]"
                    >
                        <ShoppingBag size={20} />
                    </Link>
                </div>
            </div>
        </header>
    );
}