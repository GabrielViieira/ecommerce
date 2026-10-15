import { useState } from "react"
import { useNavigate } from "react-router"
import { registerUserService } from "../services/APIservice"
import { useAuth } from "../context/AuthContext"
import Toast from "../components/notify"
import { Eye, EyeOff, ArrowRight, UserPlus, User, Mail, Calendar } from "lucide-react"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [birth, setbirth] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const [toast, setToast] = useState<{
        show: boolean
        msg: string
        type: "success" | "error"
        time?: number
    }>({
        show: false,
        msg: "",
        type: "success",
        time: 3000
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            const newUser = { username, email, password, birth }

            const response = await registerUserService(newUser)

            if (response.data.token) {
                localStorage.setItem("token", response.data.token || response)
            }

            setToast({
                show: true,
                msg: "Account created successfully!",
                type: "success",
                time: 6000
            })

            setUser(response.data)

            navigate("/home")

        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Registration failed"

            setToast({
                show: true,
                msg: errorMessage,
                type: "error",
                time: 4000
            })

            console.error("Registration error:", error.response?.data)
        }
    }

    const routingLogin = () => {
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="grid min-h-screen lg:grid-cols-2">

                <section className="hidden flex-col justify-between border-r border-[#262626] bg-[#0e0e0e] p-10 lg:flex">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                            <UserPlus size={20} />
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold">
                                Silent Commerce
                            </h1>

                            <p className="text-xs text-zinc-500">
                                Modern shopping experience
                            </p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Join the platform
                        </span>

                        <h2 className="text-5xl font-semibold leading-tight tracking-tight">
                            Create your account and start exploring.
                        </h2>

                        <p className="mt-6 max-w-sm text-base leading-7 text-zinc-400">
                            Join our platform and discover a clean, modern
                            shopping experience designed around simplicity and
                            performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-600">
                        <span>Secure</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />
                        <span>Fast</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />
                        <span>Minimal</span>
                    </div>
                </section>

                <section className="flex min-h-screen items-center justify-center bg-[#131313] px-6 py-10">

                    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

                        <div className="mb-8">
                            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-black lg:hidden">
                                <UserPlus size={20} />
                            </div>

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                New account
                            </p>

                            <h2 className="text-3xl font-semibold tracking-tight">
                                Create an account
                            </h2>

                            <p className="mt-3 text-sm text-zinc-500">
                                Enter your information to get started.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
                                >
                                    Username
                                </label>

                                <div className="relative">
                                    <User
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />

                                    <input
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        type="text"
                                        id="username"
                                        placeholder="Enter your username"
                                        required
                                        className="h-11 w-full rounded-lg border border-[#262626] bg-transparent pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />

                                    <input
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        required
                                        className="h-11 w-full rounded-lg border border-[#262626] bg-transparent pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        onChange={(e) =>
                                            setpassword(e.target.value)
                                        }
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-11 w-full rounded-lg border border-[#262626] bg-transparent px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="birth"
                                    className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
                                >
                                    Date of birth
                                </label>

                                <div className="relative">
                                    <Calendar
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />

                                    <input
                                        onChange={(e) =>
                                            setbirth(e.target.value)
                                        }
                                        type="date"
                                        id="birth"
                                        required
                                        className="h-11 w-full rounded-lg border border-[#262626] bg-transparent pl-10 pr-4 text-sm text-white outline-none transition focus:border-zinc-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99]"
                            >
                                Create account

                                <ArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>

                        </form>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-[#262626]" />

                            <span className="text-xs text-zinc-600">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-[#262626]" />
                        </div>

                        <div className="text-center">
                            <span className="text-sm text-zinc-500">
                                Already have an account?
                            </span>

                            <button
                                onClick={routingLogin}
                                className="ml-2 text-sm font-medium text-white transition hover:text-zinc-400"
                            >
                                Sign in
                            </button>
                        </div>

                    </div>
                </section>

            </div>

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
        </div>
    )
}