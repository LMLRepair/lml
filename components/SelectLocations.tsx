'use client';
// components/SelectLocations.tsx
import { useLocation } from '@/app/store';
import React, { useState } from 'react';

import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogClose,
} from '@/components/TopDialog';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SelectLocations: React.FC = () => {
   const {
      predefinedLocations,
      selectedLocations,
      selectLocation,
      unselectLocation,
   } = useLocation();

   const [checkedLocations, setCheckedLocations] = useState<string[]>([]);
   const [open, setIsOpen] = useState(false);

   const handleCheckboxChange = (id: string) => {
      if (checkedLocations.includes(id)) {
         setCheckedLocations(checkedLocations.filter((loc) => loc !== id));
         unselectLocation(id);
      } else {
         setCheckedLocations([...checkedLocations, id]);
         const location = predefinedLocations.find(
            (loc) => loc.locationId === id
         );
         if (location) {
            selectLocation(location);
         }
      }
   };

<<<<<<< HEAD
   return (
      <Dialog open={open} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <div className='flex items-center justify-between border py-2 px-4 rounded-md cursor-pointer'>
               <div className='flex flex-col gap-1'>
                  <Label className='text-sm font-medium'>Locations</Label>
                  {selectedLocations && selectedLocations.length > 0 ? (
                     <span className='text-sm'>
                        {selectedLocations.length > 1
                           ? `${selectedLocations.length} locations `
                           : selectedLocations[0].name}
                     </span>
                  ) : (
                     <span className='text-sm'>No locations</span>
                  )}
                  <Input placeholder='All locations' className='hidden' />
               </div>
               <ChevronDown size={18} strokeWidth={1} />
            </div>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Edit locations</DialogTitle>
               <DialogClose />
            </DialogHeader>
            <div className='space-y-4'>
               <Label className='block mb-1'>Locations</Label>
               <hr />
               <div>
                  {predefinedLocations.map((location: any) => (
                     <div
                        key={location.locationId}
                        className='flex items-center mb-2'
                     >
                        <input
                           type='checkbox'
                           value={location.locationId}
                           // checked={checkedLocations.includes(
                           //    location.locationId
                           // )}
                           onChange={() =>
                              handleCheckboxChange(location.locationId)
                           }
                        />
                        <Label
                           className='ml-2'
                           htmlFor={`location-${location.locationId}`}
                        >
                           {location.name}
                        </Label>
                     </div>
                  ))}
               </div>
               <DialogClose>
                  <Button type='button'>Save</Button>
               </DialogClose>
            </div>
         </DialogContent>
      </Dialog>
      // <div>
      //    <h2>Predefined Locations:</h2>
      //    {predefinedLocations.map((location) => (
      //       <div key={location.locationId}>
      //          <label>
      //             <input
      //                type='checkbox'
      //                value={location.locationId}
      //                checked={checkedLocations.includes(location.locationId)}
      //                onChange={() => handleCheckboxChange(location.locationId)}
      //             />
      //             {location.name} (Stock: {location.stock})
      //          </label>
      //       </div>
      //    ))}
      // </div>
   );
=======
  return (
    <div>
      {predefinedLocations.map((location) => (
        <div key={location.locationId}>
          <label>
            <input
              type="checkbox"
              value={location.locationId}
              checked={checkedLocations.includes(location.locationId)}
              onChange={() => handleCheckboxChange(location.locationId)}
            />
            {location.name}
          </label>
        </div>
      ))}
    </div>
  );
>>>>>>> 272553980ed4b8379332025d7fed88156021b003
};

export default SelectLocations;
