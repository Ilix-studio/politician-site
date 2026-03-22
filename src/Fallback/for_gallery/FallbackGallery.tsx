import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhotoImage {
  _id: string;
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

export interface PhotoCategory {
  _id: string;
  name: string;
  type: string;
}

export interface PhotoEntry {
  _id: string;
  images: PhotoImage[];
  title: string;
  category: PhotoCategory | string;
  date: string;
  location?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_PHOTOS: PhotoEntry[] = [
  {
    _id: "68a58ef1fe2f9101fc310b9e",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755680495/dynamic-images-for-politician/b57kwaq1bwz6re7xi2a2.png",
        alt: "Screenshot 2025-08-20 at 14",
        cloudinaryPublicId:
          "dynamic-images-for-politician/b57kwaq1bwz6re7xi2a2",
        _id: "68a58ef1fe2f9101fc310b9f",
      },
    ],
    title: "দেগ্রোং কেন্দ্রীয় ৰঙালী বিহু সম্মিলন",
    category: {
      _id: "6888ec6b29b1dd8effc66341",
      name: "Social Initiatives",
      type: "photo",
    },
    date: "2024-04-21T00:00:00.000Z",
    location: "Doigrung, Golaghat",
    isActive: true,
    createdAt: "2025-08-20T09:01:38.124Z",
    updatedAt: "2025-08-20T09:01:38.124Z",
  },
  {
    _id: "68a586cafe2f9101fc310b81",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755678409/dynamic-images-for-politician/r2nm1mm0jdxlq5dn8mpk.png",
        alt: "Screenshot 2025-08-20 at 13",
        cloudinaryPublicId:
          "dynamic-images-for-politician/r2nm1mm0jdxlq5dn8mpk",
        _id: "68a586cafe2f9101fc310b82",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755678409/dynamic-images-for-politician/gyte5imm8n2rnudwh3jb.png",
        alt: "Screenshot 2025-08-20 at 13",
        cloudinaryPublicId:
          "dynamic-images-for-politician/gyte5imm8n2rnudwh3jb",
        _id: "68a586cafe2f9101fc310b83",
      },
    ],
    title: "Honorable CM's visit to Deopahar Archaeological Site",
    category: {
      _id: "6888ec6b29b1dd8effc66341",
      name: "Social Initiatives",
      type: "photo",
    },
    date: "2024-11-28T00:00:00.000Z",
    location: "Numaligarh, Golaghat",
    description:
      "Honorable Chief Minister Dr. at the archaeological field of Deopahar today. During the observation with Himanta Biswa Sharma.",
    isActive: true,
    createdAt: "2025-08-20T08:26:51.234Z",
    updatedAt: "2025-08-20T08:26:51.234Z",
  },
  {
    _id: "68a582cdfe2f9101fc310b57",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755677387/dynamic-images-for-politician/rrbkwgjepseebenimu31.png",
        alt: "Tricolor Jatra program",
        cloudinaryPublicId:
          "dynamic-images-for-politician/rrbkwgjepseebenimu31",
        _id: "68a582cdfe2f9101fc310b58",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755677387/dynamic-images-for-politician/uck7czfz1cjqm2cvge4j.png",
        alt: "Tricolor Jatra program",
        cloudinaryPublicId:
          "dynamic-images-for-politician/uck7czfz1cjqm2cvge4j",
        _id: "68a582cdfe2f9101fc310b59",
      },
    ],
    title: "Tricolor Jatra program",
    category: { _id: "68a58240fe2f9101fc310b52", name: "Rally", type: "photo" },
    date: "2025-08-15T00:00:00.000Z",
    location: "Uriyamghat, Golaghat",
    description:
      'On the eve of 79th Independence Day, participated in the "Tricolor Jatra" program organized by Bharatiya Janata Party\'s Uriyamghat Mandal.',
    isActive: true,
    createdAt: "2025-08-20T08:09:49.684Z",
    updatedAt: "2025-08-20T08:09:49.684Z",
  },
  {
    _id: "6893742571f0e35202c959ee",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1754493989/dynamic-images-for-politician/jqoicnjzdjl2xgu1mg3d.jpg",
        alt: "465892865_3816150395316040_5531231463533882552_n",
        cloudinaryPublicId:
          "dynamic-images-for-politician/jqoicnjzdjl2xgu1mg3d",
        _id: "6893742571f0e35202c959ef",
      },
    ],
    title: "Meeting about Development",
    category: {
      _id: "6889291ed44b4fd96490d350",
      name: "Meeting",
      type: "photo",
    },
    date: "2025-07-30T00:00:00.000Z",
    location: "Golaghat",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae.",
    isActive: true,
    createdAt: "2025-08-06T15:26:30.079Z",
    updatedAt: "2025-08-06T15:26:30.079Z",
  },
  {
    _id: "689313c58460bec94146d350",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1754469316/dynamic-images-for-politician/uizhlshc4jmmx6ao71eb.jpg",
        alt: "518391784_122147283416402360_6233681102923121997_n",
        cloudinaryPublicId:
          "dynamic-images-for-politician/uizhlshc4jmmx6ao71eb",
        _id: "689313c58460bec94146d351",
      },
    ],
    title: "No Eviction in Tengani",
    category: {
      _id: "689313a28460bec94146d34b",
      name: "Eviction News",
      type: "photo",
    },
    date: "2025-07-17T00:00:00.000Z",
    location: "Sarupathar",
    isActive: true,
    createdAt: "2025-08-06T08:35:17.360Z",
    updatedAt: "2025-08-06T08:35:17.360Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhotoMainImage(photo: PhotoEntry): PhotoImage {
  return (
    photo.images?.[0] ?? {
      src: "",
      alt: photo.title,
      cloudinaryPublicId: "",
      _id: "",
    }
  );
}

