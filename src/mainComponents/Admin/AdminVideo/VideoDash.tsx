import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  Loader2,
  AlertCircle,
  Grid,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
} from "@/redux-store/services/videoApi";
import {
  VideoDocument,
  VideoQueryParams,
  VideoSortBy,
  VideoSortOrder,
} from "@/types/video.types";
import VideoCard from "./VideoCard";

const VideoDash = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // State for filters and pagination
  const [filters, setFilters] = useState<VideoQueryParams>({
    page: "1",
    limit: "12",
    category: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // API hooks
  const {
    data: videosData,
    isLoading,
    error,
    refetch,
  } = useGetVideosQuery({
    ...filters,
    search: search.trim(),
  });

  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleFilterChange = (newFilters: Partial<VideoQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: "1" }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page.toString() }));
  };

  const handleSortByChange = (value: string) => {
    handleFilterChange({ sortBy: value as VideoSortBy });
  };

  const handleSortOrderChange = (value: string) => {
    handleFilterChange({ sortOrder: value as VideoSortOrder });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters((prev) => ({ ...prev, page: "1" }));
  };

  const handleEdit = (video: VideoDocument) => {
    navigate(`/admin/editVideo/${video._id}`);
  };

  const handleView = (video: VideoDocument) => {
    navigate(`/admin/play/${video._id}`);
  };

  const handleDelete = async (videoId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deleteVideo(videoId).unwrap();
      } catch (error) {
        console.error("Failed to delete video:", error);
      }
    }
  };

  const videos = videosData?.data?.videos || [];
  const pagination = videosData?.data?.pagination;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      <div className='container py-6 px-4 sm:px-6 max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          className='mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <Button
              onClick={() => navigate("/admin/dashboard")}
              variant='ghost'
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Dashboard
            </Button>

            <Button
              onClick={() => navigate("/admin/addVideo")}
              className='flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              Add Video
            </Button>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                Video Management
              </h1>
              <p className='text-slate-600 mt-1'>
                Manage your video content, categories, and featured videos
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size='sm'
                onClick={() => setViewMode("grid")}
              >
                <Grid className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size='sm'
                onClick={() => setViewMode("list")}
              >
                <List className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className='mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardContent className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                {/* Search */}
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                  <Input
                    placeholder='Search videos...'
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange({ category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    <SelectItem value='speech'>Speech</SelectItem>
                    <SelectItem value='event'>Event</SelectItem>
                    <SelectItem value='interview'>Interview</SelectItem>
                    <SelectItem value='initiative'>Initiative</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortByChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sort By' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='createdAt'>Created Date</SelectItem>
                    <SelectItem value='date'>Video Date</SelectItem>
                    <SelectItem value='title'>Title</SelectItem>
                    <SelectItem value='views'>Views</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select
                  value={filters.sortOrder}
                  onValueChange={handleSortOrderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Order' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='desc'>Descending</SelectItem>
                    <SelectItem value='asc'>Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-slate-600'>Total Videos</p>
                  <p className='text-2xl font-bold'>
                    {pagination?.totalVideos || 0}
                  </p>
                </div>
                <Play className='w-8 h-8 text-blue-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-slate-600'>This Page</p>
                  <p className='text-2xl font-bold'>{videos.length}</p>
                </div>
                <Eye className='w-8 h-8 text-green-600' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-slate-600'>Page</p>
                  <p className='text-2xl font-bold'>
                    {pagination?.currentPage || 1} of{" "}
                    {pagination?.totalPages || 1}
                  </p>
                </div>
                <Filter className='w-8 h-8 text-purple-600' />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-slate-600' />
            <span className='ml-2 text-slate-600'>Loading videos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className='mb-6'>
            <CardContent className='p-6 text-center'>
              <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-red-700 mb-2'>
                Error Loading Videos
              </h3>
              <p className='text-slate-600 mb-4'>
                Failed to load videos. Please try again.
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {/* Videos Grid/List */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {videos.length === 0 ? (
              <Card>
                <CardContent className='p-12 text-center'>
                  <Play className='w-16 h-16 text-slate-300 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold text-slate-700 mb-2'>
                    No Videos Found
                  </h3>
                  <p className='text-slate-500 mb-6'>
                    {search || filters.category !== "all"
                      ? "No videos match your current filters."
                      : "You haven't uploaded any videos yet."}
                  </p>
                  <Button onClick={() => navigate("/admin/addVideo")}>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Your First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {videos.map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                      showActions={true}
                      viewMode={viewMode}
                      isDeleting={deleting}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 mt-8'>
                    <Button
                      variant='outline'
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === pagination.currentPage;
                      const showPage =
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.currentPage) <= 2;

                      if (!showPage) {
                        if (
                          page === pagination.currentPage - 3 ||
                          page === pagination.currentPage + 3
                        ) {
                          return <span key={page}>...</span>;
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className='w-10'
                        >
                          {page}
                        </Button>
                      );
                    })}

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
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoDash;
