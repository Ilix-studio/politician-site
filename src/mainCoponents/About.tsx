import BiswajitPhukan from "./../assets/user.jpg";
import BJP from "./../assets/bjp.png";

const About = () => {
  return (
    <section id='about' className='py-12 md:py-16 lg:py-24 bg-white'>
      <div className='container px-4 sm:px-6'>
        <div className='grid gap-8 md:gap-12 md:grid-cols-2 items-center'>
          <div className='relative aspect-square max-w-md mx-auto mb-6 md:mb-0'>
            <img
              src={BiswajitPhukan}
              alt='Biswajit Phukan'
              className='object-cover rounded-lg shadow-md'
            />
            <div className='absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32'>
              <img src={BJP} alt='Indian Flag' className='object-contain' />
            </div>
          </div>
          <div className='space-y-6 px-2'>
            <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm'>
              About Me
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Committed to Service & National Development
            </h2>
            <p className='text-muted-foreground'>
              As a dedicated member of the Bharatiya Janata Party from Assam, I
              have committed my life to public service. I was elected to the
              Assam Legislative Assembly in 2021 from the Sarupathar
              constituency, winning with 1,07,090 votes.
            </p>
            <p className='text-muted-foreground'>
              Before my current role, I served as the vice-chairman of Assam
              State Cooperative Bank, where I worked to strengthen financial
              inclusion and support for local communities. I continue to uphold
              the values of integrity, transparency, and inclusive development.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4'>
              <div className='space-y-2 p-3 bg-slate-50 rounded-lg'>
                <h3 className='text-lg font-semibold'>Education</h3>
                <p className='text-sm text-muted-foreground'>
                  MA from Gauhati University (1997)
                </p>
              </div>
              <div className='space-y-2 p-3 bg-slate-50 rounded-lg'>
                <h3 className='text-lg font-semibold'>Family</h3>
                <p className='text-sm text-muted-foreground'>
                  Son of Rajen Phukan, married to Prapti Thakur
                </p>
              </div>
              <div className='space-y-2 p-3 bg-slate-50 rounded-lg'>
                <h3 className='text-lg font-semibold'>Party</h3>
                <p className='text-sm text-muted-foreground'>
                  Bharatiya Janata Party (BJP)
                </p>
              </div>
              <div className='space-y-2 p-3 bg-slate-50 rounded-lg'>
                <h3 className='text-lg font-semibold'>Constituency</h3>
                <p className='text-sm text-muted-foreground'>
                  Sarupathar, Assam
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
