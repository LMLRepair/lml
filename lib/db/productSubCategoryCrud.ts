"use server";

import prisma from "@/lib/prisma";
import { ProductSubCategories } from "@prisma/client";
import { PartialBy } from "../type";

export const getProductSubCategories = async (
  productCategory?: number
): Promise<ProductSubCategories[]> => {
  try {
    return await prisma.productSubCategories.findMany({
      where: { product_category_id: productCategory },
      orderBy: { product_sub_category_name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const createProductSubCatgeory = async (
  productCategoryData: PartialBy<
    ProductSubCategories,
    "product_sub_category_id"
  >
) => {
  try {
    return await prisma.productSubCategories.create({
      data: productCategoryData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const updateProductSubCategory = async (
  productSubCategoryId: number,
  updatedData: PartialBy<
    ProductSubCategories,
    "product_sub_category_id" | "product_sub_category_image"
  >
) => {
  try {
    return await prisma.productSubCategories.update({
      where: { product_sub_category_id: productSubCategoryId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating productSubCategoryId:", error);
    throw new Error("Failed to update productSubCategoryId");
  }
};

export const deleteProductSubCategory = async (
  productSubCategoryId: number
) => {
  try {
    const productSubCategory = await prisma.productSubCategories.findUnique({
      where: {
        product_sub_category_id: productSubCategoryId,
      },
    });

    if (!productSubCategory) {
      return null;
    }

    await prisma.products.deleteMany({
      where: {
        product_sub_category_id: productSubCategoryId,
      },
    });

    await prisma.productSubCategories.delete({
      where: {
        product_sub_category_id: productSubCategoryId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
