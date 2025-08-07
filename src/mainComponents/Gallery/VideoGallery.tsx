// src/components/VideoGallery.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Calendar,
  Clock,
  Play,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetVideosQuery } from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { VideoQueryParams, getVideoCategoryName } from "@/types/video.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const VideoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [queryParams, setQueryParams] = useState<VideoQueryParams>({
    page: "1",
    limit: "24",
    category: "",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // API hooks
  const {
    data: videosData,
    isLoading,
    error,
    refetch,
  } = useGetVideosQuery(queryParams);
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("video");

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    switch (lowerName) {
      case "speech":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "initiative":
        return "bg-orange-100 text-orange-800";
      case "campaign":
        return "bg-red-100 text-red-800";
      case "press conference":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/view/video/${videoId}`);
  };

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: "1" }));
  };

  const handleCategoryFilter = (category: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: category === "all" ? "" : category,
      page: "1",
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const VideoSkeleton = () => (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-video w-full' />
      <CardContent className='p-4 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <div className='flex gap-2'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
        </div>
      </CardContent>
    </Card>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <div className='container mx-auto'>
          <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load videos. Please try again.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center mt-4'>
            <Button onClick={() => refetch()} variant='outline'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const videos = videosData?.data.videos || [];
  const pagination = videosData?.data.pagination;

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        {/* Header */}
        <div className='bg-white/95 backdrop-blur border-b'>
          <div className='container mx-auto px-4 py-6'>
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Video Gallery
              </h1>
              <p className='text-gray-600'>Explore our collection of videos</p>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    placeholder='Search videos...'
                    value={queryParams.search || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>

              <select
                value={queryParams.category || "all"}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className='w-48 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='all'>All Categories</option>
                {categoriesLoading ? (
                  <option value='' disabled>
                    Loading categories...
                  </option>
                ) : categoriesError ? (
                  <option value='' disabled>
                    Error loading categories
                  </option>
                ) : categories.length === 0 ? (
                  <option value='' disabled>
                    No categories available
                  </option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className='container mx-auto px-4 py-8'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 24 }, (_, i) => (
                <VideoSkeleton key={i} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className='text-center py-12'>
              <div className='max-w-md mx-auto'>
                <Play className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No videos found
                </h3>
                <p className='text-gray-500'>
                  {queryParams.search || queryParams.category
                    ? "Try adjusting your search or filter criteria."
                    : "No videos are available at the moment."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className='mb-6'>
                <p className='text-gray-600'>
                  Showing {videos.length} of {pagination?.totalVideos || 0}{" "}
                  videos
                  {queryParams.category && categories.length > 0 && (
                    <span className='ml-2'>
                      in{" "}
                      {
                        categories.find((c) => c._id === queryParams.category)
                          ?.name
                      }
                    </span>
                  )}
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {videos.map((video, index) => {
                  const categoryName = getVideoCategoryName(video.category);

                  return (
                    <motion.div
                      key={video._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleVideoClick(video._id)}
                      className={cn(
                        "cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 group",
                        hovered === index && "scale-105"
                      )}
                    >
                      <div className='relative aspect-video overflow-hidden'>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className='w-full h-full object-cover'
                        />

                        {/* Play Button Overlay */}
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                            <Play className='w-8 h-8 text-[#FF9933] ml-1' />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        <div className='absolute bottom-3 right-3'>
                          <Badge className='bg-black/75 text-white'>
                            {video.duration}
                          </Badge>
                        </div>

                        {/* Category Badge */}
                        <div className='absolute top-3 right-3'>
                          <Badge
                            variant='secondary'
                            className={getCategoryColor(categoryName)}
                          >
                            {categoryName}
                          </Badge>
                        </div>

                        {/* Hover Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <div className='absolute bottom-4 left-4 text-white'>
                            <h3 className='font-bold text-lg mb-1 line-clamp-2'>
                              {video.title}
                            </h3>
                            <div className='flex items-center gap-3 text-sm'>
                              <div className='flex items-center gap-1'>
                                <Calendar className='w-3 h-3' />
                                {formatDate(video.date)}
                              </div>
                              <div className='flex items-center gap-1'>
                                <Clock className='w-3 h-3' />
                                {video.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className='p-4'>
                        <h3 className='font-semibold text-gray-900 line-clamp-2 mb-2'>
                          {video.title}
                        </h3>

                        <div className='flex items-center justify-between text-sm text-gray-600 mb-2'>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {video.duration}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {formatDate(video.date)}
                          </div>
                        </div>

                        {video.description && (
                          <p className='text-sm text-gray-500 line-clamp-2'>
                            {video.description}
                          </p>
                        )}
                      </CardContent>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className='flex justify-center mt-8'>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>

                    <span className='text-sm text-gray-600 px-4'>
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <Button
                      variant='outline'
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoGallery;
