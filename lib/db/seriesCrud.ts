"use server";

import prisma from "@/lib/prisma";
import { Series } from "@prisma/client";
import { PartialBy } from "../type";

export const getSeries = async (brandId: number): Promise<Series[]> => {
  try {
    return await prisma.series.findMany({
      where: { brand_id: brandId },
      orderBy: { series_name: "asc" },
      include: {
        Brand: {
          select: {
            brand_name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching series:", error);
    throw new Error("Failed to fetch series");
  }
};

export const createSeries = async (
  seriesData: PartialBy<Series, "series_id">
) => {
  try {
    return await prisma.series.create({
      data: seriesData,
    });
  } catch (error) {
    console.error("Error creating series:", error);
    throw new Error("Failed to create series");
  }
};

export const updateSeries = async (
  seriesId: number,
  updatedData: PartialBy<Series, "series_id" | "series_image">
) => {
  try {
    return await prisma.series.update({
      where: { series_id: seriesId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating series:", error);
    throw new Error("Failed to update series");
  }
};

export const deleteSeries = async (seriesId: number) => {
  try {
    const series = await prisma.series.findUnique({
      where: {
        series_id: seriesId,
      },
      include: {
        Model: {
          include: {
            ModelCategory: true,
          },
        },
      },
    });

    if (!series) {
      return null;
    }

    await prisma.$transaction([
      ...series.Model.flatMap((model) =>
        model.ModelCategory.map((modelCategory) =>
          prisma.modelCategory.delete({
            where: {
              modelCategory_id: modelCategory.modelCategory_id,
            },
          })
        )
      ),
    ]);

    await prisma.model.deleteMany({
      where: {
        series_id: seriesId,
      },
    });

    await prisma.series.delete({
      where: {
        series_id: seriesId,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
