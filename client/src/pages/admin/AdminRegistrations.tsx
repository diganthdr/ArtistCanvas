import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Send, Search, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";

import type { Workshop, Registration } from "@shared/schema";

// Helper for type safety with dates
type DateType = string | Date | null | undefined;

interface NotificationFormValues {
  subject: string;
  message: string;
}

const notificationSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function AdminRegistrations() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Load workshops data
  const { data: workshops, isLoading: isLoadingWorkshops } = useQuery<Workshop[]>({
    queryKey: ["/api/workshops"],
  });

  // Load registrations for selected workshop
  const { data: registrations, isLoading: isLoadingRegistrations } = useQuery<Registration[]>({
    queryKey: ["/api/workshops", selectedWorkshop?.id, "registrations"],
    queryFn: async () => {
      if (!selectedWorkshop) return [];
      const response = await fetch(`/api/workshops/${selectedWorkshop.id}/registrations`);
      if (!response.ok) throw new Error("Failed to fetch registrations");
      return response.json();
    },
    enabled: !!selectedWorkshop,
  });

  // Setup notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Filter workshops by search term
  const filteredWorkshops = workshops?.filter(workshop => 
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sending notification
  async function onSendNotification(values: NotificationFormValues) {
    if (!selectedWorkshop) return;
    
    try {
      const res = await apiRequest("POST", `/api/workshops/${selectedWorkshop.id}/notify`, values);
      const data = await res.json();
      
      toast({
        title: "Notification Sent",
        description: `Successfully sent notifications to ${data.sentCount} participants`,
      });
      
      setNotificationOpen(false);
      notificationForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notifications. Please try again.",
        variant: "destructive",
      });
    }
  }

  const formatDate = (dateValue: DateType) => {
    if (!dateValue) return "N/A";
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Workshop Registrations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workshops List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Workshops</CardTitle>
            <CardDescription>Select a workshop to view registrations</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workshops..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {isLoadingWorkshops ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredWorkshops && filteredWorkshops.length > 0 ? (
              <div className="space-y-2">
                {filteredWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedWorkshop?.id === workshop.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedWorkshop(workshop)}
                  >
                    <div className="font-medium">{workshop.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(workshop.date)}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant={workshop.type === "online" ? "secondary" : "outline"}>
                        {workshop.type === "online" ? "Online" : "In-Person"}
                      </Badge>
                      <span className="text-xs">
                        {workshop.spotsAvailable} spots left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No workshops found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  {selectedWorkshop
                    ? `Registrations for ${selectedWorkshop.title}`
                    : "Registrations"}
                </CardTitle>
                <CardDescription>
                  {selectedWorkshop
                    ? `${formatDate(selectedWorkshop.date)} | ${
                        selectedWorkshop.type === "online" ? "Online" : "In-Person"
                      }`
                    : "Select a workshop to view registrations"}
                </CardDescription>
              </div>
              {selectedWorkshop && (
                <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Notify Participants
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogDescription>
                        Send an email notification to all participants registered for{" "}
                        {selectedWorkshop.title}.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...notificationForm}>
                      <form
                        onSubmit={notificationForm.handleSubmit(onSendNotification)}
                        className="space-y-4 pt-4"
                      >
                        <FormField
                          control={notificationForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Notification subject..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={notificationForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your message to participants..."
                                  className="h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setNotificationOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Send Notification</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedWorkshop ? (
              <div className="text-center py-12 text-muted-foreground">
                Please select a workshop to view registrations
              </div>
            ) : isLoadingRegistrations ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : registrations && registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Experience Level</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          {registration.firstName} {registration.lastName}
                        </TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{registration.experienceLevel}</Badge>
                        </TableCell>
                        <TableCell>{registration.createdAt ? formatDate(registration.createdAt) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No registrations found for this workshop
              </div>
            )}
          </CardContent>
          {selectedWorkshop && registrations && registrations.length > 0 && (
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Total registrations: {registrations.length}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}