import { getInventoryBrands } from '@/lib/db/itemBranCrud';

export async function fetchInventoryBrands() {
   try {
      const brands = await getInventoryBrands();
      return { brands, error: null };
   } catch (err) {
      return { brands: [], error: 'Check your internet connection.' };
   }
}
