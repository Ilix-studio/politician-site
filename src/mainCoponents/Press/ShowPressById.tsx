import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Share2,
  Eye,
  Clock,
  User,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Article, pressArticles } from "@/MockData/firstpagePGD";

const ShowPressById = () => {
  // Get the actual ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showAllArticles, setShowAllArticles] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Find article by ID from URL parameter
    const articleId = parseInt(id);
    const foundArticle = pressArticles.find(
      (article) => article.id === articleId
    );

    if (foundArticle) {
      setArticle(foundArticle);

      // Get related articles (same category, excluding current article)
      const related = pressArticles
        .filter(
          (a) =>
            a.category === foundArticle.category && a.id !== foundArticle.id
        )
        .slice(0, 3);
      setRelatedArticles(related);

      // Simulate view count increment (in real app, this would be an API call)
      foundArticle.views += 1;
    } else {
      setArticle(null);
    }

    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  const handleShare = async () => {
    if (!article) return;

    setIsSharing(true);
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard?.writeText(shareData.url);
        alert("Article link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback for any errors
      try {
        await navigator.clipboard?.writeText(shareData.url);
        alert("Article link copied to clipboard!");
      } catch (clipboardError) {
        alert("Unable to share or copy link. Please copy the URL manually.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const goToArticle = (articleId: number) => {
    navigate(`/press/${articleId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933] mx-auto mb-4'></div>
          <p className='text-muted-foreground text-sm sm:text-base'>
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center max-w-md mx-auto p-6'>
          <h2 className='text-xl sm:text-2xl font-bold mb-4'>
            Article Not Found
          </h2>
          <p className='text-muted-foreground mb-6 text-sm sm:text-base'>
            The article you're looking for doesn't exist or has been removed.
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
        {/* Article Header - Mobile Optimized */}
        <header className='mb-6 sm:mb-8'>
          {/* Category and Tags */}
          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4'>
            <span className='px-2 sm:px-3 py-1 bg-[#FF9933]/10 text-[#FF9933] rounded-full text-xs sm:text-sm font-medium'>
              {article.category}
            </span>
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded text-xs'
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className='text-xs text-muted-foreground'>
                +{article.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Title - Mobile Responsive */}
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight'>
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className='text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed'>
            {article.excerpt}
          </p>

          {/* Metadata - Mobile Responsive Grid */}
          <div className='grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 pb-4 sm:pb-6 border-b'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{article.date}</span>
            </div>
            <div className='flex items-center gap-1'>
              <User className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{article.author}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Building className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{article.source}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span className='truncate'>{article.readTime}</span>
            </div>
            <div className='flex items-center gap-1 col-span-2 sm:col-span-1'>
              <Eye className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
              <span>{article.views.toLocaleString()} views</span>
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
              href={article.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors w-full sm:w-auto'
            >
              <ExternalLink className='mr-2 h-4 w-4' />
              View Original Source
            </a>
          </div>
        </header>

        {/* Featured Image - Mobile Responsive */}
        <div className='mb-6 sm:mb-8'>
          <img
            src={article.image}
            alt={article.title}
            className='w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg'
            loading='lazy'
          />
        </div>

        {/* Article Content - Mobile Optimized Typography */}
        <article className='prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-12'>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className='text-foreground 
              [&>p]:mb-4 sm:[&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base lg:[&>p]:text-lg
              [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 sm:[&>h3]:mt-8 [&>h3]:mb-3 sm:[&>h3]:mb-4 [&>h3]:text-[#FF9933]
              [&>ul]:mb-4 sm:[&>ul]:mb-6 [&>ul]:pl-4 sm:[&>ul]:pl-6 [&>li]:mb-1 sm:[&>li]:mb-2 [&>li]:text-sm sm:[&>li]:text-base
              [&>blockquote]:border-l-4 [&>blockquote]:border-[#FF9933] [&>blockquote]:pl-3 sm:[&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 sm:[&>blockquote]:my-6 [&>blockquote]:bg-slate-50 [&>blockquote]:py-3 sm:[&>blockquote]:py-4 [&>blockquote]:rounded-r [&>blockquote]:text-sm sm:[&>blockquote]:text-base
              [&>strong]:text-[#FF9933] [&>strong]:font-semibold'
          />
        </article>

        {/* Related Articles - Mobile Responsive */}
        {relatedArticles.length > 0 && (
          <section className='border-t pt-6 sm:pt-8 mb-6 sm:mb-8'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>
              Related Articles
            </h2>
            <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                >
                  <button
                    onClick={() => goToArticle(relatedArticle.id)}
                    className='w-full text-left'
                  >
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className='w-full h-36 sm:h-48 object-cover'
                      loading='lazy'
                    />
                    <div className='p-3 sm:p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='px-2 py-1 bg-[#FF9933]/10 text-[#FF9933] rounded text-xs font-medium'>
                          {relatedArticle.category}
                        </span>
                      </div>
                      <h3 className='font-semibold mb-2 line-clamp-2 hover:text-[#FF9933] transition-colors text-sm sm:text-base'>
                        {relatedArticle.title}
                      </h3>
                      <p className='text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2'>
                        {relatedArticle.excerpt}
                      </p>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <span>{relatedArticle.date}</span>
                        <span>•</span>
                        <span>{relatedArticle.readTime}</span>
                        <span className='hidden sm:inline'>•</span>
                        <span className='hidden sm:inline'>
                          {relatedArticle.views} views
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Navigation - Mobile Responsive with Collapsible */}
        <section className='border-t pt-6 sm:pt-8'>
          <div className='flex items-center justify-between mb-4 sm:mb-6'>
            <h3 className='text-lg sm:text-xl font-semibold'>
              Browse All Press Articles
            </h3>
            <button
              onClick={() => setShowAllArticles(!showAllArticles)}
              className='flex items-center gap-1 text-sm text-[#FF9933] hover:text-[#FF9933]/80 transition-colors md:hidden'
            >
              {showAllArticles ? (
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
              showAllArticles ? "block" : "hidden md:grid"
            }`}
          >
            {pressArticles.map((pressArticle) => (
              <button
                key={pressArticle.id}
                onClick={() => goToArticle(pressArticle.id)}
                className={`p-3 sm:p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                  article.id === pressArticle.id
                    ? "border-[#FF9933] bg-[#FF9933]/5"
                    : "border-border hover:border-[#FF9933]/50"
                }`}
              >
                <div className='flex items-center gap-1.5 sm:gap-2 mb-2'>
                  <span className='px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#FF9933]/10 text-[#FF9933] rounded text-xs font-medium'>
                    {pressArticle.category}
                  </span>
                  {article.id === pressArticle.id && (
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
                  <span>{pressArticle.date}</span>
                  <span>•</span>
                  <span className='truncate'>{pressArticle.source}</span>
                  <span className='hidden sm:inline'>•</span>
                  <span className='hidden sm:inline'>
                    {pressArticle.views} views
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile: Show summary when collapsed */}
          <div className={`md:hidden ${showAllArticles ? "hidden" : "block"}`}>
            <p className='text-sm text-muted-foreground text-center py-4'>
              {pressArticles.length} articles available • Tap "Show All" to
              browse
            </p>
          </div>
        </section>
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
