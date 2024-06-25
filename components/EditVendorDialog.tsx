'use client';

import EditInventoryItemBrandForm from '@/forms/EditInventoryItemBrandForm';
import EditVendorForm from '@/forms/EditVendorForm';
import { useModal } from '@/providers/model-provider';
import { Pencil } from 'lucide-react';

type VendorPorps = {
   vendorId: number;
};

export function EditVendorDialog({ vendorId }: VendorPorps) {
   const { setOpen } = useModal();

   const handleOpen = () => {
      setOpen({
         content: <EditVendorForm vendorId={vendorId} />,
      });
   };

   return (
      <Pencil
         size={18}
         className='text-blue-500 mr-2 cursor-pointer'
         onClick={handleOpen}
      />
   );
}
