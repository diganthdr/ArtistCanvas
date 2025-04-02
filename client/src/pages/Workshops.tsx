import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Workshop } from "@shared/schema";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import WorkshopModal from "@/components/workshops/WorkshopModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function Workshops() {
  const [location] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if there's a selected workshop in the URL
  const urlParams = new URLSearchParams(
    location.includes("?") ? location.substring(location.indexOf("?")) : ""
  );
  const preselectedId = urlParams.get("selected");

  const { data: workshops, isLoading } = useQuery({
    queryKey: ["/api/workshops"],
  });

  // Filter workshops by type if a type is selected
  const filteredWorkshops = selectedType 
    ? workshops?.filter((workshop: Workshop) => workshop.type === selectedType)
    : workshops;

  const handleRegisterClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  // Check if there's a preselected workshop
  if (preselectedId && workshops && !selectedWorkshop) {
    const workshop = workshops.find(
      (w: Workshop) => w.id === parseInt(preselectedId)
    );
    if (workshop) {
      handleRegisterClick(workshop);
    }
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral mb-3">Workshops & Classes</h2>
          <p className="text-neutral max-w-2xl mx-auto">
            Learn techniques and explore your creativity with guided sessions both online and in-person
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white rounded-lg p-1">
            <Button 
              variant={!selectedType ? "default" : "ghost"} 
              onClick={() => setSelectedType(null)}
            >
              All
            </Button>
            <Button 
              variant={selectedType === "online" ? "default" : "ghost"} 
              onClick={() => setSelectedType("online")}
            >
              Online
            </Button>
            <Button 
              variant={selectedType === "in-person" ? "default" : "ghost"} 
              onClick={() => setSelectedType("in-person")}
            >
              In-Person
            </Button>
            <Button variant="ghost">Upcoming</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops?.map((workshop: Workshop) => (
              <WorkshopCard 
                key={workshop.id} 
                workshop={workshop} 
                onRegisterClick={() => handleRegisterClick(workshop)} 
              />
            ))}
          </div>
        )}

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
