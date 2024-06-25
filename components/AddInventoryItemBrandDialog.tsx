'use client';

import CreateNewLocationForm from '@/forms/CreateLocationForm';
import { useModal } from '@/providers/model-provider';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import CreateNewInventoryItemBrandForm from '@/forms/CreateNewInventoryItemBrandForm';

export function AddInventoryItemBrandDialog() {
   const { setOpen } = useModal();

   const handleOpen = () => {
      setOpen({
         content: <CreateNewInventoryItemBrandForm />,
      });
   };

   return (
      <Button onClick={handleOpen}>
         <Plus size={16} className='mr-2' />
         Add Brand
      </Button>
   );
}
