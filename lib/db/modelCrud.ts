"use server";

import prisma from "@/lib/prisma";
import { Model } from "@prisma/client";
import { PartialBy } from "../type";

export const getModel = async (seriesId: number): Promise<Model[]> => {
  try {
    return await prisma.model.findMany({
      where: { series_id: seriesId },
      orderBy: { model_name: "asc" },
      include: {
        Series: {
          select: {
            series_name: true,
            brand_id: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching model:", error);
    throw new Error("Failed to fetch model");
  }
};

export const createModel = async (modelData: PartialBy<Model, "model_id">) => {
  try {
    return await prisma.model.create({
      data: modelData,
    });
  } catch (error) {
    console.error("Error creating model:", error);
    throw new Error("Failed to create model");
  }
};

export const updateModel = async (
  modelId: number,
  updatedData: PartialBy<Model, "model_id" | "model_image">
) => {
  try {
    return await prisma.model.update({
      where: { model_id: modelId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating model:", error);
    throw new Error("Failed to update model");
  }
};

export const deleteModel = async (modelId: number) => {
  try {
    const model = await prisma.model.findUnique({
      where: {
        model_id: modelId,
      },
    });

    if (!model) {
      return null;
    }

    await prisma.modelCategory.deleteMany({
      where: {
        model_id: model.model_id,
      },
    });

    await prisma.model.delete({
      where: {
        model_id: modelId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
