import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useGetPhotoQuery } from "@/redux-store/services/photoApi";

export interface PhotoViewProps {
  photoId: string;
  onEdit?: (photo: any) => void;
  onDelete?: (photoId: string) => void;
  onBack?: () => void;
  showActions?: boolean;
}

const PhotoView: React.FC<PhotoViewProps> = ({
  photoId,
  onEdit,
  onDelete,
  onBack,
  showActions = true,
}) => {
  const { data: photoData, isLoading, error } = useGetPhotoQuery(photoId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card className='max-w-7xl mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-8 w-64' />
            {onBack && (
              <Button variant='outline' size='sm' onClick={onBack}>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Skeleton className='w-full h-96' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
          </div>
          <Skeleton className='h-20 w-full' />
        </CardContent>
      </Card>
    );
  }

  if (error || !photoData?.success) {
    return (
      <Alert variant='destructive' className='max-w-4xl mx-auto'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Failed to load photo. Please try again later.
        </AlertDescription>
        {onBack && (
          <Button variant='outline' size='sm' onClick={onBack} className='mt-2'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
        )}
      </Alert>
    );
  }

  const photo = photoData.data;

  return (
    <>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold'>{photo.title}</CardTitle>
            <div className='flex items-center gap-2'>
              {showActions && (
                <>
                  {onEdit && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onEdit(photo)}
                    >
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => onDelete(photo._id)}
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Photo Image */}
          <div className='relative'>
            <img
              src={photo.src}
              alt={photo.alt}
              className='w-full max-h-96 object-contain rounded-lg shadow-lg'
            />
          </div>

          {/* Photo Meta Information */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='font-medium'>Category:</span>
              <Badge variant='secondary' className='capitalize'>
                {photo.category.replace("-", " ")}
              </Badge>
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='w-4 h-4 text-gray-500' />
              <span>{formatDate(photo.date)}</span>
            </div>

            {photo.location && (
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='w-4 h-4 text-gray-500' />
                <span>{photo.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {photo.description && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>
                {photo.description}
              </p>
            </div>
          )}

          {/* Additional Information */}
          <div className='pt-4 border-t border-gray-200'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500'>
              <div>
                <span className='font-medium'>Created:</span>{" "}
                {formatDate(photo.createdAt)}
              </div>
              <div>
                <span className='font-medium'>Last Updated:</span>{" "}
                {formatDate(photo.updatedAt)}
              </div>
              <div>
                <span className='font-medium'>Photo ID:</span> {photo._id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PhotoView;
