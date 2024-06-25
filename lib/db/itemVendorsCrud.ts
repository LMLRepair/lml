'use server';

import prisma from '@/lib/prisma';
import { Vendor } from '@prisma/client';

export const getVendors = async (): Promise<Vendor[]> => {
   try {
      return await prisma.vendor.findMany({
         include: {
            InventoryItem: true,
         },
         orderBy: { name: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory vendors:', error);
      throw new Error('Failed to fetch inventory vendors');
   }
};

export const getVendor = async (vendorId: number): Promise<any> => {
   try {
      return await prisma.vendor.findUnique({
         where: {
            vendorId: vendorId,
         },
      });
   } catch (error) {
      console.error('Error fetching inventory vendor:', error);
      throw new Error('Failed to fetch inventory vendor');
   }
};

type CreateVendorResponse = {
   vendor: Vendor;
   status: string;
};

//Todo: Function to create a new location
export const createVendor = async (data: {
   name: string;
}): Promise<CreateVendorResponse> => {
   const { name } = data;

   try {
      //Todo: Create the location using Prisma
      const createdVendor = await prisma.vendor.create({
         data: {
            name,
         },
      });

      return { status: 'success', vendor: createdVendor };
      //Todo: Return the created location
   } catch (error) {
      console.error('Error creating inventory vendor:');
      throw new Error('Failed to create inventory vendor');
   }
};

type UpdateVendorInputs = {
   name: string;
};

type UpdateVendorResponse = {
   status: string;
};

export const updateVendor = async (
   vendorId: number,
   data: UpdateVendorInputs
): Promise<UpdateVendorResponse> => {
   try {
      const existingVendor = await prisma.vendor.findUnique({
         where: {
            vendorId: vendorId,
         },
      });

      if (!existingVendor) {
         throw new Error('Vendor not found');
      }

      const valueToUpdate = {
         name: data.name ? data.name : existingVendor.name,
         // description: data.description
         //    ? data.description
         //    : existingVendor.description,
      };

      await prisma.vendor.update({
         where: {
            vendorId: Number(vendorId),
         },
         data: valueToUpdate,
      });

      return { status: 'success' };
   } catch (error) {
      console.log(error);
      return { status: 'error' };
   }
};
