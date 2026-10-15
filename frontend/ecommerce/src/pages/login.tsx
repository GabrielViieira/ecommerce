import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShoppingBag,
  User
} from "lucide-react"
import { loginUserService, validateToken } from "../services/APIservice"
import { useAuth } from "../context/AuthContext"
import Toast from "../components/notify"

export default function LoginPage() {
  const { setUser } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
      const response = await loginUserService(username, password)

      const tokenReal = response?.data?.token || response?.token || response

      if (!tokenReal || typeof tokenReal === "object") {
        alert(
          "Critical error: The frontend could not retrieve the authentication token."
        )

        console.log("Raw login API response:", response)
        return
      }

      localStorage.setItem("token", tokenReal)

      const userData = await validateToken()

      if (!userData) {
        alert("Failed to validate the authenticated user.")
        return
      }

      setUser(userData)

      setToast({
        show: true,
        msg: "Login successful!",
        type: "success",
        time: 4000
      })

      navigate("/home")
    } catch (error: any) {
      console.error("Login error:", error)

      setToast({
        show: true,
        msg: "Invalid username or password.",
        type: "error",
        time: 4000
      })
    }
  }

  const routingRegister = () => {
    navigate("/register")
  }

  return (
    <main className="min-h-screen bg-(--site-bg) text-(--text-main)">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-(--border-color) bg-(--surface-lowest) p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--primary-accent) text-(--primary-text)">
              <ShoppingBag size={20} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Silent Commerce
            </span>
          </div>

          <div className="max-w-md mx-auto">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
              Welcome back
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Commerce without
              <br />
              unnecessary noise.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-6 text-(--text-secondary)">
              Access your account and continue your experience with a clean,
              focused, and minimal shopping environment.
            </p>
          </div>

          <div className="border-t border-(--border-color) pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--text-muted)">
              Secure access
            </p>

            <p className="mt-2 text-sm text-(--text-secondary)">
              Your account and information are protected.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--primary-accent) text-(--primary-text)">
                  <ShoppingBag size={20} />
                </div>

                <span className="text-lg font-semibold">
                  Silent Commerce
                </span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Account access
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
                Sign in to your account to continue shopping.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="user"
                  className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)"
                >
                  Username
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  />

                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    id="user"
                    required
                    placeholder="Enter your username"
                    className="h-11 w-full rounded-md border border-(--border-color) bg-transparent pl-10 pr-4 text-sm text-(--text-main) outline-none transition focus:border-(--text-main)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pass"
                  className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  />

                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    id="pass"
                    required
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-md border border-(--border-color) bg-transparent pl-10 pr-11 text-sm text-(--text-main) outline-none transition focus:border-(--text-main)"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--text-muted) transition hover:text-(--text-main)"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="h-11 w-full cursor-pointer rounded-md bg-(--text-main) text-sm font-medium text-(--site-bg) transition-opacity hover:opacity-90"
              >
                Sign in
              </button>
            </form>

            <div className="my-7 border-t border-(--border-color)" />

            <div className="text-center">
              <p className="text-sm text-(--text-secondary)">
                Don't have an account?
              </p>

              <button
                onClick={routingRegister}
                className="mt-3 cursor-pointer text-sm font-medium text-(--text-main) underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Create an account
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
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </main>
  )
}