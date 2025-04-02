import { Artwork } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ArtworkModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(artwork);
    toast({
      title: "Added to Cart",
      description: `${artwork.title} has been added to your cart`,
      duration: 3000,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <button 
          className="absolute top-4 right-4 z-10 bg-neutral bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-secondary">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neutral">{artwork.title}</DialogTitle>
              <DialogDescription className="text-accent font-medium">
                {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} on Canvas
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 flex-grow">
              <p className="text-neutral font-body">
                {artwork.description}
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral text-sm">Size:</span>
                  <span className="text-neutral text-sm font-medium">{artwork.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral text-sm">Year:</span>
                  <span className="text-neutral text-sm font-medium">{artwork.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral text-sm">Medium:</span>
                  <span className="text-neutral text-sm font-medium">
                    {artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} on Canvas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral text-sm">Framed:</span>
                  <span className="text-neutral text-sm font-medium">
                    {artwork.isFramed ? "Yes (Wooden Frame)" : "No"}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter className="block space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral font-heading text-2xl">${artwork.price}</span>
                <span className="text-green-600 text-sm flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Free Shipping
                </span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={!artwork.inStock}
              >
                {artwork.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Browsing
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
