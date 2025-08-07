import { Button } from "@/components/ui/button";
import { useState, useEffect, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  Eye,
  TrendingUp,
} from "lucide-react";

// Import Visitor API hooks
import {
  useIncrementVisitorCounterMutation,
  useGetVisitorCountQuery,
  useLazyGetVisitorCountQuery,
} from "@/redux-store/services/visitorApi";

import Image1 from "./../assets/carousel/A.webp";
import Image2 from "./../assets/carousel/B.webp";
import Image3 from "./../assets/carousel/C.webp";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visitorTracked, setVisitorTracked] = useState(false);

  // Visitor tracking hooks
  const [
    incrementVisitorCounter,
    { isLoading: incrementLoading, error: incrementError },
  ] = useIncrementVisitorCounterMutation();

  const [getVisitorCount, { isLoading: getCountLoading }] =
    useLazyGetVisitorCountQuery();

  const { data: currentVisitorData, isLoading: visitorCountLoading } =
    useGetVisitorCountQuery();

  // Check if user has visited before
  const isReturningVisitor = (): boolean => {
    return localStorage.getItem("visitor_tracked") === "true";
  };

  // Mark user as having visited
  const markAsVisited = (): void => {
    localStorage.setItem("visitor_tracked", "true");
    setVisitorTracked(true);
  };

  // Track visitor on component mount
  useEffect(() => {
    const trackVisitor = async () => {
      if (visitorTracked) return; // Prevent double tracking

      try {
        const returning = isReturningVisitor();

        if (returning) {
          // Returning visitor - just get current count
          console.log("Returning visitor detected");
          await getVisitorCount().unwrap();
        } else {
          // New visitor - increment count
          console.log("New visitor detected, incrementing counter");
          const result = await incrementVisitorCounter().unwrap();
          markAsVisited();
          console.log("Visitor count incremented to:", result.count);
        }
      } catch (error) {
        console.error("Error tracking visitor:", error);
        // Fallback: try to get current count
        try {
          await getVisitorCount().unwrap();
        } catch (fallbackError) {
          console.error("Fallback visitor count failed:", fallbackError);
        }
      }
    };

    // Track visitor after a short delay to ensure proper loading
    const timer = setTimeout(trackVisitor, 1000);
    return () => clearTimeout(timer);
  }, [incrementVisitorCounter, getVisitorCount, visitorTracked]);

  // Carousel images with enhanced data
  const carouselImages = [
    {
      src: Image1,
      alt: "Culture Promoter",
      caption: "CULTURE PROMOTER",
      subtitle: "Preserving and promoting Assamese heritage",
      isEven: false,
    },
    {
      src: Image2,
      alt: "Well Connected",
      caption: "WELL CONNECTED",
      subtitle: "Building bridges across communities",
      isEven: true,
    },
    {
      src: Image3,
      alt: "For The People",
      caption: "FOR THE PEOPLE",
      subtitle: "Dedicated service for every citizen",
      isEven: false,
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [carouselImages.length, isAutoPlaying]);

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4 },
    },
  };

  const visitorVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.8 },
    },
  };

  return (
    <section id='home' className='relative overflow-hidden '>
      {/* Visitor Counter Badge - Top Right */}
      <motion.div
        className='absolute top-4 right-4 z-30'
        initial='hidden'
        animate='visible'
        variants={visitorVariants}
      >
        <div className='backdrop-blur-md bg-white/10 p-2 rounded-full border border-white/20 shadow-xl'>
          <div className='flex items-center gap-2 text-white'>
            <Eye className='w-4 h-4' />
            <span className='text-sm font-medium'>
              {visitorCountLoading || incrementLoading ? (
                <span className='animate-pulse'>Loading...</span>
              ) : (
                <>
                  {currentVisitorData?.count?.toLocaleString() || "0"} visitors
                </>
              )}
            </span>
            {!isReturningVisitor() && !visitorTracked && (
              <TrendingUp className='w-3 h-3 text-green-400 animate-pulse' />
            )}
          </div>
        </div>
      </motion.div>

      {/* Carousel Background */}
      <div className='absolute inset-0 z-0'>
        <AnimatePresence mode='wait'>
          {carouselImages.map(
            (image, index) =>
              index === currentIndex && (
                <motion.div
                  key={index}
                  className='absolute inset-0'
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2 }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className='w-full h-full object-cover'
                  />

                  {/* Consistent overlay without theme variations */}
                  <div className='absolute inset-0 bg-black/50'></div>

                  {/* Floating caption */}
                  <motion.div
                    className={`absolute bottom-22 ${
                      !image.isEven
                        ? "left-3 md:left-16"
                        : "right-3 md:right-16"
                    }`}
                    initial={{ opacity: 0, x: image.isEven ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className='backdrop-blur-md bg-white/10 p-3 rounded-2xl border border-white/20 shadow-2xl'>
                      <h3 className='text-1xl md:text-4xl font-bold text-white mb-2'>
                        "{image.caption}"
                      </h3>
                      <p className='text-white/80 text-sm md:text-base'>
                        {image.subtitle}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className='absolute left-1 top-1/3 -translate-y-1/2 z-20 p-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 group'
        aria-label='Previous slide'
      >
        <ChevronLeft className='w-4 h-4 group-hover:scale-110 transition-transform' />
      </button>

      <button
        onClick={nextSlide}
        className='absolute right-1 top-1/3 -translate-y-1/2 z-20 p-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 group'
        aria-label='Next slide'
      >
        <ChevronRight className='w-4 h-4 group-hover:scale-110 transition-transform' />
      </button>

      {/* Main Content */}
      <div className='container relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4 -mt-12'>
        <motion.div
          className='max-w-4xl space-y-6'
          initial='hidden'
          animate='visible'
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {/* Main Title */}
          <motion.div variants={textVariants}>
            <h3 className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4'>
              <span className='bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent'>
                Biswajit Phukan
              </span>
            </h3>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={textVariants} className='space-y-2'>
            <p className='text-lg md:text-2xl font-medium text-orange-100'>
              Member of the Assam Legislative Assembly
            </p>
            <div className='flex items-center justify-center space-x-2 text-white/80'>
              <div className='w-2 h-2 bg-orange-400 rounded-full animate-pulse'></div>
              <span className='text-base md:text-lg'>Serving Sarupathar</span>
              <div className='w-2 h-2 bg-orange-400 rounded-full animate-pulse'></div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={textVariants}
            className='text-base md:text-xl max-w-2xl mx-auto leading-relaxed text-white/90'
          >
            Dedicated to the progress and prosperity of Assam and our great
            nation. Working tirelessly for the welfare of all citizens since
            2021.
          </motion.p>

          {/* Enhanced Stats Banner with Live Visitor Count */}
          <motion.div
            variants={textVariants}
            className='flex justify-center items-center space-x-8 py-4'
          >
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-orange-300'>
                1,07,090
              </div>
              <div className='text-sm text-white/70'>Won by 100k</div>
            </div>
            <div className='w-px h-12 bg-white/30'></div>

            <div className='w-px h-12 bg-white/30'></div>
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-orange-300'>
                3+
              </div>
              <div className='text-sm text-white/70'>Years Serving</div>
            </div>
            <div className='w-px h-12 bg-white/30'></div>
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-orange-300'>
                100K+
              </div>
              <div className='text-sm text-white/70'>Lives Impacted</div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={buttonVariants}
            className='flex flex-wrap justify-center gap-4 pt-6'
          >
            <a
              href='https://membership.bjp.org/en/home/login'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                size='lg'
                className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300'
              >
                <Users className='w-5 h-5 mr-2' />
                Join the Movement
              </Button>
            </a>

            <a href='#about'>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-white/70 text-white hover:bg-white hover:text-slate-800 font-semibold px-8 py-4 rounded-full backdrop-blur-sm bg-white/10 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300'
              >
                <Play className='w-5 h-5 mr-2' />
                Learn More
              </Button>
            </a>
          </motion.div>

          {/* Visitor Status Message (Optional) */}
          {(incrementLoading || getCountLoading) && (
            <motion.div
              variants={textVariants}
              className='text-white/70 text-sm flex items-center justify-center gap-2'
            >
              <div className='animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full'></div>
              Tracking visitor...
            </motion.div>
          )}

          {incrementError && (
            <motion.div
              variants={textVariants}
              className='text-red-400 text-sm'
            >
              Unable to track visitor count
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Carousel Navigation Dots */}
      <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20'>
        <div className='flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-1 border border-white/20'>
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className='p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300'
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            <Play
              className={`w-3 h-3 text-white ${
                isAutoPlaying ? "opacity-50" : "opacity-100"
              }`}
            />
          </button>

          {/* Dots */}
          <div className='flex space-x-3'>
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 h-3 bg-white rounded-full"
                    : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full'
                    layoutId='activeSlide'
                  />
                )}
              </button>
            ))}
          </div>

          {/* Progress indicator */}
          <div className='text-white/70 text-sm font-medium'>
            {currentIndex + 1}/{carouselImages.length}
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className='absolute inset-0 z-5 pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-white/30 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
