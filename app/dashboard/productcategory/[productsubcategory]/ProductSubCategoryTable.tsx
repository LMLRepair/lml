"use client";

import { Search } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import CustomContainer from "@/components/CustomContainer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ProductSubCategories } from "@prisma/client";
import AddProductSubCategory from "@/components/AddProductSubCategory";
import EditProductSubCategory from "@/components/EditProductSubCategory";
import DeleteProductSubCategory from "@/components/DeleteProductSubCategory";

interface ProductSubCategoryTableProps {
  productSubCategories: ProductSubCategories[];
  productCategoryId: number;
}
function ProductSubCategoryTable({
  productSubCategories,
  productCategoryId,
}: ProductSubCategoryTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredProductSubCategories = productSubCategories.filter(
    (productSubCategory) => {
      return (
        search.toLowerCase() === "" ||
        productSubCategory.product_sub_category_name
          .toLowerCase()
          .includes(search)
      );
    }
  );
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">Select Sub category</h1>
      <Card className="mb-4">
        <div className="flex justify-between items-center gap-5 px-3 py-6">
          <div className="flex items-center border border-primary-foreground px-3 rounded-md ">
            <Search />
            <Input
              placeholder="Search categories"
              className="lg:w-96 border-none focus-visible:outline-none "
              onChange={handleInputChange}
            />
          </div>
          <AddProductSubCategory productCategoryId={productCategoryId} />
        </div>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72"> Name</TableHead>
            <TableHead> Image</TableHead>
            <TableHead className="w-80"> Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProductSubCategories.map((filteredProductSubCategory) => (
            <TableRow key={filteredProductSubCategory.product_sub_category_id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/dashboard/productcategory/productsubcategory/products?productsubcategoryid=${filteredProductSubCategory.product_sub_category_id}`}
                >
                  {filteredProductSubCategory.product_sub_category_name}
                </Link>
              </TableCell>

              <TableCell>
                <img
                  src={filteredProductSubCategory.product_sub_category_image}
                  alt={filteredProductSubCategory.product_sub_category_name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </TableCell>
              <TableCell>
                {filteredProductSubCategory.product_sub_category_desc}
              </TableCell>

              <TableCell>
                <EditProductSubCategory
                  productCategoryId={
                    filteredProductSubCategory.product_category_id
                  }
                  productSubCategoryId={
                    filteredProductSubCategory.product_sub_category_id
                  }
                  productSubCategoryName={
                    filteredProductSubCategory.product_sub_category_name
                  }
                  productSubCategoryDescription={
                    filteredProductSubCategory.product_sub_category_desc
                  }
                />
              </TableCell>
              <TableCell>
                <DeleteProductSubCategory
                  productSubCategoryId={
                    filteredProductSubCategory.product_sub_category_id
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomContainer>
  );
}

export default ProductSubCategoryTable;
