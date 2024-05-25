'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import AddService from './AddService';
import CustomContainer from './CustomContainer';
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
import Link from 'next/link';

function ModelTable({ models }: any) {
   return (
      <CustomContainer>
         <h1 className='text-3xl px-2 mb-4'>Series</h1>
         <Card className='mb-4'>
            <div className='flex justify-between items-center gap-5 px-3 py-6'>
               <div className='flex items-center border border-primary-foreground px-3 rounded-md '>
                  <Search />
                  <Input
                     placeholder='Search series'
                     className='lg:w-96 border-none focus-visible:outline-none '
                  />
               </div>
               <AddService />
            </div>
         </Card>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Series Name</TableHead>
                  <TableHead>Series Image</TableHead>
                  <TableHead>Action</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {models?.map((model: any) => (
                  <TableRow>
                     <TableCell>{model.model_name}</TableCell>

                     <TableCell>
                        <Image
                           src={'/lml_logo.png'}
                           alt={model?.model_name}
                           width={50}
                           height={50}
                           className='rounded-md object-cover'
                        />
                     </TableCell>

                     <TableCell>Edit</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </CustomContainer>
   );
}

export default ModelTable;
