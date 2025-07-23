import About from "./mainComponents/AboutMe/About";
import Achievement from "./mainComponents/Achievement";
import Contact from "./mainComponents/Contact";
import Footer from "./mainComponents/Footer";
import Gallery from "./mainComponents/Gallery/Gallery";

import Header from "./mainComponents/Header";
import HeroSection from "./mainComponents/HeroSection";

import Initiatives from "./mainComponents/Initiatives";
import Marquee from "./mainComponents/Marquee";

import Press from "./mainComponents/Press/Press";
import Timeline from "./mainComponents/Timeline";
import UnderConstruction from "./mainComponents/UnderConstruction";

const Home = () => {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1'>
          <HeroSection />
          <About />
          <UnderConstruction />
          <Timeline />
          <Achievement />
          <Initiatives />
          <Marquee />
          <Gallery />
          <Press />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
