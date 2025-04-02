import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/context/CartContext";
import { ProtectedRoute, AdminRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import ArtworkDetail from "@/pages/ArtworkDetail";
import Workshops from "@/pages/Workshops";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import AuthPage from "@/pages/auth-page";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminWorkshops from "./pages/admin/AdminWorkshops";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show navbar on non-admin pages */}
      {!isAdmin || window.location.pathname === "/" ? <Navbar /> : null}
      
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/gallery/:medium" component={Gallery} />
          <Route path="/artwork/:id" component={ArtworkDetail} />
          <Route path="/workshops" component={Workshops} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/cart" component={Cart} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          
          {/* Admin Routes - only accessible to admin users */}
          <AdminRoute path="/admin" component={AdminDashboard} />
          <AdminRoute path="/admin/artworks" component={AdminArtworks} />
          <AdminRoute path="/admin/workshops" component={AdminWorkshops} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      {/* Only show footer on non-admin pages */}
      {!isAdmin || window.location.pathname === "/" ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
