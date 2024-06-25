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
import { ProductCategories } from "@prisma/client";
import AddProductCategory from "@/components/AddProductCategory";
import EditProductCategory from "@/components/EditProductCategory";
import DeleteProductCategory from "@/components/DeleteProductCategory";

interface ProductCategoryTableProps {
  productCategories: ProductCategories[];
}
function ProductCategoryTable({
  productCategories,
}: ProductCategoryTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredProductCategories = productCategories.filter(
    (productCategory) => {
      return (
        search.toLowerCase() === "" ||
        productCategory.product_category_name.toLowerCase().includes(search)
      );
    }
  );
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">Select Category</h1>
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
          <AddProductCategory />
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
          {filteredProductCategories.map((filteredProductCategory) => (
            <TableRow key={filteredProductCategory.product_category_id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/dashboard/productcategory/productsubcategory?productcategoryid=${filteredProductCategory.product_category_id}`}
                >
                  {filteredProductCategory.product_category_name}
                </Link>
              </TableCell>

              <TableCell>
                <img
                  src={filteredProductCategory.product_category_image}
                  alt={filteredProductCategory.product_category_name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </TableCell>
              <TableCell>
                {filteredProductCategory.product_category_desc}
              </TableCell>

              <TableCell>
                <EditProductCategory
                  productCategoryId={
                    filteredProductCategory.product_category_id
                  }
                  productCategoryName={
                    filteredProductCategory.product_category_name
                  }
                  productCategoryDescription={
                    filteredProductCategory.product_category_desc
                  }
                />
              </TableCell>
              <TableCell>
                <DeleteProductCategory
                  productCategoryId={
                    filteredProductCategory.product_category_id
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

export default ProductCategoryTable;
