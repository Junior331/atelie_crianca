import type { ReactNode } from "react";

export interface IProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}
