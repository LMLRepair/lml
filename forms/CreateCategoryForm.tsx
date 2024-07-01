'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createCategory } from '@/lib/db/ItemCategoryCrud';
import { useModal } from '@/providers/model-provider';
import { PutBlobResult } from '@vercel/blob';
import { CircleDashedIcon, PlusIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

type Inputs = {
   name: string;
   subCategories: { name: string }[];
};

function CreateCategoryForm() {
   const router = useRouter();
   const { toast } = useToast();
   const { setClose } = useModal();
   const [isPending, startTransition] = useTransition();
   const [image, setImage] = useState<File | null>(null);
   //Todo: Add sub category
   const {
      register,
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>();

   //Todo: Add sub category
   const { fields, append } = useFieldArray({
      control,
      name: 'subCategories',
   });

   //Todo: Add sub category
   const handleAddSubCategory = () => {
      append({ name: '' });
   };

   const getImageFile = (file: File) => {
      setImage(file);
   };

   //Todo: Handle submitting the form
   const onSubmit: SubmitHandler<Inputs> = async (data) => {
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

            const res = await createCategory({
               name: data.name,
               subCategories: data.subCategories,
               imageUrl,
            });
            if (res.status === 'success') {
               toast({
                  title: 'Created: Category',
                  description: `${res.category.name} has been created.`,
               });
               router.refresh();
               setClose();
            }
         } catch (error) {
            toast({
               title: 'Error',
               description: 'Failed to create category.',
            });
         }
      });
   };

   return (
      <div className='flex flex-col'>
         <div className='sticky top-0 z-50 flex items-center justify-between p-6 bg-white'>
            <Button variant={'secondary'} onClick={() => setClose()}>
               <X size={20} />
            </Button>

            <h1 className='text-xl font-medium'>Create Category</h1>
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
            <form
               className='space-y-4 w-full max-w-lg'
               onSubmit={handleSubmit(onSubmit)}
            >
               <div>
                  <Label className='block mb-1'>Category</Label>
                  <Input
                     placeholder='e.g Parts'
                     className='w-full'
                     {...register('name', { required: true })}
                  />
                  {errors.name && (
                     <span className='text-red-500'>
                        This field is required
                     </span>
                  )}
               </div>
               <div className='flex flex-col space-y-4 mb-4'>
                  <label htmlFor='sub-categories' className='font-semibold'>
                     Sub Categories
                  </label>
                  {fields.map((field, index) => (
                     <Input
                        key={field.id}
                        placeholder='e.g Screen, Battery, etc'
                        {...register(`subCategories.${index}.name`)}
                     />
                  ))}
                  <Button
                     type='button'
                     variant='default'
                     className='flex items-center space-x-1 '
                     onClick={handleAddSubCategory}
                  >
                     <PlusIcon size={20} />
                     <span>Add</span>
                  </Button>
               </div>
               <ImageField getImageFile={getImageFile} />
            </form>
         </div>
      </div>
   );
}

type ImageFieldProps = {
   getImageFile: (file: File) => void;
};

export function ImageField({ getImageFile }: ImageFieldProps) {
   const handleDragOver = (e: any) => {
      e.preventDefault();
   };
   const handleDrop = (e: any) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
   };

   const handleImageChange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
         getImageFile(file);
      }
   };
   return (
      <div
         className='border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2'
         onDragOver={handleDragOver}
         onDrop={handleDrop}
      >
         <ImageIcon className='h-6 w-6 text-gray-600' />
         <span className='text-gray-600'>
            Drag and drop images here,{' '}
            <Label
               htmlFor='file-upload'
               className='text-blue-600 underline cursor-pointer'
            >
               upload
               <Input
                  id='file-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
               />
            </Label>
         </span>
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
export default CreateCategoryForm;
