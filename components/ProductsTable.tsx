"use client";

import { Search } from "lucide-react";
import CustomContainer from "./CustomContainer";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import { Products } from "@prisma/client";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

interface ProductsTableProps {
  products: Products[];
  productSubCategoryId: number;
}
function ProductsTable({ products, productSubCategoryId }: ProductsTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredProducts = products.filter((product) => {
    return (
      search.toLowerCase() === "" ||
      product.product_name.toLowerCase().includes(search)
    );
  });
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">Products</h1>
      <Card className="mb-4">
        <div className="flex justify-between items-center gap-5 px-3 py-6">
          <div className="flex items-center border border-primary-foreground px-3 rounded-md ">
            <Search />
            <Input
              placeholder="Search products"
              className="lg:w-96 border-none focus-visible:outline-none "
              onChange={handleInputChange}
            />
          </div>
          <AddProduct productSubCategoryId={productSubCategoryId} />
        </div>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72"> Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="w-80">Description</TableHead>
            <TableHead>Raw</TableHead>
            <TableHead>Tax %</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Markup %</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.product_id}>
              <TableCell>{product.product_name}</TableCell>

              <TableCell>
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{product.product_desc}</TableCell>
              <TableCell>{product.raw}</TableCell>
              <TableCell>{product.tax}%</TableCell>
              <TableCell>$ {product.shipping}</TableCell>
              <TableCell>
                $
                {Math.ceil(
                  product.raw +
                    product.raw * (product.tax / 100) +
                    product.shipping
                )}
              </TableCell>
              <TableCell>{product.markup}%</TableCell>
              <TableCell>
                $
                {Math.round(
                  product.raw +
                    product.raw * (product.tax / 100) +
                    product.shipping +
                    (product.raw +
                      product.raw * (product.tax / 100) +
                      product.shipping) *
                      (product.markup / 100)
                )}
              </TableCell>
              <TableCell>
                <EditProduct
                  product_sub_category_id={product.product_sub_category_id.toString()}
                  product_id={product.product_id}
                  product_name={product.product_name}
                  product_desc={product.product_desc}
                  tax={product.tax.toString()}
                  shipping={product.shipping.toString()}
                  raw={product.raw.toString()}
                  markup={product.markup.toString()}
                />
              </TableCell>
              <TableCell>
                <DeleteProduct productId={product.product_id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomContainer>
  );
}

export default ProductsTable;
