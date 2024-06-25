"use server";

import prisma from "@/lib/prisma";
import { ProductCategories } from "@prisma/client";
import { PartialBy } from "../type";

export const getProductCategories = async (): Promise<ProductCategories[]> => {
  try {
    return await prisma.productCategories.findMany({
      orderBy: { product_category_name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const createProductCatgeory = async (
  productCategoryData: PartialBy<ProductCategories, "product_category_id">
) => {
  try {
    return await prisma.productCategories.create({
      data: productCategoryData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const updateProductCategory = async (
  productCategoryId: number,
  updatedData: PartialBy<
    ProductCategories,
    "product_category_id" | "product_category_image"
  >
) => {
  try {
    return await prisma.productCategories.update({
      where: { product_category_id: productCategoryId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating productCategoryId:", error);
    throw new Error("Failed to update productCategoryId");
  }
};

export const deleteProductCategory = async (productCategoryId: number) => {
  try {
    const productCategory = await prisma.productCategories.findUnique({
      where: {
        product_category_id: productCategoryId,
      },
      include: {
        ProductSubCategories: {
          include: {
            Products: true,
          },
        },
      },
    });

    if (!productCategory) {
      return null;
    }

    await prisma.$transaction([
      ...productCategory.ProductSubCategories.flatMap((productSubCategory) =>
        productSubCategory.Products.map((product) =>
          prisma.products.delete({
            where: {
              product_id: product.product_id,
            },
          })
        )
      ),
    ]);

    await prisma.productSubCategories.deleteMany({
      where: {
        product_sub_category_id: productCategoryId,
      },
    });

    await prisma.productCategories.delete({
      where: {
        product_category_id: productCategoryId,
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
