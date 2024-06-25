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
import Link from "next/link";
import { useState } from "react";
import { Brand } from "@prisma/client";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import { Button } from "./ui/button";
import DeleteBrand from "./DeleteBrand";

interface BrandsTableProps {
  brands: Brand[];
}
function BrandsTable({ brands }: BrandsTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredBrands = brands.filter((brand) => {
    return (
      search.toLowerCase() === "" ||
      brand.brand_name.toLowerCase().includes(search)
    );
  });
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">Brands</h1>
      <Card className="mb-4">
        <div className="flex justify-between items-center gap-5 px-3 py-6">
          <div className="flex items-center border border-primary-foreground px-3 rounded-md ">
            <Search />
            <Input
              placeholder="Search brands"
              className="lg:w-96 border-none focus-visible:outline-none "
              onChange={handleInputChange}
            />
          </div>
          <AddBrand />
        </div>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Brand Name</TableHead>
            <TableHead>Brand Image</TableHead>
            <TableHead className="w-80">Brand Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBrands.map((brand) => (
            <TableRow key={brand.brand_id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/dashboard/brands/${brand?.brand_id}/series`}
                >
                  {brand.brand_name}
                </Link>
              </TableCell>

              <TableCell>
                <img
                  src={brand.brand_image}
                  alt={brand.brand_name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{brand.brand_desc}</TableCell>
              <TableCell>
                <EditBrand
                  brandId={brand.brand_id}
                  brandName={brand.brand_name}
                  brandDescription={brand.brand_desc}
                />
              </TableCell>

              <TableCell>
                <DeleteBrand brandId={brand.brand_id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomContainer>
  );
}

export default BrandsTable;
