'use client';

import { Service } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AddService from './AddService';
import CustomContainer from './CustomContainer';
import EditService from './EditService';
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

interface ServicesTableProps {
   services: Service[];
}

function ServicesTable({ services }: ServicesTableProps) {
   const [search, setSearch] = useState('');

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
   };

   const filteredServices = services.filter((filteredService) => {
      return (
         search.toLowerCase() === '' ||
         filteredService.service_name.toLowerCase().includes(search)
      );
   });

   return (
      <CustomContainer>
         <h1 className='text-3xl px-2 mb-4'>Services</h1>
         <Card className='mb-4'>
            <div className='flex justify-between items-center gap-5 px-3 py-6'>
               <div className='flex items-center border border-primary-foreground px-3 rounded-md '>
                  <Search />
                  <Input
                     placeholder='Search service...'
                     className='w-96 border-none focus-visible:outline-none '
                     onChange={handleInputChange}
                  />
               </div>
               <AddService />
            </div>
         </Card>
         <Card>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className='w-72'>Name</TableHead>
                     <TableHead>Image</TableHead>
                     <TableHead className='w-80'>Description</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredServices.map((service) => (
                     <TableRow key={service.service_id}>
                        <TableCell className='font-medium w-72 hover:underline hover:text-blue-500'>
                           {service.service_type === 'general_service' ? (
                              <Link
                                 href={`/dashboard/services/${service.service_id}?serviceName=${service.service_name}`}
                              >
                                 {service.service_name}
                              </Link>
                           ) : (
                              <Link href={`/dashboard/brands`}>
                                 {service.service_name}
                              </Link>
                           )}
                        </TableCell>
                        <TableCell className='font-medium'>
                           {service.service_image ? (
                              <h1>image</h1>
                           ) : (
                              <h1>no image</h1>
                           )}
                        </TableCell>
                        <TableCell className='font-medium w-80 '>
                           {service.service_desc}
                        </TableCell>
                        <TableCell className='font-medium'>
                           {service.service_type}
                        </TableCell>
                        <TableCell className='font-medium'>
                           <EditService
                              serviceId={service.service_id}
                              serviceImage={service.service_image}
                              serviceName={service.service_name}
                              serviceDescription={service.service_desc}
                              serviceType={service.service_type}
                           />
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>
      </CustomContainer>
   );
}

export default ServicesTable;
