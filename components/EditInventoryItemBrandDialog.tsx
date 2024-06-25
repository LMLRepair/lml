'use client';

import EditInventoryItemBrandForm from '@/forms/EditInventoryItemBrandForm';
import { useModal } from '@/providers/model-provider';
import { Pencil } from 'lucide-react';

type BrandProps = {
   brandId: number;
};

export function EditInventoryItemBrandDialog({ brandId }: BrandProps) {
   const { setOpen } = useModal();

   const handleOpen = () => {
      setOpen({
         content: <EditInventoryItemBrandForm brandId={brandId} />,
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
