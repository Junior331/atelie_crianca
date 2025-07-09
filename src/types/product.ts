export interface Product {
    id: string
    name: string
    description: string
    image: string
    category: "essentials" | "favorites" | "weddings"  | "souvenir"  
    duration: string
    ageRange: string
    highlights?: string[]
    isPopular?: boolean
  }
  