import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import C from "./../../assets/Galleries/C.jpg";
import D from "./../../assets/Galleries/D.jpg";
import E from "./../../assets/Galleries/E.jpg";
import F from "./../../assets/Galleries/F.jpg";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees?: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: E,
    alt: "Community Meeting",
    title: "Community Meeting",
    description:
      "Engaging with local community leaders and residents to discuss infrastructure development plans and address their concerns.",
    date: "March 15, 2024",
    location: "Sarupathar Community Hall",
    attendees: "150+ residents",
  },
  {
    id: "2",
    src: "https://i.postimg.cc/FFMwLhMR/B.jpg",
    alt: "Inauguration Ceremony",
    title: "Inauguration Ceremony",
    description:
      "Opening ceremony of the new healthcare center, bringing modern medical facilities closer to our rural communities.",
    date: "February 20, 2024",
    location: "Golaghat District",
    attendees: "300+ people",
  },
  {
    id: "3",
    src: D,
    alt: "Parliament Session",
    title: "Parliament Session",
    description:
      "Participating in crucial legislative discussions and representing the voice of Sarupathar constituency in the state assembly.",
    date: "January 10, 2024",
    location: "Assam Legislative Assembly",
    attendees: "All MLAs",
  },
  {
    id: "4",
    src: "https://i.postimg.cc/2yZJKtZr/A.jpg",
    alt: "Rural Visit",
    title: "Rural Visit",
    description:
      "Field visit to remote villages to assess development needs and ensure government schemes reach every household.",
    date: "December 5, 2023",
    location: "Remote Villages",
    attendees: "Village heads",
  },
  {
    id: "5",
    src: C,
    alt: "Public Rally",
    title: "Public Rally",
    description:
      "Massive public gathering to discuss development agenda and connect directly with the people of our constituency.",
    date: "November 18, 2023",
    location: "Central Ground",
    attendees: "5000+ supporters",
  },
  {
    id: "6",
    src: F,
    alt: "School Visit",
    title: "School Visit",
    description:
      "Inspecting educational facilities and interacting with students and teachers to improve the quality of education in our region.",
    date: "October 22, 2023",
    location: "Government High School",
    attendees: "200+ students",
  },
];

const Gallery = () => {
  const [active, setActive] = useState<GalleryImage | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const closeModal = () => {
    setActive(null);
  };

  return (
    <>
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
              Gallery
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Moments from the Journey
            </h2>
            <p className='text-muted-foreground mt-4 px-2'>
              A glimpse into our work, community engagement, and public events.
            </p>
          </div>

          {/* Expandable Grid Layout */}
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layoutId={`card-${image.id}`}
                  onClick={() => setActive(image)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-900 ease-out cursor-pointer",
                    hovered !== null &&
                      hovered !== index &&
                      "blur-sm scale-[0.98]"
                  )}
                >
                  <motion.div
                    layoutId={`image-${image.id}`}
                    className='absolute inset-0'
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className='w-full h-full object-cover'
                    />
                  </motion.div>
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                      hovered === index ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className='text-white'>
                      <h3 className='text-xl md:text-2xl font-bold mb-2'>
                        {image.title}
                      </h3>
                      <div className='flex items-center gap-4 text-sm opacity-90'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-4 w-4' />
                          {image.date}
                        </div>
                        <div className='flex items-center gap-1'>
                          <MapPin className='h-4 w-4' />
                          {image.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm h-full w-full z-50'
              onClick={closeModal}
            />
            <div className='fixed inset-0 grid place-items-center z-[100] p-4'>
              <motion.div
                layoutId={`card-${active.id}`}
                className='w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl'
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors'
                  onClick={closeModal}
                >
                  <X className='h-5 w-5 text-gray-800' />
                </motion.button>

                {/* Image */}
                <motion.div
                  layoutId={`image-${active.id}`}
                  className='relative h-64 md:h-96 w-full overflow-hidden'
                >
                  <img
                    src={active.src}
                    alt={active.alt}
                    className='w-full h-full object-cover'
                  />
                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                  {/* Title on Image */}
                  <div className='absolute bottom-6 left-6 text-white'>
                    <h2 className='text-3xl md:text-4xl font-bold mb-2'>
                      {active.title}
                    </h2>
                    <div className='flex flex-wrap items-center gap-4 text-sm opacity-90'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {active.date}
                      </div>
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {active.location}
                      </div>
                      {active.attendees && (
                        <div className='flex items-center gap-1'>
                          <Users className='h-4 w-4' />
                          {active.attendees}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className='p-6 md:p-8'>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <p className='text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6'>
                      {active.description}
                    </p>

                    {/* Details Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg'>
                      <div className='text-center'>
                        <Calendar className='h-6 w-6 mx-auto mb-2 text-[#FF9933]' />
                        <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                          Date
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {active.date}
                        </div>
                      </div>
                      <div className='text-center'>
                        <MapPin className='h-6 w-6 mx-auto mb-2 text-[#138808]' />
                        <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                          Location
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {active.location}
                        </div>
                      </div>
                      {active.attendees && (
                        <div className='text-center'>
                          <Users className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                          <div className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                            Attendees
                          </div>
                          <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {active.attendees}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
