import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MobilePageWrapper } from "@/components/layout/MobilePageWrapper";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">
        <MobilePageWrapper>
          {children}
        </MobilePageWrapper>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
