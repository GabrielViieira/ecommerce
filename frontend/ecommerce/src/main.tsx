import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import PageTransition from "./components/PageTransition";

import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import RegisterPage from "./pages/register";
import CartPage from "./pages/cart";
import UserProfile from "./pages/profile";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard";
import CheckoutPage from "./pages/checkout";
import HistoryPage from "./pages/history";
import OrderTracking from "./pages/orderTracking";
import ProductGrid from "./pages/ProdGrid";
import ProductsPage from "./pages/ProductsPage";
import FavoritesPage from "./pages/FavoritesPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => (
      <PageTransition>
        <LoginPage />
      </PageTransition>
    ),
  },
  {
    path: "/home",
    Component: () => (
      <PageTransition>
        <HomePage />
      </PageTransition>
    ),
  },
  {
    path: "/register",
    Component: () => (
      <PageTransition>
        <RegisterPage />
      </PageTransition>
    ),
  },
  {
    path: "/cart",
    Component: () => (
      <PageTransition>
        <CartPage />
      </PageTransition>
    ),
  },
  {
    path: "/user/:username",
    Component: () => (
      <PageTransition>
        <UserProfile />
      </PageTransition>
    ),
  },
  {
    path: "/dashboard",
    Component: () => (
      <PageTransition>
        <Dashboard />
      </PageTransition>
    ),
  },
  {
    path: "/payments/checkout",
    Component: () => (
      <PageTransition>
        <CheckoutPage />
      </PageTransition>
    ),
  },
  {
    path: "/history",
    Component: () => (
      <PageTransition>
        <HistoryPage />
      </PageTransition>
    ),
  },
  {
    path: "/tracking",
    Component: () => (
      <PageTransition>
        <OrderTracking />
      </PageTransition>
    ),
  },
  {
    path: "/pagina-produto/:id",
    Component: () => (
      <PageTransition>
        <ProductGrid />
      </PageTransition>
    ),
  },
  {
    path: "/products",
    Component: () => (
      <PageTransition>
        <ProductsPage />
      </PageTransition>
    ),
  },
  {
    path: "/favorites",
    Component: () => (
      <PageTransition>
        <FavoritesPage />
      </PageTransition>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);