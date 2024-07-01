"use server";

import prisma from "@/lib/prisma";
import moment from "moment";
interface VariationOnLocationType {
  variationOnLocationId: number;
  variationId: number;
  locationId: number;
  stock: number;
  date: string;
  variationName: string;
  locationName: string;
  stockStatus: string;
  movement: string;
}

export const getVariationOnLocation = async (): Promise<
  VariationOnLocationType[]
> => {
  try {
    const VariationOnLocation = await prisma.variationOnLocation.findMany({
      include: {
        location: {
          select: {
            name: true,
          },
        },
        variation: {
          select: {
            name: true,
          },
        },
      },
    });

    const currentDate = new Date();

    return VariationOnLocation.map((item) => {
      const daysDifference =
        (currentDate.getTime() - new Date(item.date).getTime()) /
        (1000 * 3600 * 24);
      const percentageDecrease =
        (((item.stock / 100) * daysDifference) / item.stock) * 100;

      let movement: string;
      if (percentageDecrease >= 20) {
        movement = "fast";
      } else if (percentageDecrease >= 10) {
        movement = "normal";
      } else {
        movement = "slow";
      }

      return {
        variationOnLocationId: item.variationOnLocationId,
        variationId: item.variationId,
        locationId: item.locationId,
        stock: item.stock,
        date: moment(item.date).format("MMM Do YYYY"),
        variationName: item.variation.name,
        locationName: item.location.name,
        stockStatus: item.stock < 4 ? "Low in stock" : "Normal",
        movement,
      };
    });
  } catch (error) {
    console.error("Error fetching VariationOnLocation:", error);
    throw new Error("Failed to fetch VariationOnLocation");
  }
};
