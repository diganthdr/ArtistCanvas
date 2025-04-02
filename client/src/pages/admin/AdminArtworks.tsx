import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Using local interface due to import issues
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
  year?: string;
  isFramed?: boolean;
}
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreVertical,
  Pencil, 
  Trash2, 
  ArrowLeft 
} from "lucide-react";
import { Link } from "wouter";

// Form schema for artwork
const artworkFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  medium: z.string().min(1, "Medium is required"),
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  imageUrl: z.string().min(1, "Image URL is required"),
  featured: z.boolean().default(false),
  forSale: z.boolean().default(true),
  creationYear: z.coerce.number().positive("Year must be a positive number"),
});

type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

export default function AdminArtworks() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Fetch artworks
  const { data: artworks = [], isLoading } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
  });
  
  // Image upload mutation for adding artwork
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Set the image URL in the form
      addForm.setValue('imageUrl', data.imagePath);
      toast({
        title: "Image Uploaded",
        description: "The image has been uploaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Image upload mutation for editing artwork
  const uploadEditImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Set the image URL in the edit form
      editForm.setValue('imageUrl', data.imagePath);
      toast({
        title: "Image Uploaded",
        description: "The image has been uploaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Add artwork mutation
  const addArtworkMutation = useMutation({
    mutationFn: async (newArtwork: ArtworkFormValues) => {
      // Map client fields to server fields, extracting only the fields we want to send
      const { creationYear, featured, forSale, ...rest } = newArtwork;
      
      const serverArtwork = {
        ...rest,
        year: String(creationYear), // Convert creationYear to year as string
        isFeatured: featured,
        inStock: forSale,
      };
      
      return apiRequest("/api/artworks", {
        method: "POST",
        body: JSON.stringify(serverArtwork),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Artwork Added",
        description: "The artwork has been added successfully.",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      console.error("Add artwork error:", error);
      toast({
        title: "Error",
        description: "Failed to add artwork. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update artwork mutation
  const updateArtworkMutation = useMutation({
    mutationFn: async ({ id, artwork }: { id: number; artwork: ArtworkFormValues }) => {
      // Map client fields to server fields, extracting only the fields we want to send
      const { creationYear, featured, forSale, ...rest } = artwork;
      
      const serverArtwork = {
        ...rest,
        year: String(creationYear), // Convert creationYear to year as string
        isFeatured: featured,
        inStock: forSale,
      };
      
      return apiRequest(`/api/artworks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(serverArtwork),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Artwork Updated",
        description: "The artwork has been updated successfully.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error("Update artwork error:", error);
      toast({
        title: "Error",
        description: "Failed to update artwork. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete artwork mutation
  const deleteArtworkMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/artworks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Artwork Deleted",
        description: "The artwork has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Add form
  const addForm = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      medium: "",
      size: "",
      price: 0,
      imageUrl: "",
      featured: false,
      forSale: true,
      creationYear: new Date().getFullYear(),
    },
  });
  
  // Edit form
  const editForm = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      medium: "",
      size: "",
      price: 0,
      imageUrl: "",
      featured: false,
      forSale: true,
      creationYear: new Date().getFullYear(),
    },
  });
  
  // Handle edit artwork
  const handleEditArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
    
    // Map server fields to client fields
    editForm.reset({
      title: artwork.title,
      description: artwork.description,
      medium: artwork.medium,
      size: artwork.size,
      price: artwork.price,
      imageUrl: artwork.imageUrl,
      featured: artwork.isFeatured || false,
      forSale: artwork.inStock || true,
      creationYear: parseInt(artwork.year) || new Date().getFullYear(),
    });
    
    setIsEditDialogOpen(true);
  };
  
  // Handle delete artwork
  const handleDeleteArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle file change for add form
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };
  
  // Handle file change for edit form
  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadEditImageMutation.mutate(file);
    }
  };
  
  // Trigger file input click for add form
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Trigger file input click for edit form
  const handleEditUploadClick = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.click();
    }
  };
  
  // Handle form submissions
  const onAddSubmit = (data: ArtworkFormValues) => {
    addArtworkMutation.mutate(data);
  };
  
  const onEditSubmit = (data: ArtworkFormValues) => {
    if (selectedArtwork) {
      updateArtworkMutation.mutate({ id: selectedArtwork.id, artwork: data });
    }
  };
  
  const confirmDelete = () => {
    if (selectedArtwork) {
      deleteArtworkMutation.mutate(selectedArtwork.id);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage Artworks</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Artwork</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new artwork to your gallery.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(onAddSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medium</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medium" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="oil">Oil</SelectItem>
                            <SelectItem value="acrylic">Acrylic</SelectItem>
                            <SelectItem value="watercolor">Watercolor</SelectItem>
                            <SelectItem value="mixed media">Mixed Media</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 24x36 inches" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="creationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Created</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleUploadClick}
                            disabled={uploadImageMutation.isPending}
                          >
                            {uploadImageMutation.isPending ? "Uploading..." : "Upload"}
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-4 w-4 text-accent"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Featured</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="forSale"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-4 w-4 text-accent"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">For Sale</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={addArtworkMutation.isPending}>
                    {addArtworkMutation.isPending ? "Adding..." : "Add Artwork"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-8 text-center">Loading artworks...</div>
          ) : artworks && artworks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">In Stock</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artworks.map((artwork: any) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <div className="h-10 w-10 overflow-hidden rounded">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{artwork.title}</TableCell>
                    <TableCell className="capitalize">{artwork.medium}</TableCell>
                    <TableCell>{artwork.size}</TableCell>
                    <TableCell className="text-right">${artwork.price}</TableCell>
                    <TableCell className="text-center">
                      {artwork.isFeatured ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-center">
                      {artwork.inStock ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditArtwork(artwork)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteArtwork(artwork)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No artworks found. Add your first artwork!</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Artwork</DialogTitle>
            <DialogDescription>
              Update the artwork details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medium" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="oil">Oil</SelectItem>
                          <SelectItem value="acrylic">Acrylic</SelectItem>
                          <SelectItem value="watercolor">Watercolor</SelectItem>
                          <SelectItem value="mixed media">Mixed Media</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 24x36 inches" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="creationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Created</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleEditUploadClick}
                          disabled={uploadEditImageMutation.isPending}
                        >
                          {uploadEditImageMutation.isPending ? "Uploading..." : "Upload"}
                        </Button>
                        <input
                          type="file"
                          ref={editFileInputRef}
                          onChange={handleEditFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="form-checkbox h-4 w-4 text-accent"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Featured</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="forSale"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="form-checkbox h-4 w-4 text-accent"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">For Sale</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={updateArtworkMutation.isPending}>
                  {updateArtworkMutation.isPending ? "Updating..." : "Update Artwork"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Artwork</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedArtwork?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteArtworkMutation.isPending}
            >
              {deleteArtworkMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}