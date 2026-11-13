import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUserService } from "../services/APIservice";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/notify";
import {
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  User,
  Mail,
  Calendar,
} from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [birth, setbirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();
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
      const newUser = { username, email, password, birth };

      const response = await registerUserService(newUser);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token || response);
      }

      setToast({
        show: true,
        msg: "Account created successfully!",
        type: "success",
        time: 6000,
      });

      setUser(response.data);

      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";

      setToast({
        show: true,
        msg: errorMessage,
        type: "error",
        time: 4000,
      });

      console.error("Registration error:", error.response?.data);
    }
  };

  const routingLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-(--site-bg) text-(--text-main) overflow-hidden">
      {/* Floating decorative elements with glow pulse animation */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-tr from-(--primary-accent)/15 to-transparent rounded-full filter blur-3xl animate-glow-pulse" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-bl from-(--primary-accent)/15 to-transparent rounded-full filter blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-r border-(--border-light) bg-(--surface-low) p-10 lg:flex relative">
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(184,184,184,0.05)_50%,transparent_75%)] bg-[size:200%_200%] animate-shimmer" />

          <div className="flex items-center gap-3 relative z-10 animate-stagger-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-(--primary-accent) to-(--accent) text-black shadow-lg shadow-(--primary-accent)/30">
              <UserPlus size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-(--text-main) to-(--primary-accent) bg-clip-text text-transparent">Silent Commerce</h1>

              <p className="text-xs text-(--text-muted)">
                Modern shopping experience
              </p>
            </div>
          </div>

          <div className="max-w-md animate-stagger-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
              Join the platform
            </span>

            <h2 className="text-5xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
              Create your account and start exploring.
            </h2>

            <p className="mt-6 max-w-sm text-base leading-7 text-(--text-secondary)">
              Join our platform and discover a clean, modern shopping experience
              designed around simplicity and performance.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-(--text-muted) animate-stagger-fade-up" style={{ animationDelay: '0.3s' }}>
            <span className="flex items-center gap-2 transition-colors duration-300 hover:text-(--primary-accent)">Secure<span className="h-1 w-1 rounded-full bg-(--success) flex-shrink-0 shadow-[0_0_8px_currentColor]" /></span>
            <span className="h-1 w-1 rounded-full bg-(--border-light)" />
            <span className="flex items-center gap-2 transition-colors duration-300 hover:text-(--primary-accent)">Fast<span className="h-1 w-1 rounded-full bg-(--primary-accent) flex-shrink-0" /></span>
            <span className="h-1 w-1 rounded-full bg-(--border-light)" />
            <span className="transition-colors duration-300 hover:text-(--primary-accent)">Minimal</span>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-(--site-bg) px-6 py-10 relative">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-(--site-bg) via-(--surface-low)/5 to-(--site-bg)" />

          <div className="w-full max-w-md animate-page-enter relative z-10">
            <div className="mb-8 animate-stagger-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-(--primary-accent) to-(--accent) text-black lg:hidden shadow-xl shadow-(--primary-accent)/20">
                <UserPlus size={20} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
                New account
              </p>

              <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-(--text-main) to-(--text-secondary) bg-clip-text text-transparent">
                Create an account
              </h2>

              <p className="mt-3 text-sm text-(--text-muted)">
                Enter your information to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 animate-stagger-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)"
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
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    required
                    className="h-11 w-full rounded-lg border border-(--border-light) bg-(--surface-low)/50 placeholder:text-(--text-muted) text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 pl-10 pr-4"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-stagger-fade-up" style={{ animationDelay: '0.25s' }}>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  />

                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-lg border border-(--border-light) bg-(--surface-low)/50 placeholder:text-(--text-muted) text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 pl-10 pr-4"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-stagger-fade-up" style={{ animationDelay: '0.3s' }}>
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    onChange={(e) => setpassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    required
                    className="h-11 w-full rounded-lg border border-(--border-light) bg-(--surface-low)/50 placeholder:text-(--text-muted) text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 px-4 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text-main)"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 animate-stagger-fade-up" style={{ animationDelay: '0.35s' }}>
                <label
                  htmlFor="birth"
                  className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)"
                >
                  Date of birth
                </label>

                <div className="relative">
                  <Calendar
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  />

                  <input
                    onChange={(e) => setbirth(e.target.value)}
                    type="date"
                    id="birth"
                    required
                    className="h-11 w-full rounded-lg border border-(--border-light) bg-(--surface-low)/50 text-(--text-main) outline-none transition-all duration-200 focus:border-(--primary-accent)/50 focus:bg-(--surface-low)/80 pl-10 pr-4"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-(--gradient-button) text-sm font-semibold text-(--primary-text) transition-all duration-200 hover:scale-[0.98] active:scale-[0.99] shadow-lg shadow-(--primary-accent)/20 animate-stagger-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                Create account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-(--border-light)" />

              <span className="text-xs text-(--text-muted)">OR</span>

              <div className="h-px flex-1 bg-(--border-light)" />
            </div>

            <div className="text-center">
              <span className="text-sm text-(--text-muted)">
                Already have an account?
              </span>

              <button
                onClick={routingLogin}
                className="ml-2 text-sm font-medium text-(--text-main) transition hover:text-(--text-muted)"
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
              show: false,
            })
          }
        />
      )}
    </div>
  );
}