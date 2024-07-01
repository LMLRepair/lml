"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import LocationSelectableDialog from "@/components/LocationSelectableDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createInventoryItem } from "@/lib/db/InventoryItemCrud";
import { useModal } from "@/providers/model-provider";
import {
  InventoryItemBrand,
  ItemsCategory,
  ItemsSubCategory,
  Location,
  Vendor,
} from "@prisma/client";
import { PutBlobResult } from "@vercel/blob";
import { CircleDashedIcon, ShieldQuestion, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../components/ui/use-toast";
import VariationsDialog from "../components/AddVariation";
import VariationTable from "../components/VariationsTable";
import Image from "next/image";
import AddVariation from "../components/AddVariation";
import SelectLocations from "@/components/SelectLocations";

type Inputs = {
  item: string;
  description: string;
  vendor: string;
  category: string;
  subCategory: string;
  location: string[];
  brand: string;
  image?: File | null | string;
};

type CreateNewItemProps = {
  categories: ItemsCategory[];
  subCategories: ItemsSubCategory[];
  locations: Location[];
  brands: InventoryItemBrand[];
  vendors: Vendor[];
};

type Variation = {
  name: string;
  price: string;
  sku: string;
  quantity: string;
  image?: File | null | string;
};

export type SelectedLocationsType = { id: string; name: string }[];

function CreateNewItemForm({
  categories,
  subCategories,
  locations,
  brands,
  vendors,
}: CreateNewItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { setClose } = useModal();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const [image, setImage] = useState<File | null | string>(null);
  const [preview, setPreview] = useState<any>(null);
  const [variationsData, setVariationsData] = useState<Variation[]>([]);
  const [selectedLocations, setSelectedLocations] =
    useState<SelectedLocationsType>([]);

  const handleSelectedLocations = (checkedLocations: any) => {
    setSelectedLocations(checkedLocations);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      //Todo: Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(e.target.files[0]);
      setPreview(previewURL);
    }
  };

  const handleOptionsData = (options: Variation[]) => {
    setVariationsData((prevData) => [...prevData, ...options]);
  };

  const handleDeleteVariation = (deleteIndex: number) => {
    const updatedVariations = variationsData.filter(
      (_: Variation, index: number) => index !== deleteIndex
    );
    setVariationsData(updatedVariations);
  };

  const handleEditVariation = (
    editIndex: number,
    editedVariation: Variation
  ) => {
    const updatedVariations = variationsData.map((variation, index) =>
      index === editIndex ? editedVariation : variation
    );
    setVariationsData(updatedVariations);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // let imageUrl: string | null = null;
    // let variationImages: string[] = [];
    // startTransition(async () => {
    //    try {
    //       if (image && image instanceof File) {
    //          const response = await fetch(
    //             `/api/upload?filename=${image.name}`,
    //             {
    //                method: 'POST',
    //                body: image,
    //             }
    //          );
    //          if (!response.ok) {
    //             throw new Error('Failed to upload file.');
    //          }
    //          const newBlob = (await response.json()) as PutBlobResult;
    //          imageUrl = newBlob.url;
    //       }
    //       if (variationsData.length > 0) {
    //          for (const variation of variationsData) {
    //             if (variation.image && variation.image instanceof File) {
    //                const response = await fetch(
    //                   `/api/upload?filename=${variation.image.name}`,
    //                   {
    //                      method: 'POST',
    //                      body: variation.image,
    //                   }
    //                );
    //                if (!response.ok) {
    //                   throw new Error('Failed to upload file.');
    //                }
    //                const newBlob = (await response.json()) as PutBlobResult;
    //                variationImages.push(newBlob.url);
    //             }
    //          }
    //       }
    //       const res = await createInventoryItem({
    //          name: data.item,
    //          description: data.description,
    //          variations: variationsData.map((variation, index) => ({
    //             name: variation.name,
    //             price: variation.price,
    //             sku: variation.sku,
    //             quantity: variation.quantity,
    //             image: variationImages[index],
    //          })),
    //          brand: data.brand,
    //          vendor: data.vendor,
    //          category: data.category,
    //          subCategory: data.subCategory,
    //          location: data.location,
    //          image: imageUrl,
    //       });
    //       if (res.status === 'success') {
    //          toast({
    //             title: 'Item created',
    //             description: 'Item has been created successfully',
    //          });
    //          router.push('/dashboard/inventory/items');
    //          setClose();
    //       }
    //    } catch (error) {
    //       console.log(error);
    //    }
    // });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-6 bg-white ">
        <Button type="button" variant={"secondary"} onClick={() => setClose()}>
          <X size={20} />
        </Button>

        <h1 className="text-xl font-medium">Create Item</h1>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          {isPending ? (
            <>
              <CircleDashedIcon size={20} className="animate-spin" />
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
      <div className="flex flex-col items-center p-6 space-y-4">
        <h1 className="font-bold text-lg">Details</h1>
        {/* <div className='flex '> */}
        <form
          className="space-y-4 w-full max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex items-center gap-10 space-x-4">
              <div className="w-full space-y-1">
                <Label className="block mb-1">Item</Label>

                <Input
                  placeholder="e.g Iphone 12"
                  className="w-full"
                  {...register("item", { required: true })}
                />
              </div>
              {preview && (
                <Image
                  src={preview}
                  width={100}
                  height={100}
                  alt="Preview-image"
                  className="transition-all rounded-2xl border border-yellow-300  aspect-square"
                />
              )}
            </div>
            {errors.item && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div>
            <Label className="block mb-1">Description</Label>
            <Textarea
              rows={6}
              placeholder="e.g This Iphone 12 is the latest model from Apple."
              className="w-full"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2">
              <ImageIcon className="h-6 w-6 text-gray-600" />
              <span> Drag and drop images here, </span>
              <Label className="text-blue-600 underline cursor-pointer">
                upload
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Label>
            </div>
          </div>
          <SelectLocations />

          <div className="flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-lg">Variations</Label>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldQuestion className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        A variation is a unique combination of attributes. An
                        example of a variation is a 16GB, Green iPhone 6 Plus.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AddVariation />
              </div>
            </div>
          </div>
          <div className="space-y-4">{<VariationTable />}</div>

          <div className="space-y-4">
            <Label className="block mb-1">Vendor</Label>
            <Controller
              name="vendor"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem
                        key={vendor.vendorId}
                        value={String(vendor.vendorId)}
                      >
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              rules={{ required: true }}
            />
            {errors.vendor && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div className="space-y-4">
            <Label className="block mb-1">Brand</Label>
            <Controller
              name="brand"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem
                        key={brand.brandInventoryId}
                        value={String(brand.brandInventoryId)}
                      >
                        {brand.brandInventoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              rules={{ required: true }}
            />
            {errors.brand && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>

          <div className="flex justify-between space-x-">
            <div className="w-1/2">
              <Label className="block mb-1">Category</Label>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.itemsCategoryId}
                          value={String(category.itemsCategoryId)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                rules={{ required: true }}
              />
              {errors.category && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="w-1/2">
              <Label className="block mb-1 text-right">Sub Category</Label>
              <Controller
                name="subCategory"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.itemsSubCategoryId}
                          value={String(subcategory.itemsSubCategoryId)}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                rules={{ required: true }}
              />
              {errors.subCategory && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

export default CreateNewItemForm;
