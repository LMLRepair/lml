'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
   getInventoryItemById,
   updateInventoryItem,
} from '@/lib/db/InventoryItemCrud';
import { useModal } from '@/providers/model-provider';
import {
   InventoryItemBrand,
   ItemsCategory,
   ItemsSubCategory,
   Location,
   Variation,
   Vendor,
} from '@prisma/client';
import { CircleDashedIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '../components/ui/use-toast';
import { brands } from '@/prisma/serviceItems';
import Image from 'next/image';
import SelectLocations from '@/components/SelectLocations';
import useFormStore from '@/app/store';
import VariationTable from '@/components/VariationsTable';
import { PutBlobResult } from '@vercel/blob';

// type Vendor = {
//    vendorId: number;
//    name: string;
// };

type Variations = {
   name: string;
   price: string;
   sku: string;
   quantity: string;
   image?: string | File | null;
};

type Inputs = {
   item: string;
   description: string;
   brand: string;
   image: File | null;
   vendor: string;
   category: string;
   subCategory: string;
   location: string;
};

type EditItemProps = {
   categories: ItemsCategory[];
   subCategories: ItemsSubCategory[];
   locations: Location[];
   brands: InventoryItemBrand[];
   vendors: Vendor[];
   itemId: number;
};

function EditItemForm({
   categories,
   subCategories,
   locations,
   itemId,
   brands,
   vendors,
}: EditItemProps) {
   const [isPending, startTransition] = useTransition();
   const [item, setItem] = useState(null);
   const { toast } = useToast();
   const { setClose } = useModal();
   const router = useRouter();
   const [fetchingOne, setFetchingOne] = useState(false);
   const [image, setImage] = useState<File | null>(null);
   const { addVariation, variations } = useFormStore();

   const {
      register,
      handleSubmit,
      setValue,
      control,
      formState: { errors },
   } = useForm<Inputs>();

   useEffect(() => {
      async function fetchInventoryItemById() {
         try {
            setFetchingOne(true);
            const item = await getInventoryItemById(itemId);
            setValue('item', item.name);
            setValue('description', item.description);
            setValue('brand', String(item.brandId));
            setValue('vendor', String(item.vendorId));
            setValue('category', String(item.itemsCategoryId));
            setValue('subCategory', String(item.itemsSubCategoryId));
            setValue('location', String(item.locationId));
            setItem(item);

            setFetchingOne(false);
         } catch (error) {
            setFetchingOne(false);
            console.log(error);
         }
      }

      fetchInventoryItemById();
   }, [itemId]);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         setImage(e.target.files[0]);
      }
   };

   //Todo: Handle form submission
   const onSubmit: SubmitHandler<Inputs> = (data) => {
      let imageUrl: string | null = null;

      startTransition(async () => {
         try {
            if (image) {
               const response = await fetch(
                  `/api/upload?filename=${image.name}`,
                  {
                     method: 'POST',
                     body: image,
                  }
               );
               if (!response.ok) {
                  throw new Error('Failed to upload file.');
               }
               const newBlob = (await response.json()) as PutBlobResult;
               imageUrl = newBlob.url;
            }

            const res = await updateInventoryItem(itemId, {
               name: data.item,
               description: data.description,
               brandId: data.brand,
               image: imageUrl,
               vendorId: data.vendor,
               categoryId: data.category,
               subCategoryId: data.subCategory,
            });
            if (res.status === 'success') {
               toast({
                  title: 'Item created',
                  description: 'Item has been created successfully',
               });
               router.refresh();
               setClose();
            }
         } catch (error) {
            console.log(error);
         }
      });
   };

   return (
      <div className='flex flex-col items-center justify-center min-h-screen  p-6'>
         <div className='w-full max-w-4xl bg-white p-8'>
            <div className='flex items-start justify-between '>
               <Button variant={'ghost'} onClick={() => setClose()}>
                  <X size={20} />
               </Button>

               <h1 className='text-2xl font-semibold'>Edit Item</h1>
               <Button onClick={handleSubmit(onSubmit)}>
                  {isPending ? (
                     <>
                        <CircleDashedIcon size={20} className='animate-spin' />
                     </>
                  ) : (
                     'Edit'
                  )}
               </Button>
            </div>

            <div className='mt-6'>
               <h2 className='mb-4 text-2xl font-semibold mt-10'>Details</h2>

               <div className='grid grid-cols-2 gap-8'>
                  <div className='space-y-4'>
                     <div className='flex flex-col  gap-2'>
                        <Label className='font-semibold  '>Item</Label>
                        <Input
                           placeholder='e.g iPhone 12'
                           {...register('item')}
                           disabled={fetchingOne}
                        />
                     </div>
                     <div>
                        <Label className='font-semibold'>Description</Label>
                        <Textarea
                           placeholder='e.g This iPhone 12 is the latest model from Apple.'
                           className='min-h-[100px]'
                           {...register('description')}
                        />
                     </div>
                     <div>
                        <Label className='font-semibold'>Brands</Label>
                        <Controller
                           name='brand'
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a category' />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {brands.map(
                                          (brand: InventoryItemBrand) => (
                                             <SelectItem
                                                key={brand.brandInventoryId}
                                                value={String(
                                                   brand.brandInventoryId
                                                )}
                                             >
                                                {brand.brandInventoryName}
                                             </SelectItem>
                                          )
                                       )}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div>

                     <div>
                        <Label className='font-semibold'>Vendors</Label>
                        <Controller
                           name='vendor'
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a category' />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {vendors.map((vendor: Vendor) => (
                                          <SelectItem
                                             key={vendor.vendorId}
                                             value={String(vendor.vendorId)}
                                          >
                                             {vendor.name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div>
                  </div>
                  <div className='space-y-4'>
                     <div className='border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2'>
                        <ImageIcon className='h-6 w-6 text-gray-600' />
                        <span> Drag and drop images here, </span>
                        <Label className='text-blue-600 underline cursor-pointer'>
                           upload
                           <Input
                              id='file-upload'
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={handleImageChange}
                           />
                        </Label>
                     </div>

                     <div>
                        <Label className='font-semibold'>Categories</Label>
                        <Controller
                           name='category'
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a category' />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {categories.map((category) => (
                                          <SelectItem
                                             key={category.itemsCategoryId}
                                             value={String(
                                                category.itemsCategoryId
                                             )}
                                          >
                                             {category.name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div>
                     <div>
                        <Label className='font-semibold'>Sub Categories</Label>
                        <Controller
                           name='subCategory'
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a sub category' />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {subCategories.map((subCategory) => (
                                          <SelectItem
                                             key={
                                                subCategory.itemsSubCategoryId
                                             }
                                             value={String(
                                                subCategory.itemsSubCategoryId
                                             )}
                                          >
                                             {subCategory.name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div>
                     {/* <SelectLocations /> */}

                     {/* <div>
                        <Label className='font-semibold'>Location</Label>
                        <Controller
                           name='location'
                           control={control}
                           render={({ field }) => (
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a location' />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {locations.map((location) => (
                                          <SelectItem
                                             key={location.locationId}
                                             value={String(location.locationId)}
                                          >
                                             {location.name}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )}
                        />
                     </div> */}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function ImageIcon(props: any) {
   return (
      <svg
         {...props}
         xmlns='http://www.w3.org/2000/svg'
         width='24'
         height='24'
         viewBox='0 0 24 24'
         fill='none'
         stroke='currentColor'
         strokeWidth='2'
         strokeLinecap='round'
         strokeLinejoin='round'
      >
         <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
         <circle cx='9' cy='9' r='2' />
         <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
      </svg>
   );
}

export default EditItemForm;
