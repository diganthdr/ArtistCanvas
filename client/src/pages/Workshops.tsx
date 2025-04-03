import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Workshop } from "@shared/schema";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import WorkshopModal from "@/components/workshops/WorkshopModal";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CalendarCheck, 
  MonitorSmartphone, 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  FilterX,
  ArrowUpDown 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Workshops() {
  const [location] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dateAsc" | "dateDesc" | "priceAsc" | "priceDesc">("dateAsc");

  // Check if there's a selected workshop in the URL
  const urlParams = new URLSearchParams(
    location.includes("?") ? location.substring(location.indexOf("?")) : ""
  );
  const preselectedId = urlParams.get("selected");

  const { data: workshops, isLoading } = useQuery<Workshop[]>({
    queryKey: ["/api/workshops"],
  });

  // Filter workshops by search query
  const searchFilteredWorkshops = workshops 
    ? workshops.filter((workshop: Workshop) =>
        workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        workshop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];

  // Filter workshops by type if a type is selected
  const filteredWorkshops = selectedType 
    ? searchFilteredWorkshops.filter((workshop: Workshop) => workshop.type === selectedType)
    : searchFilteredWorkshops;

  // Sort workshops
  const sortedWorkshops = [...filteredWorkshops].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    switch (sortBy) {
      case "dateAsc":
        return dateA.getTime() - dateB.getTime();
      case "dateDesc":
        return dateB.getTime() - dateA.getTime();
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleRegisterClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  // Check if there's a preselected workshop
  useEffect(() => {
    if (preselectedId && workshops && !selectedWorkshop) {
      // Use type assertion to inform TypeScript that workshops is an array
      const workshopArr = workshops as Workshop[];
      const workshop = workshopArr.find(
        (w: Workshop) => w.id === parseInt(preselectedId)
      );
      if (workshop) {
        handleRegisterClick(workshop);
      }
    }
  }, [preselectedId, workshops, selectedWorkshop]);

  const clearFilters = () => {
    setSelectedType(null);
    setSearchQuery("");
    setSortBy("dateAsc");
  };

  const hasActiveFilters = selectedType || searchQuery;

  // Group workshops by date for the upcoming view
  const groupedByDate = sortedWorkshops.reduce((acc, workshop) => {
    const date = workshop.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workshop);
    return acc;
  }, {} as Record<string, Workshop[]>);

  // Count workshops by type
  const onlineCount = searchFilteredWorkshops.filter((w: Workshop) => w.type === 'online').length;
  const inPersonCount = searchFilteredWorkshops.filter((w: Workshop) => w.type === 'in-person').length;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container max-w-7xl px-4 sm:px-6 mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Workshops & Classes</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Learn techniques and explore your creativity with guided sessions both online and in-person. 
            Join a community of artists and develop your skills with professional instruction.
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Online Workshops</h3>
                <p className="text-sm text-muted-foreground">Join from anywhere</p>
                <Badge variant="outline" className="mt-1">{onlineCount} available</Badge>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">In-Person Studios</h3>
                <p className="text-sm text-muted-foreground">Hands-on experience</p>
                <Badge variant="outline" className="mt-1">{inPersonCount} available</Badge>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">All Skill Levels</h3>
                <p className="text-sm text-muted-foreground">Beginner to advanced</p>
                <Badge variant="outline" className="mt-1">{searchFilteredWorkshops.length} total</Badge>
              </div>
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <Button 
                  variant={!selectedType ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedType(null)}
                  className="gap-2"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>All</span>
                </Button>
                <Button 
                  variant={selectedType === "online" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedType("online")}
                >
                  Online
                </Button>
                <Button 
                  variant={selectedType === "in-person" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedType("in-person")}
                >
                  In-Person
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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
                    <DropdownMenuRadioItem value="dateAsc">Date: Earliest First</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dateDesc">Date: Latest First</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceAsc">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceDesc">Price: High to Low</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Separator orientation="vertical" className="h-6" />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  setSortBy("dateAsc");
                }}
              >
                <Filter className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          {/* Search and Active Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Active filters:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedType && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className="capitalize">{selectedType}</span>
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
        
        {/* Workshop Cards Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedWorkshops.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <CalendarCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No workshops found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any workshops that match your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : sortBy === "dateAsc" || sortBy === "dateDesc" ? (
          // Calendar view grouped by date
          <div className="space-y-8">
            {Object.entries(groupedByDate).map(([date, dateWorkshops]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{date}</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {(dateWorkshops as Workshop[]).map((workshop: Workshop) => (
                    <WorkshopCard 
                      key={workshop.id} 
                      workshop={workshop} 
                      onRegisterClick={() => handleRegisterClick(workshop)} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Regular grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedWorkshops.map((workshop: Workshop) => (
              <WorkshopCard 
                key={workshop.id} 
                workshop={workshop} 
                onRegisterClick={() => handleRegisterClick(workshop)} 
              />
            ))}
          </div>
        )}
        
        {/* Workshop Registration FAQ */}
        <div className="mt-16 bg-muted/40 rounded-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold mb-4">Workshop FAQ</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I register for a workshop?</AccordionTrigger>
              <AccordionContent>
                Click the "Register Now" button on any workshop card. Fill out the registration form with your information and submit. You'll receive a confirmation email with details about your upcoming workshop.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What materials do I need for workshops?</AccordionTrigger>
              <AccordionContent>
                For in-person workshops, all materials are provided and included in the fee. For online workshops, you'll receive a list of required materials prior to the session. Basic supplies include drawing pencils, paper, and painting materials specific to the medium.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What if I need to cancel my registration?</AccordionTrigger>
              <AccordionContent>
                Cancellations made 7 or more days before the workshop date are eligible for a full refund. Cancellations within 7 days of the workshop may receive a partial refund or credit toward a future workshop.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Are online workshops recorded?</AccordionTrigger>
              <AccordionContent>
                Yes, all online workshops are recorded and participants will have access to the recording for 30 days after the live session.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Workshop Modal */}
        {selectedWorkshop && (
          <WorkshopModal 
            workshop={selectedWorkshop} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </div>
    </section>
  );
}
