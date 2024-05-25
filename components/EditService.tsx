'use client';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { updateService } from '@/lib/db/serviceCrud';
import { Pencil } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface EditServiceProps {
   serviceId: number;
   serviceName: string;
   serviceImage: string;
   serviceDescription: string;
   serviceType: string;
}

const EditService: React.FC<EditServiceProps> = ({
   serviceId,
   serviceName,
   serviceImage,
   serviceDescription,
   serviceType,
}: EditServiceProps) => {
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      serviceName: serviceName,
      serviceDescription: serviceDescription,
      serviceImage: serviceImage,
   });
   const [type, setType] = useState(serviceType);

   const handleInputChange = (event: any) => {
      const { name, value } = event.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   async function onSubmit() {
      if (
         !formData.serviceName ||
         !formData.serviceImage ||
         !type ||
         !formData.serviceDescription
      ) {
         alert('missing info');
         return 0;
      }
      try {
         setLoading(true);
         const formattedDate = moment().format('YYYY-MM-DD');

         await updateService(serviceId, {
            service_id: serviceId,
            service_name: formData.serviceName,
            service_desc: formData.serviceDescription,
            service_type: type,
            service_image: formData.serviceImage,
         });

         setLoading(false);
         window.location.href = '/dashboard/services';
      } catch (error) {
         console.error('An error occurred:', error);
         setLoading(false);
      }
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant='ghost' className='hover:text-blue-500'>
               <Pencil size={20} />
            </Button>
         </DialogTrigger>

         <DialogContent className='w-full max-w-md bg-white rounded-lg p-6'>
            <DialogHeader>
               <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div>
               <form className='space-y-4'>
                  <div className='flex flex-col gap-2'>
                     <Label>Service Name</Label>
                     <Input
                        name='serviceName'
                        value={formData.serviceName}
                        id='service'
                        placeholder='Enter service name'
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className='flex flex-col gap-2'>
                     <Label>Service Description</Label>

                     <Input
                        name='serviceDescription'
                        value={formData.serviceDescription}
                        id='description'
                        placeholder='Enter service description'
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className='flex flex-col gap-2'>
                     <Label>Service Image</Label>

                     <Input
                        // name='serviceImage'
                        // value={formData.serviceImage}
                        type='file'
                        id='image'
                        placeholder='Enter service Image'
                        // onChange={handleInputChange}
                     />
                  </div>
                  <div className='flex flex-col gap-2'>
                     <Label>Service Type</Label>
                     <Select
                        required
                        onValueChange={(value: any) => setType(value)}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder='Service' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='general_service'>
                              General_service
                           </SelectItem>
                           <SelectItem value='repairs_service'>
                              repairs_service
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </form>
            </div>
            <DialogFooter className='flex justify-end space-x-2'>
               <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
               </DialogClose>
               <Button onClick={onSubmit} disabled={loading}>
                  {loading ? 'Loading' : 'Save'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default EditService;
