import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Package,
  AlertCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const shippingSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  notes: z.string().optional(),
  shippingMethod: z.enum(["standard", "express"]),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"])
});

type ShippingValues = z.infer<typeof shippingSchema>;
type PaymentValues = z.infer<typeof paymentSchema>;

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [shippingData, setShippingData] = useState<ShippingValues | null>(null);
  
  const shippingForm = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      notes: "",
      shippingMethod: "standard"
    }
  });

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "card"
    }
  });

  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const shippingCost = shippingData?.shippingMethod === "express" ? 15 : 0;
  const taxRate = 0.07; // 7% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!shippingData) return;
      
      const orderData = {
        order: {
          email: shippingData.email,
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          phone: shippingData.phone,
          notes: shippingData.notes,
          shippingMethod: shippingData.shippingMethod,
          subtotal: subtotal,
          shipping: shippingCost,
          tax: taxAmount,
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
      setCheckoutStep('confirmation');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  function handleShippingSubmit(values: ShippingValues) {
    setShippingData(values);
    setCheckoutStep('payment');
  }

  function handlePaymentSubmit(values: PaymentValues) {
    // In a real implementation, we would process payment here
    mutate();
  }

  function getStepNumber() {
    switch(checkoutStep) {
      case 'cart': return 1;
      case 'shipping': return 2;
      case 'payment': return 3;
      case 'confirmation': return 4;
    }
  }

  if (items.length === 0 && checkoutStep !== 'confirmation') {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Looks like you haven't added any paintings to your cart yet. 
              Explore our gallery to find beautiful artwork by Diganth.
            </p>
            <Button size="lg" onClick={() => setLocation("/gallery")}>
              Browse Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkoutStep === 'confirmation') {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-2xl mx-auto border-2 border-green-100">
          <CardContent className="flex flex-col items-center pt-12 pb-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8 text-center">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            {shippingData && (
              <div className="w-full max-w-md mb-8">
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{shippingData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium capitalize">{shippingData.shippingMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold">${totalAmount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => setLocation("/")}
              >
                Return Home
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setLocation("/gallery")}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Checkout Steps Progress */}
      <div className="mb-10">
        <div className="flex justify-between max-w-3xl mx-auto mb-2">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepNumber() >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <span className="text-xs mt-1">Cart</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${getStepNumber() >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepNumber() >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className="text-xs mt-1">Shipping</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${getStepNumber() >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepNumber() >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">{
        checkoutStep === 'cart' ? 'Your Shopping Cart' :
        checkoutStep === 'shipping' ? 'Shipping Information' :
        'Payment Details'
      }</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {checkoutStep === 'cart' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Cart Items ({items.length})</CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Image</TableHead>
                        <TableHead>Artwork</TableHead>
                        <TableHead className="hidden md:table-cell">Medium</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="h-20 w-20 rounded-md overflow-hidden">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">{item.title}</p>
                              <p className="text-sm text-muted-foreground md:hidden mt-1">
                                {item.medium.charAt(0).toUpperCase() + item.medium.slice(1)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Size: {item.size}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.medium.charAt(0).toUpperCase() + item.medium.slice(1)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${item.price}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/gallery")}
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => setCheckoutStep('shipping')}
                  className="gap-2"
                >
                  Proceed to Shipping <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {checkoutStep === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...shippingForm}>
                  <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
                    <FormField
                      control={shippingForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll send your receipt and shipping updates to this email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={shippingForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shippingForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={shippingForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={shippingForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shippingForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shippingForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={shippingForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormDescription>
                            For delivery questions and updates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shippingForm.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Shipping Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <FormItem>
                                <FormLabel className="flex items-center space-x-3 space-y-0">
                                  <RadioGroupItem value="standard" />
                                  <div>
                                    <div className="font-medium">Standard Shipping</div>
                                    <div className="text-sm text-muted-foreground">Free (5-7 business days)</div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem>
                                <FormLabel className="flex items-center space-x-3 space-y-0">
                                  <RadioGroupItem value="express" />
                                  <div>
                                    <div className="font-medium">Express Shipping</div>
                                    <div className="text-sm text-muted-foreground">$15.00 (2-3 business days)</div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shippingForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any special delivery instructions or notes" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setCheckoutStep('cart')}
                      >
                        Back to Cart
                      </Button>
                      <Button type="submit">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {checkoutStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment Details</CardTitle>
                <CardDescription>Choose your payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                    <FormField
                      control={paymentForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <Tabs 
                              defaultValue={field.value} 
                              className="w-full"
                              onValueChange={field.onChange}
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="card" className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Credit Card
                                </TabsTrigger>
                                <TabsTrigger value="paypal" className="flex items-center gap-2">
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.4817 7.37739C19.5171 7.12602 19.5349 6.86875 19.5349 6.60738C19.5349 4.71841 18.0116 3.18701 16.1354 3.18701H11.1344C10.8969 3.18701 10.687 3.36349 10.6456 3.60312L8.04958 17.9263C8.01883 18.104 8.16057 18.2655 8.34019 18.2655H10.4768L10.4057 18.6358C10.3811 18.7849 10.4984 18.9239 10.6496 18.9239H12.5231C12.7335 18.9239 12.9169 18.7728 12.9523 18.5644L12.9606 18.5201L13.4593 15.7985L13.4696 15.74C13.5051 15.5317 13.6885 15.3805 13.8988 15.3805H14.1917C16.284 15.3805 17.9443 14.4946 18.5111 12.0557C18.7516 11.0311 18.656 10.1665 18.1405 9.54611C17.9813 9.36144 17.7844 9.19972 17.5551 9.0672C18.2516 8.61688 18.7135 7.95001 18.871 7.20103C18.8752 7.17965 18.8793 7.15826 18.8834 7.13792C18.96 7.11349 19.0342 7.08597 19.1064 7.05739C19.2359 7.00059 19.3614 6.93884 19.4817 7.37739Z" fill="#012069"/>
                                    <path d="M18.1405 9.54608C17.4956 8.78537 16.2754 8.46069 14.8 8.46069H11.5631C11.3528 8.46069 11.1694 8.61184 11.134 8.82022L10.196 14.6901C10.1714 14.8391 10.2887 14.9782 10.44 14.9782H12.0354C12.3013 14.9782 12.5347 14.7836 12.5742 14.5185L12.9647 12.1992C13.0042 11.9369 13.2376 11.7423 13.5035 11.7423H14.1917C16.577 11.7423 18.3645 10.714 18.9938 7.989C19.0231 7.85054 19.0473 7.7185 19.0666 7.59183C18.9059 7.52337 18.7421 7.46453 18.5756 7.41446C18.4313 7.37129 18.2856 7.3338 18.1386 7.30174C18.1842 7.37129 18.2267 7.44316 18.2656 7.51747C18.2667 7.51955 18.2677 7.52163 18.2687 7.52371C18.656 8.42532 18.2246 9.31413 18.1405 9.54608Z" fill="#003087"/>
                                    <path d="M11.134 8.82031C11.1694 8.61193 11.3528 8.46078 11.5631 8.46078H14.8C16.2754 8.46078 17.4956 8.78339 18.1405 9.54617C18.2246 9.31422 18.656 8.4254 18.2708 7.5238C17.9089 6.69401 17.0958 6.18701 16.1354 6.18701H11.1344C10.924 6.18701 10.7406 6.33816 10.7052 6.54654L8.04958 17.9264C8.01883 18.1041 8.16057 18.2655 8.34019 18.2655H10.4768L11.134 8.82031Z" fill="#001C53"/>
                                    <path d="M18.9938 7.98915C18.3645 10.7141 16.577 11.7424 14.1917 11.7424H13.5035C13.2376 11.7424 13.0042 11.9369 12.9647 12.1993L12.5742 14.5186C12.5347 14.7836 12.3013 14.9782 12.0354 14.9782H10.44C10.2887 14.9782 10.1714 14.8392 10.196 14.6901L11.134 8.82031C11.1694 8.61193 11.3528 8.46078 11.5631 8.46078H14.8C16.2754 8.46078 17.4956 8.78339 18.1405 9.54617C18.656 10.1666 18.7516 11.0312 18.5111 12.0558C18.6736 11.3664 18.7036 10.6226 18.5111 9.89658C18.4102 9.58045 18.2656 9.30001 18.1405 9.0673C18.2246 9.31422 18.656 10.2031 18.2708 11.1047C17.9089 11.9345 17.0958 11.7434 16.1354 11.7434H11.1344C10.924 11.7434 10.7406 11.8946 10.7052 12.103L10.196 14.6901C10.1714 14.8392 10.2887 14.9782 10.44 14.9782H12.0354C12.3013 14.9782 12.5347 14.7836 12.5742 14.5186L12.9647 12.1993C13.0042 11.9369 13.2376 11.7424 13.5035 11.7424H14.1917C16.577 11.7424 18.3645 10.7141 18.9938 7.98915Z" fill="#001C53"/>
                                    <path d="M19.0668 7.59192C19.0476 7.71859 19.0234 7.85063 18.994 7.98909C18.9647 8.12756 18.9285 8.26395 18.8882 8.39723C18.3645 10.7143 16.5771 11.7424 14.1918 11.7424H13.5035C13.2376 11.7424 13.0042 11.9369 12.9647 12.1993L12.5742 14.5186C12.5348 14.7837 12.3014 14.9782 12.0355 14.9782H10.44C10.2888 14.9782 10.1714 14.8392 10.196 14.6901L11.134 8.82028C11.1694 8.6119 11.3528 8.46075 11.5631 8.46075H14.8C16.2753 8.46075 17.4956 8.78544 18.1404 9.54615C18.2246 9.3142 18.2855 9.03375 18.3846 8.71762C18.5771 7.9916 18.5471 7.24783 18.3846 6.55845C18.1404 5.87115 17.5817 5.3207 16.7685 5.3207H11.7677C11.5572 5.3207 11.3738 5.47184 11.3384 5.68022L9.62402 14.5621C9.59943 14.711 9.71677 14.8502 9.86803 14.8502H11.4634C11.7293 14.8502 11.9628 14.6556 12.0022 14.3905L12.3927 12.0713C12.4322 11.8089 12.6656 11.6144 12.9315 11.6144H13.6197C16.005 11.6144 17.7925 10.5861 18.4218 7.86125C18.6624 6.83667 18.5668 5.97215 18.0512 5.35174C17.4936 4.7884 16.6204 4.3207 15.7773 4.3207H10.7763C10.5659 4.3207 10.3825 4.47185 10.347 4.68022L8.04917 17.9264C8.01842 18.1041 8.16016 18.2656 8.33978 18.2656H10.4764L11.4094 12.2258C11.4448 12.0174 11.6281 11.8663 11.8385 11.8663H16.8395C17.8 11.8663 18.613 12.0573 18.975 11.2276C19.3602 10.326 18.9288 9.43714 18.8447 9.19022L18.8405 9.18085L18.8343 9.1674C18.3645 9.36298 17.7975 9.4644 17.1404 9.4644H14.8C14.5896 9.4644 14.4062 9.61554 14.3708 9.82392L13.6867 13.9782C13.6621 14.1272 13.7795 14.2663 13.9308 14.2663H15.5261C15.7921 14.2663 16.0255 14.0718 16.065 13.8067L16.4554 11.4875C16.4949 11.2251 16.7283 11.0305 16.9942 11.0305H17.6824C17.7585 11.0305 17.8345 11.0284 17.9087 11.0244C18.9603 10.9696 19.8159 10.5695 20.3531 9.78669C20.9065 8.98882 21.0717 7.98083 20.7985 6.83043C20.6023 6.00478 20.1765 5.31748 19.5417 4.80112C18.8385 4.23373 17.9567 3.92995 16.9942 3.92995H11.9933C11.7828 3.92995 11.5995 4.0811 11.564 4.28947L8.96796 18.6126C8.94337 18.7616 9.06071 18.9007 9.21197 18.9007H10.8073C11.0733 18.9007 11.3067 18.7062 11.3461 18.441L11.4172 18.0708H9.28014C9.10052 18.0708 8.95879 17.9094 8.98954 17.7317L11.5854 4.40844C11.6209 4.20007 11.8042 4.04892 12.0146 4.04892H17.0156C17.8586 4.04892 18.7318 4.24243 19.2895 4.80576C19.7946 5.4138 19.9024 6.25528 19.6618 7.27987C19.5022 7.31505 19.3385 7.36096 19.172 7.41104C19.1328 7.42456 19.0937 7.43704 19.0546 7.44951C19.0587 7.49644 19.0628 7.54335 19.0668 7.59192Z" fill="#0070E0"/>
                                  </svg>
                                  PayPal
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="card" className="pt-4">
                                <div className="space-y-4">
                                  <FormField
                                    name="cardNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Card Number</FormLabel>
                                        <FormControl>
                                          <div className="relative">
                                            <Input 
                                              placeholder="1234 5678 9012 3456" 
                                              className="pl-10"
                                              disabled={isPending}
                                            />
                                            <div className="absolute left-3 top-2.5 text-muted-foreground">
                                              <CreditCard className="h-4 w-4" />
                                            </div>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormItem>
                                      <FormLabel>Expiration Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="MM/YY" 
                                          disabled={isPending}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                    
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="123" 
                                          disabled={isPending}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  </div>
                                  
                                  <FormItem>
                                    <FormLabel>Cardholder Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Name as it appears on card" 
                                        disabled={isPending}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                </div>
                              </TabsContent>
                              <TabsContent value="paypal" className="pt-4">
                                <div className="text-center p-6 border rounded-md">
                                  <p className="text-lg mb-4">You'll be redirected to PayPal to complete your purchase securely.</p>
                                  <svg className="w-40 mx-auto mb-4" viewBox="0 0 124 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46.1077 6.70288H40.8764C40.4463 6.70288 40.0902 7.0329 40.0162 7.47912L37.1299 25.6445C37.0782 25.9585 37.3184 26.2489 37.6329 26.2489H40.1487C40.5792 26.2489 40.9357 25.9185 41.0093 25.4723L41.7446 21.0861C41.8182 20.6403 42.175 20.3099 42.6052 20.3099H44.1906C47.7437 20.3099 49.7577 18.5394 50.2618 15.1398C50.4863 13.6472 50.2281 12.4802 49.5223 11.6772C48.7554 10.7967 47.5346 10.3983 46.1073 10.3983L46.1077 6.70288ZM46.787 15.2775C46.5129 17.1823 45.0735 17.1823 43.6858 17.1823H42.9127L43.6213 12.9416C43.6568 12.6942 43.8657 12.5121 44.1126 12.5121H44.4696C45.4214 12.5121 46.3271 12.5121 46.7972 13.1144C47.0784 13.472 47.1618 13.7918 46.8875 15.2776L46.787 15.2775ZM60.7213 15.2076H58.1944C57.9471 15.2076 57.7386 15.3897 57.7032 15.6375L57.5932 16.3122L57.4144 16.0526C56.9 15.3079 55.8001 15.0386 54.7032 15.0386C52.1097 15.0386 49.9361 16.9803 49.4624 19.7151C49.2151 21.0805 49.4687 22.3834 50.1597 23.3116C50.7962 24.1707 51.7468 24.5327 52.8861 24.5327C54.9598 24.5327 56.1214 23.1389 56.1214 23.1389L56.011 23.8174C55.9593 24.1318 56.1995 24.4218 56.514 24.4218H58.7831C59.2132 24.4218 59.5693 24.0918 59.6429 23.6455L61.2242 15.8116C61.2759 15.4976 61.0358 15.2072 60.7213 15.2072L60.7213 15.2076ZM57.0631 19.7765C56.8178 21.0978 55.7504 21.9896 54.3675 21.9896C53.6766 21.9896 53.1217 21.7735 52.7741 21.3541C52.4298 20.938 52.3141 20.3322 52.4337 19.6715C52.6595 18.3688 53.751 17.4897 55.1126 17.4897C55.789 17.4897 56.3439 17.7062 56.6983 18.1286C57.0522 18.5539 57.1764 19.164 57.0631 19.7765ZM75.2235 15.2076H72.6841C72.4019 15.2076 72.1386 15.342 71.9763 15.5691L68.3497 20.7594L66.8161 15.7504C66.6981 15.4176 66.3883 15.2076 66.0425 15.2076H63.549C63.2041 15.2076 62.9634 15.5391 63.0634 15.8736L65.761 23.3235L63.2305 26.9214C63.0082 27.2347 63.2297 27.6837 63.6144 27.6837H66.1505C66.4299 27.6837 66.6908 27.5528 66.8546 27.3291L75.6041 15.9656C75.8227 15.6523 75.6016 15.2076 75.2231 15.2076H75.2235ZM83.3374 6.70288H78.1061C77.676 6.70288 77.3199 7.0329 77.2463 7.47912L74.3596 25.6445C74.3079 25.9585 74.5481 26.2489 74.8626 26.2489H77.2708C77.7013 26.2489 78.0578 25.9185 78.1311 25.4723L78.8671 21.0861C78.9407 20.6403 79.2971 20.3099 79.7273 20.3099H81.314C84.8671 20.3099 86.8798 18.5394 87.3839 15.1398C87.6084 13.6472 87.3498 12.4802 86.644 11.6772C85.8775 10.7967 84.6567 10.3983 83.229 10.3983L83.3374 6.70288ZM84.0167 15.2775C83.7423 17.1823 82.3029 17.1823 80.9152 17.1823H80.1421L80.8511 12.9416C80.8861 12.6942 81.0955 12.5121 81.342 12.5121H81.699C82.6508 12.5121 83.5565 12.5121 84.0266 13.1144C84.3078 13.472 84.3912 13.7918 84.1169 15.2776L84.0167 15.2775ZM97.9514 15.2076H95.4237C95.1764 15.2076 94.9675 15.3897 94.9325 15.6375L94.8221 16.3122L94.6433 16.0526C94.1289 15.3079 93.029 15.0386 91.9326 15.0386C89.3391 15.0386 87.1655 16.9803 86.6921 19.7151C86.4448 21.0805 86.6984 22.3834 87.3894 23.3116C88.0259 24.1707 88.9765 24.5327 90.1154 24.5327C92.1891 24.5327 93.3507 23.1389 93.3507 23.1389L93.2403 23.8174C93.1886 24.1318 93.4288 24.4218 93.7433 24.4218H96.0124C96.4425 24.4218 96.7986 24.0918 96.8722 23.6455L98.4539 15.8116C98.5056 15.4976 98.2659 15.2072 97.951 15.2072L97.9514 15.2076ZM94.2928 19.7765C94.0475 21.0978 92.9801 21.9896 91.5972 21.9896C90.9063 21.9896 90.351 21.7735 90.0034 21.3541C89.6591 20.938 89.5434 20.3322 89.6634 19.6715C89.8888 18.3688 90.9803 17.4897 92.3419 17.4897C93.0183 17.4897 93.5732 17.7062 93.9276 18.1286C94.2819 18.5539 94.4057 19.164 94.2924 19.7765H94.2928ZM100.679 7.07234L97.7568 25.6445C97.7051 25.9585 97.9453 26.2489 98.2598 26.2489H100.529C100.959 26.2489 101.315 25.9192 101.389 25.4727L104.273 7.30706C104.325 6.99343 104.085 6.70288 103.77 6.70288H101.283C101.035 6.70288 100.827 6.88494 100.792 7.13266L100.679 7.07234ZM116.7 6.70288L110.773 25.6445C110.722 25.9585 110.962 26.2489 111.276 26.2489H113.543C113.973 26.2489 114.329 25.9192 114.403 25.4727L120.33 6.53069C120.382 6.21707 120.141 5.92651 119.827 5.92651H117.34C117.092 5.92651 116.885 6.10857 116.85 6.35629L116.7 6.70288ZM10.9838 0L3.01604 0C2.4694 0 1.9943 0.424728 1.90355 1.00348L0 14.1782L0.1725 13.8968C1.01926 11.3693 3.6111 9.66932 6.38561 9.66932H9.64337C14.1126 9.66932 16.9092 7.31265 17.6044 3.01122C17.632 2.83301 17.6557 2.66149 17.6739 2.49274C17.3108 1.07071 16.1265 0 14.1126 0H10.9838ZM11.3915 3.24732C11.0739 6.20671 8.99805 6.20671 7.04208 6.20671H5.96057L6.89798 0.0221136C6.94509 -0.288304 7.20699 -0.519669 7.5037 -0.519669H8.84064C10.2006 -0.519669 11.4779 -0.519669 12.1085 0.322055C12.49 0.787879 12.5842 1.28372 12.3916 3.24732H11.3915ZM37.1299 14.1782L35.2263 1.00348C35.1356 0.424728 34.6605 0 34.1139 0H26.146L26.0377 0.521857C30.5523 1.5246 33.964 4.34973 35.1356 9.66932H32.2702C30.4611 9.66932 29.1015 10.7401 28.7456 12.2349C28.5806 12.9037 28.5675 13.4406 28.6987 13.8968C28.6987 13.8968 28.7043 13.9109 28.7077 13.9195L30.6113 27.0943C30.702 27.6726 31.1771 28.0979 31.7237 28.0979H37.2838C37.8305 28.0979 38.3056 27.6731 38.3963 27.0943L40.2999 14.1782C40.3906 13.5999 40.1043 13.0425 39.558 12.8538C39.0113 12.6656 38.3517 12.8538 38.081 13.3643C37.4268 13.0425 36.8801 12.6656 36.3702 12.1551C35.9141 11.5768 35.5949 10.7401 35.5949 9.66932C36.0507 9.66932 36.5064 9.66932 36.9626 9.66932C37.1276 9.66932 37.2926 9.66932 37.4576 9.66932C38.135 9.66932 38.8124 9.66932 39.4898 9.75345C40.3963 9.83758 41.2661 9.9217 42.1355 10.0899C42.3005 10.0899 42.4655 10.0899 42.6309 10.1741C43.8644 10.4218 45.0159 10.8482 46.0823 11.4265C43.8644 5.30114 38.9715 0.942585 33.0213 0.0634947L37.1299 14.1782ZM23.0941 9.66932H19.8364C17.0618 9.66932 14.47 11.3693 13.6232 13.8968L13.4507 14.1782L15.3913 27.0943C15.482 27.6726 15.9575 28.0979 16.5037 28.0979H22.0638C22.6104 28.0979 23.0856 27.6731 23.1763 27.0943L25.0799 14.1782C25.1705 13.5999 24.8843 13.0425 24.338 12.8538C23.7913 12.6656 23.1316 12.8538 22.861 13.3643C22.2068 13.0425 21.6596 12.6656 21.1502 12.1551C20.5307 11.4346 20.2097 10.3643 20.4959 9.33788C21.3654 9.50614 22.2349 9.5902 23.0941 9.66932Z" fill="#253B80"/>
                                  </svg>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-muted/40 p-4 rounded-md flex items-start gap-3 mb-4">
                      <div className="mt-0.5 text-green-600 flex-shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Secure Checkout</h4>
                        <p className="text-sm text-muted-foreground">
                          Your payment information is processed securely. We do not store credit card details nor have access to your payment information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCheckoutStep('shipping')}
                      >
                        Back to Shipping
                      </Button>
                      <Button 
                        type="submit"
                        className="gap-2"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" /> Complete Order
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order Summary Sidebar */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                {/* Order summary items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.medium.charAt(0).toUpperCase() + item.medium.slice(1)}</p>
                      </div>
                      <div className="text-sm font-medium">${item.price}</div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Price calculations */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost > 0 ? (
                      <span>${shippingCost.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (7%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            
            {checkoutStep === 'cart' && items.length > 0 && (
              <CardFooter className="pt-2">
                <Button 
                  className="w-full gap-2" 
                  onClick={() => setCheckoutStep('shipping')}
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            )}
            
            {/* Additional information */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Original artwork ships within 3-5 business days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Each artwork is carefully packaged to ensure safe delivery</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
