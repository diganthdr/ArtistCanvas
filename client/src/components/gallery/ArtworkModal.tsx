import { Artwork } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  ShoppingCart, 
  CheckCircle, 
  Truck, 
  Calendar, 
  Frame, 
  PaintBucket, 
  Ruler, 
  ArrowLeft,
  Share2
} from "lucide-react";

interface ArtworkModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const alreadyInCart = isInCart(artwork.id);

  const handleAddToCart = () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out this amazing artwork by Diganth: ${artwork.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Artwork link has been copied to clipboard",
            duration: 3000,
          });
        })
        .catch(err => {
          console.error('Error copying link:', err);
        });
    }
  };

  // Format the medium with proper capitalization
  const formattedMedium = artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <button 
          className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 transition-colors rounded-full w-8 h-8 flex items-center justify-center text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Left side - Artwork Image */}
          <div className="lg:w-3/5 bg-black/5 flex items-center justify-center p-4 max-h-[50vh] lg:max-h-[90vh]">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
          
          {/* Right side - Artwork Details */}
          <div className="lg:w-2/5 p-6 lg:p-8 flex flex-col overflow-y-auto max-h-[40vh] lg:max-h-[90vh]">
            <DialogHeader className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl font-bold">{artwork.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1">
                    {formattedMedium} on Canvas
                  </DialogDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Status badges */}
              <div className="flex gap-2 mt-2">
                {artwork.isFeatured && (
                  <Badge variant="secondary" className="bg-primary/90 text-white">
                    Featured
                  </Badge>
                )}
                {!artwork.inStock && (
                  <Badge variant="destructive">
                    Sold
                  </Badge>
                )}
              </div>
            </DialogHeader>
            
            {/* Price information */}
            <div className="mb-6">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold">${artwork.price}</span>
                <div className="text-green-600 text-sm flex items-center">
                  <Truck className="h-4 w-4 mr-1" />
                  Free Shipping
                </div>
              </div>
              {artwork.inStock ? (
                <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-2 bg-red-50 text-red-700 border-red-200">
                  Sold Out
                </Badge>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-lg">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {artwork.description}
              </p>
            </div>
            
            {/* Specifications */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-lg">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>Size</span>
                </div>
                <div className="font-medium">{artwork.size}</div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Year</span>
                </div>
                <div className="font-medium">{artwork.year}</div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PaintBucket className="h-4 w-4" />
                  <span>Medium</span>
                </div>
                <div className="font-medium">{formattedMedium} on Canvas</div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Frame className="h-4 w-4" />
                  <span>Framed</span>
                </div>
                <div className="font-medium">
                  {artwork.isFramed ? "Yes (Wooden Frame)" : "No"}
                </div>
              </div>
            </div>
            
            {/* Care instructions if needed */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-lg">Care Instructions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Keep away from direct sunlight and moisture. Dust gently with a soft, dry cloth.
              </p>
            </div>
            
            <Separator className="my-4" />
            
            {/* Action buttons */}
            <DialogFooter className="block space-y-3 mt-auto">
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleAddToCart}
                disabled={!artwork.inStock || alreadyInCart}
                size="lg"
              >
                {alreadyInCart ? (
                  <><CheckCircle className="h-5 w-5" /> Added to Cart</>
                ) : artwork.inStock ? (
                  <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                ) : (
                  "Out of Stock"
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={onClose}
                size="lg"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Browsing
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
