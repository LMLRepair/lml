'use client';

import EditInventoryItemBrandForm from '@/forms/EditInventoryItemBrandForm';
import EditVariationInfo from '@/forms/EditVariationInfo';
import EditVendorForm from '@/forms/EditVendorForm';
import { useModal } from '@/providers/model-provider';
import { Pencil } from 'lucide-react';

type VariationProps = {
   inventoryItemId: number;
   variationId: number;
};

export function EditItemVariationDialog({
   inventoryItemId,
   variationId,
}: VariationProps) {
   const { setOpen } = useModal();

   const handleOpen = () => {
      setOpen({
         content: (
            <EditVariationInfo
               inventoryItemId={inventoryItemId}
               variationId={variationId}
            />
         ),
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
