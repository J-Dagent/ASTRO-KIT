import type { ReactNode } from "react";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function AppShell({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar className="flex-shrink-0" currentPath={currentPath} />
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 lg:hidden">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation de l’espace client</SheetTitle>
              <SheetDescription>Accéder aux pages de votre compte.</SheetDescription>
            </SheetHeader>
            <Sidebar
              currentPath={currentPath}
              mobile
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMobileMenuToggle={() => setIsMobileMenuOpen((open) => !open)} />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
