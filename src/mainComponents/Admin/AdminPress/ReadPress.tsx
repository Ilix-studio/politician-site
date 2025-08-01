import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  Building,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import { useGetPressByIdQuery } from "@/redux-store/services/pressApi";
import { Press } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const ReadPress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/dashboard' />;
  }

  const { data: pressData, isLoading, error } = useGetPressByIdQuery(id);

  const press = pressData?.data;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryName = (category: Press["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      politics: "bg-red-100 text-red-800",
      economy: "bg-green-100 text-green-800",
      development: "bg-blue-100 text-blue-800",
      social: "bg-purple-100 text-purple-800",
      environment: "bg-emerald-100 text-emerald-800",
      education: "bg-yellow-100 text-yellow-800",
      healthcare: "bg-pink-100 text-pink-800",
      infrastructure: "bg-gray-100 text-gray-800",
      other: "bg-orange-100 text-orange-800",
    };
    return colors[categoryName.toLowerCase()] || colors.other;
  };

  const handlePrevImage = () => {
    if (press?.images && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (press?.images && currentImageIndex < press.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
          <p className='text-slate-600'>Loading press article...</p>
        </div>
      </div>
    );
  }

  if (error || !press) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardContent className='p-6 text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-slate-800 mb-2'>
              Article Not Found
            </h2>
            <p className='text-slate-600 mb-4'>
              The press article you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/admin/pressDashboard")}>
              Back to Press Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryName = getCategoryName(press.category);
  const currentImage = press.images?.[currentImageIndex];

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='max-w-4xl mx-auto p-4 py-8'>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-8'
          >
            {/* Article Header */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Badge className={getCategoryColor(categoryName)}>
                  {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                </Badge>
                {!press.isActive && (
                  <Badge
                    variant='secondary'
                    className='bg-gray-100 text-gray-600'
                  >
                    Inactive
                  </Badge>
                )}
              </div>

              <h1 className='text-3xl md:text-4xl font-bold text-slate-800 leading-tight'>
                {press.title}
              </h1>

              <p className='text-lg text-slate-600 leading-relaxed'>
                {press.excerpt}
              </p>

              {/* Meta Information */}
              <div className='flex flex-wrap items-center gap-6 text-sm text-slate-500'>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <span className='font-medium'>{press.author}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Building className='w-4 h-4' />
                  <span>{press.source}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>{formatDate(press.date)}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  <span>{press.readTime}</span>
                </div>
              </div>

              <Separator />
            </div>

            {/* Images Section */}
            {press.images && press.images.length > 0 && (
              <div className='space-y-4'>
                <div className='relative w-full h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden'>
                  <img
                    src={currentImage?.src}
                    alt={currentImage?.alt}
                    className='w-full h-full object-cover cursor-pointer'
                    onClick={() => setShowLightbox(true)}
                  />

                  {/* Image Navigation */}
                  {press.images.length > 1 && (
                    <>
                      <Button
                        variant='outline'
                        size='sm'
                        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                        onClick={handleNextImage}
                        disabled={currentImageIndex === press.images.length - 1}
                      >
                        <ChevronRight className='w-4 h-4' />
                      </Button>

                      {/* Image Counter */}
                      <div className='absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm'>
                        {currentImageIndex + 1} / {press.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {press.images.length > 1 && (
                  <div className='flex gap-2 overflow-x-auto'>
                    {press.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-gray-300"
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
                )}
              </div>
            )}

            {/* Article Content */}
            <Card>
              <CardContent className='p-8'>
                <div className='prose prose-slate max-w-none'>
                  <div className='whitespace-pre-wrap text-slate-700 leading-relaxed'>
                    {press.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Actions */}
            <Card>
              <CardContent className='p-6'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <Calendar className='w-4 h-4' />
                    <span>Published: {formatDate(press.date)}</span>
                    {press.createdAt && (
                      <>
                        <span>•</span>
                        <span>Added: {formatDate(press.createdAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Metadata */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold text-slate-800 mb-4'>
                  Article Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='font-medium text-slate-600'>ID:</span>
                    <span className='ml-2 text-slate-800 font-mono'>
                      {press._id}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Status:</span>
                    <span className='ml-2'>
                      <Badge variant={press.isActive ? "default" : "secondary"}>
                        {press.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Images:</span>
                    <span className='ml-2 text-slate-800'>
                      {press.images?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Created:</span>
                    <span className='ml-2 text-slate-800'>
                      {press.createdAt ? formatDate(press.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Updated:</span>
                    <span className='ml-2 text-slate-800'>
                      {press.updatedAt ? formatDate(press.updatedAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.article>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && currentImage && (
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
              src={currentImage.src}
              alt={currentImage.alt}
              className='max-w-full max-h-full object-contain'
            />

            {/* Navigation in lightbox */}
            {press.images && press.images.length > 1 && (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                  onClick={handleNextImage}
                  disabled={currentImageIndex === press.images.length - 1}
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReadPress;
