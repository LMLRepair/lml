import useFormStore from '@/app/store';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Ellipsis, Trash2 } from 'lucide-react';
import EditVariation from './EditVariation';
import ManageVariation from './ManageVariation';

const VariationTable = () => {
   const { variations, deleteVariation } = useFormStore();

   const handleDelete = (variationId: string) => {
      deleteVariation(variationId);
   };

   return (
      <Table className='border-collapse border border-gray-300'>
         <TableHeader>
            <TableRow>
               <TableHead>Image</TableHead>
               <TableHead>Name</TableHead>
               <TableHead>SKU</TableHead>
               <TableHead>Raw</TableHead>
               <TableHead>Tax</TableHead>
               <TableHead>Shipping</TableHead>
               <TableHead>Stock</TableHead>
               <TableHead>Actions</TableHead>
               <TableHead>
                  <Ellipsis size={18} />
               </TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {variations.map((variation) => (
               <TableRow key={variation.id}>
                  <TableCell>
                     {variation.image ? (
                        <div className='flex items-center'>
                           <img
                              src={variation?.image}
                              alt={`Preview of ${variation.name}`}
                              className='w-16 h-16 rounded-lg aspect-square transition ease-in-out delay-150 hover:-translate-y-4 hover:scale-150 duration-300 hover:overflow-hidden'
                           />
                        </div>
                     ) : (
                        <span>No Image</span>
                     )}
                  </TableCell>
                  <TableCell>{variation.name}</TableCell>
                  <TableCell className='overflow-x-hidden'>
                     {variation?.sku}
                  </TableCell>
                  <TableCell>{variation.variationRaw}</TableCell>
                  <TableCell>{variation.variationShipping}</TableCell>
                  <TableCell>{variation.variationTax}</TableCell>
                  <TableCell>
                     {variation.locations.reduce(
                        (total, loc) => total + loc.stock,
                        0
                     )}
                  </TableCell>
                  <TableCell>
                     <div className='flex space-x-3'>
                        <EditVariation variation={variation} />
                        <Trash2
                           className='text-red-500 font-medium cursor-pointer'
                           size={18}
                           onClick={() => handleDelete(variation.id)}
                        />
                     </div>
                  </TableCell>
                  <TableCell>
                     <ManageVariation variation={variation} />
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default VariationTable;
