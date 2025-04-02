import { Workshop } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, GlobeIcon, UserIcon } from "lucide-react";

interface WorkshopCardProps {
  workshop: Workshop;
  onRegisterClick: () => void;
}

export default function WorkshopCard({ workshop, onRegisterClick }: WorkshopCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 bg-neutral relative">
        <img 
          src={workshop.imageUrl} 
          alt={workshop.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={workshop.type === "online" ? "secondary" : "default"}>
            {workshop.type === "online" ? "Online" : "In-Person"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-xl font-bold text-neutral">{workshop.title}</h3>
          <span className="text-accent font-medium">${workshop.price}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-neutral text-sm mb-1">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{workshop.date} | {workshop.time}</span>
          </div>
          <div className="flex items-center text-neutral text-sm">
            {workshop.type === "online" ? (
              <><GlobeIcon className="mr-2 h-4 w-4" /><span>{workshop.location}</span></>
            ) : (
              <><MapPinIcon className="mr-2 h-4 w-4" /><span>{workshop.location}</span></>
            )}
          </div>
        </div>
        
        <p className="text-neutral text-sm mb-5">
          {workshop.description.length > 100 
            ? `${workshop.description.substring(0, 100)}...` 
            : workshop.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral font-medium">
            <UserIcon className="inline mr-1 h-4 w-4" />
            {workshop.spotsAvailable} spots left
          </span>
          <Button 
            size="sm" 
            onClick={onRegisterClick}
            disabled={workshop.spotsAvailable <= 0}
          >
            {workshop.spotsAvailable > 0 ? "Register Now" : "Sold Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
