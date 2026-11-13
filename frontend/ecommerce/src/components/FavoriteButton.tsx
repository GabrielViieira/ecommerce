import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  toggleFavoriteService,
  checkFavoriteService,
} from "../services/APIservice";
import Toast from "./notify";

interface FavoriteButtonProps {
  productId: string;
  initialFavorite?: boolean;
  size?: number;
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  productId,
  initialFavorite = false,
  size = 20,
  className = "",
  onToggle,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error" | "info";
    time?: number;
  }>({
    show: false,
    msg: "",
    type: "success",
    time: 3000,
  });

  useEffect(() => {
    if (user && !checked) {
      checkFavoriteService(productId)
        .then(setIsFavorite)
        .catch(console.error)
        .finally(() => setChecked(true));
    } else if (!user) {
      setChecked(true);
    }
  }, [user, productId, checked]);

  const handleToggle = async () => {
    if (!user) {
      setToast({
        show: true,
        msg: "Faça login para adicionar aos favoritos",
        type: "info",
        time: 3000,
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const result = await toggleFavoriteService(productId);
      // result.items is an array of product documents (populated)
      const items = result?.items || [];
      const newFavorite =
        items.some((item: any) =>
          typeof item === "string"
            ? item === productId
            : item._id === productId,
        ) ?? !isFavorite;
      setIsFavorite(newFavorite);
      onToggle?.(newFavorite);

      setToast({
        show: true,
        msg: newFavorite
          ? "Adicionado aos favoritos!"
          : "Removido dos favoritos",
        type: "success",
        time: 3000,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({
        show: true,
        msg: "Erro ao atualizar favorito",
        type: "error",
        time: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading || !user}
        className={`
                    flex items-center justify-center p-2 rounded-full transition-all duration-200
                    ${
                      isFavorite
                        ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                    }
                    ${!user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${className}
                `}
        aria-label={
          isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        {loading ? (
          <Loader2 size={size} className="animate-spin" />
        ) : (
          <Heart
            size={size}
            className={isFavorite ? "fill-current" : ""}
            strokeWidth={isFavorite ? 0 : 2}
          />
        )}
      </button>

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
    </>
  );
}
