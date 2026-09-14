import { NavigationBar } from "./navigation-bar";
import { ThemeProvider } from "@/components/theme";

export function NavigationIsland() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NavigationBar />
    </ThemeProvider>
  );
}
