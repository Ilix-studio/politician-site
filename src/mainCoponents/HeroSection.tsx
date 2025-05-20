import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Chakra from "./../assets/AshokaChakra.png";

const HeroSection = () => {
  return (
    <section id='home' className='relative'>
      <div className='absolute inset-0 z-0'>
        {/* Indian flag color bands with correct proportions */}
        <div className='h-1/3 bg-[#FF9933]' /> {/* Saffron (Kesari) */}
        <div className='h-1/3 bg-white relative'>
          {" "}
          {/* White - with Ashoka Chakra */}
          {/* Ashoka Chakra positioned in the center of the white band */}
          <motion.div
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48'
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <img
              src={Chakra}
              alt='Ashoka Chakra'
              className='object-contain w-full h-full'
            />
          </motion.div>
        </div>
        <div className='h-1/3 bg-[#138808]' /> {/* Green */}
        {/* Dark overlay for better text readability */}
        <div className='absolute inset-0 bg-black/25' />
      </div>

      <div className='container relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center text-white'>
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl'>
            Biswajit Phukan
          </h1>
          <p className='text-xl md:text-2xl font-medium'>
            Member of the Assam Legislative Assembly | Serving Sarupathar
          </p>
          <p className='text-base md:text-lg max-w-xl mx-auto'>
            Dedicated to the progress and prosperity of Assam and our great
            nation. Working tirelessly for the welfare of all citizens since
            2021.
          </p>
          <div className='flex flex-wrap justify-center gap-4 pt-4'>
            <a
              href='https://membership.bjp.org/en/home/login'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                size='lg'
                className='bg-[#FF9933] hover:bg-[#FF9933]/90 text-white'
              >
                Join the Movement
              </Button>
            </a>
            <a href='#about'>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-black hover:bg-white hover:text-black'
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
