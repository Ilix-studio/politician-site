import { Share2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetPressQuery } from "@/redux-store/services/pressApi";
import { Press as PressType } from "@/types/press.types";

const Press = () => {
  const navigate = useNavigate();

  // Fetch press articles using Redux API
  const {
    data: pressData,
    isLoading,
    error,
  } = useGetPressQuery({
    page: 1,
    limit: 6, // Show only 6 articles in the preview
    sortBy: "date",
    sortOrder: "desc",
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (category: PressType["category"]): string => {
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

  const handleShare = async (press: PressType, e: React.MouseEvent) => {
    e.preventDefault();

    const shareData = {
      title: press.title,
      text: press.excerpt,
      url: `${window.location.origin}/press/${press._id}`,
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
    }
  };

  const handleViewAllPress = () => {
    // Navigate to a dedicated press page or scroll to press section
    // You can implement this based on your routing structure
    navigate("/press");
  };

  const handlePressClick = (pressId: string) => {
    navigate(`/press/${pressId}`);
  };

  if (isLoading) {
    return (
      <section id='press' className='py-16 md:py-24 bg-slate-50'>
        <div className='container mx-auto'>
          <div className='text-center max-w-3xl mx-auto mb-12'>
            <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
              Press Coverage
            </div>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
              Media Highlights
            </h2>
            <p className='text-muted-foreground mt-4'>
              Recent news articles and press coverage of our initiatives and
              accomplishments.
            </p>
          </div>

          <div className='flex justify-center items-center py-12'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4 text-[#FF9933]' />
              <p className='text-muted-foreground'>Loading press articles...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id='press' className='py-16 md:py-24 bg-slate-50'>
        <div className='container mx-auto'>
          <div className='text-center max-w-3xl mx-auto mb-12'>
            <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
              Press Coverage
            </div>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
              Media Highlights
            </h2>
            <p className='text-muted-foreground mt-4'>
              Recent news articles and press coverage of our initiatives and
              accomplishments.
            </p>
          </div>

          <div className='flex justify-center items-center py-12'>
            <div className='text-center'>
              <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <p className='text-muted-foreground mb-4'>
                Unable to load press articles at the moment.
              </p>
              <Button
                variant='outline'
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pressArticles = pressData?.data?.press || [];

  return (
    <section id='press' className='py-16 md:py-24 bg-slate-50'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
            Press Coverage
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Media Highlights
          </h2>
          <p className='text-muted-foreground mt-4'>
            Recent news articles and press coverage of our initiatives and
            accomplishments.
          </p>
        </div>

        {pressArticles.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>
              No press articles available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {pressArticles.map((press: PressType) => {
                const categoryName = getCategoryName(press.category);
                const primaryImage = press.images?.[0];

                return (
                  <div
                    key={press._id}
                    className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group'
                  >
                    <div
                      className='block cursor-pointer'
                      onClick={() => handlePressClick(press._id)}
                    >
                      <div className='relative'>
                        {primaryImage && (
                          <img
                            src={primaryImage.src}
                            alt={primaryImage.alt}
                            className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        )}
                        <div className='absolute top-2 left-2 bg-white py-1 px-2 text-xs rounded font-medium shadow-sm'>
                          {press.source}
                        </div>
                        <div className='absolute top-2 right-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              categoryName
                            )}`}
                          >
                            {categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='p-4'>
                      <div
                        className='block hover:text-[#FF9933] transition-colors cursor-pointer'
                        onClick={() => handlePressClick(press._id)}
                      >
                        <h3 className='font-semibold text-lg mb-2 line-clamp-2 leading-tight'>
                          {press.title}
                        </h3>
                      </div>

                      <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                        {press.excerpt}
                      </p>

                      <div className='flex items-center gap-2 text-xs text-gray-500 mb-4'>
                        <span>{press.author}</span>
                        <span>•</span>
                        <span>{press.readTime}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-gray-500 text-sm'>
                          {formatDate(press.date)}
                        </span>

                        <div className='flex items-center gap-2'>
                          <button
                            className='text-gray-500 hover:text-[#FF9933] transition-colors p-1'
                            aria-label='Share article'
                            onClick={(e) => handleShare(press, e)}
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='text-center mt-10'>
              <Button
                variant='outline'
                size='lg'
                onClick={handleViewAllPress}
                className='hover:bg-[#FF9933] hover:text-white hover:border-[#FF9933] transition-colors'
              >
                View All Press Articles
              </Button>

              {pressData?.data?.pagination &&
                pressData.data.pagination.total > 6 && (
                  <p className='text-sm text-muted-foreground mt-2'>
                    Showing {pressArticles.length} of{" "}
                    {pressData.data.pagination.total} articles
                  </p>
                )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Press;
