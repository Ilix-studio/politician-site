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
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  useGetPressByIdQuery,
  useGetPressQuery,
} from "@/redux-store/services/pressApi";
import { PressDocument } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const ShowPressById = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [relatedPress, setRelatedPress] = useState<PressDocument[]>([]);
  const [isSharing, setIsSharing] = useState<boolean>(false);

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

  const press = pressData?.data?.press;

  useEffect(() => {
    if (press && allPressData?.data?.press) {
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
        await navigator.clipboard?.writeText(shareData.url);
        alert("Press article link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
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
          <p className='text-muted-foreground'>Loading press article...</p>
        </div>
      </div>
    );
  }

  if (error || !press) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center max-w-md mx-auto p-6'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold mb-4'>Press Article Not Found</h2>
          <p className='text-muted-foreground mb-6'>
            The press article you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            onClick={goBack}
            className='inline-flex items-center px-4 py-2 bg-[#FF9933] text-white rounded-md hover:bg-[#FF9933]/90 transition-colors'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-background'>
        <main className='container py-6 max-w-4xl mx-auto px-4'>
          {/* Press Article Header */}
          <header className='mb-8'>
            {/* Category and Status */}
            <div className='flex flex-wrap items-center gap-2 mb-4'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  press.category
                )}`}
              >
                {press.category.charAt(0).toUpperCase() +
                  press.category.slice(1)}
              </span>
              {!press.isActive && (
                <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium'>
                  Inactive
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight'>
              {press.title}
            </h1>

            {/* Excerpt */}
            <p className='text-lg text-muted-foreground mb-6 leading-relaxed'>
              {press.excerpt}
            </p>

            {/* Metadata */}
            <div className='grid grid-cols-2 md:flex md:flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4 flex-shrink-0' />
                <span>{formatDate(press.date)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <User className='h-4 w-4 flex-shrink-0' />
                <span>{press.author}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Building className='h-4 w-4 flex-shrink-0' />
                <span>{press.source}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4 flex-shrink-0' />
                <span>{press.readTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={handleShare}
                disabled={isSharing}
                className='flex items-center justify-center px-4 py-2 text-sm bg-[#FF9933] text-white rounded-md hover:bg-[#FF9933]/90 transition-colors disabled:opacity-50'
              >
                <Share2 className='mr-2 h-4 w-4' />
                {isSharing ? "Sharing..." : "Share Article"}
              </button>
              <a
                href={press.link}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center px-4 py-2 text-sm border border-input bg-background hover:bg-accent rounded-md transition-colors'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Original Source
              </a>
            </div>
          </header>

          {/* Featured Image */}
          <div className='mb-8'>
            <img
              src={press.image}
              alt={press.title}
              className='w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg'
              loading='lazy'
            />
          </div>

          {/* Press Article Content */}
          <article className='prose prose-lg max-w-none mb-12'>
            <div className='text-foreground space-y-4'>
              {press.content.split("\n").map((paragraph, index) => (
                <p key={index} className='leading-relaxed'>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Related Press Articles */}
          {relatedPress.length > 0 && (
            <section className='border-t pt-8 mb-8'>
              <h2 className='text-2xl font-bold mb-6'>
                Related Press Articles
              </h2>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
                        className='w-full h-48 object-cover'
                        loading='lazy'
                      />
                      <div className='p-4'>
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
                        <h3 className='font-semibold mb-2 line-clamp-2 hover:text-[#FF9933] transition-colors'>
                          {relatedPressArticle.title}
                        </h3>
                        <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
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

          {/* All Press Articles Navigation */}
          {allPressData?.data?.press && (
            <section className='border-t pt-8'>
              <h3 className='text-xl font-semibold mb-6'>
                Browse All Press Articles
              </h3>

              <div className='grid gap-4 sm:grid-cols-2'>
                {loadingAllPress ? (
                  <div className='col-span-full text-center py-4'>
                    <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2' />
                    <p className='text-sm text-muted-foreground'>
                      Loading press articles...
                    </p>
                  </div>
                ) : (
                  allPressData.data.press
                    .filter((p) => p.isActive)
                    .map((pressArticle) => (
                      <button
                        key={pressArticle._id}
                        onClick={() => goToPress(pressArticle._id)}
                        className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                          press._id === pressArticle._id
                            ? "border-[#FF9933] bg-[#FF9933]/5"
                            : "border-border hover:border-[#FF9933]/50"
                        }`}
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                              pressArticle.category
                            )}`}
                          >
                            {pressArticle.category.charAt(0).toUpperCase() +
                              pressArticle.category.slice(1)}
                          </span>
                          {press._id === pressArticle._id && (
                            <span className='px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium'>
                              Current
                            </span>
                          )}
                        </div>
                        <h4 className='font-medium mb-1 line-clamp-2'>
                          {pressArticle.title}
                        </h4>
                        <p className='text-sm text-muted-foreground mb-2 line-clamp-1'>
                          {pressArticle.excerpt}
                        </p>
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <span>{formatDate(pressArticle.date)}</span>
                          <span>•</span>
                          <span className='truncate'>
                            {pressArticle.source}
                          </span>
                          <span className='hidden sm:inline'>•</span>
                          <span className='hidden sm:inline'>
                            {pressArticle.readTime}
                          </span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default ShowPressById;
