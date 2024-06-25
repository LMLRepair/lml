"use server";

import prisma from "@/lib/prisma";
import { Brand } from "@prisma/client";
import { PartialBy } from "../type";

export const getBrands = async (): Promise<Brand[]> => {
  try {
    return await prisma.brand.findMany({
      orderBy: { brand_name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
};

export const createBrand = async (brandData: PartialBy<Brand, "brand_id">) => {
  try {
    return await prisma.brand.create({
      data: brandData,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    throw new Error("Failed to create brand");
  }
};

export const updateBrand = async (
  brandId: number,
  updatedData: PartialBy<Brand, "brand_id" | "brand_image">
) => {
  try {
    return await prisma.brand.update({
      where: { brand_id: brandId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    throw new Error("Failed to update brand");
  }
};

export const deleteBrand = async (brandId: number) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        brand_id: brandId,
      },
      include: {
        Series: {
          include: {
            Model: {
              include: {
                ModelCategory: true,
              },
            },
          },
        },
      },
    });

    if (!brand) {
      return null;
    }

    // Use transaction for batch operations
    await prisma.$transaction([
      // Batch delete all ModelCategory entries
      ...brand.Series.flatMap((series) =>
        series.Model.flatMap((model) =>
          model.ModelCategory.map((modelCategory) =>
            prisma.modelCategory.delete({
              where: {
                modelCategory_id: modelCategory.modelCategory_id,
              },
            })
          )
        )
      ),

      // Delete all models associated with each series
      ...brand.Series.flatMap((series) =>
        prisma.model.deleteMany({
          where: {
            series_id: series.series_id,
          },
        })
      ),
    ]);

    await prisma.series.deleteMany({
      where: {
        brand_id: brandId,
      },
    });

    await prisma.brand.delete({
      where: {
        brand_id: brandId,
      },
    });

    return true; // Or some indication of success
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
