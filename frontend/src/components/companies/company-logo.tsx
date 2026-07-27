import type { Company } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-7 rounded-md text-[10px]",
  sm: "size-8 rounded-lg text-[11px]",
  md: "size-9 rounded-lg text-xs",
  lg: "size-10 rounded-lg text-sm",
  xl: "size-14 rounded-xl text-lg",
  "2xl": "size-16 rounded-xl text-xl",
} as const;

export function CompanyLogo({
  company,
  size = "lg",
  className,
}: {
  company: Pick<Company, "initials" | "logoClass">;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center font-heading font-semibold",
        SIZES[size],
        company.logoClass,
        className
      )}
      aria-hidden
    >
      {company.initials}
    </span>
  );
}
