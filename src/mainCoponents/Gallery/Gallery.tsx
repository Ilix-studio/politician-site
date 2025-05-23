import A from "./../../assets/Galleries/A.jpg";
import B from "./../../assets/Galleries/B.jpg";
import C from "./../../assets/Galleries/C.jpg";
import D from "./../../assets/Galleries/D.jpg";
import E from "./../../assets/Galleries/E.jpg";
import F from "./../../assets/Galleries/F.jpg";

const Gallery = () => {
  return (
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

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-1'>
          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={E}
              alt='Community Meeting'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>
          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={B}
              alt='Inauguration Ceremony'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>

          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={D}
              alt='Parliament Session'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>
          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={A}
              alt='Rural Visit'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>
          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={C}
              alt='Public Rally'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>
          <div className='relative aspect-square group overflow-hidden rounded-lg shadow-md'>
            <img
              src={F}
              alt='School Visit'
              className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
