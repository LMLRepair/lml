'use client';
import useFormStore from '@/app/store';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/TopDialog';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

const AddVariation = () => {
   const inputFileRef = useRef<HTMLInputElement>(null);
   const [dialogOpen, setDialogOpen] = useState(false);
   const {
      formData,
      errors,
      loading,
      setFormData,
      setErrors,
      setLoading,
      addVariation,
   } = useFormStore();

   const validateForm = () => {
      let formErrors = {
         variationName: '',
         variationRaw: '',
         variationShipping: '',
         variationTax: '',
         variationImage: '',
      };
      let isValid = true;

      if (!formData.variationName) {
         formErrors.variationName = 'Variation name is required';
         isValid = false;
      }

      if (!formData.variationRaw) {
         formErrors.variationRaw = 'Variation Raw is required';
         isValid = false;
      }
      if (!formData.variationShipping) {
         formErrors.variationShipping = 'Variation Shipping is required';
         isValid = false;
      }
      if (!formData.variationTax) {
         formErrors.variationTax = 'Variation Tax is required';
         isValid = false;
      }

      if (formData.variationImage) {
         const fileType = formData.variationImage.type;
         if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
            formErrors.variationImage =
               'Only jpg, jpeg, and png files are allowed';
            isValid = false;
         }
      }

      setErrors(formErrors);
      return isValid;
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target;

      if (name === 'variationImage' && files) {
         setFormData({ [name]: files[0] });
      } else {
         setFormData({ [name]: value });
      }
   };

   const handleSubmit = async () => {
      if (validateForm()) {
         setLoading(true);
         try {
            addVariation({
               id: Date.now().toString(), // Generate a unique ID for the variation
               name: formData.variationName,
               variationRaw: formData.variationRaw,
               variationShipping: formData.variationShipping,
               variationTax: formData.variationTax,
               image: formData.variationImage
                  ? URL.createObjectURL(formData.variationImage)
                  : null,
               locations: [], // Initialize with an empty array of locations
            });
            setDialogOpen(false);
         } finally {
            setLoading(false);
         }
      }
   };

   return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogTrigger asChild>
            <Button variant='default'>Add new</Button>
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle className='text-center'>
                  Create variation
               </DialogTitle>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
               <div>
                  <label htmlFor='variationName'>Name</label>
                  <Input
                     type='text'
                     name='variationName'
                     placeholder='Variation Name'
                     value={formData.variationName}
                     onChange={handleChange}
                  />
                  {errors.variationName && (
                     <p className='text-red-500'>{errors.variationName}</p>
                  )}
               </div>

               <div>
                  <label htmlFor='variationPrice'>Raw</label>
                  <Input
                     type='number'
                     name='variationRaw'
                     placeholder='Variation Raw'
                     value={formData.variationRaw}
                     onChange={handleChange}
                  />
                  {errors.variationRaw && (
                     <p className='text-red-500'>{errors.variationRaw}</p>
                  )}
               </div>
               <div>
                  <label htmlFor='variationPrice'>Tax</label>
                  <Input
                     type='number'
                     name='variationTax'
                     placeholder='Variation Tax'
                     value={formData.variationTax}
                     onChange={handleChange}
                  />
                  {errors.variationTax && (
                     <p className='text-red-500'>{errors.variationTax}</p>
                  )}
               </div>
               <div>
                  <label htmlFor='variationPrice'>Shipping</label>
                  <Input
                     type='number'
                     name='variationShipping'
                     placeholder='Variation Price'
                     value={formData.variationShipping}
                     onChange={handleChange}
                  />
                  {errors.variationShipping && (
                     <p className='text-red-500'>{errors.variationShipping}</p>
                  )}
               </div>

               <div>
                  <label htmlFor='variationImage' className='text-right mb-2'>
                     Image
                  </label>
                  <div className='border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2'>
                     <ImageIcon className='h-6 w-6 text-gray-600' />
                     <span className='text-gray-600'>
                        Drag and drop images here,{' '}
                        <Label className='text-blue-600  cursor-pointer'>
                           upload
                           <Input
                              id='variationImage'
                              type='file'
                              accept='image/*'
                              name='variationImage'
                              className='hidden'
                              onChange={handleChange}
                           />
                        </Label>
                     </span>
                  </div>
                  {errors.variationImage && (
                     <p className='text-red-500'>{errors.variationImage}</p>
                  )}
               </div>

               <DialogFooter>
                  <Button
                     onClick={handleSubmit}
                     disabled={loading}
                     variant='default'
                  >
                     {loading ? 'Loading' : 'Save'}
                  </Button>
               </DialogFooter>
            </div>
         </DialogContent>
      </Dialog>
   );
};

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

export default AddVariation;
