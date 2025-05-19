import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import BJP_LOGO from "./../assets/bjp.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='relative h-8 w-8'>
            <img src={BJP_LOGO} alt='Logo' className='object-contain' />
          </div>
          <span className='text-lg font-bold'>Biswajit Phukan</span>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <a href='#home' className='text-sm font-medium hover:text-primary'>
            Home
          </a>
          <a href='#about' className='text-sm font-medium hover:text-primary'>
            About
          </a>
          <a
            href='#achievements'
            className='text-sm font-medium hover:text-primary'
          >
            Achievements
          </a>
          <a
            href='#initiatives'
            className='text-sm font-medium hover:text-primary'
          >
            Initiatives
          </a>
          <a href='#gallery' className='text-sm font-medium hover:text-primary'>
            Gallery
          </a>
          <a href='#press' className='text-sm font-medium hover:text-primary'>
            Press
          </a>
          <a href='#contact' className='text-sm font-medium hover:text-primary'>
            Contact
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <Button
          variant='ghost'
          className='md:hidden'
          onClick={toggleMenu}
          aria-label='Toggle menu'
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-background border-b'>
          <nav className='container py-4 flex flex-col items-center text-center space-y-3'>
            <a
              href='#home'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href='#about'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              About
            </a>
            <a
              href='#achievements'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Achievements
            </a>
            <a
              href='#initiatives'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Initiatives
            </a>
            <a
              href='#gallery'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Gallery
            </a>
            <a
              href='#press'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Press
            </a>
            <a
              href='#contact'
              className='text-sm font-medium hover:text-primary py-2 w-full'
              onClick={toggleMenu}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
