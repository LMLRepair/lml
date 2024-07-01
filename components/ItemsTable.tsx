"use client";

import { Download, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditItemDialog } from "./EditItemDialog";
import { Card } from "./ui/card";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddItemDialog } from "./AddItem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// interface Location {
//    locationId: number;
//    name: string;
//    description?: string;
// }

// interface InventoryItem {
//    variations: {
//       locations: {
//          location: Location;
//          stock: number;
//       }[];
//    }[];
// }

interface Props {
  items: any;
}

function ItemsTable({ items }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredItems = items.filter((item: any) => {
    return (
      search.toLowerCase() === "" ||
      item.name.toLowerCase().includes(search.toLocaleLowerCase())
    );
  });

<<<<<<< HEAD
   return (
      <div>
         <div className='space-y-3 '>
            <div className='flex items-center justify-between'>
               <div className='space-y-1'>
                  <h1 className='text-2xl font-medium'>Inventory Items</h1>
                  <p className='text-sm'>Manage your inventory items</p>
               </div>
               <div className='flex items-center gap-3'>
                  <AddItemDialog />
                  <Button type='button' onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
            </div>
            <div className='flex items-center justify-between space-x-3'>
               <Input
                  placeholder='Search Item...'
                  className='max-w-96 '
                  onChange={handleInputChange}
               />
               <div className='flex items-center gap-3'>
                  {/* <DatePickerDemo /> */}
                  <Button className='space-x-2 w-32'>
                     <Download size={20} />
                     <span>Export</span>
                  </Button>
               </div>
            </div>
         </div>
         <div>
            <Card className='my-8'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Variations</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems &&
                        filteredItems.map((item: any) => (
                           <TableRow key={item.inventoryItemId}>
                              <TableCell>
                                 <Image
                                    src={
                                       item.image
                                          ? item.image
                                          : '/noPicture.png'
                                    }
                                    className='rounded-lg aspect-square  hover:scale-125 tranisition-all duration-300 ease-in-out'
                                    alt='No Picture'
                                    width={50}
                                    height={50}
                                 />
                              </TableCell>
                              <TableCell>{item.name}</TableCell>

                              <TableCell className='space-x-1'>
                                 <>
                                    <span>{item.itemsCategory?.name} </span> -
                                    <span className='text-green-600 font-semibold'>
                                       {item.itemsSubCategory?.name}
                                    </span>
                                 </>
                              </TableCell>
                              <TableCell className='hover:text-blue-500 hover:underline hover:underline-offset-1'>
                                 <Link
                                    href={`/inventory/itemsVariation/${item.inventoryItemId}`}
                                 >
                                    {item.variations.length > 1
                                       ? `${item.variations.length} Variations`
                                       : item.variations.length === 1 &&
                                         item.variations[0].name}
                                 </Link>
                              </TableCell>
                              <TableCell>
                                 {item.variations
                                    .map(
                                       (variation: any) => variation.locations
                                    )
                                    .flat()
                                    .reduce(
                                       (total: number, location: any) =>
                                          total + location?.stock,
                                       0
                                    )}
                              </TableCell>

                              <TableCell>
                                 {item.brand.brandInventoryName}
                              </TableCell>
                              <TableCell>{item.vendor.name}</TableCell>
                              <TableCell>
                                 {item.variations &&
                                 item.variations.length > 0 ? (
                                    <>
                                       <span className='text-blue-500 font-bold'>
                                          $
                                          {Math.min(
                                             ...item.variations.map(
                                                (variation: any) => {
                                                   const raw = parseFloat(
                                                      variation.raw
                                                   );
                                                   const tax =
                                                      parseFloat(
                                                         variation.tax
                                                      ) / 100;
                                                   const shipping = parseFloat(
                                                      variation.shipping
                                                   );
                                                   const cost =
                                                      raw +
                                                      raw * tax +
                                                      shipping;
                                                   return Math.round(cost);
                                                }
                                             )
                                          )}
                                       </span>
                                       {' - '}
                                       <span>
                                          $
                                          {Math.max(
                                             ...item.variations.map(
                                                (variation: any) => {
                                                   const raw = parseFloat(
                                                      variation.raw
                                                   );
                                                   const tax =
                                                      parseFloat(
                                                         variation.tax
                                                      ) / 100;
                                                   const shipping = parseFloat(
                                                      variation.shipping
                                                   );
                                                   const cost =
                                                      raw +
                                                      raw * tax +
                                                      shipping;
                                                   return Math.round(cost);
                                                }
                                             )
                                          )}
                                       </span>
                                    </>
                                 ) : (
                                    'No variations'
                                 )}
                              </TableCell>

                              <TableCell>
                                 {(() => {
                                    // Get all locations from all variations
                                    const allLocations =
                                       item.variations.flatMap(
                                          (variation: any) =>
                                             variation.locations.map(
                                                (location: any) => ({
                                                   locationId:
                                                      location.location
                                                         .locationId,
                                                   name: location.location.name,
                                                   description:
                                                      location.location
                                                         .description,
                                                })
                                             )
                                       );

                                    // Get unique locations by locationId
                                    const uniqueLocations = [
                                       ...new Map(
                                          allLocations.map((location: any) => [
                                             location.locationId,
                                             location,
                                          ])
                                       ).values(),
                                    ];

                                    return uniqueLocations.length > 1
                                       ? `${uniqueLocations.length} Locations`
                                       : uniqueLocations.length === 1 &&
                                            uniqueLocations[0].name;
                                 })()}
                              </TableCell>
                              <TableCell>
                                 <div className='flex items-center gap-3'>
                                    <EditItemDialog
                                       itemId={item.inventoryItemId}
                                    />

                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger>
                                             <Trash2
                                                size={18}
                                                className='text-red-600 font-bold cursor-pointer'
                                             />
                                          </TooltipTrigger>
                                          <TooltipContent className='bg-red-600 text-white'>
                                             <p>Delete</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                  </TableBody>
               </Table>
            </Card>
         </div>
=======
  return (
    <div>
      <div className="space-y-3 ">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium">Inventory Items</h1>
            <p className="text-sm">Manage your inventory items</p>
          </div>
          <div className="flex items-center gap-3">
            <AddItemDialog />
            <Button type="button" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-3">
          <Input
            placeholder="Search Item..."
            className="max-w-96 "
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-3">
            {/* <DatePickerDemo /> */}
            <Button className="space-x-2 w-32">
              <Download size={20} />
              <span>Export</span>
            </Button>
          </div>
        </div>
>>>>>>> 272553980ed4b8379332025d7fed88156021b003
      </div>
      <div>
        <Card className="my-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Variations</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems &&
                filteredItems.map((item: any) => (
                  <TableRow key={item.inventoryItemId}>
                    <TableCell>
                      <Image
                        src={item.image ? item.image : "/noPicture.png"}
                        className="rounded-lg aspect-square  hover:scale-125 tranisition-all duration-300 ease-in-out"
                        alt="No Picture"
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>

                    <TableCell className="space-x-1">
                      <>
                        <span>{item.itemsCategory?.name} </span> -
                        <span className="text-green-600 font-semibold">
                          {item.itemsSubCategory?.name}
                        </span>
                      </>
                    </TableCell>
                    <TableCell className="hover:text-blue-500 hover:underline hover:underline-offset-1">
                      <Link
                        href={`/inventory/itemsVariation/${item.inventoryItemId}`}
                      >
                        Variation
                      </Link>
                    </TableCell>
                    <TableCell>
                      {item.variations
                        ?.map((vr: any) => vr.quantity)
                        .reduce((a: any, b: any) => a + b, 0)}
                    </TableCell>

                    <TableCell>{item.brand.brandInventoryName}</TableCell>
                    <TableCell>{item.vendor.name}</TableCell>
                    <TableCell>
                      {item.variations && item.variations.length > 0 ? (
                        <>
                          <span className="text-blue-500 font-bold">
                            $
                            {Math.min(
                              ...item.variations.map((vr: any) => vr.price)
                            )}{" "}
                          </span>
                          -{" "}
                          <span>
                            $
                            {Math.max(
                              ...item.variations.map((vr: any) => vr.price)
                            )}
                          </span>
                        </>
                      ) : (
                        "No variations"
                      )}
                    </TableCell>
                    <TableCell>{item.location?.name || "N/A"}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EditItemDialog itemId={item.inventoryItemId} />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Trash2
                                size={18}
                                className="text-red-600 font-bold cursor-pointer"
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-600 text-white">
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default ItemsTable;
