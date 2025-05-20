import About from "./mainCoponents/About";
import Achievement from "./mainCoponents/Achievement";
import Contact from "./mainCoponents/Contact";
import Footer from "./mainCoponents/Footer";
import Gallery from "./mainCoponents/Gallery";
import Header from "./mainCoponents/Header";
import HeroSection from "./mainCoponents/HeroSection";
import Initiatives from "./mainCoponents/Initiatives";
import Marquee from "./mainCoponents/Marquee";
// import Press from "./mainCoponents/Press";
import Timeline from "./mainCoponents/Timeline";

const Home = () => {
  return (
    <>
      <Header />
      <main className='flex-1'>
        <HeroSection />
        <About />
        <Timeline />
        <Achievement />
        <Initiatives />
        <Marquee />
        <Gallery />
        {/* <Press /> */}
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
