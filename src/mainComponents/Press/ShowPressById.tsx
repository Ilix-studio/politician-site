import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Share2,
  Clock,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useGetPressByIdQuery,
  useGetPressQuery,
  useDeletePressArticleMutation,
} from "@/redux-store/services/pressApi";
import { PressDocument } from "@/types/press.types";

const ShowPressById = () => {
  // Get the actual ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [relatedPress, setRelatedPress] = useState<PressDocument[]>([]);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showAllPress, setShowAllPress] = useState<boolean>(false);

  // API hooks
  const {
    data: pressData,
    isLoading,
    error,
  } = useGetPressByIdQuery(id || "", { skip: !id });

  const { data: allPressData, isLoading: loadingAllPress } = useGetPressQuery({
    page: "1",
    limit: "50",
    sortBy: "date",
    sortOrder: "desc",
  });

  const [deletePress, { isLoading: deleting }] =
    useDeletePressArticleMutation();

  const press = pressData?.data?.press;

  useEffect(() => {
    if (press && allPressData?.data?.press) {
      // Get related press articles (same category, excluding current article)
      const related = allPressData.data.press
        .filter((p) => p.category === press.category && p._id !== press._id)
        .slice(0, 3);
      setRelatedPress(related);
    }
  }, [press, allPressData]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
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
    return colors[category] || colors.other;
  };

  const handleShare = async () => {
    if (!press) return;

    setIsSharing(true);
    const shareData = {
      title: press.title,
      text: press.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard?.writeText(shareData.url);
        alert("Press article link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback for any errors
      try {
        await navigator.clipboard?.writeText(shareData.url);
        alert("Press article link copied to clipboard!");
      } catch (clipboardError) {
        alert("Unable to share or copy link. Please copy the URL manually.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!press || !isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this press article? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deletePress(press._id).unwrap();
        navigate("/");
      } catch (error: any) {
        console.error("Delete failed:", error);
        alert(error.data?.message || "Failed to delete press article");
      }
    }
  };

  const handleEdit = () => {
    if (press && isAdmin) {
      navigate(`/admin/press/edit/${press._id}`);
    }
  };

  const goToPress = (pressId: string) => {
    navigate(`/press/${pressId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933] mx-auto mb-4'></div>
          <p className='text-muted-foreground text-sm sm:text-base'>
            Loading press article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !press) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center max-w-md mx-auto p-6'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl sm:text-2xl font-bold mb-4'>
            Press Article Not Found
          </h2>
          <p className='text-muted-foreground mb-6 text-sm sm:text-base'>
            The press article you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            onClick={goBack}
            className='inline-flex items-center px-4 py-2 bg-[#FF9933] text-white rounded-md hover:bg-[#FF9933]/90 transition-colors text-sm sm:text-base'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header Navigation - Mobile Optimized */}
      <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6'>
          <button
            onClick={goBack}
            className='inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
            <span className='hidden xs:inline'>Back to Home</span>
            <span className='xs:hidden'>Back</span>
          </button>

          <div className='flex items-center gap-1 sm:gap-2'>
            {/* Admin Actions */}
            {isAuthenticated && isAdmin && (
              <>
                <button
                  onClick={handleEdit}
                  className='inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                >
                  <Edit className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className='inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-red-200 bg-background hover:bg-red-50 text-red-600 hover:text-red-700 rounded-md transition-colors disabled:opacity-50'
                >
                  {deleting ? (
                    <Loader2 className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin' />
                  ) : (
                    <Trash2 className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                  )}
                  <span className='hidden sm:inline'>
                    {deleting ? "Deleting..." : "Delete"}
                  </span>
                </button>
              </>
            )}

            <button
              onClick={handleShare}
              disabled={isSharing}
              className='inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors disabled:opacity-50'
            >
              <Share2 className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
              <span className='hidden sm:inline'>
                {isSharing ? "Sharing..." : "Share"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className='container py-4 sm:py-6 lg:py-8 max-w-4xl mx-auto px-4 sm:px-6'>
        {/* Press Article Header - Mobile Optimized */}
        <header className='mb-6 sm:mb-8'>
          {/* Category and Status */}
          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4'>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getCategoryColor(
                press.category
              )}`}
            >
              {press.category.charAt(0).toUpperCase() + press.category.slice(1)}
            </span>
            {!press.isActive && (
              <span className='px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-medium'>
                Inactive
              </span>
            )}
          </div>

          {/* Title - Mobile Responsive */}
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight'>
            {press.title}
          </h1>

          {/* Excerpt */}
          <p className='text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed'>
            {press.excerpt}
          </p>

          {/* Metadata - Mobile Responsive Grid */}
          <div className='grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 pb-4 sm:pb-6 border-b'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{formatDate(press.date)}</span>
            </div>
            <div className='flex items-center gap-1'>
              <User className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{press.author}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Building className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{press.source}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{press.readTime}</span>
            </div>
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className='flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm bg-[#FF9933] text-white rounded-md hover:bg-[#FF9933]/90 transition-colors disabled:opacity-50 w-full sm:w-auto'
            >
              <Share2 className='mr-2 h-4 w-4' />
              {isSharing ? "Sharing..." : "Share Article"}
            </button>
            <a
              href={press.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors w-full sm:w-auto'
            >
              <ExternalLink className='mr-2 h-4 w-4' />
              View Original Source
            </a>

            {/* Admin Action Buttons - Mobile */}
            {isAuthenticated && isAdmin && (
              <>
                <button
                  onClick={handleEdit}
                  className='flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm border border-blue-200 bg-background hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-md transition-colors w-full sm:w-auto'
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Edit Article
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className='flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm border border-red-200 bg-background hover:bg-red-50 text-red-600 hover:text-red-700 rounded-md transition-colors disabled:opacity-50 w-full sm:w-auto'
                >
                  {deleting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Article
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </header>

        {/* Featured Image - Mobile Responsive */}
        <div className='mb-6 sm:mb-8'>
          <img
            src={press.image}
            alt={press.title}
            className='w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg'
            loading='lazy'
          />
        </div>

        {/* Press Article Content - Mobile Optimized Typography */}
        <article className='prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-12'>
          <div
            className='text-foreground 
              [&>p]:mb-4 sm:[&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base lg:[&>p]:text-lg
              [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 sm:[&>h3]:mt-8 [&>h3]:mb-3 sm:[&>h3]:mb-4 [&>h3]:text-[#FF9933]
              [&>ul]:mb-4 sm:[&>ul]:mb-6 [&>ul]:pl-4 sm:[&>ul]:pl-6 [&>li]:mb-1 sm:[&>li]:mb-2 [&>li]:text-sm sm:[&>li]:text-base
              [&>blockquote]:border-l-4 [&>blockquote]:border-[#FF9933] [&>blockquote]:pl-3 sm:[&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 sm:[&>blockquote]:my-6 [&>blockquote]:bg-slate-50 [&>blockquote]:py-3 sm:[&>blockquote]:py-4 [&>blockquote]:rounded-r [&>blockquote]:text-sm sm:[&>blockquote]:text-base
              [&>strong]:text-[#FF9933] [&>strong]:font-semibold'
          >
            {press.content.split("\n").map((paragraph, index) => (
              <p key={index} className='mb-4 leading-relaxed'>
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Related Press Articles - Mobile Responsive */}
        {relatedPress.length > 0 && (
          <section className='border-t pt-6 sm:pt-8 mb-6 sm:mb-8'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>
              Related Press Articles
            </h2>
            <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {relatedPress.map((relatedPressArticle) => (
                <div
                  key={relatedPressArticle._id}
                  className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                >
                  <button
                    onClick={() => goToPress(relatedPressArticle._id)}
                    className='w-full text-left'
                  >
                    <img
                      src={relatedPressArticle.image}
                      alt={relatedPressArticle.title}
                      className='w-full h-36 sm:h-48 object-cover'
                      loading='lazy'
                    />
                    <div className='p-3 sm:p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                            relatedPressArticle.category
                          )}`}
                        >
                          {relatedPressArticle.category
                            .charAt(0)
                            .toUpperCase() +
                            relatedPressArticle.category.slice(1)}
                        </span>
                      </div>
                      <h3 className='font-semibold mb-2 line-clamp-2 hover:text-[#FF9933] transition-colors text-sm sm:text-base'>
                        {relatedPressArticle.title}
                      </h3>
                      <p className='text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2'>
                        {relatedPressArticle.excerpt}
                      </p>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <span>{formatDate(relatedPressArticle.date)}</span>
                        <span>•</span>
                        <span>{relatedPressArticle.readTime}</span>
                        <span className='hidden sm:inline'>•</span>
                        <span className='hidden sm:inline'>
                          {relatedPressArticle.source}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Press Articles Navigation - Mobile Responsive with Collapsible */}
        {allPressData?.data?.press && (
          <section className='border-t pt-6 sm:pt-8'>
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <h3 className='text-lg sm:text-xl font-semibold'>
                Browse All Press Articles
              </h3>
              <button
                onClick={() => setShowAllPress(!showAllPress)}
                className='flex items-center gap-1 text-sm text-[#FF9933] hover:text-[#FF9933]/80 transition-colors md:hidden'
              >
                {showAllPress ? (
                  <>
                    <span>Hide</span>
                    <ChevronUp className='h-4 w-4' />
                  </>
                ) : (
                  <>
                    <span>Show All</span>
                    <ChevronDown className='h-4 w-4' />
                  </>
                )}
              </button>
            </div>

            {/* Mobile: Collapsible, Desktop: Always Visible */}
            <div
              className={`grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 ${
                showAllPress ? "block" : "hidden md:grid"
              }`}
            >
              {loadingAllPress ? (
                <div className='col-span-full text-center py-4'>
                  <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    Loading press articles...
                  </p>
                </div>
              ) : (
                allPressData.data.press
                  .filter((p) => p.isActive) // Only show active press articles
                  .map((pressArticle) => (
                    <button
                      key={pressArticle._id}
                      onClick={() => goToPress(pressArticle._id)}
                      className={`p-3 sm:p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                        press._id === pressArticle._id
                          ? "border-[#FF9933] bg-[#FF9933]/5"
                          : "border-border hover:border-[#FF9933]/50"
                      }`}
                    >
                      <div className='flex items-center gap-1.5 sm:gap-2 mb-2'>
                        <span
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${getCategoryColor(
                            pressArticle.category
                          )}`}
                        >
                          {pressArticle.category.charAt(0).toUpperCase() +
                            pressArticle.category.slice(1)}
                        </span>
                        {press._id === pressArticle._id && (
                          <span className='px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded text-xs font-medium'>
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className='font-medium text-sm sm:text-base mb-1 line-clamp-2'>
                        {pressArticle.title}
                      </h4>
                      <p className='text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1'>
                        {pressArticle.excerpt}
                      </p>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <span>{formatDate(pressArticle.date)}</span>
                        <span>•</span>
                        <span className='truncate'>{pressArticle.source}</span>
                        <span className='hidden sm:inline'>•</span>
                        <span className='hidden sm:inline'>
                          {pressArticle.readTime}
                        </span>
                      </div>
                    </button>
                  ))
              )}
            </div>

            {/* Mobile: Show summary when collapsed */}
            <div className={`md:hidden ${showAllPress ? "hidden" : "block"}`}>
              <p className='text-sm text-muted-foreground text-center py-4'>
                {allPressData.data.press.filter((p) => p.isActive).length}{" "}
                articles available • Tap "Show All" to browse
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className='sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden'>
        <div className='container px-4'>
          <div className='flex items-center justify-between py-3'>
            <button
              onClick={goBack}
              className='flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              Home
            </button>

            <div className='flex items-center gap-2'>
              {isAuthenticated && isAdmin && (
                <button
                  onClick={handleEdit}
                  className='flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </button>
              )}
              <button
                onClick={handleShare}
                disabled={isSharing}
                className='flex items-center gap-2 px-3 py-2 bg-[#FF9933] text-white rounded-md hover:bg-[#FF9933]/90 transition-colors disabled:opacity-50 text-sm'
              >
                <Share2 className='h-4 w-4' />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPressById;
