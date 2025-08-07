import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Loader2,
  Play,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import API hooks from project knowledge
import {
  useGetPhotosQuery,
  useGetPhotosByCategoryQuery,
} from "@/redux-store/services/photoApi";
import {
  useGetVideosByCategoryQuery,
  useGetVideosQuery,
} from "@/redux-store/services/videoApi";

// Import types from project knowledge
import { Video, getVideoCategoryName } from "@/types/video.types";
import { Photo } from "@/types/photo.types";
import { getCategoryColor } from "./getColor";

const Gallery = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // API hooks for photos with proper types from project knowledge
  const {
    data: photosData,
    isLoading: loadingPhotos,
    error: photosError,
  } = useGetPhotosQuery({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // API hook for category-filtered photos - use category name for photos
  const {
    data: categoryPhotosData,
    isLoading: loadingCategoryPhotos,
    error: categoryPhotosError,
  } = useGetPhotosByCategoryQuery(
    {
      category: selectedCategory!,
      limit: 50,
    },
    {
      skip: !selectedCategory || activeTab !== "photos",
    }
  );

  // API hooks for videos with proper types from project knowledge
  const {
    data: videosData,
    isLoading: loadingVideos,
    error: videosError,
  } = useGetVideosQuery({
    page: "1",
    limit: "20",
    sortBy: "date",
    sortOrder: "desc",
  });

  // API hook for category-filtered videos
  const {
    data: categoryVideosData,
    isLoading: loadingCategoryVideos,
    error: categoryVideosError,
  } = useGetVideosByCategoryQuery(
    {
      category: selectedCategory!,
      limit: 50,
    },
    {
      skip: !selectedCategory || activeTab !== "videos",
    }
  );

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get photo category name
  const getPhotoCategoryName = (category: Photo["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  // Helper function to get photo category ID
  // const getPhotoCategoryId = (category: Photo["category"]): string => {
  //   if (typeof category === "string") {
  //     return category;
  //   }
  //   return category._id;
  // };

  // Helper function to get video category ID
  const getVideoCategoryId = (category: Video["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category._id;
  };

  // Helper function to get photo primary image
  const getPhotoMainImage = (photo: Photo) => {
    return photo.images && photo.images.length > 0
      ? photo.images[0]
      : { src: "/placeholder-image.jpg", alt: photo.title };
  };

  const handlePhotoClick = (photo: Photo) => {
    navigate(`/view/photo/${photo._id}`);
  };

  const handleVideoClick = (video: Video) => {
    navigate(`/view/video/${video._id}`);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  const isLoading =
    loadingPhotos ||
    loadingVideos ||
    loadingCategoryPhotos ||
    loadingCategoryVideos;
  const hasError =
    photosError || videosError || categoryPhotosError || categoryVideosError;

  // Loading state
  if (isLoading && !selectedCategory) {
    return (
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
          <div className='flex justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-[#138808]' />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (hasError) {
    return (
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
              Gallery
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Moments from the Journey
            </h2>
          </div>
          <Alert variant='destructive' className='max-w-md mx-auto'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load gallery content. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // Extract data with proper error handling
  const photos =
    selectedCategory && activeTab === "photos"
      ? categoryPhotosData?.data?.photos || []
      : photosData?.data?.photos || [];

  const videos =
    selectedCategory && activeTab === "videos"
      ? categoryVideosData?.data?.videos || []
      : videosData?.data?.videos || [];

  // Get category name for filtered view
  const selectedCategoryName = selectedCategory
    ? activeTab === "photos" && photos[0]
      ? getPhotoCategoryName(photos[0].category)
      : activeTab === "videos" && videos[0]
      ? getVideoCategoryName(videos[0].category)
      : "Category"
    : null;

  return (
    <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
      <div className='container px-4 sm:px-6'>
        <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
          <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
            Gallery
          </div>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
            {selectedCategory
              ? `${selectedCategoryName} ${
                  activeTab === "photos" ? "Photos" : "Videos"
                }`
              : "Moments from the Journey"}
          </h2>
          <p className='text-muted-foreground mt-4 px-2'>
            {selectedCategory
              ? `${
                  activeTab === "photos" ? "Photos" : "Videos"
                } from ${selectedCategoryName} category`
              : "A glimpse into our work, community engagement, and public events."}
          </p>
          {selectedCategory && (
            <button
              onClick={clearCategoryFilter}
              className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <X className='w-4 h-4' />
              Back to {activeTab === "photos" ? "Photos" : "Videos"}
            </button>
          )}
        </div>

        {selectedCategory ? (
          // Category filtered view
          <div className='w-full'>
            {(loadingCategoryPhotos && activeTab === "photos") ||
            (loadingCategoryVideos && activeTab === "videos") ? (
              <div className='flex justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-[#138808]' />
              </div>
            ) : (activeTab === "photos" ? photos : videos).length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground text-lg'>
                  No {activeTab} available in this category.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto'>
                {activeTab === "photos"
                  ? photos.map((photo) => {
                      const mainImage = getPhotoMainImage(photo);
                      const categoryName = getPhotoCategoryName(photo.category);

                      return (
                        <motion.div
                          key={photo._id}
                          onClick={() => handlePhotoClick(photo)}
                          className={cn(
                            "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer"
                          )}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className='absolute inset-0'>
                            <img
                              src={mainImage.src}
                              alt={mainImage.alt}
                              className='w-full h-full object-cover'
                              loading='lazy'
                            />
                          </div>

                          {/* Category badge */}
                          <div className='absolute top-4 left-4'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                categoryName
                              )}`}
                            >
                              {categoryName.charAt(0).toUpperCase() +
                                categoryName.slice(1)}
                            </span>
                          </div>

                          {/* Hover overlay */}
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300"
                            )}
                          >
                            <div className='text-white'>
                              <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                {photo.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm opacity-90'>
                                <div className='flex items-center gap-1'>
                                  <Calendar className='h-4 w-4' />
                                  {formatDate(photo.date)}
                                </div>
                                {photo.location && (
                                  <div className='flex items-center gap-1'>
                                    <MapPin className='h-4 w-4' />
                                    <span className='truncate max-w-24'>
                                      {photo.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {photo.images && photo.images.length > 1 && (
                                <div className='mt-2 text-xs opacity-75'>
                                  +{photo.images.length - 1} more photos
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  : videos.map((video) => {
                      const categoryName = getVideoCategoryName(video.category);

                      return (
                        <motion.div
                          key={video._id}
                          onClick={() => handleVideoClick(video)}
                          className={cn(
                            "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer group"
                          )}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className='absolute inset-0'>
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className='w-full h-full object-cover'
                              loading='lazy'
                            />

                            {/* Play button overlay */}
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                                <Play
                                  className='w-8 h-8 text-[#FF9933] ml-1'
                                  fill='currentColor'
                                />
                              </div>
                            </div>
                          </div>

                          {/* Category badge */}
                          <div className='absolute top-4 left-4'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                categoryName
                              )}`}
                            >
                              {categoryName.charAt(0).toUpperCase() +
                                categoryName.slice(1)}
                            </span>
                          </div>

                          {/* Hover overlay */}
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300"
                            )}
                          >
                            <div className='text-white'>
                              <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                {video.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm opacity-90 flex-wrap'>
                                <div className='flex items-center gap-1'>
                                  <Calendar className='h-4 w-4' />
                                  {formatDate(video.date)}
                                </div>
                                {video.duration && (
                                  <div className='flex items-center gap-1'>
                                    <Clock className='h-4 w-4' />
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                              {video.description && (
                                <p className='mt-2 text-xs opacity-75 line-clamp-2'>
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
              </div>
            )}
          </div>
        ) : (
          // Regular gallery view with tabs
          <Tabs
            defaultValue='photos'
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "photos" | "videos")
            }
            className='w-full'
          >
            <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-8'>
              <TabsTrigger value='photos' className='flex items-center gap-2'>
                <span>📸</span>
                Photos ({photos.length})
              </TabsTrigger>
              <TabsTrigger value='videos' className='flex items-center gap-2'>
                <Play className='w-4 h-4' />
                Videos ({videos.length})
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab Content */}
            <TabsContent value='photos' className='w-full'>
              {photos.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-muted-foreground text-lg'>
                    No photos available at the moment.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                  {photos.map((photo) => {
                    const mainImage = getPhotoMainImage(photo);
                    const categoryName = getPhotoCategoryName(photo.category);
                    // const categoryId = getPhotoCategoryId(photo.category);

                    return (
                      <motion.div
                        key={photo._id}
                        className={cn(
                          "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out"
                        )}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className='absolute inset-0 cursor-pointer'
                          onClick={() => handlePhotoClick(photo)}
                        >
                          <img
                            src={mainImage.src}
                            alt={mainImage.alt}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        </div>

                        {/* Category badge with view all button */}
                        <div className='absolute top-4 left-4 flex items-center gap-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              categoryName
                            )}`}
                          >
                            {categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)}
                          </span>
                          <button
                            className='text-xs text-white bg-black/50 px-2 py-1 rounded cursor-pointer underline hover:bg-black/70 transition-colors'
                            onClick={(e) => {
                              e.stopPropagation();
                              // For photos, send category name instead of ID to match API expectation
                              handleCategoryFilter(categoryName);
                            }}
                          >
                            view All
                          </button>
                        </div>

                        {/* Hover overlay */}
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none"
                          )}
                        >
                          <div className='text-white'>
                            <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                              {photo.title}
                            </h3>
                            <div className='flex items-center gap-4 text-sm opacity-90'>
                              <div className='flex items-center gap-1'>
                                <Calendar className='h-4 w-4' />
                                {formatDate(photo.date)}
                              </div>
                              {photo.location && (
                                <div className='flex items-center gap-1'>
                                  <MapPin className='h-4 w-4' />
                                  <span className='truncate max-w-24'>
                                    {photo.location}
                                  </span>
                                </div>
                              )}
                            </div>
                            {photo.images && photo.images.length > 1 && (
                              <div className='mt-2 text-xs opacity-75'>
                                +{photo.images.length - 1} more photos
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Videos Tab Content */}
            <TabsContent value='videos' className='w-full'>
              {videos.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-muted-foreground text-lg'>
                    No videos available at the moment.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                  {videos.map((video) => {
                    const categoryName = getVideoCategoryName(video.category);
                    const categoryId = getVideoCategoryId(video.category);

                    return (
                      <motion.div
                        key={video._id}
                        className={cn(
                          "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer group"
                        )}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className='absolute inset-0'
                          onClick={() => handleVideoClick(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />

                          {/* Play button overlay */}
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                              <Play
                                className='w-8 h-8 text-[#FF9933] ml-1'
                                fill='currentColor'
                              />
                            </div>
                          </div>
                        </div>

                        {/* Category badge with view all button */}
                        <div className='absolute top-4 left-4 flex items-center gap-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              categoryName
                            )}`}
                          >
                            {categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)}
                          </span>
                          <button
                            className='text-xs text-white bg-black/50 px-2 py-1 rounded cursor-pointer underline hover:bg-black/70 transition-colors'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryFilter(categoryId);
                            }}
                          >
                            view All
                          </button>
                          {video.featured && (
                            <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium'>
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Hover overlay */}
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none"
                          )}
                        >
                          <div className='text-white'>
                            <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                              {video.title}
                            </h3>
                            <div className='flex items-center gap-4 text-sm opacity-90 flex-wrap'>
                              <div className='flex items-center gap-1'>
                                <Calendar className='h-4 w-4' />
                                {formatDate(video.date)}
                              </div>
                              {video.duration && (
                                <div className='flex items-center gap-1'>
                                  <Clock className='h-4 w-4' />
                                  {video.duration}
                                </div>
                              )}
                            </div>
                            {video.description && (
                              <p className='mt-2 text-xs opacity-75 line-clamp-2'>
                                {video.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* See More Button */}
            <div className='text-center mt-8'>
              <button
                onClick={() => {
                  if (activeTab === "photos") {
                    navigate("/photo-gallery");
                  } else {
                    navigate("/video-gallery");
                  }
                }}
                className='px-6 py-3 bg-white text-black font-medium rounded-lg hover:from-[#FF9933]/90 hover:to-[#138808]/90 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                See More {activeTab === "photos" ? "Photos" : "Videos"}
              </button>
            </div>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default Gallery;
