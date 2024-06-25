"use server";

import prisma from "@/lib/prisma";
import { ModelCategory } from "@prisma/client";
import { PartialBy } from "../type";

export const getModelCategory = async (
  modelId: number
): Promise<ModelCategory[]> => {
  try {
    return await prisma.modelCategory.findMany({
      where: { model_id: modelId },
      include: { Model: true },
      orderBy: { type_of_repair: "asc" },
    });
  } catch (error) {
    console.error("Error fetching model category:", error);
    throw new Error("Failed to fetch model category");
  }
};

export const createModelCategory = async (
  modelCategoryData: PartialBy<ModelCategory, "modelCategory_id">
) => {
  try {
    return await prisma.modelCategory.create({
      data: modelCategoryData,
    });
  } catch (error) {
    console.error("Error creating model category:", error);
    throw new Error("Failed to create model category");
  }
};

export const updateModelCategory = async (
  modelCategory: number,
  updatedData: PartialBy<ModelCategory, "modelCategory_id" | "model_id">
) => {
  try {
    return await prisma.modelCategory.update({
      where: { modelCategory_id: modelCategory },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteModelCategory = async (modelCategoryId: number) => {
  try {
    await prisma.modelCategory.delete({
      where: {
        modelCategory_id: modelCategoryId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
