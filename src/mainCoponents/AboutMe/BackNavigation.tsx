import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, ArrowLeft } from "lucide-react";

export const BackNavigation = () => {
  const handleHomeRedirect = () => {
    window.location.href = "/";
  };

  return (
    <div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Home Navigation */}
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
              <span className='font-medium'>Back to Home</span>
            </Button>

            <div className='hidden sm:block w-px h-6 bg-gray-300'></div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              className='hidden md:flex items-center gap-2 hover:bg-[#FF9933]/5 hover:border-[#FF9933]/30'
            >
              <Share2 className='w-4 h-4' />
              Share
            </Button>

            <Button
              size='sm'
              className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90 text-white shadow-lg'
            >
              <MessageSquare className='w-4 h-4 mr-2' />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
