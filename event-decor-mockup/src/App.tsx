import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Layout from "@/components/layout/Layout";
import { jwtDecode } from "jwt-decode";

// User Pages
import Home from "./pages/user/Home";
import Services from "./pages/user/Services";
import Products from "./pages/user/Products";
import Portfolio from "./pages/user/Portfolio";
import Quote from "./pages/user/Quote";
import Testimonials from "./pages/user/Testimonials";

// Admin Pages
import AddCategory from "./pages/admin/AddCategory";
import AddProduct from "./pages/admin/AddProduct";
import Orders from "./pages/admin/Orders";
import AdminPortfolio from "./pages/admin/AddPortfolio";
import AdminLogin from "./pages/admin/AdminLogin"; // 👈 Ajoute la page login

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    // Vérifier expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }

    // Vérifier rôle ADMIN
    if (!decoded.roles || !decoded.roles.includes("ROLE_ADMIN")) {
      return false;
    }

    return true;
  } catch (e) {
    localStorage.removeItem("token");
    return false;
  }
}

/* --------------------------------------------
   🔐 Protection de route Admin
----------------------------------------------*/
function RequireAdmin({ children }) {
  if (!isTokenValid()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/testimonials" element={<Testimonials />} />

              {/* Admin Login Page */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* 🔐 Admin Protected Routes */}
              <Route
                path="/admin/categories"
                element={
                  <RequireAdmin>
                    <AddCategory />
                  </RequireAdmin>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <RequireAdmin>
                    <AddProduct />
                  </RequireAdmin>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <RequireAdmin>
                    <Orders />
                  </RequireAdmin>
                }
              />

              <Route
                path="/admin/portfolio"
                element={
                  <RequireAdmin>
                    <AdminPortfolio />
                  </RequireAdmin>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
