// Type definitions
export interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
