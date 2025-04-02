import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const id = parseInt(params.id);

  const { data: artwork, isLoading, error } = useQuery({
    queryKey: [`/api/artworks/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <h1 className="text-2xl font-bold">Artwork Not Found</h1>
              <p className="text-muted-foreground">
                We couldn't find the artwork you were looking for.
              </p>
              <Button onClick={() => navigate("/gallery")} className="mt-4">
                Return to Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(artwork);
    toast({
      title: "Added to Cart",
      description: `${artwork.title} has been added to your cart`,
      duration: 3000,
    });
  };

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 bg-secondary rounded-lg p-6">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title}
            className="w-full h-auto rounded shadow-md"
          />
        </div>
        
        <div className="md:w-1/2">
          <h1 className="font-heading text-3xl font-bold text-neutral">{artwork.title}</h1>
          <p className="text-accent font-medium mt-1">{artwork.medium.charAt(0).toUpperCase() + artwork.medium.slice(1)} on Canvas</p>
          
          <div className="mt-6">
            <p className="text-neutral">
              {artwork.description}
            </p>
            
            <div className="mt-8 space-y-2">
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
            
            <Separator className="my-6" />
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral font-heading text-2xl">${artwork.price}</span>
                <span className="text-green-600 text-sm flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Free Shipping
                </span>
              </div>
              
              <Button
                disabled={!artwork.inStock}
                onClick={handleAddToCart}
                className="w-full mb-3"
              >
                {artwork.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              
              <Button variant="secondary" className="w-full">
                Request Custom Sizes
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Each painting is a unique work of art. Contact for custom commissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
