"use client";

import { usePathname } from "next/navigation";

export function MobilePageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // The homepage overlay hero does not get extra mobile top padding.
  const isHomePage = pathname === "/";

  return (
    <div className={!isHomePage ? "max-md:pt-[148px] max-md:flex max-md:flex-col" : ""}>
      {children}
    </div>
  );
}
