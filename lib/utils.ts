import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categories = [
  {
    "id": "",
    "name": "Food"
  },
  {
    "id":"",
    "name": "tech"
  }
];

export const blogs= [
  {
    id:"",
    title: "New blog on tech",
    description: " hello ",
    imageUrl: "",
    userId: " ",
    createdAt: " ",
    updatedAt: " ",
    CategoryIds: " ",
    location: "India",
  },
];