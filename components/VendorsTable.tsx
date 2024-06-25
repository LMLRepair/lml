'use client';

import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AddVendorDialog } from './AddVendorDialog';
import { EditVendorDialog } from './EditVendorDialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './ui/table';

function VendorsTable({ vendors }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredItems = vendors.filter((vendor: any) => {
      return (
         search.toLowerCase() === '' ||
         vendor.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
   });
   return (
      <div>
         <div className='space-y-3'>
            <div className='flex items-center justify-between'>
               <div className='space-y-1'>
                  <h1 className='text-2xl font-medium'>Vendors</h1>
                  <p className='text-sm'>Manage your Vendors</p>
               </div>
               <div className='flex items-center gap-3'>
                  <AddVendorDialog />
                  <Button type='button' onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
            </div>

            <Input
               placeholder='Search Vendors. . . . .'
               className='max-w-96 '
               onChange={handleInputChange}
            />
         </div>
         <div>
            <Card className='my-8'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className='lg:w-80'>Vendor</TableHead>
                        <TableHead>Items in Vendor</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems &&
                        filteredItems.map((vendor: any) => (
                           <TableRow key={vendor.vendorId}>
                              <TableCell className='lg;w-96'>
                                 {vendor.name}
                              </TableCell>

                              <TableCell>
                                 {vendor.InventoryItem &&
                                    vendor.InventoryItem.length}
                              </TableCell>
                              <TableCell>
                                 <div className='flex items-center gap-3'>
                                    <EditVendorDialog
                                       vendorId={vendor.vendorId}
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

export default VendorsTable;
