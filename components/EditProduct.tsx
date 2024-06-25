"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/TopDialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import type { PutBlobResult } from "@vercel/blob";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProduct } from "@/lib/db/productCrud";
import { getProductSubCategories } from "@/lib/db/productSubCategoryCrud";
import { ProductSubCategories } from "@prisma/client";
import { Pencil } from "lucide-react";

const schema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(1, "Product description is required"),
  productSubCategory: z.string().min(1, "product category is required"),
  productImage: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        (files.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type)),
      "Only jpg, jpeg, and png files are allowed"
    ),
  raw: z.string().min(1, "Raw is required"),
  shipping: z.string().min(1, "Shipping is required"),
  tax: z.string().min(1, "Tax is required"),
  markup: z.string().min(1, "Markup is required"),
});

type FormData = z.infer<typeof schema>;

interface EditProductProps {
  product_id: number;
  product_name: string;
  product_desc: string;
  tax: string;
  markup: string;
  raw: string;
  shipping: string;
  product_sub_category_id: string;
}

const EditProduct = ({
  product_id,
  product_sub_category_id,
  product_name,
  product_desc,
  tax,
  markup,
  raw,
  shipping,
}: EditProductProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<ProductSubCategories[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setError(null);
      try {
        const data = await getProductSubCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      markup: markup,
      productDescription: product_desc,
      productName: product_name,
      raw: raw,
      shipping: shipping,
      tax: tax,
      productSubCategory: product_sub_category_id,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);
      let imageUrl: string | null = null;
      const file = formData.productImage?.[0];

      if (!file) {
        await updateProduct(product_id, {
          product_name: formData.productName,
          product_desc: formData.productDescription,
          product_sub_category_id: parseInt(formData.productSubCategory),
          raw: parseInt(formData.raw),
          markup: parseFloat(formData.markup),
          tax: parseFloat(formData.tax),
          shipping: parseInt(formData.shipping),
        });
        setLoading(false);
        window.location.reload();
        return;
      }

      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const newBlob = (await response.json()) as PutBlobResult;
      imageUrl = newBlob.url;

      await updateProduct(product_id, {
        product_name: formData.productName,
        product_desc: formData.productDescription,
        product_image: imageUrl,
        product_sub_category_id: parseInt(formData.productSubCategory),
        raw: parseInt(formData.raw),
        markup: parseFloat(formData.markup),
        tax: parseFloat(formData.tax),
        shipping: parseInt(formData.shipping),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {product_name}</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  {errors.productName && <p>{errors.productName.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  {errors.productDescription && (
                    <p>{errors.productDescription.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="productSubCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-max">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Change Category:</SelectLabel>
                          {categoriesLoading ? (
                            <div>Loading...</div>
                          ) : error ? (
                            <div>Error: {error}</div>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category.product_sub_category_id}
                                value={category.product_sub_category_id.toString()}
                              >
                                {category.product_sub_category_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {errors.productSubCategory && (
                    <p>{errors.productSubCategory.message}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="productImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={inputFileRef}
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="raw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raw</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Raw" {...field} />
                  </FormControl>
                  {errors.raw && <p>{errors.raw.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="shipping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Shipping" {...field} />
                  </FormControl>
                  {errors.shipping && <p>{errors.shipping.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax %</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Tax" {...field} />
                  </FormControl>
                  {errors.tax && <p>{errors.tax.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="markup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markup %</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Markup" {...field} />
                  </FormControl>
                  {errors.markup && <p>{errors.markup.message}</p>}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} variant="default">
                {loading ? "Loading" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
