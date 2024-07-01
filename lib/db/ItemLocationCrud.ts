'use server';

import prisma from '@/lib/prisma';
import { Location } from '@prisma/client';

export const getLocations = async (): Promise<Location[]> => {
   try {
      return await prisma.location.findMany({
         orderBy: { name: 'asc' },
      });
   } catch (error) {
      console.error('Error fetching inventory locations:', error);
      throw new Error('Failed to fetch inventory locations');
   }
};

type CreateLocationResponse = {
   location: Location;
   status: string;
};

//Todo: Function to create a new location
export const createLocation = async (data: {
   name: string;
   description: string;
}): Promise<CreateLocationResponse> => {
   const { name, description } = data;

   try {
      //Todo: Create the location using Prisma
      const createdLocation = await prisma.location.create({
         data: {
            name,
            description,
         },
      });

      return { status: 'success', location: createdLocation };
      //Todo: Return the created location
   } catch (error) {
      console.error('Error creating inventory location:');
      throw new Error('Failed to create inventory location');
   }
};

type UpdateLocationInput = {
   name: string;
   description: string;
};

type UpdateLocationResponse = {
   status: string;
};

export const updateLocation = async (
   locationId: number,
   data: UpdateLocationInput
): Promise<UpdateLocationResponse> => {
   try {
      const existingLocation = await prisma.location.findUnique({
         where: {
            locationId: locationId,
         },
      });

      if (!existingLocation) {
         throw new Error('Location not found');
      }

      const valueToUpdate = {
         name: data.name ? data.name : existingLocation.name,
         description: data.description
            ? data.description
            : existingLocation.description,
      };

      await prisma.location.update({
         where: {
            locationId: Number(locationId),
         },
         data: valueToUpdate,
      });

      return { status: 'success' };
   } catch (error) {
      console.log(error);
      return { status: 'error' };
   }
};

export type DeleteLocationCrud = {
   status: string;
   message: string;
};

export const deleteLocationFn = async (
   locationId: number
): Promise<DeleteLocationCrud> => {
   try {
      const existingLocation = await prisma.location.findUnique({
         where: {
            locationId: locationId,
         },
      });

      if (!existingLocation) {
         throw new Error('Location Not found');
      }

      await prisma.location.delete({
         where: {
            locationId: locationId,
         },
      });

      return { status: 'success', message: 'Location Successfully Deleted' };
   } catch (error) {
      throw new Error('Failed to Delete Location');
   }
};
