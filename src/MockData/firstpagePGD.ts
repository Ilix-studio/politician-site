import pressFirst from "../assets/press/F.jpg";
import pressSecond from "../assets/press/G.png";
import pressThird from "../assets/press/I.png";
import pressForth from "../assets/press/J.png";
import pressFivth from "../assets/press/K.png";
import pressSixth from "../assets/press/L.png";

// Define the article type
export interface Article {
  id: number;
  title: string;
  source: string;
  date: string;
  image: string;
  link: string;
  category: string;
  author: string;
  readTime: string;
  views: number;
  content: string;
  tags: string[];
  excerpt: string;
}

// Extended press articles data with full content and proper images
export const pressArticles: Article[] = [
  {
    id: 1,
    title:
      "Biswajit Phukan inaugurates new rural development project in Sarupathar",
    source: "Assam Tribune",
    date: "May 18, 2023",
    image: pressFirst,
    link: "https://assamtribune.com/example-link",
    category: "Development",
    author: "Staff Reporter",
    readTime: "3 min read",
    views: 1250,
    excerpt:
      "MLA Biswajit Phukan inaugurated a comprehensive rural development project worth ₹15 crores in Sarupathar constituency, aimed at transforming infrastructure and living conditions in remote villages.",
    content: `
      <p><strong>SARUPATHAR:</strong> In a significant step towards rural development, MLA Biswajit Phukan inaugurated a comprehensive rural development project in Sarupathar constituency today. The project, worth ₹15 crores, aims to transform the infrastructure and living conditions in remote villages.</p>
      
      <p>Speaking at the inauguration ceremony, Phukan emphasized the government's commitment to ensuring that development reaches every corner of the constituency. "This project represents our dedication to inclusive growth and our promise to leave no village behind in our development journey," he stated.</p>
      
      <p>The rural development initiative includes:</p>
      <ul>
        <li>Construction of all-weather roads connecting 12 villages</li>
        <li>Establishment of primary health centers</li>
        <li>Installation of solar power systems</li>
        <li>Creation of sustainable water supply mechanisms</li>
      </ul>
      
      <p>The project is expected to directly benefit over 5,000 families across the region. Local residents expressed their gratitude for the long-awaited infrastructure improvements.</p>
      
      <blockquote>"This project will transform our lives. Better roads mean better access to markets, healthcare, and education for our children," noted village head Rajesh Sharma.</blockquote>
      
      <p>The MLA also announced plans for skill development programs that will be integrated with the infrastructure development, ensuring that local youth have opportunities for employment and entrepreneurship.</p>
      
      <p>The project timeline spans 18 months, with the first phase focusing on road connectivity and the second phase on health and education infrastructure. Regular monitoring committees have been established to ensure timely completion and quality implementation.</p>
    `,
    tags: [
      "Rural Development",
      "Infrastructure",
      "Sarupathar",
      "Government Initiative",
    ],
  },
  {
    id: 2,
    title:
      "BJP MLA Biswajit Phukan announces new healthcare initiative for rural areas",
    source: "The Times of India",
    date: "Apr 12, 2023",
    image: pressSecond,
    link: "https://timesofindia.com/example-link",
    category: "Healthcare",
    author: "Priya Sharma",
    readTime: "4 min read",
    views: 980,
    excerpt:
      "BJP MLA Biswajit Phukan unveiled the 'Swasthya Seva Abhiyan', an ambitious healthcare initiative aimed at improving medical services in rural areas through mobile medical units and telemedicine facilities.",
    content: `
      <p><strong>GUWAHATI:</strong> BJP MLA Biswajit Phukan unveiled an ambitious healthcare initiative aimed at improving medical services in rural areas of his constituency. The comprehensive program focuses on bringing quality healthcare closer to remote communities.</p>
      
      <p>The initiative, titled <strong>"Swasthya Seva Abhiyan,"</strong> includes deployment of mobile medical units, telemedicine facilities, and establishment of mini-hospitals in strategic locations. The program will cover 25 villages initially, with plans for expansion based on success metrics.</p>
      
      <p>During the announcement, Phukan highlighted the critical need for accessible healthcare in rural areas. "Healthcare should not be a privilege of urban areas alone. Every citizen, regardless of their location, deserves quality medical care," he emphasized.</p>
      
      <h3>Key Components of the Initiative:</h3>
      <ul>
        <li><strong>Mobile Medical Units:</strong> Equipped with basic diagnostic equipment and staffed by qualified doctors and nurses</li>
        <li><strong>Telemedicine Centers:</strong> Connecting rural health centers with specialist doctors in major hospitals</li>
        <li><strong>Mini-Hospitals:</strong> Strategically located facilities for emergency care</li>
        <li><strong>Health Awareness Programs:</strong> Community education on preventive healthcare</li>
      </ul>
      
      <p>Each mobile medical unit will follow a scheduled route, ensuring regular medical checkups and treatment for villagers who previously had to travel long distances for healthcare.</p>
      
      <p>The telemedicine component will enable remote consultations and expert medical advice, significantly reducing the need for costly and time-consuming travel to urban centers for specialized care.</p>
      
      <p>The initiative has received backing from the state health department and will be implemented in phases over the next two years, with an estimated budget of ₹8 crores.</p>
    `,
    tags: ["Healthcare", "Rural", "Telemedicine", "Mobile Medical Units"],
  },
  {
    id: 3,
    title: "Education reform policy launched by Assam MLA Biswajit Phukan",
    source: "Northeast Today",
    date: "Mar 05, 2023",
    image: pressThird,
    link: "https://northeasttoday.com/example-link",
    category: "Education",
    author: "Ankit Patel",
    readTime: "5 min read",
    views: 1500,
    excerpt:
      "MLA Biswajit Phukan launched a comprehensive education reform policy introducing digital learning platforms, teacher training programs, and scholarship schemes for economically disadvantaged students.",
    content: `
      <p><strong>SARUPATHAR:</strong> MLA Biswajit Phukan launched a comprehensive education reform policy focused on enhancing the quality of education and increasing accessibility in his constituency. The reform package addresses key challenges in the education sector with innovative solutions.</p>
      
      <p>The policy introduces digital learning platforms, teacher training programs, infrastructure upgrades, and scholarship schemes for economically disadvantaged students. The initiative aims to bridge the urban-rural education gap and prepare students for future challenges.</p>
      
      <blockquote>"Education is the foundation of progress. We must ensure that our children receive world-class education regardless of their economic background or geographical location," Phukan stated during the launch event.</blockquote>
      
      <h3>Reform Highlights:</h3>
      <ul>
        <li>Establishment of 10 new smart classrooms</li>
        <li>Distribution of tablets to 1,000+ students</li>
        <li>High-speed internet connectivity to all schools</li>
        <li>Vocational training programs aligned with industry requirements</li>
        <li>Annual scholarship program for 500 students</li>
      </ul>
      
      <p>The scholarship program will benefit students annually, covering tuition fees, books, and other educational expenses. Special provisions have been made for girl students and students from marginalized communities to ensure inclusive access to quality education.</p>
      
      <p>Teachers will undergo regular training sessions to familiarize themselves with new teaching methodologies and digital tools. This capacity building initiative is expected to significantly improve the quality of instruction and student outcomes.</p>
      
      <p>The reform package also includes establishment of science laboratories, libraries, and computer centers in schools that currently lack these facilities. A dedicated monitoring system will track progress and ensure effective implementation.</p>
      
      <p>Industry partnerships have been established to provide practical training and internship opportunities for students in emerging fields like renewable energy, digital marketing, and sustainable agriculture.</p>
    `,
    tags: ["Education", "Digital Learning", "Scholarships", "Teacher Training"],
  },
  {
    id: 4,
    title:
      "Biswajit Phukan addresses infrastructure challenges in Golaghat district",
    source: "Pratidin Time",
    date: "Feb 22, 2023",
    image: pressForth,
    link: "https://pratidintime.com/example-link",
    category: "Infrastructure",
    author: "Ravi Kumar",
    readTime: "3 min read",
    views: 850,
    excerpt:
      "MLA Biswajit Phukan outlined a comprehensive roadmap for infrastructure development in Golaghat district, focusing on transportation, power, and communication networks.",
    content: `
      <p><strong>GOLAGHAT:</strong> Addressing longstanding infrastructure challenges, MLA Biswajit Phukan outlined a comprehensive roadmap for infrastructure development in Golaghat district. The plan focuses on addressing critical gaps in transportation, power, and communication networks.</p>
      
      <p>The infrastructure development plan includes construction of 50 kilometers of new roads, repair and maintenance of existing road networks, installation of solar street lights, and improvement of drainage systems in urban and semi-urban areas.</p>
      
      <blockquote>"Good infrastructure is the backbone of economic growth. It creates opportunities, facilitates trade, and improves quality of life for our people," Phukan emphasized while speaking to local officials and community leaders.</blockquote>
      
      <h3>Development Components:</h3>
      <ul>
        <li><strong>Transportation:</strong> 50km of new roads and maintenance of existing networks</li>
        <li><strong>Power Infrastructure:</strong> Grid extension to remote areas and solar installations</li>
        <li><strong>Communication:</strong> Mobile network expansion and public Wi-Fi hotspots</li>
        <li><strong>Urban Planning:</strong> Improved drainage and street lighting systems</li>
      </ul>
      
      <p>The power infrastructure component includes grid extension to remote areas, installation of solar power systems in government buildings, and establishment of charging stations for electric vehicles in key locations.</p>
      
      <p>Communication infrastructure improvements will focus on expanding mobile network coverage and establishing Wi-Fi hotspots in public areas. These initiatives aim to bridge the digital divide and enhance connectivity for residents and businesses.</p>
      
      <p>The total project cost is estimated at ₹25 crores, with funding secured from both state and central government schemes. Implementation will begin in the next quarter with completion expected within 24 months.</p>
    `,
    tags: ["Infrastructure", "Transportation", "Power", "Communication"],
  },
  {
    id: 5,
    title: "MLA Biswajit Phukan's efforts recognized in state assembly",
    source: "Assam Tribune",
    date: "Jan 15, 2023",
    image: pressFivth,
    link: "https://assamtribune.com/example-link-2",
    category: "Recognition",
    author: "Dipak Gogoi",
    readTime: "2 min read",
    views: 1100,
    excerpt:
      "The Assam Legislative Assembly formally recognized MLA Biswajit Phukan's contributions to constituency development and public service, with fellow legislators praising his dedication.",
    content: `
      <p><strong>DISPUR:</strong> The efforts and contributions of MLA Biswajit Phukan were formally recognized in the Assam Legislative Assembly, with fellow legislators praising his dedication to constituency development and public service.</p>
      
      <p>During the winter session, the Speaker acknowledged Phukan's exemplary work in rural development, healthcare initiatives, and education reforms. His innovative approaches to addressing local challenges have set new benchmarks for constituency development.</p>
      
      <blockquote>"MLA Phukan exemplifies the spirit of dedicated public service and has made significant contributions to the development of his constituency," the Chief Minister praised Phukan's commitment to transparent governance.</blockquote>
      
      <h3>Recognition Highlights:</h3>
      <ul>
        <li>Success in securing additional funding for infrastructure projects</li>
        <li>Role in promoting digital literacy initiatives</li>
        <li>Efforts in strengthening the cooperative banking sector</li>
        <li>Transparent governance and accountability measures</li>
      </ul>
      
      <p>The recognition specifically highlighted his success during his tenure as Vice-Chairman of Assam State Cooperative Bank, where he implemented several reforms that improved financial inclusion in rural areas.</p>
      
      <p>Fellow MLAs from across party lines commended his collaborative approach and his focus on evidence-based policy making. His annual constituency reports have been cited as models for transparency and accountability in public office.</p>
      
      <p>The assembly also noted his efforts in promoting sustainable development practices and his commitment to environmental conservation in all development projects undertaken in his constituency.</p>
    `,
    tags: ["Recognition", "Assembly", "Public Service", "Achievements"],
  },
  {
    id: 6,
    title:
      "Biswajit Phukan leads initiative to promote local culture and heritage",
    source: "The Sentinel",
    date: "Dec 10, 2022",
    image: pressSixth,
    link: "https://thesentinel.com/example-link",
    category: "Culture",
    author: "Meena Devi",
    readTime: "4 min read",
    views: 750,
    excerpt:
      "MLA Biswajit Phukan launched a comprehensive cultural preservation initiative to document, preserve, and celebrate the rich cultural traditions of the region.",
    content: `
      <p><strong>SARUPATHAR:</strong> In an effort to preserve and promote local culture and heritage, MLA Biswajit Phukan launched a comprehensive cultural preservation initiative. The program aims to document, preserve, and celebrate the rich cultural traditions of the region.</p>
      
      <p>The initiative includes establishment of a cultural documentation center, organization of traditional festivals, support for local artisans, and introduction of cultural education programs in schools. The project seeks to ensure that traditional knowledge and practices are passed on to future generations.</p>
      
      <blockquote>"Our culture and heritage are our identity. It is our responsibility to preserve these treasures for future generations while adapting to modern times," Phukan emphasized during the launch ceremony.</blockquote>
      
      <h3>Initiative Components:</h3>
      <ul>
        <li><strong>Cultural Documentation Center:</strong> Repository for traditional songs, stories, and practices</li>
        <li><strong>Artisan Support Program:</strong> Skill development and market linkages for craftspeople</li>
        <li><strong>School Cultural Programs:</strong> Heritage education for students</li>
        <li><strong>Festival Organization:</strong> Revival and promotion of traditional celebrations</li>
      </ul>
      
      <p>The cultural documentation center will serve as a repository for traditional songs, stories, crafts, and practices. Local elders and cultural experts will be involved in the documentation process to ensure authenticity and completeness.</p>
      
      <p>Support for local artisans includes skill development programs, market linkages, and financial assistance for traditional craft production. This component aims to provide sustainable livelihoods while preserving traditional crafts.</p>
      
      <p>The school cultural education program will introduce students to their local heritage through interactive sessions, cultural performances, and hands-on craft workshops. This initiative is expected to instill pride in local culture among young people.</p>
      
      <p>A cultural advisory committee comprising historians, artists, and community elders has been formed to guide the initiative and ensure its cultural authenticity and relevance.</p>
    `,
    tags: ["Culture", "Heritage", "Traditional Crafts", "Education"],
  },
];
