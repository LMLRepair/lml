'use client';
import { useState, useTransition } from 'react';

import { deleteLocationFn } from '@/lib/db/ItemLocationCrud';
import { CircleDashedIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from './TopDialog';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

type DeleteLocationProps = {
   locationId: number;
};

const DeleteItemLocation = ({ locationId }: DeleteLocationProps) => {
   const [dialogOpen, setDialogOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const router = useRouter();
   const { toast } = useToast();

   const deleteLocation = async () => {
      startTransition(async () => {
         try {
            const res = await deleteLocationFn(locationId);
            if (res.status === 'success') {
               toast({
                  title: 'Location',
                  description: res.message,
               });
               router.refresh();
            }
         } catch (error) {
            toast({
               title: 'Location',
               description: 'Failed to Delete location',
            });
         }
      });
   };

   return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogTrigger asChild>
            <Trash2 size={18} className='text-red-500 cursor-pointer' />
         </DialogTrigger>
         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle>Are you sure you want to delete</DialogTitle>
            </DialogHeader>
            <DialogDescription>
               This action cannot be undone. This will permanently delete the
               <strong> Location</strong> and remove data from{' '}
               <strong>LML</strong> servers.
            </DialogDescription>
            <DialogFooter>
               <Button onClick={() => deleteLocation()} variant='destructive'>
                  {isPending ? (
                     <CircleDashedIcon size={18} className='animate-spin' />
                  ) : (
                     'Continuee'
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default DeleteItemLocation;
