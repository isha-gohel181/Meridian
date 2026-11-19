import { APP_DISPLAY_NAME, LOGO_PATH, LOGO_EMBLEM_PATH } from "../../constants/brand";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "full" | "emblem";
};

const sizeClasses = {
  sm: "h-9 w-auto max-w-[48px]",
  md: "h-14 w-auto max-w-[190px]",
  lg: "h-20 w-auto max-w-[240px]",
};

/** Meridian logo mark — crisp white branding for dark sidebar, compact emblem for icon rail */
export default function BrandLogo({
  size = "md",
  className = "",
  variant,
}: BrandLogoProps) {
  const isEmblem = variant === "emblem" || size === "sm";
  const src = isEmblem ? LOGO_EMBLEM_PATH : LOGO_PATH;

  return (
    <img
      className={`object-contain transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
      src={src}
      alt={APP_DISPLAY_NAME}
    />
  );
}
