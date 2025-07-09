import { Dispatch, SetStateAction } from "react";

export type HeaderProps = {
  searchTerm: string;
  selectedCategory: string
  setSearchTerm: (term: string) => void;
  onCategoryChange: (category: string) => void
  setIsCartOpen: Dispatch<SetStateAction<boolean>>
};