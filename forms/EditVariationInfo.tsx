'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState, useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// import { getVariationById, updateVariation } from '@/lib/db/VariationCrud';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/TopDialog';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getLocations } from '@/lib/db/ItemLocationCrud';
import { UpdateVariation } from '@/lib/db/ItemVariationCrud';
import { generateSKU } from '@/lib/skuGenerator';
import { Location, Variation } from '@prisma/client';
import { PutBlobResult } from '@vercel/blob';
import { CircleDashedIcon, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

type EditVariationInfoProps = {
   inventoryItemId: number;
   variationId?: number;
};

type VariationFormInputs = {
   variationName: string;
   variationRaw: number;
   variationShipping: number;
   variationTax: number;
   stock: number;
   location: string;
   image: File | null;
};

function EditVariationInfo({
   inventoryItemId,
   variationId,
}: EditVariationInfoProps) {
   const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors },
   } = useForm<VariationFormInputs>();
   const [variation, setVariation] = useState<Variation | null>(null);
   const [locations, setLocations] = useState<Location[] | null>(null);
   const [image, setImage] = useState<File | string | null>(null);
   const [isPending, startTransition] = useTransition();
   const { toast } = useToast();
   const router = useRouter();

   useEffect(() => {
      async function fetchLocations() {
         const locations = await getLocations();

         if (locations && locations.length > 0) {
            setLocations(locations);
         }
      }

      //   async function fetchVariation() {
      //      if (variationId) {
      //         try {
      //            const fetchedVariation = await getVariationById(variationId);
      //            setVariation(fetchedVariation);
      //            setValue('variationName', fetchedVariation.name);
      //            setValue('variationRaw', fetchedVariation.raw);
      //            setValue('variationShipping', fetchedVariation.shipping);
      //            setValue('variationTax', fetchedVariation.tax);
      //            setValue('sku', fetchedVariation.sku);
      //            setValue('stock', fetchedVariation.stock);
      //            setValue('location', fetchedVariation.location);
      //            // Handle setting the image file as well if necessary
      //         } catch (error) {
      //            console.error('Failed to fetch variation:', error);
      //         }
      //      }
      //   }
      fetchLocations();
      //   fetchVariation();
   }, [variationId, setValue]);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         setImage(e.target.files[0]);
         // setValue('image', e.target.files[0]);
      }
   };

   const onSubmit: SubmitHandler<VariationFormInputs> = (data) => {
      let imageUrl: string | null;
      let sku: string | null;

      startTransition(async () => {
         try {
            if (image && image instanceof File) {
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

            if (data.variationName) {
               sku = generateSKU(data.variationName);
            }
            const res = await UpdateVariation(Number(variationId), {
               variationName: data.variationName,
               variationRaw: Number(data.variationRaw),
               variationShipping: Number(data.variationShipping),
               variationTax: Number(data.variationTax),
               stock: data.stock,
               sku: sku ?? null,
               location: data.location,
               image: imageUrl ?? null,
            });

            if (res.status === 'success') {
               toast({
                  title: 'Variation Updated',
                  description: 'Variation has been updated',
               });
               reset();
               router.refresh();
            }
         } catch (error) {
            console.log(error);
            toast({
               title: 'Failed',
               description: 'Failed To update the variation',
            });
         }
      });
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Pencil
               className='text-blue-500 font-medium cursor-pointer'
               size={18}
            />
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle className='text-center'>Edit variation</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <div className='grid gap-4 py-4'>
                  <div>
                     <Label htmlFor='variationName'>Name</Label>
                     <Input
                        type='text'
                        id='variationName'
                        placeholder='Variation Name'
                        {...register('variationName')}
                     />
                  </div>

                  <div>
                     <Label htmlFor='variationRaw'>Raw</Label>
                     <Input
                        type='number'
                        id='variationRaw'
                        placeholder='Variation Raw'
                        {...register('variationRaw')}
                     />
                  </div>

                  <div>
                     <Label htmlFor='variationTax'>Tax</Label>
                     <Input
                        type='number'
                        step='0.01'
                        id='variationTax'
                        placeholder='Variation Tax'
                        {...register('variationTax')}
                     />
                  </div>

                  <div>
                     <Label htmlFor='variationShipping'>Shipping</Label>
                     <Input
                        type='number'
                        id='variationShipping'
                        placeholder='Variation Shipping'
                        {...register('variationShipping')}
                     />
                  </div>

                  <div>
                     <Label htmlFor='stock'>Stock</Label>
                     <Input
                        type='number'
                        id='stock'
                        placeholder='Stock'
                        {...register('stock')}
                     />
                  </div>

                  {locations && (
                     <div>
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
                     </div>
                  )}

                  <div>
                     <Label
                        htmlFor='variationImage'
                        className='text-right mb-2'
                     >
                        Image
                     </Label>
                     <div className='border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2'>
                        <ImageIcon className='h-6 w-6 text-gray-700' />
                        <span className='text-gray-600'>
                           Drag and drop images here,{' '}
                           <Label className='text-blue-600 cursor-pointer'>
                              upload
                              <Input
                                 id='variationImage'
                                 type='file'
                                 accept='image/*'
                                 onChange={handleImageChange}
                                 className='hidden'
                              />
                           </Label>
                        </span>
                     </div>
                  </div>

                  <DialogFooter>
                     <Button type='submit'>
                        {isPending ? (
                           <CircleDashedIcon
                              size={20}
                              className='animate-spin'
                           />
                        ) : (
                           'Edit'
                        )}
                     </Button>
                  </DialogFooter>
               </div>
            </form>
         </DialogContent>
      </Dialog>
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

export default EditVariationInfo;
