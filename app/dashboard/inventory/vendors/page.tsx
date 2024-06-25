import InventoryItemBrandTable from '@/components/InventoryItemBrandsTable';
import VendorsTable from '@/components/VendorsTable';
import { fetchVendors } from '@/lib/FetchVendors';

const Locations = async () => {
   const { vendors, error } = await fetchVendors();

   return (
      <div>
         {error ? (
            <p className='text-red-500 text-center mt-10'>{error}</p>
         ) : (
            <VendorsTable vendors={vendors} />
         )}
      </div>
   );
};

export default Locations;
