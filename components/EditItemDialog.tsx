'use client';

import EditItemForm from '@/forms/EditItem';
import { getCategory, getSubCategory } from '@/lib/db/ItemCategoryCrud';
import { getLocations } from '@/lib/db/ItemLocationCrud';
import { useModal } from '@/providers/model-provider';
import { Pencil } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from './ui/use-toast';
import { fetchInventoryBrands } from '@/lib/FetchBrands';
import { fetchVendors } from '@/lib/FetchVendors';

type EditInventoryItemDialogProps = {
   itemId: number;
};

export function EditItemDialog({ itemId }: EditInventoryItemDialogProps) {
   const { setOpen } = useModal();
   const { toast } = useToast();
   const [isPending, startTransition] = useTransition();

   const handleOpen = async () => {
      startTransition(async () => {
         try {
            //Todo: Fetch categories, subcategories, and locations
            const categoriesPromise = getCategory();
            const subCategoriesPromise = getSubCategory();
            const locationsPromise = getLocations();
            const brandPromise = fetchInventoryBrands();
            const vendorPromise = fetchVendors();

            const [categories, subCategories, locations, brands, vendors] =
               await Promise.all([
                  categoriesPromise,
                  subCategoriesPromise,
                  locationsPromise,
                  brandPromise,
                  vendorPromise,
               ]);

            setOpen({
               content: (
                  <EditItemForm
                     itemId={itemId}
                     categories={categories}
                     subCategories={subCategories}
                     locations={locations}
                     brands={brands.brands}
                     vendors={vendors.vendors}
                  />
               ),
            });
         } catch (error) {
            toast({
               title: 'Error',
               description: 'Check your internet connection.',
            });
         }
      });
   };

   return (
      <>
         {isPending ? (
            <Pencil
               size={18}
               className='text-blue-500 animate-pulse cursor-pointer'
            />
         ) : (
            <Pencil
               size={18}
               className='text-blue-500 cursor-pointer'
               onClick={handleOpen}
            />
         )}
      </>
   );
}
