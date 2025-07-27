// src/components/PhotoGallery.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPhotosQuery, PhotoQuery } from "@/redux-store/services/photoApi";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const PhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [queryParams, setQueryParams] = useState<PhotoQuery>({
    page: 1,
    limit: 24,
    category: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: photosData, isLoading, error } = useGetPhotosQuery(queryParams);

  const categories = [
    { value: "political-events", label: "Political Events" },
    { value: "community-service", label: "Community Service" },
    { value: "public-rallies", label: "Public Rallies" },
    { value: "meetings", label: "Meetings" },
    { value: "awards", label: "Awards" },
    { value: "personal", label: "Personal" },
    { value: "campaigns", label: "Campaigns" },
    { value: "speeches", label: "Speeches" },
    { value: "other", label: "Other" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePhotoClick = (photoId: string) => {
    navigate(`/view/photo/${photoId}`);
  };

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryFilter = (category: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: category === "all" ? "" : category,
      page: 1,
    }));
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
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='container mx-auto text-center py-12'>
          <p className='text-red-600'>Failed to load photos.</p>
        </div>
      </div>
    );
  }

  const photos = photosData?.data.photos || [];

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
                    placeholder='Search photos...'
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
                <PhotoSkeleton key={i} />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No photos found.</p>
            </div>
          ) : (
            <>
              <div className='mb-6'>
                <p className='text-gray-600'>
                  Showing {photos.length} of{" "}
                  {photosData?.data.pagination.total || 0} photos
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handlePhotoClick(photo._id)}
                    className={cn(
                      "cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300",
                      hovered === index && "scale-105"
                    )}
                  >
                    <div className='relative aspect-[4/3] overflow-hidden'>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'>
                        <div className='absolute bottom-4 left-4 text-white'>
                          <h3 className='font-bold text-lg mb-1'>
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
                                {photo.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className='p-4'>
                      <h3 className='font-semibold text-gray-900 line-clamp-1 mb-1'>
                        {photo.title}
                      </h3>
                      <p className='text-sm text-gray-600 capitalize'>
                        {photo.category.replace("-", " ")}
                      </p>
                      {photo.description && (
                        <p className='text-sm text-gray-500 line-clamp-2 mt-2'>
                          {photo.description}
                        </p>
                      )}
                    </CardContent>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {photosData?.data.pagination &&
                photosData.data.pagination.pages > 1 && (
                  <div className='flex justify-center mt-8 space-x-2'>
                    {Array.from(
                      { length: photosData.data.pagination.pages },
                      (_, i) => (
                        <Button
                          key={i + 1}
                          variant={
                            queryParams.page === i + 1 ? "default" : "outline"
                          }
                          size='sm'
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      )
                    )}
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
