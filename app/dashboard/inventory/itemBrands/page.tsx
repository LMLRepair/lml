import InventoryItemBrandTable from '@/components/InventoryItemBrandsTable';
import { fetchInventoryBrands } from '@/lib/FetchBrands';

const Locations = async () => {
   const { brands, error } = await fetchInventoryBrands();

   return (
      <div>
         {error ? (
            <p className='text-red-500 text-center mt-10'>{error}</p>
         ) : (
            <InventoryItemBrandTable brands={brands} />
         )}
      </div>
   );
};

export default Locations;
