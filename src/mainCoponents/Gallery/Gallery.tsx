import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

import C from "./../../assets/Galleries/C.jpg";
import D from "./../../assets/Galleries/D.jpg";
import E from "./../../assets/Galleries/E.jpg";
import F from "./../../assets/Galleries/F.jpg";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

const galleryImages: GalleryImage[] = [
  { src: E, alt: "Community Meeting", title: "Community Meeting" },
  {
    src: "https://i.postimg.cc/FFMwLhMR/B.jpg",
    alt: "Inauguration Ceremony",
    title: "Inauguration Ceremony",
  },
  { src: D, alt: "Parliament Session", title: "Parliament Session" },
  {
    src: "https://i.postimg.cc/2yZJKtZr/A.jpg",
    alt: "Rural Visit",
    title: "Rural Visit",
  },
  { src: C, alt: "Public Rally", title: "Public Rally" },
  { src: F, alt: "School Visit", title: "School Visit" },
];

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;

    if (direction === "prev") {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? galleryImages.length - 1
          : selectedImageIndex - 1
      );
    } else {
      setSelectedImageIndex(
        selectedImageIndex === galleryImages.length - 1
          ? 0
          : selectedImageIndex + 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") navigateImage("prev");
    if (e.key === "ArrowRight") navigateImage("next");
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

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-1'>
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className='relative aspect-square group overflow-hidden rounded-lg shadow-md cursor-pointer'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                // onClick={() => openModal(index)}
                onHoverStart={() => openModal(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
                />

                {/* Desktop hover overlay */}
                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center'>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className='flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg'
                  >
                    <ZoomIn className='h-4 w-4' />
                    View Image
                  </motion.div>
                </div>

                {/* Mobile tap indicator */}
                <div className='absolute bottom-2 right-2 md:hidden'>
                  <div className='bg-black/70 backdrop-blur-sm p-1.5 rounded-full'>
                    <ZoomIn className='h-3 w-3 text-white' />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative max-w-5xl max-h-[90vh] w-full'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className='absolute -top-12 right-0 z-10 p-2 text-white hover:text-gray-300 transition-colors'
                aria-label='Close modal'
              >
                <X className='h-8 w-8' />
              </button>

              {/* Navigation Buttons */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className='absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors'
                    aria-label='Previous image'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className='absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors'
                    aria-label='Next image'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </>
              )}

              {/* Image Container */}
              <div className='relative bg-white rounded-lg overflow-hidden shadow-2xl'>
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={galleryImages[selectedImageIndex].src}
                  alt={galleryImages[selectedImageIndex].alt}
                  className='w-full h-auto max-h-[80vh] object-contain'
                />

                {/* Image Title */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6'>
                  <h3 className='text-white text-lg font-semibold'>
                    {galleryImages[selectedImageIndex].title}
                  </h3>
                  <p className='text-white/80 text-sm mt-1'>
                    {selectedImageIndex + 1} of {galleryImages.length}
                  </p>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {galleryImages.length > 1 && (
                <div className='flex justify-center gap-2 mt-4 px-4'>
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                        index === selectedImageIndex
                          ? "ring-2 ring-white scale-110"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className='w-full h-full object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
