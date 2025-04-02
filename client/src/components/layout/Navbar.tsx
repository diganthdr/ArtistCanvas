import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();

  // Track window scroll position to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle navigation item active state
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-heading text-2xl font-bold text-neutral hover:text-accent transition">
            Diganth
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-body text-sm tracking-wide ${isActive("/") ? "text-accent" : "hover:text-accent"} transition`}>
              Home
            </Link>
            <Link href="/gallery" className={`font-body text-sm tracking-wide ${isActive("/gallery") ? "text-accent" : "hover:text-accent"} transition`}>
              Gallery
            </Link>
            <Link href="/workshops" className={`font-body text-sm tracking-wide ${isActive("/workshops") ? "text-accent" : "hover:text-accent"} transition`}>
              Workshops
            </Link>
            <Link href="/about" className={`font-body text-sm tracking-wide ${isActive("/about") ? "text-accent" : "hover:text-accent"} transition`}>
              About
            </Link>
            <Link href="/contact" className={`font-body text-sm tracking-wide ${isActive("/contact") ? "text-accent" : "hover:text-accent"} transition`}>
              Contact
            </Link>
            <Link href="/admin" className={`font-body text-sm tracking-wide ${isActive("/admin") ? "text-accent" : "hover:text-accent"} transition`}>
              Admin
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-2">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-heading text-xl font-bold">
                      Diganth
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/") ? "bg-secondary text-accent" : ""}`}>
                        Home
                      </div>
                    </Link>
                    <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/gallery") ? "bg-secondary text-accent" : ""}`}>
                        Gallery
                      </div>
                    </Link>
                    <Link href="/workshops" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/workshops") ? "bg-secondary text-accent" : ""}`}>
                        Workshops
                      </div>
                    </Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/about") ? "bg-secondary text-accent" : ""}`}>
                        About
                      </div>
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/contact") ? "bg-secondary text-accent" : ""}`}>
                        Contact
                      </div>
                    </Link>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/admin") ? "bg-secondary text-accent" : ""}`}>
                        Admin
                      </div>
                    </Link>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-2 py-2 rounded-md ${isActive("/cart") ? "bg-secondary text-accent" : ""}`}>
                        Cart ({items.length})
                      </div>
                    </Link>
                  </nav>
                  
                  <div className="mt-auto pb-8">
                    <div className="flex space-x-4 justify-center">
                      <a href="#" className="text-neutral hover:text-accent transition">
                        <i className="bx bxl-instagram text-xl"></i>
                      </a>
                      <a href="#" className="text-neutral hover:text-accent transition">
                        <i className="bx bxl-facebook text-xl"></i>
                      </a>
                      <a href="#" className="text-neutral hover:text-accent transition">
                        <i className="bx bxl-pinterest text-xl"></i>
                      </a>
                      <a href="#" className="text-neutral hover:text-accent transition">
                        <i className="bx bxl-youtube text-xl"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
