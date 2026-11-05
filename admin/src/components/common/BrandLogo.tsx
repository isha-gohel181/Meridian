import { APP_DISPLAY_NAME, LOGO_PATH } from "../../constants/brand";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-9 w-auto max-w-[48px]",
  md: "h-16 w-auto max-w-[200px]",
  lg: "h-24 w-auto max-w-[240px]",
};

/** Circular dental academy mark — no background chip or wrapper. */
export default function BrandLogo({
  size = "md",
  className = "",
}: BrandLogoProps) {
  return (
    <img
      className={`object-contain transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
      src={LOGO_PATH}
      alt={APP_DISPLAY_NAME}
    />
  );
}
