import { getLocations } from '@/lib/db/ItemLocationCrud';
import { generateSKU } from '@/lib/skuGenerator';
import { create } from 'zustand';

interface Location {
   name: string;
   locationId: string;
   stock: number;
   description?: string | null;
}

interface Variation {
   id: string;
   name: string;
   variationTax: string;
   variationShipping: string;
   variationRaw: string;
   sku?: null | string | undefined;
   image?: string | null | undefined;
   locations: Location[];
}

interface FormData {
   variationName: string;
   variationSku: string;
   variationImage: File | null;
   variationTax: string;
   variationShipping: string;
   variationRaw: string;
}

interface LocationState {
   predefinedLocations: Location[];
   selectedLocations: Location[];
   selectLocation: (location: Location) => void;
   unselectLocation: (id: string) => void;
}

interface FormState {
   formData: FormData;
   variations: Variation[];
   errors: { [key: string]: string };
   loading: boolean;
   setFormData: (formData: Partial<FormData>) => void;
   addVariation: (variation: Variation) => void;

   updateVariation: (updatedVariation: Variation) => void;
   deleteVariation: (variationId: string) => void;
   setErrors: (errors: { [key: string]: string }) => void;
   setLoading: (loading: boolean) => void;
}

const useFormStore = create<FormState>((set) => ({
   formData: {
      variationName: '',
      variationSku: '',
      variationRaw: '',
      variationTax: '',
      variationShipping: '',
      variationImage: null,
   },
   variations: [],
   errors: {
      variationName: '',
      variationRaw: '',
      variationShipping: '',
      variationTax: '',
      variationImage: '',
   },
   loading: false,
   setFormData: (updatedData) =>
      set((state) => ({
         formData: { ...state.formData, ...updatedData },
      })),
   addVariation: (variation) => {
      let sku: string;
      if (variation.name) {
         sku = generateSKU(variation.name);
      }

      set((state) => ({
         variations: [...state.variations, { ...variation, sku }],
      }));
   },

   updateVariation: (updatedVariation) => {
      let sku: string;

      if (updatedVariation.name) {
         sku = generateSKU(updatedVariation.name);
      }

      set((state) => ({
         variations: state.variations.map((variation) =>
            variation.id === updatedVariation.id
               ? { ...updatedVariation, sku }
               : variation
         ),
      }));
   },
   deleteVariation: (variationId) =>
      set((state) => ({
         variations: state.variations.filter(
            (variation) => variation.id !== variationId
         ),
      })),
   setErrors: (errors) => set({ errors }),
   setLoading: (loading) => set({ loading }),
}));

const fetchLocations = async (): Promise<Location[]> => {
   const data = await getLocations();
   return data.map((location) => ({
      ...location,
      locationId: location.locationId.toString(),
      stock: 0,
   }));
};

const useLocation = create<LocationState>((set) => ({
   predefinedLocations: [],
   selectedLocations: [],
   selectLocation: (location) =>
      set((state) => ({
         selectedLocations: [...state.selectedLocations, location],
      })),
   unselectLocation: (id) =>
      set((state) => ({
         selectedLocations: state.selectedLocations.filter(
            (location) => location.locationId !== id
         ),
      })),
}));

fetchLocations().then((locations) => {
   useLocation.setState({ predefinedLocations: locations });
});

export { useFormStore, useLocation };

export default useFormStore;
