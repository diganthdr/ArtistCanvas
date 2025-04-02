import { Artwork } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const alreadyInCart = isInCart(artwork.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (alreadyInCart) {
      toast({
        title: "Already in Cart",
        description: `${artwork.title} is already in your cart`,
        duration: 3000,
      });
      return;
    }
    
    addToCart(artwork);
    toast({
      title: "Added to Cart",
      description: `${artwork.title} has been added to your cart`,
      duration: 3000,
    });
  };

  return (
    <div 
      className="group relative rounded-lg overflow-hidden shadow-md h-72 cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Image Container with zoom effect */}
      <div className="h-full overflow-hidden">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      {/* Overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <h3 className="font-heading text-xl text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{artwork.title}</h3>
        <p className="text-white/80 font-body text-sm mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} • {artwork.size}
        </p>
        <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
          <span className="text-white font-semibold text-lg">${artwork.price}</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex items-center gap-1 rounded-full"
            >
              <Eye className="h-4 w-4" />
              <span>Details</span>
            </Button>
            <Button
              size="sm"
              variant={alreadyInCart ? "outline" : "default"}
              className={`rounded-full ${alreadyInCart ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30 border-green-600/50' : ''}`}
              onClick={handleAddToCart}
              disabled={!artwork.inStock}
            >
              {alreadyInCart ? (
                <><CheckCircle className="h-4 w-4 mr-1" /> Added</>
              ) : (
                <><ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart</>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Static elements that are always visible */}
      <div className="absolute top-3 left-3 flex gap-2">
        {artwork.isFeatured && (
          <Badge variant="secondary" className="bg-primary/90 text-white hover:bg-primary">
            Featured
          </Badge>
        )}
      </div>
      
      {!artwork.inStock && (
        <div className="absolute top-3 right-3">
          <Badge variant="destructive" className="font-medium">
            Sold
          </Badge>
        </div>
      )}
    </div>
  );
}
