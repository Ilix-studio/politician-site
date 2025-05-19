import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BJP_LOGO from "./../assets/bjp.png";

const Footer = () => {
  return (
    <footer className='border-t bg-slate-50'>
      <div className='container py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='relative h-8 w-8'>
                <img src={BJP_LOGO} alt='Logo' className='object-contain' />
              </div>
              <span className='text-lg font-bold'>Biswajit Phukan</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Dedicated to the progress and prosperity of our nation. Working
              tirelessly for the welfare of all citizens.
            </p>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Quick Links</h3>
            <nav className='flex flex-col space-y-2'>
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

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Resources</h3>
            <nav className='flex flex-col space-y-2'>
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

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Subscribe</h3>
            <p className='text-sm text-muted-foreground'>
              Stay updated with our newsletter
            </p>
            <form className='flex gap-2'>
              <input
                type='email'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='Your email'
              />
              <Button type='submit' variant='outline'>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} Biswajit Phukan. All rights
            reserved.
          </p>
          <div className='flex gap-4'>
            <Link
              to='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              Privacy Policy
            </Link>
            <Link
              to='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              Terms of Service
            </Link>
            <Link
              to='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
