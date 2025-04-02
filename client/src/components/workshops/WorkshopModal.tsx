import { Workshop, insertRegistrationSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, MapPinIcon, GlobeIcon, TagIcon } from "lucide-react";

interface WorkshopModalProps {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
}

// Extend the schema from shared schema
const formSchema = insertRegistrationSchema.extend({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function WorkshopModal({ workshop, isOpen, onClose }: WorkshopModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workshopId: workshop.id,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experienceLevel: "beginner",
      termsAccepted: false,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      // Remove the terms field before sending to API
      const { termsAccepted, ...registrationData } = values;
      return apiRequest("POST", "/api/registrations", registrationData);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been registered for the workshop.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: FormValues) {
    mutate(values);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral mb-1">Register for Workshop</DialogTitle>
          <DialogDescription className="text-accent font-medium">
            {workshop.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-secondary p-4 rounded-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral mb-1">Date & Time:</p>
              <p className="font-medium text-neutral flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {workshop.date} | {workshop.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral mb-1">Location:</p>
              <p className="font-medium text-neutral flex items-center">
                {workshop.type === "online" ? (
                  <GlobeIcon className="h-4 w-4 mr-1" />
                ) : (
                  <MapPinIcon className="h-4 w-4 mr-1" />
                )}
                {workshop.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral mb-1">Type:</p>
              <p className="font-medium text-neutral capitalize">
                {workshop.type}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral mb-1">Fee:</p>
              <p className="font-medium text-neutral flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                ${workshop.price} {workshop.type === "in-person" && "(Materials included)"}
              </p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (No Experience)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Some Experience)</SelectItem>
                      <SelectItem value="advanced">Advanced (Experienced)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I agree to the <a href="#" className="text-accent hover:underline">terms and conditions</a> and understand the cancellation policy.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Processing..." : "Complete Registration"}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-initial" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
