import { Share2 } from "lucide-react";
import { Link } from "react-router-dom";

// Press articles data
const pressArticles = [
  {
    id: 1,
    title:
      "Biswajit Phukan inaugurates new rural development project in Sarupathar",
    source: "Assam Tribune",
    date: "May 18, 2023",
    image: "/placeholder.svg?height=200&width=300",
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

// Popular press articles for the sidebar
const popularPressArticles = [
  {
    id: 101,
    title: "BJP's roots in Assam strengthened through education initiatives",
    date: "May 10, 2023",
    image: "/placeholder.svg?height=80&width=120",
    link: "#",
  },
  {
    id: 102,
    title: "Democracy reached to grassroots level in Sarupathar",
    date: "Mar 02, 2023",
    image: "/placeholder.svg?height=80&width=120",
    link: "#",
  },
  {
    id: 103,
    title: "Use tech to maintain maximum reach, says Biswajit Phukan",
    date: "Mar 04, 2023",
    image: "/placeholder.svg?height=80&width=120",
    link: "#",
  },
  {
    id: 104,
    title: "गृहमंत्री के साथ बिस्वजित फुकन ने की बैठक",
    date: "May 09, 2023",
    image: "/placeholder.svg?height=80&width=120",
    link: "#",
  },
];

const Press = () => {
  return (
    <section id='press' className='py-16 md:py-24 bg-slate-50'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mb-12'>
          <div className='inline-block'>
            <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
              Press
            </div>
          </div>
          <Link to='/press' className='text-[#FF9933] font-medium'>
            MORE
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Main press articles - 3/4 width on desktop */}
          <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {pressArticles.map((article) => (
              <div
                key={article.id}
                className='bg-white rounded-lg shadow-md overflow-hidden'
              >
                <div className='relative'>
                  <img
                    src={article.image}
                    alt={article.title}
                    className='w-full h-48 object-cover'
                  />
                  <div className='absolute top-2 left-2 bg-white py-1 px-2 text-xs rounded'>
                    {article.source}
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2'>
                    {article.title}
                  </h3>
                  <div className='flex justify-between items-center mt-4'>
                    <span className='text-gray-500 text-sm'>
                      {article.date}
                    </span>
                    <button
                      className='text-gray-500 hover:text-[#FF9933]'
                      aria-label='Share article'
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular press sidebar - 1/4 width on desktop */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-bold mb-6'>Popular Press</h2>
              <div className='space-y-6'>
                {popularPressArticles.map((article) => (
                  <div key={article.id} className='flex gap-4'>
                    <img
                      src={article.image}
                      alt=''
                      className='w-20 h-20 object-cover rounded-md'
                    />
                    <div className='flex flex-col justify-between'>
                      <h3 className='font-medium line-clamp-2'>
                        {article.title}
                      </h3>
                      <span className='text-gray-500 text-sm'>
                        {article.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Press;
