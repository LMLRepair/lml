'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
   getInventoryItemBrandById,
   updateInventoryBrand,
} from '@/lib/db/itemBranCrud';
import { useModal } from '@/providers/model-provider';
import { CircleDashedIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
   brandInventoryName: string;
   description: string;
};

type BrandProps = {
   brandId: number;
};

export default function EditInventoryItemBrandForm({ brandId }: BrandProps) {
   const { setClose } = useModal();

   const router = useRouter();
   const { toast } = useToast();
   const [isPending, startTransition] = useTransition();
   const {
      register,
      handleSubmit,
      control,
      setValue,
      formState: { errors },
   } = useForm<Inputs>();

   useEffect(() => {
      const fetchInventoryBrand = async () => {
         try {
            const res = await getInventoryItemBrandById(brandId);
            setValue('brandInventoryName', res.brandInventoryName);
            setValue('description', res.description);
         } catch (error) {
            console.log(error);
         }
      };

      fetchInventoryBrand();
   }, [brandId]);

   //Todo: Handle form submission
   const onSubmit: SubmitHandler<Inputs> = (data) => {
      startTransition(async () => {
         try {
            const res = await updateInventoryBrand(brandId, {
               brandInventoryName: data.brandInventoryName,
               description: data.description,
            });

            if (res.status === 'success') {
               toast({
                  title: 'Brand updated successfully',
                  description: 'The Brand has been updated successfully.',
               });
               router.refresh();
               setClose();
            }
         } catch (error) {
            console.log(error);
            toast({
               title: 'An error occurred',
               description: 'Failed to update the brand.',
            });
         }
      });
   };

   return (
      <div className='flex items-center justify-center h-screen'>
         <div className='m-auto p-10 rounded-lg  w-1/2'>
            <div className='flex justify-between items-center mb-8'>
               <Button variant={'ghost'} onClick={() => setClose()}>
                  <X className='h-6 w-6' />
               </Button>

               <h1 className='text-2xl font-semibold'>Edit Brand</h1>
               <Button variant='default' onClick={handleSubmit(onSubmit)}>
                  {isPending ? (
                     <>
                        <CircleDashedIcon size={20} className='animate-spin' />
                     </>
                  ) : (
                     'Edit'
                  )}
               </Button>
            </div>
            <div>
               <h2 className='text-lg font-medium mb-4'>Details</h2>
               <div className='space-y-4'>
                  <div className='flex flex-col'>
                     <Label htmlFor='location'>Brand</Label>
                     <Input
                        id='location'
                        placeholder='e.g Apple'
                        {...register('brandInventoryName')}
                     />
                  </div>
                  <div className='flex flex-col'>
                     <Label htmlFor='description'>Description</Label>
                     <Textarea
                        id='description'
                        placeholder='e.g This is Apple brand.'
                        className='min-h-[100px]'
                        {...register('description')}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
