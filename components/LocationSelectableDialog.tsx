'use client';

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

const LocationSelector = ({ locations, handleSelectedLocations }: any) => {
   const [selectedLocations, setSelectedLocations] = useState<
      { id: string; name: string }[]
   >([]);

   const handleLocationChange = (value: { id: string; name: string }) => {
      setSelectedLocations((prev) =>
         prev.some((location) => location.id === value.id)
            ? prev.filter((location) => location.id !== value.id)
            : [...prev, value]
      );
   };

   const handleSubmit = () => {
      console.log(selectedLocations);
      handleSelectedLocations(selectedLocations);
      //   console.log('Selected locations:', selectedLocations);
      //   console.log(selectedLocations);
   };

   return (
      <Dialog>
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
                  {locations.map((location: any) => (
                     <div
                        key={location.locationId}
                        className='flex items-center mb-2'
                     >
                        <Checkbox
                           id={`location-${location.locationId}`}
                           checked={selectedLocations.some(
                              (loc) => loc.id === String(location.locationId)
                           )}
                           onCheckedChange={(checked) => {
                              const value = {
                                 id: String(location.locationId),
                                 name: location.name,
                              };
                              handleLocationChange(value);
                           }}
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
                  <Button type='button' onClick={handleSubmit}>
                     Save
                  </Button>
               </DialogClose>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default LocationSelector;
