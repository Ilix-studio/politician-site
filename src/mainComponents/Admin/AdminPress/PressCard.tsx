import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Building, Eye } from "lucide-react";
import { Press } from "@/types/press.types";

interface PressCardProps {
  press: Press;
  onView?: (id: string) => void;
  showActions?: boolean;
  variant?: "default" | "compact" | "featured";
}

const PressCard = ({
  press,
  onView,
  showActions = true,
  variant = "default",
}: PressCardProps) => {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const handleViewClick = () => {
    if (onView) {
      onView(press._id);
    }
  };

  // Get first image from images array
  const primaryImage = press.images?.[0];
  const categoryName = getCategoryName(press.category);

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className='bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer'
        onClick={handleViewClick}
      >
        <div className='p-4'>
          <div className='flex gap-4'>
            <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
              {primaryImage && (
                <img
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                  className='w-full h-full object-cover'
                />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-2 mb-2'>
                <h3 className='font-medium text-slate-800 line-clamp-2 text-sm'>
                  {press.title}
                </h3>
                <Badge
                  className={getCategoryColor(categoryName)}
                  variant='secondary'
                >
                  {categoryName}
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <span>{press.source}</span>
                <span>•</span>
                <span>{formatDate(press.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className='bg-white rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'
      >
        {/* Featured Image */}
        <div className='relative h-48 bg-gray-100 overflow-hidden'>
          {primaryImage && (
            <img
              src={primaryImage.src}
              alt={primaryImage.alt}
              className='w-full h-full object-cover'
            />
          )}
          <div className='absolute top-4 left-4'>
            <Badge className={getCategoryColor(categoryName)}>
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </Badge>
          </div>
        </div>

        <div className='p-6'>
          <h2 className='text-xl font-bold text-slate-800 mb-3 line-clamp-2'>
            {press.title}
          </h2>

          <p className='text-slate-600 mb-4 line-clamp-3'>{press.excerpt}</p>

          {/* Meta Information */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4'>
            <div className='flex items-center gap-1'>
              <User className='w-4 h-4' />
              <span>{press.author}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Building className='w-4 h-4' />
              <span>{press.source}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' />
              <span>{formatDate(press.date)}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              <span>{press.readTime}</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className='flex items-center gap-2'>
              <Button onClick={handleViewClick} className='flex-1'>
                <Eye className='w-4 h-4 mr-2' />
                Read Article
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className='bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300'
    >
      <div className='p-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Image */}
          <div className='lg:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
            {primaryImage && (
              <img
                src={primaryImage.src}
                alt={primaryImage.alt}
                className='w-full h-full object-cover'
              />
            )}
          </div>

          {/* Content */}
          <div className='flex-1 space-y-3'>
            <div className='flex flex-wrap items-start justify-between gap-2'>
              <h3 className='text-lg font-semibold text-slate-800 line-clamp-2'>
                {press.title}
              </h3>
              <Badge className={getCategoryColor(categoryName)}>
                {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
              </Badge>
            </div>

            <p className='text-slate-600 line-clamp-2'>{press.excerpt}</p>

            {/* Meta Information */}
            <div className='flex flex-wrap items-center gap-4 text-sm text-slate-500'>
              <div className='flex items-center gap-1'>
                <User className='w-4 h-4' />
                <span>{press.author}</span>
              </div>
              <span>•</span>
              <div className='flex items-center gap-1'>
                <Building className='w-4 h-4' />
                <span>{press.source}</span>
              </div>
              <span>•</span>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>{formatDate(press.date)}</span>
              </div>
              <span>•</span>
              <div className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                <span>{press.readTime}</span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className='flex items-center gap-2 pt-2'>
                <Button variant='outline' size='sm' onClick={handleViewClick}>
                  <Eye className='w-4 h-4 mr-1' />
                  Read
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PressCard;
