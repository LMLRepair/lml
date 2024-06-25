'use server';

import prisma from '@/lib/prisma';
import { InventoryItem, Vendor } from '@prisma/client';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
   try {
      return await prisma.inventoryItem.findMany({
         include: {
            variations: true,
            itemsCategory: true,
            itemsSubCategory: true,
            vendor: true,
            location: true,
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
            variations: true,
            itemsCategory: true,
            itemsSubCategory: true,
            vendor: true,
            location: true,
         },
      });
   } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw new Error('Failed to fetch inventory item');
   }
};

type Variations = {
   name: string;
   price: string;
   sku: string;
   quantity: string;
   image?: string;
};

type CreateItemInput = {
   name: string;
   description: string;
   brand: string;
   image: string | null;
   variations: Variations[];
   vendor: string;
   category: string;
   subCategory?: string;
   location?: string;
};

type CreateItemResponse = {
   item: InventoryItem;
   status: string;
};

export const createInventoryItem = async (
   data: CreateItemInput
): Promise<CreateItemResponse> => {
   const {
      name,
      description,
      variations,
      brand,
      vendor,
      category,
      subCategory,
      location,
      image,
   } = data;

   try {
      const createdItem = await prisma.$transaction(async (prisma) => {
         // Create the vendor
         const vendorRecord = await prisma.vendor.create({
            data: { name: vendor },
         });

         // Create the inventory item
         const inventoryItem = await prisma.inventoryItem.create({
            data: {
               name,
               description,
               brand,
               image: image ? image : '',
               vendorId: vendorRecord.vendorId,
               itemsCategoryId: Number(category),
               itemsSubCategoryId: subCategory ? Number(subCategory) : null,
               locationId: location ? Number(location) : null,
            },
         });

         // Create the variations using Promise.all to ensure all variations are created before the transaction completes
         await Promise.all(
            variations.map(async (vr) => {
               return prisma.variation.create({
                  data: {
                     name: vr.name,
                     price: Number(vr.price),
                     sku: vr.sku,
                     quantity: Number(vr.quantity),
                     image: vr.image ? vr.image : '',
                     inventoryItemId: inventoryItem.inventoryItemId,
                  },
               });
            })
         );

         return inventoryItem;
      });

      return { item: createdItem, status: 'success' };
   } catch (error) {
      console.error('Error creating inventory item:', error);
      throw new Error('Failed to create inventory item');
   }
};

type UpdateItemInput = {
   name: string;
   description: string;
   brand: string;
   image: string | null;
   variations: Variations[];
   vendor: string;
   category: string;
   subCategory?: string;
   location?: string;
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
         include: {
            variations: true,
         },
      });

      if (!existingItem) {
         throw new Error('Item not found');
      }

      const valueToUpdate = {
         name: data.name ? data.name : existingItem.name,
         description: data.description
            ? data.description
            : existingItem.description,
         brand: data.brand ? data.brand : existingItem.brand,
         image: data.image ? data.image : existingItem.image,
         vendorId: data.vendor
            ? (await prisma.vendor.create({ data: { name: data.vendor } }))
                 .vendorId
            : existingItem.vendorId,
         itemsCategoryId: data.category
            ? Number(data.category)
            : existingItem.itemsCategoryId,
         itemsSubCategoryId: data.subCategory
            ? Number(data.subCategory)
            : existingItem.itemsSubCategoryId,
         locationId: data.location
            ? Number(data.location)
            : existingItem.locationId,
      };

      if (data.variations) {
         await prisma.variation.deleteMany({
            where: { inventoryItemId: itemId },
         });

         await Promise.all(
            data.variations.map(async (vr) => {
               return prisma.variation.create({
                  data: {
                     name: vr.name,
                     price: Number(vr.price),
                     sku: vr.sku,
                     quantity: Number(vr.quantity),
                     image: vr.image ? vr.image : '',
                     inventoryItemId: itemId,
                  },
               });
            })
         );
      }

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
