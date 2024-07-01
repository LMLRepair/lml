import React, { useState, useEffect } from 'react';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/TopDialog';
import { Button } from '@/components/ui/button';
import useFormStore, { useLocation } from '@/app/store';

interface Location {
   name: string;
   locationId: string;
   stock: number;
   description: string | null;
}

const ManageVariation = ({ variation }: { variation: any }) => {
   const [dialogOpen, setDialogOpen] = useState(false);
   const [localLocations, setLocalLocations] = useState<Location[]>([]);
   const [selectedSubLocations, setSelectedLocations] = useState<string[]>([]);
   const { updateVariation } = useFormStore();
   const { selectedLocations } = useLocation();

   useEffect(() => {
      const initializedLocations = selectedLocations.map((location) => {
         const existingLocation = variation.locations.find(
            (loc: Location) => loc.locationId === location.locationId
         );
         return {
            ...location,
            stock: existingLocation ? existingLocation.stock : 0,
         };
      });
      setLocalLocations(initializedLocations);
   }, [variation]);

   const handleStockChange = (locationId: string, stock: number) => {
      const updatedLocations = localLocations.map((loc) =>
         loc.locationId === locationId ? { ...loc, stock } : loc
      );
      setLocalLocations(updatedLocations);
   };

   const handleCheckboxChange = (locationId: string) => {
      setSelectedLocations((prevSelected) =>
         prevSelected.includes(locationId)
            ? prevSelected.filter((id) => id !== locationId)
            : [...prevSelected, locationId]
      );
   };

   const handleSave = () => {
      const updatedVariationLocations = localLocations.filter((location) =>
         selectedSubLocations.includes(location.locationId)
      );
      updateVariation({ ...variation, locations: updatedVariationLocations });
      setDialogOpen(false);
   };

   return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogTrigger asChild>
            <p className='text-blue-500 underline cursor-pointer'>Manage</p>
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle>Manage Stock for {variation.name}</DialogTitle>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
               {localLocations.map((location) => (
                  <div key={location.locationId} className='flex items-center'>
                     <input
                        type='checkbox'
                        id={`checkbox-${location.locationId}`}
                        checked={selectedSubLocations.includes(
                           location.locationId
                        )}
                        onChange={() =>
                           handleCheckboxChange(location.locationId)
                        }
                        className='mr-2'
                     />
                     <label
                        htmlFor={`checkbox-${location.locationId}`}
                        className='mr-2'
                     >
                        {location.name}
                     </label>
                     <input
                        type='number'
                        id={`location-${location.locationId}`}
                        value={location.stock}
                        onChange={(e) =>
                           handleStockChange(
                              location.locationId,
                              parseInt(e.target.value, 10)
                           )
                        }
                        className='w-20'
                        disabled={
                           !selectedSubLocations.includes(location.locationId)
                        }
                     />
                  </div>
               ))}

               <DialogFooter>
                  <Button onClick={handleSave} variant='default'>
                     Save
                  </Button>
                  <Button
                     onClick={() => setDialogOpen(false)}
                     variant='default'
                  >
                     Close
                  </Button>
               </DialogFooter>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ManageVariation;
