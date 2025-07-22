import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  AlertCircle,
  Grid3X3,
  List,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import {
  useGetPhotosQuery,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
  Photo,
  PhotoQuery,
} from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { logout, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PhotoCard from "./AdminPhoto/PhotoCard";

// Skeleton Components
const PhotoCardSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  if (viewMode === "grid") {
    return (
      <Card className='overflow-hidden'>
        <Skeleton className='aspect-video w-full' />
        <CardContent className='p-4 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className='flex p-4 gap-4'>
        <Skeleton className='w-24 h-24 rounded flex-shrink-0' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-3 w-1/3' />
        </div>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </Card>
  );
};

const PhotoGridSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <PhotoCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};

const PhotoDash: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Query parameters
  const [queryParams, setQueryParams] = useState<PhotoQuery>({
    page: 1,
    limit: 12,
    category: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // API hooks
  const { data: photosData, isLoading } = useGetPhotosQuery(queryParams);
  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

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

  if (!isAdmin) {
    return (
      <Alert className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Admin access required.</AlertDescription>
      </Alert>
    );
  }

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
  };

  const handleViewPhoto = (photo: Photo) => {
    navigate(`/admin/view/${photo._id}`);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return;

    try {
      await deletePhoto(photoId).unwrap();
    } catch (error: any) {
      console.error("Delete failed:", error.data?.message || "Delete failed");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      await updatePhoto({
        id: editingPhoto._id,
        data: {
          title: editingPhoto.title,
          category: editingPhoto.category,
          location: editingPhoto.location,
          description: editingPhoto.description,
          date: editingPhoto.date,
        },
      }).unwrap();

      setEditingPhoto(null);
    } catch (error: any) {
      console.error("Update failed:", error.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigateToAddPhoto = () => {
    navigate("/admin/addPhoto");
  };

  const handleHomeRedirect = () => {
    window.location.href = "/admin/dashboard";
  };

  return (
    <>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={handleHomeRedirect}
              variant='ghost'
              className='group flex items-center gap-3 px-4 py-2 hover:bg-gradient-to-r hover:from-[#FF9933]/10 hover:to-[#138808]/10 rounded-xl transition-all duration-300'
            >
              <div className='relative'>
                <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300' />
                <div className='absolute inset-0 bg-[#FF9933] rounded-full opacity-0 group-hover:opacity-20 animate-ping'></div>
              </div>
              <span className='font-medium'>Back to Admin Dashboard</span>
            </Button>

            <div className='hidden sm:block w-px h-6 bg-gray-300'></div>
          </div>

          <Button
            onClick={handleLogout}
            variant='ghost'
            className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-5xl mx-auto space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h1 className='text-3xl font-bold text-slate-800'>
              Photo Dashboard
            </h1>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                disabled={isLoading}
              >
                {viewMode === "grid" ? (
                  <List className='w-4 h-4' />
                ) : (
                  <Grid3X3 className='w-4 h-4' />
                )}
              </Button>

              <Button disabled={isLoading} onClick={navigateToAddPhoto}>
                <Plus className='w-4 h-4 mr-2' />
                Add Photo
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      placeholder='Search photos...'
                      value={queryParams.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                      className='pl-10'
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Select
                  value={queryParams.category || "all"}
                  onValueChange={handleCategoryFilter}
                  disabled={isLoading}
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
            </CardContent>
          </Card>

          {/* Photos Grid/List with Skeleton Loading */}
          {isLoading ? (
            <PhotoGridSkeleton viewMode={viewMode} />
          ) : photosData?.data.photos.length === 0 ? (
            <Card>
              <CardContent className='text-center py-12'>
                <p className='text-gray-500'>No photos found.</p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {photosData?.data.photos.map((photo) => (
                <PhotoCard
                  key={photo._id}
                  photo={photo}
                  viewMode={viewMode}
                  onView={handleViewPhoto}
                  onEdit={handleEditPhoto}
                  onDelete={handleDeletePhoto}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}

          {/* Pagination with Skeleton */}
          {isLoading ? (
            <div className='flex justify-center space-x-2'>
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className='h-8 w-8' />
              ))}
            </div>
          ) : (
            photosData?.data.pagination &&
            photosData.data.pagination.pages > 1 && (
              <div className='flex justify-center space-x-2'>
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
            )
          )}

          {/* Edit Photo Dialog */}
          <Dialog
            open={!!editingPhoto}
            onOpenChange={() => setEditingPhoto(null)}
          >
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
              {editingPhoto && (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit Photo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-sm font-medium'>Title</label>
                        <Input
                          value={editingPhoto.title}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev ? { ...prev, title: e.target.value } : null
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Category</label>
                        <Select
                          value={editingPhoto.category}
                          onValueChange={(value) =>
                            setEditingPhoto((prev) =>
                              prev ? { ...prev, category: value } : null
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Date</label>
                        <Input
                          type='date'
                          value={editingPhoto.date.split("T")[0]}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev ? { ...prev, date: e.target.value } : null
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Location</label>
                        <Input
                          value={editingPhoto.location}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev
                                ? { ...prev, location: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium'>Description</label>
                      <textarea
                        className='w-full p-2 border rounded'
                        rows={3}
                        value={editingPhoto.description}
                        onChange={(e) =>
                          setEditingPhoto((prev) =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>

                    <Button
                      type='submit'
                      disabled={isUpdating}
                      className='w-full'
                    >
                      {isUpdating ? "Updating..." : "Update Photo"}
                    </Button>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PhotoDash;
