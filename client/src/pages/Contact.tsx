import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone, Globe, Clock, Loader2, Instagram, Facebook, Twitter } from "lucide-react";
import { SiteSetting } from "@shared/schema";

// Define validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  // Fetch site settings
  const { data: settings = [], isLoading: isLoadingSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Get contact information from settings
  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.settingKey === key);
    return setting ? setting.settingValue : "";
  };
  
  // Define form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // Define mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      return apiRequest("POST", "/api/contacts", values);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Form submission handler
  function onSubmit(values: ContactFormValues) {
    mutate(values);
  }

  return (
    <section id="contact" className="py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-neutral mb-3">Get in Touch</h2>
            <p className="text-neutral mb-8">
              Have questions about my artwork, workshops, or commissions? Feel free to reach out.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md h-full">
              {isLoadingSettings ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-border" />
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-xl font-bold text-neutral mb-6">Contact Information</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start">
                      <Mail className="text-accent mr-3 mt-1 h-5 w-5" />
                      <div>
                        <p className="font-medium text-neutral">Email</p>
                        <a 
                          href={`mailto:${getSettingValue("contactEmail") || "contact@diganth.art"}`} 
                          className="text-accent hover:underline"
                        >
                          {getSettingValue("contactEmail") || "contact@diganth.art"}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="text-accent mr-3 mt-1 h-5 w-5" />
                      <div>
                        <p className="font-medium text-neutral">Phone</p>
                        <a 
                          href={`tel:${getSettingValue("contactPhone") || "+1 (234) 567-890"}`} 
                          className="text-accent hover:underline"
                        >
                          {getSettingValue("contactPhone") || "+1 (234) 567-890"}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="text-accent mr-3 mt-1 h-5 w-5" />
                      <div>
                        <p className="font-medium text-neutral">Studio Address</p>
                        <p className="text-neutral whitespace-pre-line">
                          {getSettingValue("contactAddress") || "123 Artist Way\nCreative District\nCity, State 12345"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-neutral mb-4">Studio Hours</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <p className="font-medium text-neutral flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Monday - Friday
                      </p>
                      <p className="text-neutral">10:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium text-neutral flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Saturday
                      </p>
                      <p className="text-neutral">11:00 AM - 4:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium text-neutral flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Sunday
                      </p>
                      <p className="text-neutral">Closed</p>
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-neutral mb-4">Connect</h3>
                  <div className="flex space-x-4">
                    {getSettingValue("instagramUrl") && (
                      <a 
                        href={getSettingValue("instagramUrl")} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral hover:text-accent transition"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {getSettingValue("facebookUrl") && (
                      <a 
                        href={getSettingValue("facebookUrl")} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral hover:text-accent transition"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {getSettingValue("twitterUrl") && (
                      <a 
                        href={getSettingValue("twitterUrl")} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral hover:text-accent transition"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
