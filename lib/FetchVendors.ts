import { getVendors } from './db/itemVendorsCrud';

export async function fetchVendors() {
   try {
      const vendors = await getVendors();
      return { vendors, error: null };
   } catch (err) {
      return { vendors: [], error: 'Check your internet connection.' };
   }
}
