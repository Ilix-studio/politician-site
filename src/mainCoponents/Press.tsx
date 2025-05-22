import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import pressFirst from "./../assets/press/F.jpg";

// Press articles data
const pressArticles = [
  {
    id: 1,
    title:
      "Biswajit Phukan inaugurates new rural development project in Sarupathar",
    source: "Assam Tribune",
    date: "May 18, 2023",
    image: pressFirst,
    link: "#",
  },
  {
    id: 2,
    title:
      "BJP MLA Biswajit Phukan announces new healthcare initiative for rural areas",
    source: "The Times of India",
    date: "Apr 12, 2023",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
  {
    id: 3,
    title: "Education reform policy launched by Assam MLA Biswajit Phukan",
    source: "Northeast Today",
    date: "Mar 05, 2023",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
  {
    id: 4,
    title:
      "Biswajit Phukan addresses infrastructure challenges in Golaghat district",
    source: "Pratidin Time",
    date: "Feb 22, 2023",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
  {
    id: 5,
    title: "MLA Biswajit Phukan's efforts recognized in state assembly",
    source: "Assam Tribune",
    date: "Jan 15, 2023",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
  {
    id: 6,
    title:
      "Biswajit Phukan leads initiative to promote local culture and heritage",
    source: "The Sentinel",
    date: "Dec 10, 2022",
    image: "/placeholder.svg?height=200&width=300",
    link: "#",
  },
];

const Press = () => {
  return (
    <section id='press' className='py-16 md:py-24 bg-slate-50'>
      <div className='container mx-auto'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
            Press Coverage
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Media Highlights
          </h2>
          <p className='text-muted-foreground mt-4'>
            Recent news articles and press coverage of our initiatives and
            accomplishments.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {pressArticles.map((article) => (
            <div
              key={article.id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              <a href={article.link} className='block'>
                <div className='relative'>
                  <img
                    src={article.image}
                    alt={article.title}
                    className='w-full h-48 object-cover'
                  />
                  <div className='absolute top-2 left-2 bg-white py-1 px-2 text-xs rounded font-medium'>
                    {article.source}
                  </div>
                </div>
              </a>
              <div className='p-4'>
                <a href={article.link} className='block hover:text-[#FF9933]'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2'>
                    {article.title}
                  </h3>
                </a>
                <div className='flex justify-between items-center mt-4'>
                  <span className='text-gray-500 text-sm'>{article.date}</span>
                  <button
                    className='text-gray-500 hover:text-[#FF9933] transition-colors'
                    aria-label='Share article'
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-10'>
          <Button variant='outline' size='lg'>
            View All Press
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Press;
