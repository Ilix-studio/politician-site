import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const legalLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Accessibility",
    "Sitemap",
  ];

  return (
    <footer className='border-t bg-slate-50'>
      <div className='container py-8 md:py-12 px-4 sm:px-6'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4 px-2'>
            <div className='flex items-center gap-3'>
              <div className='relative h-10 w-10'>
                <img
                  src='https://i.postimg.cc/0Qrhpj56/BJPico.png'
                  alt='Logo'
                  className='object-contain'
                />
              </div>
              <span className='text-lg font-bold'>Biswajit Phukan</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Dedicated to the progress and prosperity of our nation. Working
              tirelessly for the welfare of all citizens.
            </p>
          </div>

          <div className='space-y-4 px-2'>
            <h3 className='text-lg font-semibold'>Quick Links</h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to='#home'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Home
              </Link>
              <Link
                to='#about'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                About
              </Link>
              <Link
                to='#achievements'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Achievements
              </Link>
              <Link
                to='#initiatives'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Initiatives
              </Link>
              <Link
                to='#gallery'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Gallery
              </Link>
            </nav>
          </div>

          <div className='space-y-4 px-2'>
            <h3 className='text-lg font-semibold'>Resources</h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Press Releases
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Speeches
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Policy Documents
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Constituency Map
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Parliament Records
              </Link>
            </nav>
          </div>

          <div className='space-y-4 px-2'>
            <h3 className='text-lg font-semibold'>Subscribe</h3>
            <p className='text-sm text-muted-foreground'>
              Stay updated with our newsletter
            </p>
            <form className='flex flex-col sm:flex-row gap-3'>
              <input
                type='email'
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='Your email'
              />
              <Button type='submit' variant='outline' className='h-11 shrink-0'>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              &copy; {new Date().getFullYear()} Biswajit Phukan. All rights
              reserved.
            </p>
            <Badge
              variant='outline'
              className='bg-green-50 text-green-700 border-green-200'
            >
              Made in India 🇮🇳
            </Badge>
          </div>

          <div className='flex flex-wrap justify-center gap-4 md:gap-6'>
            {legalLinks.map((item, index) => (
              <a
                key={index}
                href='#'
                className='text-sm text-muted-foreground hover:text-primary transition-colors duration-200'
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
