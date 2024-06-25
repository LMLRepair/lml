'use client';

import CreateVendorForm from '@/forms/CreateVendorForm';
import { useModal } from '@/providers/model-provider';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

export function AddVendorDialog() {
   const { setOpen } = useModal();

   const handleOpen = () => {
      setOpen({
         content: <CreateVendorForm />,
      });
   };

   return (
      <Button onClick={handleOpen}>
         <Plus size={16} className='mr-2' />
         Add Vendor
      </Button>
   );
}
