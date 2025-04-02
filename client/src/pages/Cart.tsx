import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: ""
    }
  });

  const totalAmount = items.reduce((total, item) => total + item.price, 0);
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      const orderData = {
        order: {
          email: values.email,
          total: totalAmount,
          status: "pending"
        },
        items: items.map(item => ({
          artworkId: item.id,
          quantity: 1,
          price: item.price
        }))
      };
      
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase! You will receive an email confirmation shortly.",
      });
      clearCart();
      setIsCheckingOut(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(values: CheckoutValues) {
    mutate(values);
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="bx bx-cart text-6xl text-muted-foreground mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any paintings to your cart yet.</p>
            <Button onClick={() => window.location.href = "/gallery"}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Artwork</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        {item.medium.charAt(0).toUpperCase() + item.medium.slice(1)}
                      </TableCell>
                      <TableCell className="text-right">${item.price}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {isCheckingOut ? (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Checkout Information</h4>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email for order confirmation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col space-y-2">
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Processing..." : "Complete Purchase"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIsCheckingOut(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <Button 
                  className="w-full mt-6" 
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => window.location.href = "/gallery"}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
