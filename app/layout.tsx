import { Toaster } from '@/components/ui/toaster';
import ModalProvider from '@/providers/model-provider';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
// import VariationProvider from '@/providers/VariationManagement';

const poppins = Poppins({
   weight: '400',
   subsets: ['latin'],
   variable: '--font-poppins',
   style: 'normal',
});
export const metadata: Metadata = {
   title: 'LML Repair',
   description:
      'LML Repair is a repair service company that specializes in fixing electronics.',
   icons: '/lml_logo.png',
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang='en' suppressHydrationWarning>
         <body className={poppins.className}>
            <ModalProvider>
               {/* <VariationProvider> */}
               <main>{children}</main>
               {/* </VariationProvider> */}

               <Toaster />
            </ModalProvider>
         </body>
      </html>
   );
}
