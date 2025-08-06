// src/components/PhotoGallery.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Calendar, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Import from project knowledge - correct API hook and types
import { useGetPhotosQuery } from "@/redux-store/services/photoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { PhotosQueryParams, Photo } from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const PhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  // Use correct PhotosQueryParams type from project knowledge
  const [queryParams, setQueryParams] = useState<PhotosQueryParams>({
    page: 1,
    limit: 24,
    sortBy: "createdAt",
    sortOrder: "desc",
    // Don't include category or search if they're empty
  });

  // Build clean query params that only include non-empty values
  const cleanQueryParams = React.useMemo(() => {
    const params: PhotosQueryParams = {
      page: queryParams.page,
      limit: queryParams.limit,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
    };

    // Only include category if it's not empty and not "all"
    // Make sure to use the category ID, not "all"
    if (
      queryParams.category &&
      queryParams.category !== "all" &&
      queryParams.category.trim() !== ""
    ) {
      params.category = queryParams.category; // This will be the ObjectId
    }

    // Only include search if it's not empty
    if (queryParams.search && queryParams.search.trim() !== "") {
      params.search = queryParams.search;
    }

    return params;
  }, [queryParams]);

  // Use the correct API hook with clean params
  const {
    data: photosData,
    isLoading,
    error,
    refetch,
  } = useGetPhotosQuery(cleanQueryParams);

  // Fetch photo categories dynamically from API
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("photo");

  // Debug logs to help troubleshoot
  useEffect(() => {
    console.log("Query params being sent:", cleanQueryParams);
  }, [cleanQueryParams]);

  useEffect(() => {
    console.log("Categories loaded:", categories);
  }, [categories]);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get photo category name - handles both string and object types
  const getPhotoCategoryName = (category: Photo["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  // Helper function to get the main photo image
  const getPhotoMainImage = (photo: Photo) => {
    return photo.images && photo.images.length > 0
      ? photo.images[0]
      : {
          src: "/placeholder-image.jpg",
          alt: photo.title,
          cloudinaryPublicId: "",
        };
  };

  const handlePhotoClick = (photoId: string) => {
    navigate(`/view/photo/${photoId}`);
  };

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: search.trim(), // Trim whitespace
      page: 1,
    }));
  };

  // Fixed category filter handler
  const handleCategoryFilter = (category: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category, // Keep the ObjectId
      page: 1,
    }));
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split("-");
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      page: 1,
    }));
  };

  // Fixed clearAllFilters function
  const clearAllFilters = () => {
    setQueryParams({
      page: 1,
      limit: 24,
      sortBy: "createdAt",
      sortOrder: "desc",
      // Remove category and search entirely, don't set to undefined
    });
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PhotoSkeleton = () => (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-[4/3] w-full' />
      <CardContent className='p-4 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-3 w-1/3' />
      </CardContent>
    </Card>
  );

  // Error state with retry functionality
  if (error || categoriesError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <div className='container mx-auto text-center py-12'>
          <Alert variant='destructive' className='max-w-md mx-auto mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {error ? "Failed to load photos." : "Failed to load categories."}{" "}
              Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} variant='outline' className='gap-2'>
            <RefreshCw className='w-4 h-4' />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Extract photos with proper error handling based on project knowledge structure
  const photos = photosData?.data?.photos || [];
  const pagination = photosData?.data?.pagination;

  // Get the current category display value
  const currentCategoryValue = queryParams.category || "all";

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        {/* Header */}
        <div className='bg-white/95 backdrop-blur border-b sticky top-0 z-10'>
          <div className='container mx-auto px-4 py-6'>
            <div className='text-center mb-6'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                Photo Gallery
              </h1>
              <p className='text-gray-600'>
                Explore our collection of memorable moments and events
              </p>
            </div>

            {/* Filters */}
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    placeholder='Search photos by title, location, or description...'
                    value={queryParams.search || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>

              <div className='flex gap-2'>
                <select
                  value={currentCategoryValue}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  disabled={categoriesLoading}
                  className='w-48 px-2 py-2 border rounded-md bg-white text-sm'
                >
                  <option value='' disabled hidden>
                    {categoriesLoading ? "Loading..." : "Filter by category"}
                  </option>
                  <option value='all'>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className='w-48 px-2 py-2 border rounded-md bg-white text-sm'
                >
                  <option value='createdAt-desc'>Newest First</option>
                  <option value='createdAt-asc'>Oldest First</option>
                  <option value='title-asc'>Title A-Z</option>
                  <option value='title-desc'>Title Z-A</option>
                  <option value='date-desc'>Date (Recent)</option>
                  <option value='date-asc'>Date (Oldest)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className='container mx-auto px-4 py-8'>
          {isLoading || categoriesLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 24 }, (_, i) => (
                <PhotoSkeleton key={i} />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className='text-center py-12'>
              <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Search className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No photos found
              </h3>
              <p className='text-gray-500 mb-4'>
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Button onClick={clearAllFilters} variant='outline'>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Results summary */}
              <div className='mb-6 flex justify-between items-center'>
                <p className='text-gray-600'>
                  Showing {photos.length} of {pagination?.total || 0} photos
                  {queryParams.search && (
                    <span className='ml-2 text-sm'>
                      for "{queryParams.search}"
                    </span>
                  )}
                  {/* Fixed results summary to properly display category names */}
                  {queryParams.category && queryParams.category !== "all" && (
                    <span className='ml-2 text-sm'>
                      in{" "}
                      {categories.find((c) => c._id === queryParams.category)
                        ?.name || "Unknown Category"}
                    </span>
                  )}
                </p>

                {(queryParams.search ||
                  (queryParams.category && queryParams.category !== "all")) && (
                  <Button onClick={clearAllFilters} variant='ghost' size='sm'>
                    Clear All Filters
                  </Button>
                )}
              </div>

              {/* Photo Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {photos.map((photo, index) => {
                  const mainImage = getPhotoMainImage(photo);
                  const categoryName = getPhotoCategoryName(photo.category);

                  return (
                    <motion.div
                      key={photo._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handlePhotoClick(photo._id)}
                      className={cn(
                        "cursor-pointer rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 group",
                        hovered === index && "scale-105 shadow-2xl"
                      )}
                    >
                      <div className='relative aspect-[4/3] overflow-hidden'>
                        <img
                          src={mainImage.src}
                          alt={mainImage.alt}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                          loading='lazy'
                        />

                        {/* Category badge */}
                        <div className='absolute top-3 left-3'>
                          <span className='px-2 py-1 bg-white/90 backdrop-blur text-gray-800 rounded-full text-xs font-medium'>
                            {categoryName}
                          </span>
                        </div>

                        {/* Multiple photos indicator */}
                        {photo.images && photo.images.length > 1 && (
                          <div className='absolute top-3 right-3'>
                            <span className='px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium'>
                              +{photo.images.length - 1}
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <div className='absolute bottom-4 left-4 right-4 text-white'>
                            <h3 className='font-bold text-lg mb-1 line-clamp-2'>
                              {photo.title}
                            </h3>
                            <div className='flex items-center gap-3 text-sm'>
                              <div className='flex items-center gap-1'>
                                <Calendar className='w-3 h-3' />
                                {formatDate(photo.date)}
                              </div>
                              {photo.location && (
                                <div className='flex items-center gap-1'>
                                  <MapPin className='w-3 h-3' />
                                  <span className='truncate'>
                                    {photo.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card content */}
                      <CardContent className='p-4'>
                        <h3 className='font-semibold text-gray-900 line-clamp-1 mb-1'>
                          {photo.title}
                        </h3>
                        <p className='text-sm text-gray-600 mb-2'>
                          {categoryName}
                        </p>
                        {photo.description && (
                          <p className='text-sm text-gray-500 line-clamp-2'>
                            {photo.description}
                          </p>
                        )}
                        {photo.location && (
                          <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                            <MapPin className='w-3 h-3' />
                            {photo.location}
                          </p>
                        )}
                      </CardContent>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className='flex justify-center items-center mt-12 space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => handlePageChange(queryParams.page! - 1)}
                    disabled={!pagination.hasPrev || isLoading}
                  >
                    Previous
                  </Button>

                  <div className='flex space-x-1'>
                    {Array.from(
                      { length: Math.min(pagination.pages, 5) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (queryParams.page! <= 3) {
                          pageNum = i + 1;
                        } else if (queryParams.page! >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = queryParams.page! - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              queryParams.page === pageNum
                                ? "default"
                                : "outline"
                            }
                            size='sm'
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant='outline'
                    onClick={() => handlePageChange(queryParams.page! + 1)}
                    disabled={!pagination.hasNext || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PhotoGallery;
