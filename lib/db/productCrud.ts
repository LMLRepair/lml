"use server";

import prisma from "@/lib/prisma";
import { Products } from "@prisma/client";
import { PartialBy } from "../type";

export const getProducts = async (
  productCategoryId: number
): Promise<Products[]> => {
  try {
    const products = await prisma.products.findMany({
      where: { product_sub_category_id: productCategoryId },
      include: {
        ProductSubCategories: {
          select: {
            product_sub_category_name: true,
          },
        },
      },
      orderBy: { product_name: "asc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const createProduct = async (
  productData: PartialBy<Products, "product_id">
) => {
  try {
    return await prisma.products.create({
      data: productData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const updateProduct = async (
  productId: number,
  updatedData: PartialBy<Products, "product_id" | "product_image">
) => {
  try {
    return await prisma.products.update({
      where: { product_id: productId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    await prisma.products.delete({
      where: {
        product_id: productId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
