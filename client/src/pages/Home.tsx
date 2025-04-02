import Hero from "../components/home/Hero";
import FeaturedArtworks from "../components/home/FeaturedArtworks";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import { useQuery } from "@tanstack/react-query";
import { Workshop } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, GlobeIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: workshops, isLoading: isLoadingWorkshops } = useQuery({
    queryKey: ["/api/workshops"],
  });

  const featuredWorkshops = workshops?.slice(0, 3) || [];

  return (
    <div>
      <Hero />
      <FeaturedArtworks />
      
      {/* Workshops Section */}
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
              <Button variant="default">All</Button>
              <Button variant="ghost">Online</Button>
              <Button variant="ghost">In-Person</Button>
              <Button variant="ghost">Upcoming</Button>
            </div>
          </div>
          
          {isLoadingWorkshops ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-[400px] animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4 w-3/4" />
                    <div className="h-4 bg-muted rounded mb-2 w-full" />
                    <div className="h-4 bg-muted rounded mb-4 w-5/6" />
                    <div className="h-4 bg-muted rounded mb-6 w-full" />
                    <div className="flex justify-between">
                      <div className="h-8 bg-muted rounded w-1/3" />
                      <div className="h-8 bg-muted rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredWorkshops.map((workshop: Workshop) => (
                <Card key={workshop.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
                      <h3 className="text-xl font-bold text-neutral">{workshop.title}</h3>
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
                      <Link href={`/workshops?selected=${workshop.id}`}>
                        <Button size="sm">Register Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href="/workshops" className="inline-flex items-center text-accent hover:text-neutral transition">
              View Full Workshop Calendar
              <i className="bx bx-right-arrow-alt ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
      
      <Testimonials />
      <Newsletter />
    </div>
  );
}
