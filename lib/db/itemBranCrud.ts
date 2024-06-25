'use server';

import prisma from '@/lib/prisma';
import { InventoryItemBrand } from '@prisma/client';

export const getInventoryBrands = async (): Promise<InventoryItemBrand[]> => {
   try {
      return await prisma.inventoryItemBrand.findMany({
         include: {
            items: true,
         },
         orderBy: { brandInventoryName: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory locations:', error);
      throw new Error('Failed to fetch inventory locations');
   }
};

export const getInventoryItemBrandById = async (
   brandId: number
): Promise<any> => {
   try {
      return await prisma.inventoryItemBrand.findUnique({
         where: {
            brandInventoryId: brandId,
         },
      });
   } catch (error) {
      console.error('Error fetching inventory locations:', error);
      throw new Error('Failed to fetch inventory locations');
   }
};

type CreateBrandResponse = {
   brand: InventoryItemBrand;
   status: string;
};

//Todo: Function to create a new location
export const createInventoryBrand = async (data: {
   brandInventoryName: string;
   description: string;
}): Promise<CreateBrandResponse> => {
   const { brandInventoryName, description } = data;

   try {
      //Todo: Create the location using Prisma
      const createdBrand = await prisma.inventoryItemBrand.create({
         data: {
            brandInventoryName,
            description,
         },
      });

      return { status: 'success', brand: createdBrand };
      //Todo: Return the created location
   } catch (error) {
      console.error('Error creating inventory location:');
      throw new Error('Failed to create inventory location');
   }
};

type UpdateBrandInput = {
   brandInventoryName: string;
   description: string;
};

type UpdateBrandResponse = {
   status: string;
};

export const updateInventoryBrand = async (
   brandId: number,
   data: UpdateBrandInput
): Promise<UpdateBrandResponse> => {
   try {
      const existingLocation = await prisma.inventoryItemBrand.findUnique({
         where: {
            brandInventoryId: brandId,
         },
      });

      if (!existingLocation) {
         throw new Error('Location not found');
      }

      const valueToUpdate = {
         brandInventoryName: data.brandInventoryName
            ? data.brandInventoryName
            : existingLocation.brandInventoryName,
         description: data.description
            ? data.description
            : existingLocation.description,
      };

      await prisma.inventoryItemBrand.update({
         where: {
            brandInventoryId: Number(brandId),
         },
         data: valueToUpdate,
      });

      return { status: 'success' };
   } catch (error) {
      console.log(error);
      return { status: 'error' };
   }
};
