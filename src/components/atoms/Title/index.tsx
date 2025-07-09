import type { Props } from "./@types";

export const Title = ({ children, className, ...rest }: Props) => {
  return (
    <h2 className={`text-[#111827] textarea-lg font-bold ${className}`} {...rest}>
      {children}
    </h2>
  );
};
