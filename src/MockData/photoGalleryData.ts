import { Category, Photo } from "@/types/photo.types";

import pressFirst from "../assets/press/F.jpg";
import pressSecond from "../assets/press/G.png";
import pressThird from "../assets/press/I.png";
import pressForth from "../assets/press/J.png";
import pressFivth from "../assets/press/K.png";
import pressSixth from "../assets/press/L.png";

// Sample photo data - replace with your actual images
export const samplePhotos: Photo[] = [
  {
    id: 1,
    src: pressFirst,
    alt: "Community Meeting",
    title: "Community Development Meeting",
    category: "meetings",
    date: "2024-03-15",
    location: "Sarupathar Community Hall",
    description:
      "Engaging with local leaders to discuss infrastructure improvements and community needs.",
    tags: ["community", "development", "meeting"],
    likes: 156,
    views: 892,
  },
  {
    id: 2,
    src: pressSecond,
    alt: "School Inauguration",
    title: "New School Inauguration Ceremony",
    category: "education",
    date: "2024-02-28",
    location: "Village Primary School",
    description:
      "Inaugurating a new primary school building to enhance educational facilities in rural areas.",
    tags: ["education", "inauguration", "development"],
    likes: 203,
    views: 1247,
  },
  {
    id: 3,
    src: pressThird,
    alt: "Healthcare Initiative",
    title: "Mobile Health Clinic Launch",
    category: "healthcare",
    date: "2024-01-20",
    location: "Rural Health Center",
    description:
      "Launching mobile health clinics to provide medical services to remote villages.",
    tags: ["healthcare", "rural", "service"],
    likes: 178,
    views: 934,
  },
  {
    id: 4,
    src: pressForth,
    alt: "Cultural Festival",
    title: "Assamese Cultural Festival",
    category: "culture",
    date: "2024-04-10",
    location: "Cultural Center",
    description:
      "Celebrating Assamese heritage and promoting local arts and traditions.",
    tags: ["culture", "festival", "heritage"],
    likes: 312,
    views: 1856,
  },
  {
    id: 5,
    src: pressFivth,
    alt: "Infrastructure Project",
    title: "Road Development Project",
    category: "infrastructure",
    date: "2024-01-05",
    location: "Highway Construction Site",
    description:
      "Overseeing the construction of new roads to improve connectivity in rural areas.",
    tags: ["infrastructure", "roads", "development"],
    likes: 145,
    views: 723,
  },
  {
    id: 6,
    src: pressSixth,
    alt: "Youth Program",
    title: "Youth Skill Development Program",
    category: "youth",
    date: "2024-03-22",
    location: "Training Center",
    description:
      "Launching skill development programs for youth to enhance employment opportunities.",
    tags: ["youth", "skills", "employment"],
    likes: 267,
    views: 1134,
  },
  {
    id: 7,
    src: pressFirst,
    alt: "Agricultural Meet",
    title: "Farmers' Advisory Meeting",
    category: "agriculture",
    date: "2024-02-14",
    location: "Agricultural Extension Office",
    description:
      "Discussing modern farming techniques and government support for farmers.",
    tags: ["agriculture", "farmers", "advisory"],
    likes: 189,
    views: 876,
  },
  {
    id: 8,
    src: pressSecond,
    alt: "Women Empowerment",
    title: "Women Entrepreneurship Workshop",
    category: "social",
    date: "2024-03-08",
    location: "Women's Development Center",
    description:
      "Empowering women through entrepreneurship and skill development programs.",
    tags: ["women", "empowerment", "workshop"],
    likes: 234,
    views: 1345,
  },
];

export const categories: Category[] = [
  { id: "all", name: "All Photos", count: samplePhotos.length },
  {
    id: "meetings",
    name: "Meetings",
    count: samplePhotos.filter((p) => p.category === "meetings").length,
  },
  {
    id: "education",
    name: "Education",
    count: samplePhotos.filter((p) => p.category === "education").length,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    count: samplePhotos.filter((p) => p.category === "healthcare").length,
  },
  {
    id: "culture",
    name: "Culture",
    count: samplePhotos.filter((p) => p.category === "culture").length,
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    count: samplePhotos.filter((p) => p.category === "infrastructure").length,
  },
  {
    id: "youth",
    name: "Youth",
    count: samplePhotos.filter((p) => p.category === "youth").length,
  },
  {
    id: "agriculture",
    name: "Agriculture",
    count: samplePhotos.filter((p) => p.category === "agriculture").length,
  },
  {
    id: "social",
    name: "Social",
    count: samplePhotos.filter((p) => p.category === "social").length,
  },
];
