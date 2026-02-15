import { Clock, Timer, Settings, Maximize, Info, Palette } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavBarProps {
  onSettingsClick: () => void;
  onFullscreen: () => void;
}

const NavBar = ({ onSettingsClick, onFullscreen }: NavBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/", icon: Clock, label: "Clock" },
    { path: "/countdown", icon: Timer, label: "Countdown" },
    { path: "/themes", icon: Palette, label: "Themes" },
    { path: "/about", icon: Info, label: "About" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-center gap-1 p-4" style={{ backgroundColor: "hsl(var(--nav-bg))" }}>
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-1 backdrop-blur-md">
        {links.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
              location.pathname === path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}

        <div className="mx-1 h-5 w-px bg-border" />

        <button
          onClick={onSettingsClick}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          onClick={onFullscreen}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
