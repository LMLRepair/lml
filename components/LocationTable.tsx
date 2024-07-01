'use client';

import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddLocationDialog } from './AddLocation';
import { EditLocationDialog } from './EditLocation';
import { Card } from './ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import DeleteItemLocation from './DeleteItemLocation';

function CategoryTable({ locations }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredItems = locations.filter((location: any) => {
      return (
         search.toLowerCase() === '' ||
         location.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
   });

   return (
      <div>
         <div className='space-y-3'>
            <div className='flex items-center justify-between'>
               <div className='space-y-1'>
                  <h1 className='text-2xl font-medium'>Locations</h1>
                  <p className='text-sm'>Manage your Locations</p>
               </div>
               <div className='flex items-center gap-3'>
                  <AddLocationDialog />
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
                        <TableHead>Location</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems &&
                        filteredItems.map((locate: any) => (
                           <TableRow key={locate.locationId}>
                              <TableCell>{locate.name}</TableCell>
                              <TableCell className='space-x-1 text-green-500 font-medium'>
                                 {locate.description}
                              </TableCell>

                              <TableCell>
                                 <div className='flex items-center gap-3'>
                                    <EditLocationDialog
                                       locationId={locate.locationId}
                                    />

                                    <DeleteItemLocation
                                       locationId={locate.locationId}
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

export default CategoryTable;
