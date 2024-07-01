'use server';

import prisma from '@/lib/prisma';
import { InventoryItem } from '@prisma/client';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
   try {
      return await prisma.inventoryItem.findMany({
         include: {
            variations: {
               include: {
                  locations: {
                     include: {
                        location: true,
                     },
                  }, // Include variationOnLocation data
               },
            },

            itemsCategory: true,
            itemsSubCategory: true,
            vendor: true,
            brand: true,
         },
         orderBy: { inventoryItemId: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw new Error('Failed to fetch inventory items');
   }
};

export const getInventoryItemById = async (itemId: number): Promise<any> => {
   try {
      return await prisma.inventoryItem.findUnique({
         where: { inventoryItemId: itemId },
         include: {
            variations: {
               include: {
                  locations: {
                     include: {
                        location: true,
                     },
                  }, // Include variationOnLocation data
               },
            },
            itemsCategory: true,
            itemsSubCategory: true,
            vendor: true,
         },
      });
   } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw new Error('Failed to fetch inventory item');
   }
};

type LocationInput = {
   locationId: string;
   stock: number;
};

type VariationsInput = {
   name: string;
   variationTax: string;
   variationShipping: string;
   variationRaw: string;
   sku?: string | null | undefined;
   image?: string | null | undefined;
   locations: LocationInput[];
};

type CreateItemInput = {
   name: string;
   description: string;
   brandId: string;
   vendorId: string;
   categoryId: string;
   subCategoryId?: string;
   image: string | null;
   variations: VariationsInput[];
};

type CreateItemResponse = {
   status: string;
};

export const createInventoryItem = async (
   data: CreateItemInput
): Promise<CreateItemResponse> => {
   const {
      name,
      description,
      variations,
      brandId,
      vendorId,
      categoryId,
      subCategoryId,
      image,
   } = data;

   console.log(data);

   try {
      await prisma.$transaction(
         async (tx) => {
            // Create the inventory item
            const createdItem = await tx.inventoryItem.create({
               data: {
                  name,
                  description,
                  brandId: parseInt(brandId),
                  vendorId: parseInt(vendorId),
                  itemsCategoryId: parseInt(categoryId),
                  itemsSubCategoryId: subCategoryId
                     ? parseInt(subCategoryId)
                     : undefined,
                  image: image ?? '',
               },
            });

            // Create variations and link their corresponding locations
            for (const variation of variations) {
               const createdVariation = await tx.variation.create({
                  data: {
                     name: variation.name,
                     raw: parseFloat(variation.variationRaw),
                     shipping: parseFloat(variation.variationShipping),
                     tax: parseFloat(variation.variationTax),
                     sku: variation.sku ?? '',
                     image: variation.image ?? '',
                     inventoryItemId: createdItem.inventoryItemId,
                  },
               });

               // Link locations for the current variation
               await Promise.all(
                  variation.locations.map((location) => {
                     return tx.variationOnLocation.create({
                        data: {
                           stock: location.stock,
                           variationId: createdVariation.variationId,
                           locationId: Number(location.locationId),
                        },
                     });
                  })
               );
            }
         },
         {
            maxWait: 8000, //? default: 2000
            timeout: 15000, //? default: 5000
         }
      );

      return { status: 'success' };
   } catch (error) {
      console.error('Error creating inventory item:', error);
      throw new Error('Failed to create inventory item');
   }
};

type UpdateItemInput = {
   name?: string;
   description?: string;
   brandId?: string;
   vendorId?: string;
   categoryId?: string;
   subCategoryId?: string;
   image?: string | null;
};

type UpdateItemResponse = {
   status: string;
};

export const updateInventoryItem = async (
   itemId: number,
   data: UpdateItemInput
): Promise<UpdateItemResponse> => {
   try {
      const existingItem = await prisma.inventoryItem.findUnique({
         where: { inventoryItemId: itemId },
      });

      if (!existingItem) {
         throw new Error('Item not found');
      }

      const valueToUpdate = {
         name: data.name ? data.name : existingItem.name,
         description: data.description
            ? data.description
            : existingItem.description,
         brandId: data.brandId ? Number(data.brandId) : existingItem.brandId,
         image: data.image ? data.image : existingItem.image,
         vendorId: data.vendorId
            ? Number(data.vendorId)
            : existingItem.vendorId,
         itemsCategoryId: data.categoryId
            ? Number(data.categoryId)
            : existingItem.itemsCategoryId,
         itemsSubCategoryId: data.subCategoryId
            ? Number(data.subCategoryId)
            : existingItem.itemsSubCategoryId,
      };

      await prisma.inventoryItem.update({
         where: { inventoryItemId: Number(itemId) },
         data: valueToUpdate,
      });

      return { status: 'success' };
   } catch (error) {
      console.error('Error updating inventory item:', error);
      throw new Error('Failed to update inventory item');
   }
};
