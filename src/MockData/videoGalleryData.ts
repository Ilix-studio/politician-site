import pressFirst from "../assets/press/F.jpg";
import pressSecond from "../assets/press/G.png";
import pressThird from "../assets/press/I.png";
import pressForth from "../assets/press/J.png";
import pressFivth from "../assets/press/K.png";
import pressSixth from "../assets/press/L.png";

// Video data structure
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
  views: string;
  category: "speech" | "event" | "interview" | "initiative";
  duration: string;
}

// Sample video data - converted to embed URLs
export const videoData: Video[] = [
  {
    id: "1",
    title: "Assembly Speech on Rural Development",
    description:
      "Addressing key issues in rural infrastructure and development initiatives for Sarupathar constituency.",
    thumbnail: pressFirst,
    videoUrl: "https://www.youtube.com/embed/wIotpx7fiqI", // Fixed: converted to embed URL
    date: "May 15, 2024",
    views: "12.5K",
    category: "speech",
    duration: "8:42",
  },
  {
    id: "2",
    title: "Healthcare Initiative Launch",
    description: "Launching mobile health clinics for remote areas in Assam.",
    thumbnail: pressSecond,
    videoUrl: "https://www.youtube.com/embed/34jCjWbJigM", // Fixed: converted to embed URL
    date: "April 28, 2024",
    views: "8.7K",
    category: "initiative",
    duration: "6:15",
  },
  {
    id: "3",
    title: "Community Meeting - Education Reform",
    description:
      "Interactive session with parents and teachers on education policy changes.",
    thumbnail: pressThird,
    videoUrl: "https://www.youtube.com/embed/3zGwFKIGQpA", // Fixed: converted to embed URL
    date: "April 10, 2024",
    views: "15.2K",
    category: "event",
    duration: "12:30",
  },
  {
    id: "4",
    title: "Interview on Economic Development",
    description:
      "Discussion on economic policies and development strategies for Assam.",
    thumbnail: pressForth,
    videoUrl: "https://www.youtube.com/embed/GAgPAT55tl4", // Fixed: converted to embed URL
    date: "March 22, 2024",
    views: "9.4K",
    category: "interview",
    duration: "15:45",
  },
  {
    id: "5",
    title: "Infrastructure Project Inauguration",
    description:
      "Opening ceremony of the new bridge connecting rural communities.",
    thumbnail: pressFivth,
    videoUrl: "https://www.youtube.com/embed/RWmVzCHw4j4", // Fixed: converted to embed URL
    date: "March 8, 2024",
    views: "18.9K",
    category: "event",
    duration: "7:20",
  },
  {
    id: "6",
    title: "Legislative Assembly Address",
    description: "Key speech on women empowerment and social welfare programs.",
    thumbnail: pressSixth,
    videoUrl: "https://www.youtube.com/embed/GAgPAT55tl4", // Fixed: converted to embed URL
    date: "February 14, 2024",
    views: "11.3K",
    category: "speech",
    duration: "9:55",
  },
];
