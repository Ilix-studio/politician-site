import A from "./../assets/Galleries/A.jpg";
import B from "./../assets/Galleries/B.jpg";
import C from "./../assets/Galleries/C.jpg";
import D from "./../assets/Galleries/D.jpg";
import E from "./../assets/Galleries/E.jpg";
import F from "./../assets/Galleries/F.jpg";

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

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='relative aspect-square'>
            <img
              src={E}
              alt='Community Meeting'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src={B}
              alt='Inauguration Ceremony'
              className='object-cover rounded-lg'
            />
          </div>

          <div className='relative aspect-square'>
            <img
              src={D}
              alt='Parliament Session'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src={A}
              alt='Rural Visit'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src={C}
              alt='Public Rally'
              className='object-cover rounded-lg'
            />
          </div>
          <div className='relative aspect-square'>
            <img
              src={F}
              alt='School Visit'
              className='object-cover rounded-lg'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
