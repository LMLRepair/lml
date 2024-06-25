'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Variation } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ItemsVariationList({ variations }: any) {
   const router = useRouter();
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredVariations = variations.filter((variation: any) => {
      return (
         search.toLowerCase() === '' ||
         variation.name.toLowerCase().includes(search.toLocaleLowerCase())
      );
   });

   return (
      <div className='p-8 space-y-8'>
         <div className='flex items-center justify-between'>
            <div className='space-y-2'>
               <h2 className='text-3xl font-bold'>Variations Information</h2>
               <p className='text-muted-foreground'>
                  Here is all the variations data.
               </p>
               <div className='space-y-4'>
                  <Input
                     type='text'
                     placeholder='Search variations...'
                     className='w-full max-w-md'
                     onChange={handleInputChange}
                  />
               </div>
            </div>
            <Button type='button' onClick={() => router.back()}>
               Go Back
            </Button>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {filteredVariations?.map((vr: Variation) => (
                  <TableRow>
                     <TableCell>
                        <img
                           src={vr.image || '/'}
                           alt={`Variation-image-${vr.variationId}`}
                           width={50}
                           height={50}
                           className='rounded-lg aspect-square  hover:scale-125 tranisition-all duration-300 ease-in-out'
                        />
                     </TableCell>
                     <TableCell>{vr.name}</TableCell>
                     <TableCell>{vr.sku}</TableCell>
                     <TableCell>{vr.quantity}</TableCell>
                     <TableCell>{vr.price}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
