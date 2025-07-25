// src/components/ViewPhotoId.tsx
import React from "react";
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
  Download,
} from "lucide-react";
import { useGetPhotoQuery } from "@/redux-store/services/photoApi";

const ViewPhotoId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: photoData, isLoading, error } = useGetPhotoQuery(id!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleShare = async () => {
    if (navigator.share && photoData?.data) {
      try {
        await navigator.share({
          title: photoData.data.title,
          text: photoData.data.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (photoData?.data) {
      const link = document.createElement("a");
      link.href = photoData.data.src;
      link.download = `${photoData.data.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          {/* Header Skeleton */}
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-10' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>

          {/* Main Content Skeleton */}
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

  const photo = photoData.data;

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
            <Button variant='outline' size='sm' onClick={handleDownload}>
              <Download className='w-4 h-4' />
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
                      {photo.category.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Photo Image */}
              <div className='relative'>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className='w-full h-auto max-h-96 object-contain bg-gray-100'
                />
              </div>

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
                      {photo.category.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-700'>
                        Category
                      </div>
                      <div className='text-sm text-gray-600 capitalize'>
                        {photo.category.replace("-", " ")}
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
                \{/* Photo Metadata */}
                <div className='pt-6 border-t border-gray-200'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500'>
                    <div>
                      <span className='font-medium'>Photo ID:</span> {photo._id}
                    </div>
                    <div>
                      <span className='font-medium'>Published:</span>{" "}
                      {formatDate(photo.createdAt)}
                    </div>
                    <div>
                      <span className='font-medium'>Last Updated:</span>{" "}
                      {formatDate(photo.updatedAt)}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>
                      <Badge
                        variant={photo.isActive ? "default" : "secondary"}
                        className='ml-1 text-xs'
                      >
                        {photo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewPhotoId;
