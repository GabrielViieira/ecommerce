import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"

import LoginPage from './pages/login'
import HomePage from './pages/home'
import RegisterPage from './pages/register'
import CartPage from './pages/cart'
import UserProfile from './pages/profile'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/dashboard'
import CheckoutPage from './pages/checkout';
import HistoryPage from './pages/history';
import OrderTracking from './pages/orderTracking';
import ProductPage from './pages/ProdPage';


const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage
  },
  {
    path: "/home",
    Component: HomePage
  },
  {
    path: "/register",
    Component: RegisterPage
  },
  {
    path: "/cart",
    Component: CartPage
  },
  {
    path: "/user/:username",
    Component: UserProfile
  }, {
    path: "/dashboard",
    Component: Dashboard
  },
  {
    path:"/payments/checkout",
    Component: CheckoutPage
  },
  {
    path:"/history",
    Component: HistoryPage
  },
  {
    path:"/tracking",
    Component: OrderTracking
  },
  {
    path:"/pagina-produto/:id",
    Component: ProductPage
  }
])

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)