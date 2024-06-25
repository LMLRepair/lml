'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateCategory } from '@/lib/db/ItemCategoryCrud';
import { useModal } from '@/providers/model-provider';
import { ItemsCategory, ItemsSubCategory } from '@prisma/client';
import { CircleDashedIcon, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../components/ui/use-toast';

type EditCategoriesProps = {
   categories: ItemsCategory[];
   itemSubCategories: ItemsSubCategory[];
   categoryId: number;
};

type SubCategoryState = {
   name: string;
   isNew: boolean;
   id?: number;
};

export default function EditCategoryForm({
   categories,
   categoryId,
   itemSubCategories,
}: EditCategoriesProps) {
   const router = useRouter();
   const { setClose } = useModal();
   const { register, handleSubmit } = useForm();
   const [subCategories, setSubCategories] = useState<SubCategoryState[]>(
      itemSubCategories
         .filter((subCategory) => subCategory.categoryId === Number(categoryId))
         .map((subCategory) => ({
            name: subCategory.name,
            isNew: false,
            id: subCategory.itemsSubCategoryId,
         }))
   );
   const [removedSubCategoryIds, setRemovedSubCategoryIds] = useState<number[]>(
      []
   );
   const [isPending, startTransition] = useTransition();
   const { toast } = useToast();

   const categorySelected = categories.find(
      (category) => category.itemsCategoryId === Number(categoryId)
   );

   const handleAddSubCategory = () => {
      setSubCategories([...subCategories, { name: '', isNew: true }]);
   };

   const handleSubCategoryChange = (index: number, value: string) => {
      const updatedSubCategories = [...subCategories];
      updatedSubCategories[index] = {
         ...updatedSubCategories[index],
         name: value,
      };
      setSubCategories(updatedSubCategories);
   };

   const handleRemoveSubCategory = (index: number) => {
      const updatedSubCategories = [...subCategories];
      const removedSubCategory = updatedSubCategories.splice(index, 1)[0];
      if (!removedSubCategory.isNew && removedSubCategory.id) {
         setRemovedSubCategoryIds([
            ...removedSubCategoryIds,
            removedSubCategory.id,
         ]);
      }
      setSubCategories(updatedSubCategories);
   };

   const onSubmit = (data: any) => {
      startTransition(async () => {
         try {
            const existingSubCategories = subCategories.filter(
               (subCategory) => !subCategory.isNew
            );
            const newSubCategories = subCategories.filter(
               (subCategory) => subCategory.isNew
            );

            const res = await updateCategory(categoryId, {
               name: data.category,
               subCategories: existingSubCategories.map(
                  (subCategory, index) => ({
                     itemsSubCategoryId: subCategory.id!,
                     name: subCategory.name,
                  })
               ),
               newSubCategories: newSubCategories.map((subCategory) => ({
                  name: subCategory.name,
               })),
               removedSubCategoryIds: removedSubCategoryIds,
            });
            if (res.status === 'success') {
               toast({
                  title: 'Category updated successfully',
                  description: 'The category has been updated successfully',
               });
               router.refresh();
               setClose();
            }
         } catch (error) {
            toast({
               title: 'An error occurred',
               description: 'An error occurred while updating the category',
            });
         }
      });
   };

   return (
      <div className='flex items-center justify-center h-screen'>
         <div className='m-auto p-8 rounded-lg w-1/2'>
            <div className='flex justify-between items-center mb-8'>
               <Button variant={'ghost'} onClick={() => setClose()}>
                  <X className='h-6 w-6 text-gray-500' />
               </Button>

               <h1 className='text-xl font-semibold'>Edit Category</h1>
               <Button onClick={handleSubmit(onSubmit)} className=' py-2 px-4 '>
                  {isPending ? (
                     <CircleDashedIcon size={20} className='animate-spin' />
                  ) : (
                     'Edit'
                  )}
               </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className='mb-4'>
                  <div className='mb-2'>
                     <Label
                        htmlFor='category'
                        className='block text-gray-700 text-sm font-bold mb-2'
                     >
                        Category
                     </Label>
                     <Input
                        id='category'
                        defaultValue={categorySelected?.name || ''}
                        {...register('category')}
                        placeholder='e.g Parts'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                     />
                  </div>
                  <div className='mb-6'>
                     <Label
                        htmlFor='sub-categories'
                        className='block text-gray-700 text-sm font-bold mb-2'
                     >
                        Sub Categories
                     </Label>
                     {subCategories.map((subCategory, index) => (
                        <div
                           key={index}
                           className='mb-2 flex items-center gap-8'
                        >
                           <Input
                              id={`sub-category-${index}`}
                              value={subCategory.name}
                              onChange={(e) =>
                                 handleSubCategoryChange(index, e.target.value)
                              }
                              placeholder='e.g Engine'
                              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                           />
                           <Trash2
                              className='text-red-500 cursor-pointer'
                              onClick={() => handleRemoveSubCategory(index)}
                           />
                        </div>
                     ))}
                  </div>
                  <Button type='button' onClick={handleAddSubCategory}>
                     Add
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
