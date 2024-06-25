import AboutUs from '@/components/website/AboutUs';
import ChooseUs from '@/components/website/ChooseUs';
import Faqs from '@/components/website/Faqs';
import Footer from '@/components/website/footer';
import Gallery from '@/components/website/Gallery';
import Header from '@/components/website/header';
import Hero from '@/components/website/Hero';
import Services from '@/components/website/Services';

export default async function Home() {
   return (
      <div>
         <Header />
         <Hero />
         <AboutUs />
         <Services />
         <ChooseUs />
         <Gallery />
         <Faqs />
         <Footer />
      </div>
   );
}
