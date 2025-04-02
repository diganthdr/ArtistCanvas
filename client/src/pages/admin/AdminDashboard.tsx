import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
// Using any for now due to import issues
interface Artwork {
  id: number;
  title: string;
  description: string;
  medium: string;
  imageUrl: string;
  price: number;
  size: string;
  featured?: boolean;
  inStock?: boolean;
}

interface Workshop {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  spotsAvailable: number;
  price: number;
  imageUrl: string;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PaintBucket, 
  Users, 
  Calendar, 
  ShoppingBag, 
  UserPlus, 
  Mail,
  PanelRight
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: artworks = [] } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
  });
  
  const { data: workshops = [] } = useQuery<Workshop[]>({
    queryKey: ["/api/workshops"],
  });

  // Sample order data that would come from API in a real app
  const orders = [
    { status: "completed", count: 12 },
    { status: "pending", count: 3 },
    { status: "cancelled", count: 1 }
  ];
  
  // Sample sales data that would come from API in a real app
  const monthlySales = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 2500 },
    { name: "Mar", total: 3800 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 4900 },
    { name: "Jun", total: 3200 },
  ];

  // Calculate artwork counts by medium
  const artworksByMedium = artworks?.reduce((acc: any, artwork: any) => {
    acc[artwork.medium] = (acc[artwork.medium] || 0) + 1;
    return acc;
  }, {});

  const artworkMediumChartData = Object.keys(artworksByMedium || {}).map(medium => ({
    name: medium.charAt(0).toUpperCase() + medium.slice(1),
    value: artworksByMedium[medium]
  }));

  const workshopRegistrationsData = [
    { name: "Filled", value: workshops?.reduce((acc: number, workshop: any) => acc + (workshop.capacity - workshop.spotsAvailable), 0) || 0 },
    { name: "Available", value: workshops?.reduce((acc: number, workshop: any) => acc + workshop.spotsAvailable, 0) || 0 }
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-neutral font-medium">Total Artworks</p>
              <p className="text-3xl font-bold">{artworks?.length || 0}</p>
            </div>
            <PaintBucket className="h-8 w-8 text-accent" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-neutral font-medium">Total Workshops</p>
              <p className="text-3xl font-bold">{workshops?.length || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-accent" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-neutral font-medium">Completed Orders</p>
              <p className="text-3xl font-bold">{orders.find(o => o.status === "completed")?.count || 0}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-accent" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-neutral font-medium">Workshop Registrations</p>
              <p className="text-3xl font-bold">{workshopRegistrationsData[0].value}</p>
            </div>
            <UserPlus className="h-8 w-8 text-accent" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Latest Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-secondary p-2 rounded-full mr-3">
                      <ShoppingBag className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">New artwork purchase</p>
                      <p className="text-sm text-muted-foreground">Order #1234 - Autumn Landscape</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-2 rounded-full mr-3">
                      <UserPlus className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">New workshop registration</p>
                      <p className="text-sm text-muted-foreground">Watercolor Basics - John D.</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-2 rounded-full mr-3">
                      <Mail className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">New contact message</p>
                      <p className="text-sm text-muted-foreground">Commission inquiry - Sarah M.</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Artworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artworks?.slice(0, 3).map((artwork: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded overflow-hidden">
                        <img 
                          src={artwork.imageUrl} 
                          alt={artwork.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{artwork.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">{artwork.medium}</p>
                      </div>
                      <div className="ml-auto text-sm font-medium">
                        ${artwork.price}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <PaintBucket className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Manage Artworks</h3>
                  <p className="text-neutral text-center mb-6">
                    Upload, edit, and delete artwork entries
                  </p>
                  <Link href="/admin/artworks">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      Manage Artworks →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <Calendar className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Manage Workshops</h3>
                  <p className="text-neutral text-center mb-6">
                    Create, edit, and schedule workshops
                  </p>
                  <Link href="/admin/workshops">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      Manage Workshops →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <ShoppingBag className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Orders & Sales</h3>
                  <p className="text-neutral text-center mb-6">
                    View and manage customer orders
                  </p>
                  <Link href="/admin/orders">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      Manage Orders →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <UserPlus className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Workshop Registrations</h3>
                  <p className="text-neutral text-center mb-6">
                    View and manage workshop attendees
                  </p>
                  <Link href="/admin/registrations">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      View Registrations →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <Mail className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Contact Messages</h3>
                  <p className="text-neutral text-center mb-6">
                    View contact form submissions
                  </p>
                  <Link href="/admin/messages">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      View Messages →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <PanelRight className="h-16 w-16 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">Site Settings</h3>
                  <p className="text-neutral text-center mb-6">
                    Update website content and settings
                  </p>
                  <Link href="/admin/settings">
                    <p className="text-accent font-medium hover:underline cursor-pointer">
                      Edit Settings →
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}