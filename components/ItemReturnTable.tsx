'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AddReturnItemDialog } from './AddReturnItem';
import { EditReturnItemDialog } from './EditReturnItem';
import { Card } from './ui/card';
import { Input } from './ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './ui/table';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function ItemReturnTable({ returnedItems }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredReturnedItems = returnedItems.filter((returned: any) => {
      return (
         search.toLowerCase() === '' ||
         returned.inventoryItem.name
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      );
   });
   return (
      <div>
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-2xl font-medium'>Return Items List</h1>
               <p className='text-sm'>Here all Returned Items data</p>
            </div>
            <div className='flex items-center gap-5'>
               <AddReturnItemDialog />
               <Button type='button' onClick={() => router.back()}>
                  Go Back
               </Button>
            </div>
         </div>
         <Input
            placeholder='Search Item Return...'
            className='max-w-96 '
            onChange={handleInputChange}
         />
         <div>
            <Card className='my-8'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className='lg:w-80'>Returned Item</TableHead>
                        <TableHead>Returned By</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredReturnedItems.map((item: any) => (
                        <TableRow key={item.stockReturnId}>
                           <TableCell className='hover:text-blue-500 hover:underline hover:underline-offset-1'>
                              <Link
                                 href={`/inventory/returnItems/${item.stockReturnId}`}
                              >
                                 {item.inventoryItem.name}
                              </Link>
                           </TableCell>
                           {item.returningParty === 'Customer' ? (
                              <TableCell className='text-blue-500 font-semibold'>
                                 {item.returningParty}
                              </TableCell>
                           ) : (
                              <TableCell className='text-purple-700 font-semibold'>
                                 {item.returningParty}
                              </TableCell>
                           )}
                           <TableCell>{item.reason}</TableCell>
                           {item.result === 'Approved' ? (
                              <TableCell className='text-green-500 font-semibold'>
                                 {item.result}
                              </TableCell>
                           ) : item.result === 'Pending' ? (
                              <TableCell className='text-yellow-600 semibold'>
                                 {item.result}
                              </TableCell>
                           ) : (
                              <TableCell className='text-red-500 font-semibold'>
                                 {item.result}
                              </TableCell>
                           )}
                           <TableCell>
                              <div className='flex gap-2'>
                                 <EditReturnItemDialog
                                    stockReturnId={item.stockReturnId}
                                 />

                                 <Trash2 size={20} className='text-red-600' />
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

export default ItemReturnTable;
