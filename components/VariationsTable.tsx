import React from "react";
import useFormStore from "@/app/store";
import EditVariation from "./EditVariation";
import ManageVariation from "./ManageVariation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const VariationTable = () => {
  const { variations, deleteVariation } = useFormStore();

  const handleDelete = (variationId: string) => {
    deleteVariation(variationId);
  };

  return (
    <Table className="border-collapse border border-gray-300">
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variations.map((variation) => (
          <TableRow key={variation.id}>
            <TableCell>
              {variation.image ? (
                <div className="flex items-center">
                  <div className="h-10 w-10 relative mr-2">
                    <Image
                      src={variation.image}
                      alt={variation.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              ) : (
                <span>No Image</span>
              )}
            </TableCell>
            <TableCell>{variation.name}</TableCell>
            <TableCell>{variation.price}</TableCell>
            <TableCell>
              {variation.locations.reduce((total, loc) => total + loc.stock, 0)}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <EditVariation variation={variation} />
                <ManageVariation variation={variation} />
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(variation.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VariationTable;
