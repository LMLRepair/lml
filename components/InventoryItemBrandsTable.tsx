'use client';

import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddLocationDialog } from './AddLocation';
import { Card } from './ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './ui/table';
import { AddInventoryItemBrandDialog } from './AddInventoryItemBrandDialog';
import { EditInventoryItemBrandDialog } from './EditInventoryItemBrandDialog';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function InventoryItemBrandTable({ brands }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredItems = brands.filter((brand: any) => {
      return (
         search.toLowerCase() === '' ||
         brand.brandInventoryName
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      );
   });
   return (
      <div>
         <div className='space-y-3'>
            <div className='flex items-center justify-between'>
               <div className='space-y-1'>
                  <h1 className='text-2xl font-medium'>Brands</h1>
                  <p className='text-sm'>Manage your Brands</p>
               </div>
               <div className='flex items-center gap-3'>
                  <AddInventoryItemBrandDialog />
                  <Button type='button' onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
            </div>

            <Input
               placeholder='Search Location. . . . .'
               className='max-w-96 '
               onChange={handleInputChange}
            />
         </div>
         <div>
            <Card className='my-8'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className='lg:w-80'>Brand</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Items in Brand</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems &&
                        filteredItems.map((brand: any) => (
                           <TableRow key={brand.brandInventoryId}>
                              <TableCell className='lg;w-96'>
                                 {brand.brandInventoryName}
                              </TableCell>
                              <TableCell className='space-x-1 text-green-500 font-medium'>
                                 {brand.description}
                              </TableCell>
                              <TableCell>
                                 {brand.items && brand.items.length}
                              </TableCell>
                              <TableCell>
                                 <div className='flex items-center gap-3'>
                                    <EditInventoryItemBrandDialog
                                       brandId={brand.brandInventoryId}
                                    />

                                    <Trash2
                                       size={18}
                                       className='text-red-500 cursor-pointer'
                                    />
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

export default InventoryItemBrandTable;
