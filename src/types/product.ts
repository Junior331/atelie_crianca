export interface Product {
    id: string
    name: string
    description: string
    image: string
    category: string
    duration: string
    ageRange: string
    highlights?: string[]
    isPopular?: boolean
    workshopFolder?: string
    workshopSubfolder?: string
  }
  