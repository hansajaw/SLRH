import type { ImageSourcePropType } from "react-native";


export type Driver = {
  id: string;                    
  name: string;
  avatar?: string | ImageSourcePropType;
  teamId?: string | null;
  bestAchievement?: string;
  bio?: string;
};

export type Team = {
  id: string;                        
  name: string;
  logo?: string | ImageSourcePropType;
  city?: string;
  founded?: string;
  drivers?: string[];                
  about?: string;
};

export type Fame = {
  id: string;                       
  name: string;                      
  role: "Driver" | "Team" | "Official";
  year?: number;
  summary?: string;
  portrait?: string | ImageSourcePropType;
};

export type EventItem = {
  _id: string;
  slug?: string;
  title?: string;
  name?: string;
  city?: string;
  location?: { city?: string };
  dateUtc?: string;
  scheduledDateTime?: string;        
  date?: string;                      
  startTime?: string;                 
  heroImage?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  image?: string | ImageSourcePropType;
};

export type NewsItem = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  image?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  publishedAt?: string;               
  createdAt?: string;
  excerpt?: string;
};

export type ResultItem = {
  _id: string;
  slug: string;
  title: string;
  city?: string;
  occurredAt: string;               
  banner?: string | ImageSourcePropType;
  topFinishers?: Array<{
    place: 1 | 2 | 3;
    name: string;
    avatar?: string | ImageSourcePropType;
  }>;
};

export type MediaVideo = {
  _id: string;
  title: string;
  thumbnail?: string | ImageSourcePropType;
  duration?: string;                
  publishedAt?: string;               
};

export type MediaImage = {
  _id: string;
  caption?: string;
  src?: string | ImageSourcePropType;
};
