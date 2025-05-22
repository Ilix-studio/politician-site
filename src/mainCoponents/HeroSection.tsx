import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import Image1 from "./../assets/carousel/A.jpg";
import Image2 from "./../assets/carousel/B.jpg";
import Image3 from "./../assets/carousel/C.jpg";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel images with captions
  const carouselImages = [
    {
      src: Image1,
      alt: "Culture Prommoter",
      caption: "CULTURE PROMOTER",
      isEven: false,
    },
    {
      src: Image2,
      alt: "Well connected",
      caption: "WELL CONNECTED",
      isEven: true,
    },
    {
      src: Image3,
      alt: "For The People",
      caption: "FOR THE PEOPLE",
      isEven: false,
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <section id='home' className='relative'>
      {/* Carousel Background */}
      <div className='absolute inset-0 z-0'>
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-full object-cover'
            />
            {/* Dark overlay for better text readability */}
            <div className='absolute inset-0 bg-black/50'></div>
            <div
              className={`absolute bottom-10 ${
                !image.isEven ? "left-10 text-left" : "right-10 text-right"
              }`}
            >
              <h3 className='text-2xl md:text-3xl font-bold text-[#F47216]  p-4 rounded inline-block'>
                "{image.caption}"
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
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
                className='bg-[#F47216] hover:bg-[#F47216]/90 text-white'
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

        {/* Carousel Navigation Dots */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-2'>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
