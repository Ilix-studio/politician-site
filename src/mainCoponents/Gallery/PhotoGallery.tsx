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
  Heart,
  Eye,
} from "lucide-react";
import { BackNavigation } from "../AboutMe/BackNavigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Type definitions
interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// Sample photo data - replace with your actual images
const samplePhotos: Photo[] = [
  {
    id: 1,
    src: "/api/placeholder/400/300",
    alt: "Community Meeting",
    title: "Community Development Meeting",
    category: "meetings",
    date: "2024-03-15",
    location: "Sarupathar Community Hall",
    description:
      "Engaging with local leaders to discuss infrastructure improvements and community needs.",
    tags: ["community", "development", "meeting"],
    likes: 156,
    views: 892,
  },
  {
    id: 2,
    src: "/api/placeholder/400/300",
    alt: "School Inauguration",
    title: "New School Inauguration Ceremony",
    category: "education",
    date: "2024-02-28",
    location: "Village Primary School",
    description:
      "Inaugurating a new primary school building to enhance educational facilities in rural areas.",
    tags: ["education", "inauguration", "development"],
    likes: 203,
    views: 1247,
  },
  {
    id: 3,
    src: "/api/placeholder/400/300",
    alt: "Healthcare Initiative",
    title: "Mobile Health Clinic Launch",
    category: "healthcare",
    date: "2024-01-20",
    location: "Rural Health Center",
    description:
      "Launching mobile health clinics to provide medical services to remote villages.",
    tags: ["healthcare", "rural", "service"],
    likes: 178,
    views: 934,
  },
  {
    id: 4,
    src: "/api/placeholder/400/300",
    alt: "Cultural Festival",
    title: "Assamese Cultural Festival",
    category: "culture",
    date: "2024-04-10",
    location: "Cultural Center",
    description:
      "Celebrating Assamese heritage and promoting local arts and traditions.",
    tags: ["culture", "festival", "heritage"],
    likes: 312,
    views: 1856,
  },
  {
    id: 5,
    src: "/api/placeholder/400/300",
    alt: "Infrastructure Project",
    title: "Road Development Project",
    category: "infrastructure",
    date: "2024-01-05",
    location: "Highway Construction Site",
    description:
      "Overseeing the construction of new roads to improve connectivity in rural areas.",
    tags: ["infrastructure", "roads", "development"],
    likes: 145,
    views: 723,
  },
  {
    id: 6,
    src: "/api/placeholder/400/300",
    alt: "Youth Program",
    title: "Youth Skill Development Program",
    category: "youth",
    date: "2024-03-22",
    location: "Training Center",
    description:
      "Launching skill development programs for youth to enhance employment opportunities.",
    tags: ["youth", "skills", "employment"],
    likes: 267,
    views: 1134,
  },
  {
    id: 7,
    src: "/api/placeholder/400/300",
    alt: "Agricultural Meet",
    title: "Farmers' Advisory Meeting",
    category: "agriculture",
    date: "2024-02-14",
    location: "Agricultural Extension Office",
    description:
      "Discussing modern farming techniques and government support for farmers.",
    tags: ["agriculture", "farmers", "advisory"],
    likes: 189,
    views: 876,
  },
  {
    id: 8,
    src: "/api/placeholder/400/300",
    alt: "Women Empowerment",
    title: "Women Entrepreneurship Workshop",
    category: "social",
    date: "2024-03-08",
    location: "Women's Development Center",
    description:
      "Empowering women through entrepreneurship and skill development programs.",
    tags: ["women", "empowerment", "workshop"],
    likes: 234,
    views: 1345,
  },
];

const categories: Category[] = [
  { id: "all", name: "All Photos", count: samplePhotos.length },
  {
    id: "meetings",
    name: "Meetings",
    count: samplePhotos.filter((p) => p.category === "meetings").length,
  },
  {
    id: "education",
    name: "Education",
    count: samplePhotos.filter((p) => p.category === "education").length,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    count: samplePhotos.filter((p) => p.category === "healthcare").length,
  },
  {
    id: "culture",
    name: "Culture",
    count: samplePhotos.filter((p) => p.category === "culture").length,
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    count: samplePhotos.filter((p) => p.category === "infrastructure").length,
  },
  {
    id: "youth",
    name: "Youth",
    count: samplePhotos.filter((p) => p.category === "youth").length,
  },
  {
    id: "agriculture",
    name: "Agriculture",
    count: samplePhotos.filter((p) => p.category === "agriculture").length,
  },
  {
    id: "social",
    name: "Social",
    count: samplePhotos.filter((p) => p.category === "social").length,
  },
];

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(samplePhotos);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState<number>(0);

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
          photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          photo.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Sort photos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "likes":
          return b.likes - a.likes;
        case "views":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredPhotos(filtered);
  }, [photos, selectedCategory, searchTerm, sortBy]);

  const handleLike = (photoId: number) => {
    const newLikedPhotos = new Set(likedPhotos);
    if (newLikedPhotos.has(photoId)) {
      newLikedPhotos.delete(photoId);
    } else {
      newLikedPhotos.add(photoId);
    }
    setLikedPhotos(newLikedPhotos);

    // Update photo likes count
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              likes: newLikedPhotos.has(photoId)
                ? photo.likes + 1
                : photo.likes - 1,
            }
          : photo
      )
    );
  };

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
          {/* Header */}
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

          {/* Controls */}
          <motion.div
            className='flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg border border-slate-100'
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

                  <div className='flex flex-wrap gap-1 mb-4'>
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                      <div className='flex items-center gap-1'>
                        <Eye className='w-4 h-4' />
                        {photo.views}
                      </div>
                      <button
                        onClick={() => handleLike(photo.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          likedPhotos.has(photo.id)
                            ? "text-red-500"
                            : "hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedPhotos.has(photo.id) ? "fill-red-500" : ""
                          }`}
                        />
                        {photo.likes}
                      </button>
                    </div>
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

                    <div className='flex flex-wrap gap-2 mb-6'>
                      {selectedPhoto.tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className='flex items-center justify-between pt-4 border-t'>
                      <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1 text-slate-500'>
                          <Eye className='w-5 h-5' />
                          {selectedPhoto.views}
                        </div>
                        <button
                          onClick={() => handleLike(selectedPhoto.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            likedPhotos.has(selectedPhoto.id)
                              ? "text-red-500"
                              : "hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedPhotos.has(selectedPhoto.id)
                                ? "fill-red-500"
                                : ""
                            }`}
                          />
                          {selectedPhoto.likes}
                        </button>
                      </div>

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
