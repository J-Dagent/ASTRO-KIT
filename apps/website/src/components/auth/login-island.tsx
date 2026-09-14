import { GoogleLogin } from "./google-login";
import { ThemeProvider } from "@/components/theme";

export function LoginIsland() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleLogin />
    </ThemeProvider>
  );
}
