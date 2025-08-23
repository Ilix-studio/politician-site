import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BJP_LOGO from "./../assets/bjp.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='relative h-16 w-16'>
            <img src={BJP_LOGO} alt='Logo' className='object-contain' />
          </div>
          <span className='text-lg font-bold'>Biswajit Phukan</span>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <a
            href='#home'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
            Home
          </a>
          <Link
            to='/about'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
            About
          </Link>
          <a
            href='#achievements'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
            Achievements
          </a>
          <a
            href='#initiatives'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
            Initiatives
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center text-sm font-medium hover:text-primary transition-colors duration-200'>
              Gallery <ChevronDown className='ml-1 w-4 h-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to='/photo-gallery' className='w-full'>
                  Photo Gallery
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to='/video-gallery' className='w-full'>
                  Video Gallery
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href='/see-all-press'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
            Press
          </a>
          <a
            href='#contact'
            className='text-sm font-medium hover:text-primary transition-colors duration-200'
          >
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
        <motion.div
          className='md:hidden bg-background border-b'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className='container py-4 flex flex-col items-center text-center space-y-3'>
            <Link
              to='#home'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              Home
            </Link>
            <a
              href='/about'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              About
            </a>
            <a
              href='#achievements'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              Achievements
            </a>
            <a
              href='#initiatives'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              Initiatives
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center text-sm font-medium hover:text-primary transition-colors duration-200'>
                Gallery <ChevronDown className='ml-1 w-4 h-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <a href='/photo-gallery' className='w-full'>
                    Photo Gallery
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href='/video-gallery' className='w-full'>
                    Video Gallery
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href='#press'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              Press
            </a>
            <a
              href='#contact'
              className='text-sm font-medium hover:text-primary py-2 w-full transition-colors duration-200'
              onClick={toggleMenu}
            >
              Contact
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
