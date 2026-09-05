"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, CATEGORIES } from "@/lib/mockData";
import { db, storage } from "@/lib/firebase/client";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const productSchema = z.object({
  name: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  price: z.preprocess((a) => Number(a), z.number().min(0, "Must be positive")),
  stock: z.preprocess((a) => Number(a), z.number().min(0)),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  flavorOptions: z.string().optional(),
  weightOptions: z.string().optional(),
  availAttock: z.boolean().optional(),
  availKamra: z.boolean().optional(),
});

type FormData = z.infer<typeof productSchema>;

export function ProductForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      isPopular: initialData?.isPopular || false,
      isNew: initialData?.isNew || false,
      flavorOptions: initialData?.flavorOptions?.join(", ") || "",
      weightOptions: initialData?.weightOptions?.join(", ") || "",
      availAttock: initialData?.availability?.attock ?? true,
      availKamra: initialData?.availability?.kamra ?? true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrls = initialData?.images || [];
      const productId = initialData?.id || doc(collection(db, "products")).id;

      if (imageFile) {
        setUploadProgress(30);
        const formData = new FormData();
        formData.append("image", imageFile);
        
        const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!imgbbApiKey) throw new Error("ImgBB API key is missing in environment variables");

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        
        if (data.success) {
          imageUrls = [data.data.url];
          setUploadProgress(100);
        } else {
          throw new Error(data.error?.message || "Failed to upload image to ImgBB");
        }
      }

      if (!initialData && imageUrls.length === 0) {
        throw new Error("Please upload an image for new products");
      }

      const productToSave: Product = {
        id: productId,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        stock: data.stock,
        rating: initialData?.rating || 0,
        reviews: initialData?.reviews || 0,
        images: imageUrls,
        isPopular: !!data.isPopular,
        isNew: !!data.isNew,
        availability: {
          attock: data.availAttock ?? true,
          kamra: data.availKamra ?? true,
        },
      };

      if (data.flavorOptions) {
        productToSave.flavorOptions = data.flavorOptions.split(",").map(s => s.trim()).filter(Boolean);
      }
      if (data.weightOptions) {
        productToSave.weightOptions = data.weightOptions.split(",").map(s => s.trim()).filter(Boolean);
      }
      
      if (initialData?.sizeOptions) {
          productToSave.sizeOptions = initialData.sizeOptions;
      }

      await setDoc(doc(db, "products", productId), productToSave);
      toast.success(initialData ? "Product updated" : "Product created");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "products", initialData.id));
      toast.success("Product deleted");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Product" : "New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit as any)}>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                {...form.register("category")}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {form.formState.errors.category && <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...form.register("description")} />
            {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (Rs.)</Label>
              <Input type="number" {...form.register("price")} />
              {form.formState.errors.price && <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" {...form.register("stock")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Flavor Options (comma separated)</Label>
              <Input {...form.register("flavorOptions")} placeholder="Chocolate, Vanilla" />
            </div>
            <div className="space-y-2">
              <Label>Weight Options (comma separated)</Label>
              <Input {...form.register("weightOptions")} placeholder="1lb, 2lb" />
            </div>
          </div>

          <div className="space-y-4 border p-4 rounded-md">
            <Label>Image</Label>
            {initialData?.images?.[0] && (
              <div className="mb-2">
                <img src={initialData.images[0]} alt="Current" className="w-24 h-24 object-cover rounded-md border" />
              </div>
            )}
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
               <p className="text-sm text-blue-500">Uploading: {Math.round(uploadProgress)}%</p>
            )}
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="isPopular" onCheckedChange={(c) => form.setValue("isPopular", c as boolean)} defaultChecked={initialData?.isPopular} />
              <Label htmlFor="isPopular">Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isNew" onCheckedChange={(c) => form.setValue("isNew", c as boolean)} defaultChecked={initialData?.isNew} />
              <Label htmlFor="isNew">New Item</Label>
            </div>
          </div>
          
          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="availAttock" onCheckedChange={(c) => form.setValue("availAttock", c as boolean)} defaultChecked={form.getValues("availAttock")} />
              <Label htmlFor="availAttock">Available in Attock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="availKamra" onCheckedChange={(c) => form.setValue("availKamra", c as boolean)} defaultChecked={form.getValues("availKamra")} />
              <Label htmlFor="availKamra">Available in Kamra</Label>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          {initialData ? (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          ) : <div></div>}
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
