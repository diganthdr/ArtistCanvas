import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Artwork } from "@shared/schema";
import ArtworkCard from "@/components/gallery/ArtworkCard";
import ArtworkModal from "@/components/gallery/ArtworkModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const params = useParams<{ medium?: string }>();
  const [, setLocation] = useLocation();
  const medium = params?.medium;
  
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);

  const { data: artworks, isLoading } = useQuery({
    queryKey: medium ? [`/api/artworks/medium/${medium}`] : ["/api/artworks"],
  });

  const handleFilterChange = (newMedium: string | null) => {
    if (newMedium) {
      setLocation(`/gallery/${newMedium}`);
    } else {
      setLocation("/gallery");
    }
    setDisplayLimit(6);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 6);
  };

  const displayedArtworks = artworks?.slice(0, displayLimit) || [];
  const hasMore = artworks && displayLimit < artworks.length;

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral mb-3">Gallery</h2>
          <p className="text-neutral max-w-2xl mx-auto">
            Browse through my collection of paintings across different mediums
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-secondary rounded-lg p-1">
            <Button 
              variant={!medium ? "default" : "ghost"} 
              onClick={() => handleFilterChange(null)}
            >
              All
            </Button>
            <Button 
              variant={medium === "oil" ? "default" : "ghost"} 
              onClick={() => handleFilterChange("oil")}
            >
              Oils
            </Button>
            <Button 
              variant={medium === "acrylic" ? "default" : "ghost"} 
              onClick={() => handleFilterChange("acrylic")}
            >
              Acrylics
            </Button>
            <Button 
              variant={medium === "watercolor" ? "default" : "ghost"} 
              onClick={() => handleFilterChange("watercolor")}
            >
              Watercolors
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 relative rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArtworks.map((artwork: Artwork) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  onClick={() => handleArtworkClick(artwork)} 
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-10">
                <Button variant="secondary" onClick={loadMore}>
                  Load More Artworks
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </section>
  );
}
