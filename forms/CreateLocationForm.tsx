'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createLocation } from '@/lib/db/ItemLocationCrud';
import { useModal } from '@/providers/model-provider';
import { CircleDashedIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
   name: string;
   description: string;
};

function CreateNewLocationForm() {
   const { setClose } = useModal();
   const router = useRouter();
   const { toast } = useToast();
   const [isPending, startTransition] = useTransition();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>();

   const onSubmit: SubmitHandler<Inputs> = (data) => {
      startTransition(async () => {
         try {
            const res = await createLocation(data);
            if (res.status === 'success') {
               toast({
                  title: 'Created: Location ',
                  description: `${res.location.name} has been created.`,
               });

               router.refresh();
               setClose();
            }
         } catch (error) {
            console.log(error);
            toast({
               title: 'Error',
               description: 'Failed to create location.',
            });
         }
      });
   };

   return (
      <div className='flex flex-col'>
         <div className='flex items-center justify-between p-6 bg-white '>
            <Button variant={'secondary'} onClick={() => setClose()}>
               <X size={20} />
            </Button>

            <h1 className='text-xl font-medium'>Create Location</h1>

            <Button type='submit' onClick={handleSubmit(onSubmit)}>
               {isPending ? (
                  <>
                     <CircleDashedIcon size={20} className='animate-spin' />
                  </>
               ) : (
                  'Save'
               )}
            </Button>
         </div>
         <div className='flex flex-col items-center p-6 space-y-4'>
            <h1 className='font-bold text-lg'>Details</h1>
            <form className='space-y-4 w-full max-w-lg'>
               <div>
                  <Label className='block mb-1'>Location</Label>
                  <Input
                     placeholder='e.g seattle Warehouse A'
                     className='w-full'
                     {...register('name', { required: true })}
                  />
               </div>
               <div>
                  <Label className='block mb-1'>Description</Label>
                  <Input
                     placeholder='e.g Main warehouse for storing inventory items.'
                     className='w-full'
                     {...register('description', { required: true })}
                  />
               </div>
               {errors.name && (
                  <p className='text-red-500'>Location name is required.</p>
               )}
               {errors.description && (
                  <p className='text-red-500'>Description is required.</p>
               )}
            </form>
         </div>
      </div>
   );
}

export default CreateNewLocationForm;
