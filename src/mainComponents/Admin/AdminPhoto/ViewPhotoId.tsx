// src/components/ViewPhotoId.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  AlertCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useGetPhotoQuery } from "@/redux-store/services/photoApi";
import { Photo } from "@/types/photo.types";

const ViewPhotoId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const { data: photoData, isLoading, error } = useGetPhotoQuery(id!);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get category name
  const getCategoryName = (category: Photo["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (!photoData?.success) return;

    const photo =
      "photo" in photoData.data ? photoData.data.photo : photoData.data;

    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!id) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Photo ID not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-10' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>
          <Card>
            <CardContent className='p-6 space-y-6'>
              <Skeleton className='h-8 w-3/4' />
              <Skeleton className='w-full h-96' />
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
              </div>
              <Skeleton className='h-20 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !photoData?.success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load photo. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle the union type from PhotoResponse
  const photo =
    "photo" in photoData.data ? photoData.data.photo : photoData.data;

  // Get the current image from the images array
  const currentImage = photo.images?.[currentImageIndex];
  const imageSrc = currentImage?.src || "";
  const imageAlt = currentImage?.alt || photo.title;

  const nextImage = () => {
    if (photo.images && currentImageIndex < photo.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <Button variant='ghost' onClick={handleBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleShare}>
              <Share2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto p-4 pt-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-4xl mx-auto'
        >
          <Card className='overflow-hidden shadow-xl'>
            <CardContent className='p-0'>
              {/* Photo Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-2'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                      {photo.title}
                    </h1>
                    <Badge variant='outline' className='text-sm'>
                      {getCategoryName(photo.category).toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Photo Image with Slider */}
              <div className='relative'>
                {imageSrc ? (
                  <div className='relative group'>
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className='w-full h-auto max-h-96 object-contain bg-gray-100 cursor-pointer'
                      onClick={() => openLightbox(currentImageIndex)}
                    />

                    {/* Navigation arrows for multiple images */}
                    {photo.images && photo.images.length > 1 && (
                      <>
                        <Button
                          variant='outline'
                          size='sm'
                          className='absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm'
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                        >
                          <ChevronLeft className='w-4 h-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          className='absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm'
                          onClick={nextImage}
                          disabled={
                            currentImageIndex === photo.images.length - 1
                          }
                        >
                          <ChevronRight className='w-4 h-4' />
                        </Button>

                        {/* Image counter */}
                        <div className='absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm'>
                          {currentImageIndex + 1} / {photo.images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className='w-full h-96 bg-gray-200 flex items-center justify-center'>
                    <span className='text-gray-500'>No image available</span>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {photo.images && photo.images.length > 1 && (
                <div className='p-6 pt-4'>
                  <div className='flex gap-2 overflow-x-auto pb-2'>
                    {photo.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-gray-400"
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
                </div>
              )}

              {/* Photo Details */}
              <div className='p-6 space-y-6'>
                {/* Meta Information */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                    <Calendar className='w-5 h-5 text-orange-500' />
                    <div>
                      <div className='text-sm font-medium text-gray-700'>
                        Date
                      </div>
                      <div className='text-sm text-gray-600'>
                        {formatDate(photo.date)}
                      </div>
                    </div>
                  </div>

                  {photo.location && (
                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                      <MapPin className='w-5 h-5 text-green-500' />
                      <div>
                        <div className='text-sm font-medium text-gray-700'>
                          Location
                        </div>
                        <div className='text-sm text-gray-600'>
                          {photo.location}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                    <div className='w-5 h-5 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold'>
                      {getCategoryName(photo.category).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-700'>
                        Category
                      </div>
                      <div className='text-sm text-gray-600 capitalize'>
                        {getCategoryName(photo.category)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {photo.description && (
                  <div>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900'>
                      Description
                    </h3>
                    <p className='text-gray-700 leading-relaxed'>
                      {photo.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lightbox Modal */}
          {showLightbox && photo.images && (
            <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
              <div className='relative max-w-4xl max-h-full'>
                {/* Close button */}
                <Button
                  variant='outline'
                  size='sm'
                  className='absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm'
                  onClick={() => setShowLightbox(false)}
                >
                  <X className='w-4 h-4' />
                </Button>

                {/* Main image */}
                <img
                  src={photo.images[currentImageIndex]?.src}
                  alt={photo.images[currentImageIndex]?.alt}
                  className='max-w-full max-h-full object-contain'
                />

                {/* Navigation */}
                {photo.images.length > 1 && (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className='w-4 h-4' />
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                      onClick={nextImage}
                      disabled={currentImageIndex === photo.images.length - 1}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>

                    {/* Counter */}
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded'>
                      {currentImageIndex + 1} / {photo.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ViewPhotoId;
