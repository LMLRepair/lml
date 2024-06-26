'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/TopDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSKU } from '@/lib/skuGenerator';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';

type Location = {
   id: string;
   name: string;
   description: string;
   stock: string; // Each location should have its own quantity field
};

type Variation = {
   name: string;
   price: string;
   sku: string;
   quantity: string; // Total quantity for all selected locations
   image?: File | null;
};

type ErrorVariation = {
   name?: string;
   price?: string;
   quantity?: string;
};

type VariationsDialogProps = {
   getVariations: (options: Variation[]) => void;
   selectedLocations: Location[]; // Update to specify Location type
};

const VariationsDialog = ({
   getVariations,
   selectedLocations,
}: VariationsDialogProps) => {
   const [open, setOpen] = useState(false);
   const [isNext, setIsNext] = useState(false);
   const [isBack, setIsBack] = useState(true);
   const [variation, setVariation] = useState<Variation>({
      name: '',
      price: '',
      sku: '',
      quantity: '',
      image: null,
   });

   const [errors, setErrors] = useState<ErrorVariation>({});
   const [locations, setLocations] = useState<Location[]>([]);
   const [variationsItemData, setVariationsItemData] = useState<{
      image?: File | null;
      name: string;
      price: string;
      stock: number;
      locations: Location[];
   }>({
      name: '',
      price: '',
      stock: 0,
      locations: [],
   });

   const handleChange = (key: string, value: any) => {
      try {
         let updatedVariation = { ...variation };
         if (key === 'name') {
            updatedVariation.sku = generateSKU(value as string);
         }
         updatedVariation[key] = value;

         setVariation(updatedVariation);
      } catch (error) {
         console.error(`Error updating ${key}:`, error);
      }
   };

   const handleLocationData = (index: number, stock: string) => {
      setIsBack(false);
      const updatedLocations = [...locations];
      updatedLocations[index].stock = stock;
      setLocations(updatedLocations);

      if (!variation.name || !variation.price) {
         console.error('Please fill in name and price before managing stock.');
         return;
      }
      if (locations && locations.length > 0) {
         const totalStock = locations.reduce(
            (acc, curr) => acc + parseInt(curr.stock),
            0
         );

         setVariationsItemData({
            image: variation.image,
            name: variation.name,
            price: variation.price,
            stock: totalStock,
            locations: [...locations],
         });
      }
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         if (e.target.files) {
            setVariation({ ...variation, image: e.target.files[0] });
         }
      } catch (error) {
         console.error('Error updating image:', error);
      }
   };

   const handleSubmit = () => {
      if (!variation.name || !variation.price) {
         setErrors({
            name: !variation.name ? 'Please enter a name' : '',
            price: !variation.price ? 'Please enter a price' : '',
         });
         setIsNext(false);
         return;
      }
      setIsNext(true);
   };

   const handleManageStock = () => {
      console.log('Variations Item Data:', variationsItemData);
      setLocations([]);
      setVariation({
         name: '',
         price: '',
         sku: '',
         quantity: '',
         image: null,
      });
      setOpen(false);
      setIsNext(false);
      setErrors({});
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button type='button' onClick={() => setOpen(true)}>
               Add
            </Button>
         </DialogTrigger>
         <DialogContent>
            <Tabs defaultValue='details'>
               <TabsList className='grid w-full grid-cols-2 border border-primary'>
                  <TabsTrigger value='details' disabled={!isBack}>
                     Details
                  </TabsTrigger>
                  <TabsTrigger
                     value='manage'
                     className={
                        isNext
                           ? `text-green-500 font-bold animate-pulse`
                           : 'animate-none'
                     }
                     disabled={!isNext}
                  >
                     Manage stock
                  </TabsTrigger>
               </TabsList>
               <TabsContent value='details'>
                  <Card className='border border-primary'>
                     <form className='space-y-4 flex flex-col justify-center mt-10 px-8 py-6'>
                        <h1 className='text-xl font-bold text-center'>
                           Create Variation
                        </h1>
                        <div className='space-y-4'>
                           <div>
                              <Label className='mb-3'>
                                 Variation Name{' '}
                                 <span className='text-red-600 font-extrabold'>
                                    *
                                 </span>
                              </Label>
                              <Input
                                 placeholder='e.g. Color'
                                 value={variation.name}
                                 onChange={(e) =>
                                    handleChange('name', e.target.value)
                                 }
                                 className='border-2 border-yellow-600'
                              />
                              <p className='text-red-600'>{errors.name}</p>
                           </div>

                           <div>
                              <Label className='mb-3'>
                                 Price{' '}
                                 <span className='text-red-600 font-extrabold'>
                                    *
                                 </span>
                              </Label>
                              <Input
                                 placeholder='e.g. 10.00'
                                 value={variation.price}
                                 onChange={(e) =>
                                    handleChange(
                                       'price',
                                       e.target.value === ''
                                          ? ''
                                          : e.target.value
                                    )
                                 }
                                 className='border-2 border-yellow-600'
                              />
                              <p className='text-red-600'>{errors.price}</p>
                           </div>
                           {/* <div>
                              <Label className='mb-3'>
                                 Quantity{' '}
                                 <span className='text-red-600 font-extrabold'>
                                    *
                                 </span>
                              </Label>
                              <Input
                                 placeholder='e.g. 10'
                                 value={variation.quantity}
                                 onChange={(e) =>
                                    handleChange(
                                       'quantity',
                                       e.target.value === ''
                                          ? ''
                                          : e.target.value
                                    )
                                 }
                                 className='border-2 border-yellow-600'
                              />
                              <p className='text-red-600'>{errors.quantity}</p>
                           </div> */}
                           <VariationImageField
                              handleImageChange={handleImageChange}
                           />
                        </div>
                        <Button type='button' onClick={handleSubmit}>
                           Create Variation
                        </Button>
                     </form>
                  </Card>
               </TabsContent>

               <TabsContent value='manage'>
                  <form className='h-96 2xl:h-full overflow-y-auto space-y-8 '>
                     {selectedLocations && selectedLocations.length > 0 ? (
                        selectedLocations.map((location, index) => (
                           <Card
                              key={location.id}
                              className='w-full max-w-lg border border-primary mt-6'
                           >
                              <CardContent className='mt-6'>
                                 <div className='flex flex-col justify-center mt-10'>
                                    <div className='flex items-center space-x-2'>
                                       <Checkbox
                                          onCheckedChange={() =>
                                             setLocations([
                                                ...locations,
                                                {
                                                   ...location,
                                                   stock: '',
                                                },
                                             ])
                                          }
                                       />
                                       <Label className='text-sm font-medium leading-none'>
                                          Available at{' '}
                                          <span className='font-semibold'>
                                             {location.name}
                                          </span>
                                       </Label>
                                    </div>

                                    <div className='grid grid-cols-3 items-center gap-4 mt-6'>
                                       <Label
                                          htmlFor='stock-on-hand'
                                          className='col-span-1 text-sm font-medium leading-none '
                                       >
                                          Stock on hand
                                       </Label>
                                       <Input
                                          id='stock-on-hand'
                                          placeholder='7'
                                          className='border-2 border-yellow-600 col-span-2'
                                          value={location.stock}
                                          onChange={(e) =>
                                             handleLocationData(
                                                index,
                                                e.target.value
                                             )
                                          }
                                       />
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        ))
                     ) : (
                        <p className='text-center mt-6 flex flex-col gap-2'>
                           <span>No Locations Available</span>{' '}
                           <span className='text-sm'>
                              Select a location to assign variations
                           </span>{' '}
                        </p>
                     )}

                     <Button
                        className='w-full'
                        type='button'
                        onClick={handleManageStock}
                     >
                        Done
                     </Button>
                  </form>
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
};

type ImageFieldProps = {
   handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function VariationImageField({ handleImageChange }: ImageFieldProps) {
   return (
      <div className='border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2'>
         <ImageIcon className='h-6 w-6 text-gray-600' />
         <span> Drag and drop images here, </span>
         <Label className='text-blue-600 underline cursor-pointer'>
            upload
            <Input
               id='file-upload'
               type='file'
               accept='image/*'
               className='hidden'
               onChange={handleImageChange}
            />
         </Label>
      </div>
   );
}

function ImageIcon(props: any) {
   return (
      <svg
         {...props}
         xmlns='http://www.w3.org/2000/svg'
         width='24'
         height='24'
         viewBox='0 0 24 24'
         fill='none'
         stroke='currentColor'
         strokeWidth='2'
         strokeLinecap='round'
         strokeLinejoin='round'
      >
         <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
         <circle cx='9' cy='9' r='2' />
         <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
      </svg>
   );
}

export default VariationsDialog;
