
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductList from "./pages/products/ProductList";
import AddEditProduct from "./pages/products/AddEditProduct";
import CategoryList from "./pages/categories/CategoryList";
import AddEditCategory from "./pages/categories/AddEditCategory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddEditProduct />} />
              <Route path="products/edit/:id" element={<AddEditProduct />} />
              
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/add" element={<AddEditCategory />} />
              <Route path="categories/edit/:id" element={<AddEditCategory />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
