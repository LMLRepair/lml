'use client';

import { Trash2 } from 'lucide-react';
import { EditCategoryDialog } from './EditCategoryDialog';
import { Card } from './ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from './ui/table';
import { DatePickerDemo } from './DatePicker';
import { AddCategoryDialog } from './AddCategoryDialog';
import { Input } from './ui/input';
import { useState } from 'react';
import { InventoryItem } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function CategoryTable({ categories }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredItems = categories.filter((item: any) => {
      return (
         search.toLowerCase() === '' ||
         item.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
   });

   return (
      <div>
         <div className='space-y-3'>
            <div className='flex items-center justify-between'>
               <div className='space-y-1'>
                  <h1 className='text-2xl font-medium'>Item Categories</h1>
                  <p className='text-sm'>Manage your item categories</p>
               </div>
               <div className='flex items-center gap-3'>
                  {/* <div className='flex items-center gap-3'>
                     <DatePickerDemo />
                  </div> */}
                  <AddCategoryDialog />
                  <Button type='button' onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
            </div>

            <Input
               placeholder='Search Category. . . . .'
               className='max-w-96 '
               onChange={handleInputChange}
            />
         </div>
         <div>
            <Card className='my-8'>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className='lg:w-80'>Category</TableHead>
                        <TableHead>Sub-Category</TableHead>
                        <TableHead>Linked Items</TableHead>
                        <TableHead>Acttions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems &&
                        filteredItems.map((cate: any) => (
                           <TableRow key={cate.itemsCategoryId}>
                              <TableCell className='lg;w-96'>
                                 {cate.name}
                              </TableCell>
                              <TableCell className='space-x-1'>
                                 <ul className='space-y-1'>
                                    {cate.subCategories &&
                                    cate.subCategories?.length > 0 ? (
                                       cate.subCategories?.map(
                                          (subCategory: any, index: any) => (
                                             <li
                                                key={index}
                                                className='text-green-500 font-medium'
                                             >
                                                {subCategory?.name},
                                             </li>
                                          )
                                       )
                                    ) : (
                                       <span>N/A</span>
                                    )}
                                 </ul>
                              </TableCell>
                              <TableCell>
                                 {cate.InventoryItem &&
                                    cate.InventoryItem.length}
                              </TableCell>

                              <TableCell>
                                 <div className='flex items-center gap-3'>
                                    <EditCategoryDialog
                                       categoryId={cate.itemsCategoryId}
                                    />
                                    <Trash2
                                       size={20}
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

export default CategoryTable;
