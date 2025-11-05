import { Link, useLocation } from "react-router-dom";
import { Swords, BookOpen, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Characters", icon: Swords },
    { to: "/spells", label: "Spells & Abilities", icon: BookOpen },
    { to: "/equipments", label: "Equipment", icon: Package },
  ];

  return (
    <nav className="bg-card border-b-4 border-double border-primary/40 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Swords className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              RPG System
            </h1>
          </div>

          <div className="flex space-x-1 md:space-x-2">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md font-heading font-semibold transition-all",
                  "border-2 hover:scale-105 active:scale-95",
                  location.pathname === to
                    ? "bg-primary text-primary-foreground border-primary/60 shadow-md"
                    : "bg-secondary/50 text-secondary-foreground border-secondary hover:bg-secondary/70"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
