import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Artwork } from "@shared/schema";
import ArtworkCard from "@/components/gallery/ArtworkCard";
import ArtworkModal from "@/components/gallery/ArtworkModal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Palette, 
  Image as ImageIcon, 
  Grid3X3, 
  Grid2X2, 
  Search, 
  FilterX,
  ArrowUpDown 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Gallery() {
  const params = useParams<{ medium?: string }>();
  const [, setLocation] = useLocation();
  const medium = params?.medium;
  
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price-low" | "price-high">("featured");
  const [gridView, setGridView] = useState<"3x3" | "2x2">("3x3");

  // URL parameter handling for medium filter
  useEffect(() => {
    // Resetting display limit when medium changes
    setDisplayLimit(9);
  }, [medium]);

  const { data: artworks, isLoading } = useQuery({
    queryKey: medium ? [`/api/artworks/medium/${medium}`] : ["/api/artworks"],
  });

  // Filter by search query
  const filteredArtworks = artworks?.filter(artwork => 
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Sort the filtered artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      case "newest":
        return parseInt(b.year) - parseInt(a.year);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const displayedArtworks = sortedArtworks.slice(0, displayLimit);
  const hasMore = sortedArtworks.length > displayLimit;

  const handleFilterChange = (newMedium: string | null) => {
    if (newMedium) {
      setLocation(`/gallery/${newMedium}`);
    } else {
      setLocation("/gallery");
    }
    setSearchQuery("");
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 9);
  };

  const clearFilters = () => {
    setLocation("/gallery");
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters = medium || searchQuery;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container max-w-7xl px-4 sm:px-6 mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Artwork Gallery
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Explore Diganth's collection of original paintings. From vibrant landscapes to abstract expressions, 
            each piece is a unique window into artistic imagination.
          </p>
        </div>
        
        {/* Filters and Controls Section */}
        <div className="mb-10 space-y-4">
          {/* Medium Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <Button 
                  variant={!medium ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => handleFilterChange(null)}
                  className="gap-2"
                >
                  <Palette className="h-4 w-4" />
                  <span>All</span>
                </Button>
                <Button 
                  variant={medium === "oil" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => handleFilterChange("oil")}
                >
                  Oils
                </Button>
                <Button 
                  variant={medium === "acrylic" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => handleFilterChange("acrylic")}
                >
                  Acrylics
                </Button>
                <Button 
                  variant={medium === "watercolor" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => handleFilterChange("watercolor")}
                >
                  Watercolors
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={gridView === "3x3" ? "bg-secondary" : ""}
                onClick={() => setGridView("3x3")}
                title="3-column grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={gridView === "2x2" ? "bg-secondary" : ""}
                onClick={() => setGridView("2x2")}
                title="2-column grid"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Search and Active Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Active filters:</div>
                <div className="flex flex-wrap gap-2">
                  {medium && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="capitalize">{medium}</span>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>"{searchQuery}"</span>
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-6 gap-1 text-xs"
                  >
                    <FilterX className="h-3 w-3" />
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Gallery Results */}
        {isLoading ? (
          <div className={`grid ${gridView === "3x3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"} gap-6`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 relative rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : displayedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No artworks found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any artworks that match your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className={`grid ${gridView === "3x3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"} gap-6 md:gap-8`}>
              {displayedArtworks.map((artwork: Artwork) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  onClick={() => handleArtworkClick(artwork)} 
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-14">
                <Button variant="outline" size="lg" onClick={loadMore} className="px-8">
                  Load More Artworks
                </Button>
              </div>
            )}

            {/* Gallery stats */}
            <div className="mt-14 text-center text-sm text-muted-foreground">
              Showing {displayedArtworks.length} of {sortedArtworks.length} artworks
            </div>
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
