import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  deleteUserService,
  updateUserService,
  getProductsService,
  getFavoritesService,
} from "../services/APIservice";
import { useState, useEffect } from "react";
import Toast from "../components/notify";

import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Pencil,
  Trash2,
  Shield,
  Loader2,
  X,
  Heart,
  Package,
} from "lucide-react";

export default function UserProfile() {
  const { user, setUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Favorites section state
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

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

  if (!user) {
    return (
      <div className="min-h-screen bg-(--site-bg) flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={28} className="animate-spin text-(--text-main)" />

          <p className="text-sm text-(--text-muted)">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = user.username
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openEditModal = () => {
    setNewUser({
      username: user.username || "",
      email: user.email || "",
      password: "",
    });

    setIsOpen(true);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Deseja realmente excluir sua conta?");

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      await deleteUserService(user._id);

      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (error) {
      console.error(error);

      setToast({
        show: true,
        msg: "Não foi possível excluir sua conta.",
        type: "error",
        time: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmUpdate = window.confirm("Deseja salvar as alterações?");

    if (!confirmUpdate) return;

    try {
      setIsUpdating(true);

      const data = {
        username: newUser.username,
        email: newUser.email,
        ...(newUser.password ? { password: newUser.password } : {}),
      };

      await updateUserService(user._id, data);

      setUser({
        ...user,
        username: newUser.username,
        email: newUser.email,
      });

      setIsOpen(false);

      setToast({
        show: true,
        msg: "Perfil atualizado com sucesso.",
        type: "success",
        time: 4000,
      });
    } catch (error) {
      console.error(error);

      setToast({
        show: true,
        msg: "Não foi possível atualizar o perfil.",
        type: "error",
        time: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Load user's favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;

      try {
        const favIds = await getFavoritesService();
        if (favIds && favIds.length > 0) {
          const response = await getProductsService(100);
          const allProducts = Array.isArray(response)
            ? response
            : response.data || [];
          const favProducts = allProducts.filter((p: any) =>
            favIds.includes(p._id),
          );
          setFavorites(favProducts);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="min-h-screen bg-(--site-bg) text-(--text-main)">
      {/* HEADER */}

      <header className="border-b border-(--border-color)">
        <div className="w-full max-w-300 mx-auto px-4 md:px-8 lg:px-12 h-18 flex items-center">
          <Link
            to="/home"
            className="flex items-center gap-2 text-xs font-medium text-(--text-secondary) hover:text-(--text-main) transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="w-full max-w-300 mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
        {/* TITLE */}

        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
            Account
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-medium tracking-tight text-(--text-main)">
            Profile Settings
          </h1>

          <p className="mt-3 text-sm text-(--text-secondary)">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
          {/* SIDEBAR */}

          <aside className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div
                className="
                                w-24
                                h-24
                                rounded-full
                                bg-(--primary-accent)
                                text-(--primary-text)
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-semibold
                                mb-5
                            "
              >
                {initials || <User size={32} />}
              </div>

              <h2 className="text-lg font-medium text-(--text-main)">
                {user.username}
              </h2>

              <p className="text-xs text-(--text-muted) mt-1 truncate max-w-full">
                {user.email}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-(--border-color) space-y-3">
              <div className="flex items-center gap-3 text-xs text-(--text-secondary)">
                <Shield size={15} />
                <span>Account active</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-(--text-secondary)">
                <User size={15} />
                <span>{user.roles}</span>
              </div>
            </div>

            <button
              onClick={openEditModal}
              className="
                                mt-6
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-(--primary-accent)
                                text-(--primary-text)
                                py-3
                                rounded-lg
                                text-xs
                                font-semibold
                                hover:bg-(--primary-hover)
                                active:scale-[0.98]
                                transition-all
                                cursor-pointer
                            "
            >
              <Pencil size={14} />
              Edit profile
            </button>
          </aside>

          {/* PROFILE AND FAVORITES */}

          <div className="flex flex-col gap-6">
            {/* PROFILE */}

            <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                      Personal information
                    </p>

                    <h2 className="mt-2 text-xl font-medium text-(--text-main)">
                      Your profile
                    </h2>
                  </div>

                  <button
                    onClick={openEditModal}
                    className="
                                            w-10
                                            h-10
                                            flex
                                            items-center
                                            justify-center
                                            border
                                            border-(--border-color)
                                            rounded-lg
                                            text-(--text-secondary)
                                            hover:bg-(--surface-hover)
                                            hover:text-(--text-main)
                                            transition-colors
                                            cursor-pointer
                                        "
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* USERNAME */}

                  <div className="bg-(--surface) border border-(--border-color) rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-(--surface-high) flex items-center justify-center text-(--text-secondary)">
                        <User size={17} />
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                        Username
                      </span>
                    </div>

                    <p className="text-base font-medium text-(--text-main)">
                      {user.username}
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div className="bg-(--surface) border border-(--border-color) rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-(--surface-high) flex items-center justify-center text-(--text-secondary)">
                        <Mail size={17} />
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                        Email
                      </span>
                    </div>

                    <p className="text-base font-medium text-(--text-main) truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* BIRTH */}

                  <div className="bg-(--surface) border border-(--border-color) rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-(--surface-high) flex items-center justify-center text-(--text-secondary)">
                        <Calendar size={17} />
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                        Birth date
                      </span>
                    </div>

                    <p className="text-base font-medium text-(--text-main)">
                      {user.birth || "Not provided"}
                    </p>
                  </div>

                  {/* ROLE */}

                  <div className="bg-(--surface) border border-(--border-color) rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-(--surface-high) flex items-center justify-center text-(--text-secondary)">
                        <Shield size={17} />
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                        Role
                      </span>
                    </div>

                    <p className="text-base font-medium text-(--text-main) capitalize">
                      {user.roles}
                    </p>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE */}

              <div className="border-t border-(--border-color) p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-(--error)">
                      <Trash2 size={16} />

                      <h3 className="text-sm font-medium">Danger zone</h3>
                    </div>

                    <p className="mt-2 text-xs text-(--text-muted) max-w-md">
                      Permanently delete your account and all associated
                      information.
                    </p>
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="
                                            shrink-0
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            px-4
                                            py-3
                                            border
                                            border-(--error-bg)
                                            text-(--error)
                                            rounded-lg
                                            text-xs
                                            font-semibold
                                            hover:bg-(--error-bg)
                                            hover:text-(--error-text)
                                            disabled:opacity-50
                                            transition-all
                                            cursor-pointer
                                        "
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        Delete account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* FAVORITES */}

            <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
                      Your favorites
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-(--text-main)">
                      Favorite Products
                    </h2>
                  </div>
                </div>

                {favoritesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2
                      size={24}
                      className="animate-spin text-(--primary-accent)"
                    />
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="overflow-y-auto max-h-80 pr-2">
                    <div className="grid grid-cols-1 gap-4">
                      {favorites.map((item) => {
                        const temDesconto = item.discount > 0;
                        const precoFinal = temDesconto
                          ? item.price * (1 - item.discount / 100)
                          : item.price;

                        return (
                          <Link
                            key={item._id}
                            to={`/pagina-produto/${item._id}`}
                            className="flex items-center gap-3 p-3 bg-(--surface) border border-(--border-color) rounded-lg hover:bg-(--surface-hover) transition-colors"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-(--surface-high) rounded-md flex items-center justify-center">
                                <Package
                                  size={16}
                                  className="text-(--text-muted)"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-(--text-main) text-sm line-clamp-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {temDesconto ? (
                                  <>
                                    <span className="text-[10px] text-(--text-muted) line-through">
                                      {formatPrice(item.price)}
                                    </span>
                                    <span className="text-sm font-semibold text-(--success)">
                                      {formatPrice(precoFinal)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold text-(--primary-accent)">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Heart
                              size={16}
                              className="fill-current text-red-500"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Heart size={32} className="text-(--text-muted) mb-2" />
                    <p className="text-sm text-(--text-muted)">
                      Você ainda não tem produtos favoritos.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* MODAL */}

      {isOpen && (
        <div
          className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/70
                    backdrop-blur-sm
                    p-4
                "
        >
          <div
            className="
                        relative
                        w-full
                        max-w-md
                        bg-(--card-bg)
                        border
                        border-(--border-color)
                        rounded-2xl
                        shadow-2xl
                        animate-in
                        fade-in
                        zoom-in-95
                        duration-200
                    "
          >
            {/* HEADER */}

            <div
              className="
                            flex
                            items-center
                            justify-between
                            p-6
                            border-b
                            border-(--border-color)
                        "
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-muted)">
                  Account
                </p>

                <h2 className="mt-1 text-lg font-medium text-(--text-main)">
                  Edit profile
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                                    w-9
                                    h-9
                                    flex
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-(--text-secondary)
                                    hover:bg-(--surface-hover)
                                    hover:text-(--text-main)
                                    transition-colors
                                    cursor-pointer
                                "
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* USERNAME */}

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                  Username
                </label>

                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      username: e.target.value,
                    })
                  }
                  className="
                                        w-full
                                        bg-(--input-bg)
                                        border
                                        border-(--border-color)
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-sm
                                        text-(--text-main)
                                        outline-none
                                        hover:bg-(--input-hover)
                                        focus:border-(--border-light)
                                        transition-colors
                                    "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                  Email
                </label>

                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    })
                  }
                  className="
                                        w-full
                                        bg-(--input-bg)
                                        border
                                        border-(--border-color)
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-sm
                                        text-(--text-main)
                                        outline-none
                                        hover:bg-(--input-hover)
                                        focus:border-(--border-light)
                                        transition-colors
                                    "
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-(--text-muted)">
                  New password
                </label>

                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                    })
                  }
                  className="
                                        w-full
                                        bg-(--input-bg)
                                        border
                                        border-(--border-color)
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-sm
                                        text-(--text-main)
                                        outline-none
                                        hover:bg-(--input-hover)
                                        focus:border-(--border-light)
                                        transition-colors
                                    "
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                                        flex-1
                                        bg-(--surface)
                                        border
                                        border-(--border-color)
                                        py-3
                                        rounded-lg
                                        text-xs
                                        font-semibold
                                        text-(--text-secondary)
                                        hover:bg-(--surface-hover)
                                        hover:text-(--text-main)
                                        transition-all
                                        cursor-pointer
                                    "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="
                                        flex-1
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-(--primary-accent)
                                        text-(--primary-text)
                                        py-3
                                        rounded-lg
                                        text-xs
                                        font-semibold
                                        hover:bg-(--primary-hover)
                                        disabled:opacity-50
                                        transition-all
                                        cursor-pointer
                                    "
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}

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
