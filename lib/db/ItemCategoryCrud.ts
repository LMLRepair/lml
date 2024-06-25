'use server';

import prisma from '@/lib/prisma';
import { ItemsCategory, ItemsSubCategory } from '@prisma/client';

export const getCategoryWithSubCategory = async (): Promise<
   ItemsCategory[]
> => {
   try {
      return await prisma.itemsCategory.findMany({
         orderBy: { name: 'asc' },
         include: {
            subCategories: true,
            InventoryItem: true,
         },
      });
   } catch (error) {
      console.error('Error fetching inventory categories:', error);
      throw new Error('Failed to fetch inventory categories');
   }
};
export const getCategory = async (): Promise<ItemsCategory[]> => {
   try {
      return await prisma.itemsCategory.findMany({
         orderBy: { name: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory categories:', error);
      throw new Error('Failed to fetch inventory categories');
   }
};

export const getSubCategory = async (): Promise<ItemsSubCategory[]> => {
   try {
      return await prisma.itemsSubCategory.findMany({
         orderBy: { name: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory categories:', error);
      throw new Error('Failed to fetch inventory categories');
   }
};

type CreateCategoryResponse = {
   category: ItemsCategory;
   status: string;
};

type CreateCategoryInput = {
   name: string;
   subCategories?: { name: string }[];
   imageUrl?: string | null;
   newSubCategories?: { name: string }[];
};

export const createCategory = async (
   data: CreateCategoryInput
): Promise<CreateCategoryResponse> => {
   const { name, subCategories, imageUrl } = data;

   try {
      const createdCategory = await prisma.$transaction(async (prisma) => {
         //Todo: Create the main category
         const category = await prisma.itemsCategory.create({
            data: {
               name,
               image: imageUrl ? imageUrl : '',
            },
         });

         //Todo: If there are subcategories, create them
         if (subCategories && subCategories.length > 0) {
            const subCategoryPromises = subCategories.map((subCategory) => {
               return prisma.itemsSubCategory.create({
                  data: {
                     name: subCategory.name,
                     categoryId: category?.itemsCategoryId,
                  },
               });
            });
            await Promise.all(subCategoryPromises);
         }

         return category;
      });

      return {
         category: createdCategory,
         status: 'success',
      };
   } catch (error) {
      console.error('Error creating inventory category:', error);
      throw new Error('Failed to create inventory category');
   }
};

type UpdateCategoryInput = {
   name: string;
   subCategories?: { itemsSubCategoryId: number; name: string }[];
   newSubCategories?: { name: string }[];
   removedSubCategoryIds?: number[];
};

type UpdateCategoryResponse = {
   status: string;
};

export const updateCategory = async (
   categoryId: number,
   data: UpdateCategoryInput
): Promise<UpdateCategoryResponse> => {
   try {
      console.log(data);
      const existingCategory = await prisma.itemsCategory.findUnique({
         where: {
            itemsCategoryId: Number(categoryId),
         },
         include: {
            subCategories: true,
         },
      });

      if (!existingCategory) {
         return { status: 'error' };
      }

      const valueToUpdate = {
         name: data.name ? data.name : existingCategory.name,
      };

      await prisma.itemsCategory.update({
         where: {
            itemsCategoryId: Number(categoryId),
         },
         data: valueToUpdate,
      });

      if (data.subCategories) {
         const subCategoryPromises = data.subCategories.map((subCategory) => {
            if (subCategory.itemsSubCategoryId) {
               return prisma.itemsSubCategory.update({
                  where: {
                     itemsSubCategoryId: subCategory.itemsSubCategoryId,
                  },
                  data: {
                     name: subCategory.name,
                  },
               });
            }
         });

         await Promise.all(subCategoryPromises);
      }

      if (data.newSubCategories && data.newSubCategories.length > 0) {
         const newSubCategoriesPromises = data.newSubCategories.map(
            (newSubCategory) => {
               if (newSubCategory.name) {
                  return prisma.itemsSubCategory.create({
                     data: {
                        name: newSubCategory.name,
                        categoryId: Number(categoryId),
                     },
                  });
               }
            }
         );

         await Promise.all(newSubCategoriesPromises);
      }

      if (data.removedSubCategoryIds && data.removedSubCategoryIds.length > 0) {
         const removeSubCategoryPromises = data.removedSubCategoryIds.map(
            (id) => {
               return prisma.itemsSubCategory.delete({
                  where: { itemsSubCategoryId: id },
               });
            }
         );

         await Promise.all(removeSubCategoryPromises);
      }

      return { status: 'success' };
   } catch (error) {
      return { status: 'error' };
   }
};
