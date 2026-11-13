import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  CreditCard,
  CheckCircle,
  Loader2,
  QrCode,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { checkOut, getCartService } from "../services/APIservice";
import HeaderComp from "../components/header";
import Toast from "../components/notify";

interface Product {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

interface CartItem {
  _id: string;
  productId: Product | string;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

type PaymentMethod = "pix" | "cartao";

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [metodo, setMetodo] = useState<PaymentMethod>("pix");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cpf, setCpf] = useState("");
  const [isOpenP, setIsOpenP] = useState(false);
  const [pixPayload, setPixPayload] = useState("");
  const [timer, setTimer] = useState(10);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "warning" | "info" }>({ show: false, message: "", type: "info" });
  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ show: true, message, type });
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await getCartService();
      setCart(response.data || response);
    } catch (error) {
      console.error("Erro ao carregar checkout:", error);
      showToast("Não foi possível carregar seu carrinho.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const getProduct = (productId: Product | string): Product | null => {
    if (typeof productId === "string") return null;
    return productId;
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const product = getProduct(item.productId);
      if (!product) return total;
      return total + product.price * item.quantity;
    }, 0);
  };

  const checkPayment = async () => {
    if (!cart || processing) return;
    try {
      setProcessing(true);
      const itensFormatados = cart.items.map((item) => ({
        productId: typeof item.productId === "string" ? item.productId : item.productId._id,
        quantity: item.quantity,
      }));
      const data = await checkOut(itensFormatados);
      if (!data) throw new Error("Erro no pagamento");
      setIsOpenP(false);
      setPaymentComplete(true);
      setTimeout(() => { navigate("/cart"); }, 3000);
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setIsOpenP(false);
      showToast("Falha ao processar o pagamento.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const cpfFormatado = value.slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(cpfFormatado);
  };

  const handleFinalizarClick = () => {
    if (!cart) return;
    if (metodo === "pix") {
      const cpfNumerico = cpf.replace(/\D/g, "");
      if (cpfNumerico.length !== 11) {
        showToast("Por favor, preencha o CPF corretamente.", "warning");
        return;
      }
      setPixPayload(`PIX-PAGAMENTO-${Date.now()}-${cart._id}`);
      setTimer(10);
      setIsOpenP(true);
      return;
    }
    checkPayment();
  };

  useEffect(() => {
    if (!isOpenP) return;
    if (timer <= 0) { checkPayment(); return; }
    const interval = setInterval(() => {
      setTimer((previousTimer) => {
        if (previousTimer <= 1) { clearInterval(interval); return 0; }
        return previousTimer - 1;
      });
    }, 1000);
    return () => { clearInterval(interval); };
  }, [timer, isOpenP]);

  if (loading) return <div className="min-h-screen bg-(--site-bg) flex items-center justify-center"><Loader2 className="animate-spin text-(--primary-accent)" size={32} /></div>;

  if (!cart || cart.items.length === 0) return (
    <>
      <HeaderComp />
      <div className="min-h-screen bg-(--site-bg) text-(--text-main) flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={42} className="text-(--text-muted)" />
        <p className="text-lg font-semibold">Seu carrinho está vazio.</p>
        <button onClick={() => navigate("/cart")} className="px-5 py-2.5 rounded-xl bg-(--primary-accent) text-(--primary-text) font-semibold cursor-pointer hover:bg-(--primary-hover) transition-colors">Voltar ao carrinho</button>
      </div>
    </>
  );

  const total = getCartTotal();

  return (
    <>
      <HeaderComp />
      <main className="min-h-screen bg-(--site-bg) text-(--text-main) p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* RESUMO - Com efeitos de brilho sutil */}
          <section className="w-full lg:w-105 bg-gradient-card border border-(--border-color) rounded-2xl p-6 flex flex-col shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-(--border-color)">
              <div className="w-10 h-10 rounded-xl bg-(--surface-high) flex items-center justify-center animate-pulse-subtle">
                <ShoppingBag size={20} className="text-(--primary-accent)" />
              </div>
              <div>
                <h2 className="font-bold text-(--text-main) text-lg">Resumo do Pedido</h2>
                <p className="text-xs text-(--text-muted)">{cart.items.length} item(ns)</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 max-h-105 overflow-y-auto pr-1">
              {cart.items.map((item, idx) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item._id}
                    className="flex gap-3 items-center bg-(--surface-lowest) border border-(--border-color) p-3 rounded-xl hover:bg-(--surface-hover) transition-all duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-15 h-15 shrink-0 bg-(--surface) rounded-lg overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={18} className="text-(--text-muted)" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-(--primary-accent)/10 to-transparent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-(--text-main) truncate">{product.title}</h3>
                      <p className="text-xs text-(--text-muted) mt-1">
                        {item.quantity}x R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-(--primary-accent)">R$ {(item.quantity * product.price).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-(--border-color)">
              <div className="flex justify-between items-center">
                <span className="text-sm text-(--text-secondary)">Total a pagar</span>
                <span className="text-2xl font-black text-(--primary-accent)">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* PAGAMENTO - Com animações elegantes */}
          <section className="flex-1 bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            {/* Efeito de brilho sutil no fundo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-bl from-(--primary-accent)/10 to-transparent rounded-full filter blur-3xl" />

            <div className="relative">
              <div className="flex gap-1 mb-8 bg-(--surface-lowest) border border-(--border-color) p-1 rounded-xl">
                <button
                  onClick={() => setMetodo("pix")}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300",
                    metodo === "pix"
                      ? "bg-gradient-button text-(--primary-text) shadow-md"
                      : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--surface-hover)"
                  )}
                >
                  <QrCode size={18} /> PIX
                </button>
                <button
                  onClick={() => setMetodo("cartao")}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300",
                    metodo === "cartao"
                      ? "bg-gradient-button text-(--primary-text) shadow-md"
                      : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--surface-hover)"
                  )}
                >
                  <CreditCard size={18} /> Cartão
                </button>
              </div>

              {metodo === "pix" ? (
                <div className="bg-(--surface-lowest) border border-(--border-color) p-6 rounded-xl animate-fade-in">
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-(--text-secondary) mb-2">
                      <User size={14} /> CPF DO TITULAR
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="
                        w-full bg-(--input-bg) border border-(--border-color)
                        p-4 rounded-xl outline-none text-(--text-main)
                        transition-all duration-300
                        focus:border-(--primary-accent) focus:ring-2 focus:ring-(--glow-color)
                      "
                    />
                  </div>
                  <div className="p-6 bg-white rounded-xl text-center">
                    <div className="inline-flex w-12 h-12 rounded-xl bg-(--surface) items-center justify-center mb-3">
                      <QrCode className="text-(--primary-accent)" size={28} />
                    </div>
                    <p className="text-sm text-(--text-secondary)">
                      O QR Code será gerado após confirmar o pagamento.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-(--text-secondary) mb-2 block">
                      NOME COMPLETO
                    </label>
                    <input
                      type="text"
                      className="
                        w-full bg-(--input-bg) border border-(--border-color)
                        p-4 rounded-xl outline-none text-(--text-main)
                        transition-all duration-300 focus:border-(--primary-accent)
                      "
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-(--text-secondary) mb-2 block">
                      NÚMERO DO CARTÃO
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="
                        w-full bg-(--input-bg) border border-(--border-color)
                        p-4 rounded-xl outline-none text-(--text-main)
                        transition-all duration-300 focus:border-(--primary-accent)
                      "
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-(--text-secondary) mb-2 block">
                      VALIDADE
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="
                        w-full bg-(--input-bg) border border-(--border-color)
                        p-4 rounded-xl outline-none text-(--text-main)
                        transition-all duration-300 focus:border-(--primary-accent)
                      "
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-(--text-secondary) mb-2 block">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      className="
                        w-full bg-(--input-bg) border border-(--border-color)
                        p-4 rounded-xl outline-none text-(--text-main)
                        transition-all duration-300 focus:border-(--primary-accent)
                      "
                    />
                  </div>
                </div>
              )}


              {/* Botão de pagamento - Verde para concluído */}
              <button
                onClick={handleFinalizarClick}
                disabled={processing || paymentComplete}
                className={clsx(
                  "w-full mt-8 py-4 rounded-xl font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2",
                  paymentComplete
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/30"
                    : processing
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-button text-(--primary-text) hover:scale-[1.02] shadow-md hover:shadow-(--primary-accent)/30"
                )}
              >
                {paymentComplete ? (
                  <>
                    <CheckCircle size={20} className="animate-bounce" />
                    <span>PAGAMENTO REALIZADO</span>
                  </>
                ) : processing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    PROCESSANDO
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    PROSSEGUIR
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL PIX */}
      {isOpenP && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="relative w-full max-w-sm bg-(--card-bg) border border-(--border-color) p-8 rounded-2xl text-center flex flex-col items-center shadow-2xl">
            <button onClick={() => setIsOpenP(false)} disabled={processing} className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-main) cursor-pointer transition-colors"><X size={20} /></button>
            <div className="w-12 h-12 rounded-xl bg-(--surface) flex items-center justify-center mb-4"><QrCode className="text-(--primary-accent)" size={28} /></div>
            <h3 className="text-lg font-bold text-(--text-main) mb-1">Efetue o Pagamento</h3>
            <p className="text-xs text-(--text-muted) mb-6">Escaneie o QR Code pelo aplicativo do seu banco.</p>
            <div className="p-4 bg-white rounded-xl mb-6"><QRCodeSVG value={pixPayload} size={180} level="H" /></div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-(--text-muted) font-bold">Aguardando aprovação</p>
              <p className={clsx("text-2xl font-black", { "text-(--error) animate-pulse": timer <= 3, "text-(--primary-accent)": timer > 3 })}>{`00:${timer < 10 ? `0${timer}` : timer}`}</p>
            </div>
          </div>
        </div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast((previous) => ({ ...previous, show: false }))} />}
    </>
  );
}