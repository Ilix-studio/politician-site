import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Save, AlertCircle, Loader2 } from "lucide-react";
import {
  useGetPhotoQuery,
  useUpdatePhotoMutation,
  PhotoUploadData,
} from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";

import { BackNavigation } from "@/config/navigation/BackNavigation";

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

const EditPhoto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();

  const isAdmin = useSelector(selectIsAdmin);

  const { data: photoData, isLoading, error } = useGetPhotoQuery(id!);
  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();

  const [formData, setFormData] = useState<PhotoUploadData>({
    title: "",
    category: "",
    date: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (photoData?.success && photoData.data) {
      const photo = photoData.data;
      setFormData({
        title: photo.title || "",
        category: photo.category || "",
        date: photo.date ? photo.date.split("T")[0] : "",
        location: photo.location || "",
        description: photo.description || "",
      });
    }
  }, [photoData]);

  if (!id) {
    return (
      <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Photo ID not found</AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Admin access required</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-2xl mx-auto'>
          <Card className='shadow-xl'>
            <CardHeader>
              <Skeleton className='h-8 w-48' />
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='aspect-video'>
                <Skeleton className='w-full h-full rounded' />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                ))}
              </div>
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !photoData?.success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load photo. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const photo = photoData.data;

  const handleInputChange = (field: keyof PhotoUploadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updatePhoto({
        id: photo._id,
        data: formData,
      }).unwrap();
    } catch (error: any) {
      setErrors({ submit: error.data?.message || "Update failed" });
    }
  };

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-2xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className='shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-2xl font-bold text-slate-800'>
                    Edit Photo
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                {/* Photo Preview */}
                <div className='space-y-2'>
                  <Label>Current Photo</Label>
                  <div className='aspect-video rounded-lg overflow-hidden bg-gray-100'>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Form Fields */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={errors.title ? "border-red-500" : ""}
                        placeholder='Enter photo title'
                      />
                      {errors.title && (
                        <p className='text-sm text-red-600'>{errors.title}</p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className='text-sm text-red-600'>
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='date' className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4' />
                        Date
                      </Label>
                      <Input
                        id='date'
                        type='date'
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='location'
                        className='flex items-center gap-2'
                      >
                        <MapPin className='w-4 h-4' />
                        Location
                      </Label>
                      <Input
                        id='location'
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className={errors.location ? "border-red-500" : ""}
                        placeholder='Where was this photo taken?'
                      />
                      {errors.location && (
                        <p className='text-sm text-red-600'>
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={errors.description ? "border-red-500" : ""}
                      placeholder="Describe what's happening in this photo"
                      rows={4}
                    />
                    {errors.description && (
                      <p className='text-sm text-red-600'>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    disabled={isUpdating}
                    className='w-full'
                    size='lg'
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Updating Photo...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4 mr-2' />
                        Update Photo
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EditPhoto;
