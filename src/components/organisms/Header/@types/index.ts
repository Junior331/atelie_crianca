import { Dispatch, SetStateAction } from "react";

export type HeaderProps = {
  selectedCategory: string
  setIsCartOpen: Dispatch<SetStateAction<boolean>>
  setSelectedCategory: Dispatch<SetStateAction<string>>
};