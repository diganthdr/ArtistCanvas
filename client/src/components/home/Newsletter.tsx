import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

// Email validation schema
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: { email: string }) => {
      return apiRequest("POST", "/api/subscribers", values);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
      setError("");
    },
    onError: (err) => {
      toast({
        title: "Subscription Failed",
        description: err.message || "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const validatedData = emailSchema.parse({ email });
      mutate(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-neutral mb-3">Stay Inspired</h2>
          <p className="font-body text-neutral mb-8">
            Subscribe to my newsletter for new artwork announcements, workshop dates, and artistic inspiration.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
            <div className="flex-1">
              <Input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-destructive text-sm mt-1 text-left">{error}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-neutral text-sm mt-4">
            I respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
