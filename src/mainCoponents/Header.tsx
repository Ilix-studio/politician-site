import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='relative h-8 w-8'>
            <img
              src='/placeholder.svg?height=32&width=32'
              alt='Logo'
              className='object-contain'
            />
          </div>
          <span className='text-lg font-bold'>Biswajit Phukan</span>
        </div>
        <nav className='hidden md:flex items-center gap-6'>
          <Link to='#home' className='text-sm font-medium hover:text-primary'>
            Home
          </Link>
          <Link to='#about' className='text-sm font-medium hover:text-primary'>
            About
          </Link>
          <Link
            to='#achievements'
            className='text-sm font-medium hover:text-primary'
          >
            Achievements
          </Link>
          <Link
            to='#initiatives'
            className='text-sm font-medium hover:text-primary'
          >
            Initiatives
          </Link>
          <Link
            to='#gallery'
            className='text-sm font-medium hover:text-primary'
          >
            Gallery
          </Link>
          <Link to='#news' className='text-sm font-medium hover:text-primary'>
            News
          </Link>
          <Link
            to='#contact'
            className='text-sm font-medium hover:text-primary'
          >
            Contact
          </Link>
        </nav>
        <Button variant='outline' className='md:hidden'>
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;