function getPhotoCategoryName(category: PhotoEntry["category"]): string {
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

// ─── Category color map ───────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Social Initiatives": "bg-blue-50 text-blue-700",
  Rally: "bg-orange-50 text-orange-700",
  Meeting: "bg-purple-50 text-purple-700",
  "Eviction News": "bg-red-50 text-red-700",
};

function categoryBadgeStyle(name: string): string {
  return CATEGORY_COLORS[name] ?? "bg-white/90 text-gray-800";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FallbackPhotoGalleryProps {
  /** How many cards to show. Defaults to all 5. */
  limit?: number;
}

const FallbackGallery: React.FC<FallbackPhotoGalleryProps> = ({
  limit = 5,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const photos = MOCK_PHOTOS.filter((p) => p.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const handlePhotoClick = (id: string) => {
    // TODO: Implement navigation to photo detail page
    console.log("Photo clicked:", id);
  };

  return (
    <>
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
              Gallery
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Moments from the Journey
            </h2>
            <p className='text-muted-foreground mt-4 px-2'>
              A glimpse into our work, community engagement, and public events.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {photos.map((photo, index) => {
              const mainImage = getPhotoMainImage(photo);
              const categoryName = getPhotoCategoryName(photo.category);

              return (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handlePhotoClick(photo._id)}
                  className={cn(
                    "cursor-pointer rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 group",
                    hovered === index && "scale-105 shadow-2xl",
                  )}
                >
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    {mainImage.src ? (
                      <img
                        src={mainImage.src}
                        alt={mainImage.alt}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        loading='lazy'
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x300/f1f5f9/94a3b8?text=Photo";
                        }}
                      />
                    ) : (
                      <div className='w-full h-full bg-slate-100 flex items-center justify-center'>
                        <span className='text-slate-400 text-sm'>No image</span>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className='absolute top-3 left-3'>
                      <span
                        className={cn(
                          "px-2 py-1 backdrop-blur rounded-full text-xs font-medium",
                          categoryBadgeStyle(categoryName),
                        )}
                      >
                        {categoryName}
                      </span>
                    </div>

                    {/* Multiple photos indicator */}
                    {photo.images && photo.images.length > 1 && (
                      <div className='absolute top-3 right-3'>
                        <span className='px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium'>
                          +{photo.images.length - 1}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='absolute bottom-4 left-4 right-4 text-white'>
                        <h3 className='font-bold text-lg mb-1 line-clamp-2'>
                          {photo.title}
                        </h3>
                        <div className='flex items-center gap-3 text-sm'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {formatDate(photo.date)}
                          </div>
                          {photo.location && (
                            <div className='flex items-center gap-1'>
                              <MapPin className='w-3 h-3' />
                              <span className='truncate'>{photo.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card content */}
                  <CardContent className='p-4'>
                    <h3 className='font-semibold text-gray-900 line-clamp-1 mb-1'>
                      {photo.title}
                    </h3>
                    <p className='text-sm text-gray-600 mb-2'>{categoryName}</p>
                    {photo.description && (
                      <p className='text-sm text-gray-500 line-clamp-2'>
                        {photo.description}
                      </p>
                    )}
                    {photo.location && (
                      <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                        <MapPin className='w-3 h-3' />
                        {photo.location}
                      </p>
                    )}
                  </CardContent>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FallbackGallery;
