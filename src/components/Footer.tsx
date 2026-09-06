import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const links = [
  { href: "https://github.com/Safwen-bm", label: "GitHub", icon: FaGithub },
  {
    href: "https://linkedin.com/in/safwen-ben-mabrouk",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "mailto:safwenbenmabrouk@gmail.com",
    label: "Email",
    icon: FaEnvelope,
  },
];

export default function Footer() {
  return (
    <footer className="pointer-events-auto relative z-10 flex flex-col gap-6 border-t border-white/10 px-6 py-10 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-16">
      <div className="flex flex-col gap-1">
        <span className="font-display text-sm text-foreground">AXIS-7</span>
        <span>© 2026 AXIS-7. Concept project, not a real product.</span>
        <span>Drone model by Kira, Sketchfab, CC BY 4.0</span>
      </div>

      <div className="flex items-center gap-5">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="flex items-center gap-2 text-muted transition-colors hover:text-accent"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}
