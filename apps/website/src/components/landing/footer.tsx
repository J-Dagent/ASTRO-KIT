import { ExternalLink, Globe2 } from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

const navigation = {
  main: [
    { name: "Astro", href: "https://astro.build" },
    { name: "Astro Actions", href: "https://docs.astro.build/en/guides/actions/" },
    { name: "Cloudflare Workers", href: "https://workers.cloudflare.com" },
    { name: "React", href: "https://react.dev" },
  ],
  tools: [
    { name: "Vite", href: "https://vitejs.dev" },
    { name: "Shadcn/UI", href: "https://ui.shadcn.com" },
    { name: "pnpm Workspaces", href: "https://pnpm.io/workspaces" },
    { name: "Drizzle ORM", href: "https://orm.drizzle.team" },
  ],
  social: [
    {
      name: "Site web",
      href: "https://www.acadelead.co/",
      icon: Globe2,
    },
    {
      name: "GitHub",
      href: "https://github.com/J-Ddev",
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/acadelead",
      icon: FaLinkedin,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/acadelead/",
      icon: FaInstagram,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61583092791325",
      icon: FaFacebook,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-6 md:space-y-0">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Écosystème Astro
            </h3>
            <ul role="list" className="mt-2 space-y-1">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center group"
                  >
                    {item.name}
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Outils de développement
            </h3>
            <ul role="list" className="mt-2 space-y-1">
              {navigation.tools.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center group"
                  >
                    {item.name}
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-0 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex space-x-6">
            {navigation.social.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              Construit avec Astro
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              &copy; {new Date().getFullYear()} Acadelead. Licence MIT.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
