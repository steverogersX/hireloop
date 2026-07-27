import Link from "next/link";

import { CompanyLogo } from "@/components/companies/company-logo";
import type { Company } from "@/lib/mock-data";

/** Link row used by the "Similar roles" and "Similar companies" panels. */
export function EntityRow({
  href,
  company,
  title,
  subtitle,
  trailing,
}: {
  href: string;
  company: Pick<Company, "initials" | "logoClass">;
  title: string;
  subtitle: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <CompanyLogo company={company} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {trailing}
    </Link>
  );
}
