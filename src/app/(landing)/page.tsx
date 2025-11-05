import Customers from './_home/components/customers';
import Faq from './_home/components/faq';
import Features from './_home/components/features';
import HeroBanner from './_home/components/hero.banner';
import Roadmap from './_home/components/roadmap';
import Tokenomics from './_home/components/tokenomics';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Customers />
      <Features />
      <Tokenomics />
      <Roadmap />
      <Faq />
    </>
  );
}
