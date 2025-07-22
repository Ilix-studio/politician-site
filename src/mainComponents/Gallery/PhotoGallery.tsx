import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ZoomIn,
  Download,
  Share2,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BackNavigation } from "../AboutMe/BackNavigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Photo } from "@/types/photo.types";
import { categories, samplePhotos } from "@/MockData/photoGalleryData";

const PhotoGallery = () => {
  const [photos] = useState<Photo[]>(samplePhotos);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(samplePhotos);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");

  const [currentLightboxIndex, setCurrentLightboxIndex] = useState<number>(0);
  const [showMobileControls, setShowMobileControls] = useState<boolean>(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = photos;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (photo) => photo.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (photo) =>
          photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          photo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort photos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();

        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredPhotos(filtered);
  }, [photos, selectedCategory, searchTerm, sortBy]);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: string) => {
    const newIndex =
      direction === "next"
        ? (currentLightboxIndex + 1) % filteredPhotos.length
        : currentLightboxIndex === 0
        ? filteredPhotos.length - 1
        : currentLightboxIndex - 1;

    setCurrentLightboxIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <BackNavigation />
      <section className='py-16 bg-gradient-to-br from-slate-50 to-white'>
        <div className='container mx-auto px-4'>
          <motion.div
            className='text-center mb-12'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4'>
              Photo Gallery
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-800 mb-4'>
              Moments from the Journey
            </h2>
            <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
              Capturing the essence of public service, community engagement, and
              transformative initiatives
            </p>
          </motion.div>

          {/* Mobile Filter Toggle Button */}
          <div className='lg:hidden mb-4'>
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-700 font-medium hover:bg-slate-50 transition-colors'
            >
              <Filter className='w-5 h-5' />
              Search & Filters
              {showMobileControls ? (
                <ChevronUp className='w-5 h-5' />
              ) : (
                <ChevronDown className='w-5 h-5' />
              )}
            </button>
          </div>

          {/* Controls */}
          <motion.div
            className={`flex-col lg:flex-row gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg border border-slate-100 ${
              showMobileControls ? "flex" : "hidden lg:flex"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search photos...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className='flex items-center gap-2'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              >
                <option value='date'>Sort by Date</option>
                <option value='likes'>Sort by Likes</option>
                <option value='views'>Sort by Views</option>
                <option value='title'>Sort by Title</option>
              </select>

              <div className='flex border border-slate-200 rounded-lg overflow-hidden'>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  <Grid3X3 className='w-5 h-5' />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  <List className='w-5 h-5' />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Photo Grid */}
          <motion.div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={cardVariants}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 ${
                  viewMode === "list" ? "flex" : ""
                }`}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-1/3" : "aspect-video"
                  } overflow-hidden`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute bottom-4 left-4 flex gap-2'>
                      <button
                        onClick={() => openLightbox(photo, index)}
                        className='p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors'
                      >
                        <ZoomIn className='w-4 h-4' />
                      </button>
                      <button className='p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors'>
                        <Share2 className='w-4 h-4' />
                      </button>
                      <button className='p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors'>
                        <Download className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className='absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full'>
                    {categories.find((cat) => cat.id === photo.category)?.name}
                  </div>
                </div>

                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className='text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors'>
                    {photo.title}
                  </h3>

                  <p className='text-slate-600 text-sm mb-4'>
                    {photo.description}
                  </p>

                  <div className='flex items-center gap-4 text-xs text-slate-500 mb-4'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      {formatDate(photo.date)}
                    </div>
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-4 h-4' />
                      {photo.location}
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 text-sm text-slate-500'></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredPhotos.length === 0 && (
            <motion.div
              className='text-center py-16'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className='text-6xl mb-4'>📸</div>
              <h3 className='text-2xl font-bold text-slate-600 mb-2'>
                No photos found
              </h3>
              <p className='text-slate-500'>
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div
                className='relative max-w-6xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className='absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>

                {/* Navigation */}
                <button
                  onClick={() => navigateLightbox("prev")}
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors'
                >
                  <ChevronLeft className='w-6 h-6' />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className='absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors'
                >
                  <ChevronRight className='w-6 h-6' />
                </button>

                <div className='flex flex-col lg:flex-row'>
                  <div className='lg:w-2/3'>
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.alt}
                      className='w-full h-auto max-h-96 lg:max-h-full object-cover'
                    />
                  </div>

                  <div className='lg:w-1/3 p-6'>
                    <h3 className='text-2xl font-bold text-slate-800 mb-4'>
                      {selectedPhoto.title}
                    </h3>

                    <p className='text-slate-600 mb-6'>
                      {selectedPhoto.description}
                    </p>

                    <div className='space-y-4 mb-6'>
                      <div className='flex items-center gap-2 text-slate-500'>
                        <Calendar className='w-5 h-5' />
                        {formatDate(selectedPhoto.date)}
                      </div>
                      <div className='flex items-center gap-2 text-slate-500'>
                        <MapPin className='w-5 h-5' />
                        {selectedPhoto.location}
                      </div>
                    </div>

                    <div className='flex items-center justify-between pt-4 border-t'>
                      <div className='flex gap-2'>
                        <button className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors'>
                          <Share2 className='w-5 h-5' />
                        </button>
                        <button className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors'>
                          <Download className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-12'>
          <Button
            variant='outline'
            size='lg'
            className='px-8 py-3 border-2 border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-all duration-300 font-semibold'
          >
            See More Videos
          </Button>
          <Link to='/video-gallery'>
            <Button
              size='lg'
              className='px-8 py-3 bg-[#138808] hover:bg-[#138808]/90 text-white font-semibold transition-all duration-300'
            >
              View All Videos
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default PhotoGallery;
