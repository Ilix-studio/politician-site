import { useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContentPreview } from "@/lib/helperfn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PressImage {
  _id: string;
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

export interface PressCategory {
  _id: string;
  name: string;
  type: string;
}

export interface PressType {
  _id: string;
  title: string;
  source: string;
  date: string;
  images: PressImage[];
  category: PressCategory | string;
  author?: string;
  readTime?: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_PRESS: PressType[] = [
  {
    _id: "689375f171f0e35202c95a6c",
    title: "Political Rally",
    source: "The Truth",
    date: "2025-07-29T00:00:00.000Z",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1754494448/politician-press-articles/bjkd7aiofouusoohwaoo.jpg",
        alt: "Testing",
        cloudinaryPublicId: "politician-press-articles/bjkd7aiofouusoohwaoo",
        _id: "689375f171f0e35202c95a6d",
      },
    ],
    category: {
      _id: "688c3fc3ca745ed5135e95bf",
      name: "Political Rally",
      type: "press",
    },
    readTime: "5 min",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
    isActive: true,
    createdAt: "2025-08-06T15:34:09.422Z",
    updatedAt: "2025-08-20T09:03:22.993Z",
  },
  {
    _id: "68930cc68460bec94146d288",
    title: "টেঙানী আঞ্চলিক গাঁও প্ৰধান সন্থা",
    source: "Sky News Assam",
    date: "2025-07-17T00:00:00.000Z",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1754467525/politician-press-articles/lzmto5zquomthzmf0y7j.jpg",
        alt: "টেঙানী আঞ্চলিক গাঁও প্ৰধান সন্থা",
        cloudinaryPublicId: "politician-press-articles/lzmto5zquomthzmf0y7j",
        _id: "68930cc68460bec94146d289",
      },
    ],
    category: {
      _id: "68930c5c8460bec94146d26d",
      name: "Awareness",
      type: "press",
    },
    author: "Editor",
    readTime: "4 min",
    content:
      "আমি টেঙানী আঞ্চলিক গাঁও প্ৰধান সন্থাই টেঙানীবাসী ৰাইজৰ মাটিৰ ম্যাদি পট্টাৰ ক্ষেত্ৰত স্থানীয় তথা সন্মানীয় বিধায়ক মহোদয়ৰ নিৰ্দেশমৰ্মে ইতিমধ্যে টেঙানীৰ প্ৰত্যেকটো পৰিয়ালৰ প্ৰয়োজনীয় নথি-পত্ৰ বিভাগীয় কাৰ্যালয়ত জমা কৰা হৈছে।",
    isActive: true,
    createdAt: "2025-08-06T08:05:26.937Z",
    updatedAt: "2025-08-06T08:06:31.684Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryName(category: PressType["category"]): string {
  if (typeof category === "object" && category !== null) return category.name;
  return String(category);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Political Rally": "bg-orange-100 text-orange-700",
  Awareness: "bg-blue-100 text-blue-700",
  Development: "bg-green-100 text-green-700",
  "Eviction News": "bg-red-100 text-red-700",
};

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? "bg-gray-100 text-gray-600";
}

function handleShare(press: PressType, e: React.MouseEvent) {
  e.stopPropagation();
  if (navigator.share) {
    navigator
      .share({ title: press.title, text: press.content.slice(0, 120) })
      .catch(() => {});
  } else {
    navigator.clipboard
      .writeText(window.location.origin + `/press/${press._id}`)
      .catch(() => {});
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const FallbackPressSection: React.FC = () => {
  const navigate = useNavigate();

  const pressArticles = MOCK_PRESS.filter((p) => p.isActive).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handlePressClick = (id: string) => {
    // TODO: Implement press detail navigation
    console.log("Press detail navigation:", id);
  };
  const handleViewAllPress = () => navigate("/press");

  return (
    <section id='press' className='py-16 md:py-24 bg-slate-50'>
      <div className='container mx-auto px-4 sm:px-6'>
        {/* Header */}
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
              {pressArticles.map((press) => {
                const categoryName = getCategoryName(press.category);
                const primaryImage = press.images?.[0];

                return (
                  <div
                    key={press._id}
                    className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group'
                  >
                    {/* Image block */}
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/600x300/f1f5f9/94a3b8?text=Press";
                            }}
                          />
                        )}
                        {/* Source pill — top left */}
                        <div className='absolute top-2 left-2 bg-white py-1 px-2 text-xs rounded font-medium shadow-sm'>
                          {press.source}
                        </div>
                        {/* Category badge — top right */}
                        <div className='absolute top-2 right-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              categoryName,
                            )}`}
                          >
                            {categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className='p-4'>
                      <div
                        className='block hover:text-[#FF9933] transition-colors cursor-pointer'
                        onClick={() => handlePressClick(press._id)}
                      >
                        <h3 className='font-semibold text-lg mb-2 line-clamp-2 leading-tight'>
                          {press.title}
                        </h3>
                        <p className='text-gray-600 text-sm line-clamp-2'>
                          {getContentPreview(press.content)}
                        </p>
                      </div>

                      {press.readTime && (
                        <div className='flex items-center gap-2 text-xs text-gray-500 mt-2 mb-4'>
                          <span>{press.readTime} read</span>
                          {press.author && (
                            <>
                              <span>·</span>
                              <span>{press.author}</span>
                            </>
                          )}
                        </div>
                      )}

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
                disabled
                className='hover:bg-[#FF9933] hover:text-white hover:border-[#FF9933] transition-colors'
              >
                View All Press Articles
              </Button>
            </div>

            {/* Fallback notice */}
            <p className='text-sm text-gray-400 text-center mt-4 italic'>
              Limited Mode — Live data temporarily unavailable
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default FallbackPressSection;
