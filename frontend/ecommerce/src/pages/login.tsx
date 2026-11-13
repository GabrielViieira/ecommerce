import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, LockKeyhole, ShoppingBag, User } from "lucide-react";
import { loginUserService, validateToken } from "../services/APIservice";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/notify";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error";
    time?: number;
  }>({
    show: false,
    msg: "",
    type: "success",
    time: 3000,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await loginUserService(username, password);

      const tokenReal = response?.data?.token || response?.token || response;

      if (!tokenReal || typeof tokenReal === "object") {
        alert(
          "Critical error: The frontend could not retrieve the authentication token.",
        );

        console.log("Raw login API response:", response);
        return;
      }

      localStorage.setItem("token", tokenReal);

      const userData = await validateToken();

      if (!userData) {
        alert("Failed to validate the authenticated user.");
        return;
      }

      setUser(userData);

      setToast({
        show: true,
        msg: "Login successful!",
        type: "success",
        time: 4000,
      });

      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error);

      setToast({
        show: true,
        msg: "Invalid username or password.",
        type: "error",
        time: 4000,
      });
    }
  };

  const routingRegister = () => {
    navigate("/register");
  };

  return (
    <main className="min-h-screen bg-(--site-bg) text-(--text-main) overflow-hidden">
      {/* Floating decorative elements with subtle animations */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-tr from-(--primary-accent)/10 to-transparent rounded-full filter blur-3xl animate-glow-pulse" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-bl from-(--primary-accent)/10 to-transparent rounded-full filter blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-(--border-color) bg-(--surface-lowest) p-10 lg:flex lg:flex-col lg:justify-between">
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(184,184,184,0.05)_50%,transparent_75%)] bg-[size:200%_200%] animate-shimmer" />

          <div className="flex items-center gap-3 animate-stagger-item" style={{ animationDelay: '0.2s' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--gradient-primary) text-(--primary-text)">
              <ShoppingBag size={20} />
            </div>

            <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-(--text-main) to-(--primary-accent) bg-clip-text text-transparent">
              Silent Commerce
            </span>
          </div>

          <div className="max-w-md mx-auto animate-stagger-container">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted) animate-stagger-item" style={{ animationDelay: '0.4s' }}>
              Welcome back
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent animate-stagger-item" style={{ animationDelay: '0.5s' }}>
              Commerce without
              <br />
              unnecessary noise.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-6 text-(--text-secondary) animate-stagger-item" style={{ animationDelay: '0.6s' }}>
              Access your account and continue your experience with a clean,
              focused, and minimal shopping environment.
            </p>
          </div>

          <div className="border-t border-(--border-color) pt-5 animate-stagger-item" style={{ animationDelay: '0.7s' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--text-muted)">
              Secure access
            </p>

            <p className="mt-2 text-sm text-(--text-secondary)">
              Your account and information are protected.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 relative">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-(--site-bg) via-(--surface-low)/5 to-(--site-bg)" />

          <div className="w-full max-w-sm relative z-10 animate-stagger-container">
            <div className="mb-10 lg:hidden animate-stagger-item" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-(--gradient-primary) text-(--primary-text)">
                  <ShoppingBag size={20} />
                </div>

                <span className="text-lg font-semibold bg-gradient-to-r from-(--text-main) to-(--primary-accent) bg-clip-text text-transparent">Silent Commerce</span>
              </div>
            </div>

            <div className="mb-8 animate-stagger-item" style={{ animationDelay: '0.2s' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                Account access
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-(--text-muted)">
                Sign in to your account to continue shopping.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 animate-stagger-container">
              <div className="space-y-2">
                <label
                  htmlFor="user"
                  className="text-xs font-semibold uppercase tracking-widest text-(--text-muted)"
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
                    className="h-11 w-full rounded-md border border-(--border-light) bg-(--surface-low)/50 placeholder:text-(--text-muted) text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 pl-10 pr-4"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-stagger-item" style={{ animationDelay: '0.3s' }}>
                <label
                  htmlFor="pass"
                  className="text-xs font-semibold uppercase tracking-widest text-(--text-muted)"
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
                    className="h-11 w-full rounded-md border border-(--border-light) bg-(--surface-low)/50 placeholder:text-(--text-muted) text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 pl-10 pr-11"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--text-muted) transition hover:text-(--text-main)"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-md bg-(--gradient-primary) text-sm font-medium text-(--primary-text) transition-all duration-200 hover:scale-[0.98] active:scale-[0.99] animate-stagger-item"
                style={{ animationDelay: '0.4s' }}
              >
                Sign in
                <LockKeyhole
                  size={17}
                  className="transition-transform group-hover:scale-110"
                />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 animate-stagger-item" style={{ animationDelay: '0.5s' }}>
              <div className="h-px flex-1 bg-(--border-light)" />

              <span className="text-xs text-(--text-muted)">OR</span>

              <div className="h-px flex-1 bg-(--border-light)" />
            </div>

            <div className="text-center animate-stagger-item" style={{ animationDelay: '0.6s' }}>
              <p className="text-sm text-(--text-muted)">
                Don't have an account?
              </p>

              <button
                onClick={routingRegister}
                className="mt-3 cursor-pointer text-sm font-medium bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent underline underline-offset-4 transition-opacity hover:opacity-70"
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
  );
}
