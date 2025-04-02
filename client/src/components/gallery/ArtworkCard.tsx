import { Artwork } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(artwork);
    toast({
      title: "Added to Cart",
      description: `${artwork.title} has been added to your cart`,
      duration: 3000,
    });
  };

  return (
    <div 
      className="artwork-card group relative rounded-lg overflow-hidden shadow-sm h-64 cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={artwork.imageUrl} 
        alt={artwork.title} 
        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="artwork-overlay absolute inset-0 bg-neutral bg-opacity-60 flex flex-col justify-end p-4 opacity-0 transition duration-300">
        <h3 className="font-heading text-lg text-white">{artwork.title}</h3>
        <p className="text-accent font-body text-sm mb-2">
          {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} • ${artwork.price}
        </p>
        <div className="flex justify-between items-center">
          <Button 
            size="sm" 
            variant="default" 
            className="text-white bg-accent bg-opacity-90 hover:bg-opacity-100 px-3 py-1 rounded text-xs"
          >
            View Details
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:text-accent"
            onClick={handleAddToCart}
            disabled={!artwork.inStock}
          >
            <i className="bx bx-cart-add text-xl"></i>
          </Button>
        </div>
      </div>
      
      {!artwork.inStock && (
        <div className="absolute top-0 right-0 bg-destructive text-white text-xs px-2 py-1 m-2 rounded-md">
          Sold
        </div>
      )}
    </div>
  );
}
