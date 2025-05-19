import { Button } from "@/components/ui/button";

const Gallery = () => {
  return (
    <section id='gallery' className='py-16 md:py-24 bg-slate-50'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
            Gallery
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Moments from the Journey
          </h2>
          <p className='text-muted-foreground mt-4'>
            A glimpse into our work, community engagement, and public events.
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Community Meeting'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Inauguration Ceremony'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Rural Visit'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Parliament Session'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Public Rally'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='School Visit'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Independence Day Celebration'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src='/placeholder.svg?height=300&width=300'
              alt='Press Conference'
              className='object-cover rounded-lg'
            />
          </div>
        </div>

        <div className='text-center mt-8'>
          <Button variant='outline' size='lg'>
            View All Photos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
