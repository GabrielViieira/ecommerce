import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      icon: <CheckCircle2 size={20} />,
      color: "text-(--success)",
      progress: "bg-(--success)",
      title: "Sucesso",
    },

    error: {
      icon: <XCircle size={20} />,
      color: "text-(--error)",
      progress: "bg-(--error)",
      title: "Erro",
    },

    warning: {
      icon: <AlertCircle size={20} />,
      color: "text-(--warning)",
      progress: "bg-(--warning)",
      title: "Atenção",
    },

    info: {
      icon: <Info size={20} />,
      color: "text-(--primary-accent)",
      progress: "bg-(--primary-accent)",
      title: "Informação",
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className="
                fixed
                top-24
                right-5
                z-200
                w-[calc(100%-2.5rem)]
                max-w-sm
                overflow-hidden
                rounded-xl
                border
                border-(--border-color)
                bg-(--card-bg)
                shadow-2xl
                animate-in
                fade-in
                slide-in-from-right-8
                duration-300
            "
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className={`
                        shrink-0
                        ${currentStyle.color}
                    `}
        >
          {currentStyle.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-(--text-main)">
            {currentStyle.title}
          </p>

          <p className="text-xs text-(--text-secondary) mt-1">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
                        shrink-0
                        text-(--text-muted)
                        hover:text-(--text-main)
                        transition-colors
                        cursor-pointer
                    "
          aria-label="Fechar notificação"
        >
          <X size={18} />
        </button>
      </div>

      <div className="h-1 w-full bg-(--surface-highest)">
        <div
          className={`
                        h-full
                        ${currentStyle.progress}
                        animate-[toastProgress_linear_forwards]
                    `}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  );
}
