'use server';

import prisma from '@/lib/prisma';

type UpdatedVariationInput = {
   variationName: string;
   variationRaw: number;
   variationShipping: number;
   variationTax: number;
   stock: number;
   sku?: string | null;
   location?: string; // This is the new location ID (optional)
   image: string | null;
};

type UpdatedVariationResponse = {
   status: string;
};

export const UpdateVariation = async (
   variationId: number,
   data: UpdatedVariationInput
): Promise<UpdatedVariationResponse> => {
   try {
      const existingVariation = await prisma.variation.findUnique({
         where: {
            variationId: variationId,
         },
      });

      if (!existingVariation) {
         throw new Error('Variation not found');
      }

      const valueVariationToUpdate = {
         name: data.variationName ? data.variationName : existingVariation.name,
         sku: data?.sku ? data.sku : existingVariation.sku,
         image: data.image ? data.image : existingVariation.image,
         raw: data.variationRaw ? data.variationRaw : existingVariation.raw,
         tax: data.variationTax ? data.variationTax : existingVariation.tax,
         shipping: data.variationShipping
            ? data.variationShipping
            : existingVariation.shipping,
      };

      await prisma.$transaction(async (tx) => {
         //Todo: Update the variation
         await tx.variation.update({
            where: {
               variationId: variationId,
            },
            data: valueVariationToUpdate,
         });

         if (data.location) {
            const existingVariationOnLocation =
               await tx.variationOnLocation.findFirst({
                  where: {
                     variationId: variationId,
                  },
               });

            if (!existingVariationOnLocation) {
               //Todo: Create a new VariationOnLocation record if it doesn't exist
               await tx.variationOnLocation.create({
                  data: {
                     variationId: variationId,
                     locationId: Number(data.location),
                     stock: Number(data.stock),
                  },
               });
            } else if (
               existingVariationOnLocation.locationId !== Number(data.location)
            ) {
               //Todo: If the location has changed, delete the existing record
               await tx.variationOnLocation.delete({
                  where: {
                     variationOnLocationId:
                        existingVariationOnLocation.variationOnLocationId,
                  },
               });

               //Todo: Create a new VariationOnLocation record with the new locationId and stock
               await tx.variationOnLocation.create({
                  data: {
                     variationId: variationId,
                     locationId: Number(data.location),
                     stock: Number(data.stock),
                  },
               });
            } else {
               //Todo: If the location has not changed, just update the stock
               await tx.variationOnLocation.update({
                  where: {
                     variationOnLocationId:
                        existingVariationOnLocation.variationOnLocationId,
                  },
                  data: {
                     stock: Number(data.stock),
                  },
               });
            }
         } else {
            //Todo: If location is not provided, update the stock using the existing value
            const existingVariationOnLocation =
               await tx.variationOnLocation.findFirst({
                  where: {
                     variationId: variationId,
                  },
               });

            if (existingVariationOnLocation) {
               await tx.variationOnLocation.updateMany({
                  where: {
                     variationId: variationId,
                  },
                  data: {
                     stock:
                        Number(data.stock) || existingVariationOnLocation.stock,
                  },
               });
            }
         }
      });

      return { status: 'success' };
   } catch (error) {
      console.log(error);
      return { status: 'error' };
   }
};
