import { useQuery } from "@tanstack/react-query";
import { Artwork } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function FeaturedArtworks() {
  const { data: artworks, isLoading } = useQuery({
    queryKey: ["/api/artworks/featured"],
  });

  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickView = (id: number) => {
    navigate(`/artwork/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, artwork: Artwork) => {
    e.stopPropagation();
    addToCart(artwork);
    toast({
      title: "Added to Cart",
      description: `${artwork.title} has been added to your cart`,
      duration: 3000,
    });
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-neutral mb-3">Featured Artworks</h2>
          <p className="font-body text-neutral max-w-2xl mx-auto">
            A curated selection of my most celebrated pieces from different mediums
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 relative rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artworks?.map((artwork: Artwork) => (
              <div 
                key={artwork.id} 
                className="artwork-card group relative overflow-hidden rounded-lg shadow-md h-80 cursor-pointer"
                onClick={() => handleQuickView(artwork.id)}
              >
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="artwork-overlay absolute inset-0 bg-neutral bg-opacity-60 flex flex-col justify-end p-6 opacity-0 transition duration-300">
                  <h3 className="font-heading text-xl text-white font-medium">{artwork.title}</h3>
                  <p className="text-accent font-body mb-2">
                    {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} • ${artwork.price}
                  </p>
                  <div className="flex justify-between items-center">
                    <Button size="sm" variant="default">
                      View Details
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white hover:text-accent"
                      onClick={(e) => handleAddToCart(e, artwork)}
                    >
                      <i className="bx bx-cart-add text-2xl"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/gallery" className="inline-flex items-center font-body text-accent hover:text-neutral transition">
            View Full Gallery
            <i className="bx bx-right-arrow-alt ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
