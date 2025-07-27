// src/components/VideoGallery.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Clock, Eye, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetVideosQuery } from "@/redux-store/services/videoApi";
import { VideoQueryParams } from "@/types/video.types";
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

  const { data: videosData, isLoading, error } = useGetVideosQuery(queryParams);

  const categories = [
    { value: "speech", label: "Speeches" },
    { value: "event", label: "Events" },
    { value: "interview", label: "Interviews" },
    { value: "initiative", label: "Initiatives" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='container mx-auto text-center py-12'>
          <p className='text-red-600'>Failed to load videos.</p>
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
              <Select
                value={queryParams.category || "all"}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Filter by category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <p className='text-gray-500 text-lg'>No videos found.</p>
            </div>
          ) : (
            <>
              <div className='mb-6'>
                <p className='text-gray-600'>
                  Showing {videos.length} of {pagination?.totalVideos || 0}{" "}
                  videos
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {videos.map((video, index) => (
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

                      {/* Category Badge */}
                      <div className='absolute top-3 right-3'>
                        <Badge
                          variant='secondary'
                          className='bg-white/90 text-gray-800'
                        >
                          {video.category.charAt(0).toUpperCase() +
                            video.category.slice(1)}
                        </Badge>
                      </div>

                      {/* Featured Badge */}
                      {video.featured && (
                        <div className='absolute top-3 left-3'>
                          <Badge className='bg-yellow-500 text-white'>
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'>
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
                        {video.views && (
                          <div className='flex items-center gap-1'>
                            <Eye className='w-3 h-3' />
                            {video.views.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {video.description && (
                        <p className='text-sm text-gray-500 line-clamp-2'>
                          {video.description}
                        </p>
                      )}
                    </CardContent>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className='flex justify-center mt-8 space-x-2'>
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={
                        parseInt(queryParams.page || "1") === i + 1
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
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
