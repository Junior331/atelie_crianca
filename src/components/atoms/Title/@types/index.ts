import type { HTMLAttributes, ReactNode } from "react";

export type Props = {
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;
