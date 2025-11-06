import { Link, useLocation } from "react-router-dom";
import { Swords, BookOpen, Package, Dices, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignSelector } from "./CampaignSelector";

export const Navigation = () => {
  const location = useLocation();
  const isDiceRoller = location.pathname === "/dice";

  const links = [
    { to: "/", label: "Characters", icon: Swords },
    { to: "/spells", label: "Spells & Abilities", icon: BookOpen },
    { to: "/equipments", label: "Equipment", icon: Package },
    { to: "/campaigns", label: "Campaigns", icon: Settings },
    { to: "/dice", label: "Dice Roller", icon: Dices },
  ];

  return (
    <nav className="bg-gradient-to-r from-card via-card to-primary/5 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Swords className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground leading-tight">
                RPG System
              </h1>
              <p className="text-[10px] text-muted-foreground">Gerenciador D&D</p>
            </div>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-3xl">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/30 text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive && "drop-shadow-sm"
                  )} />
                  <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-foreground/30 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Campaign Selector - Desktop */}
          {!isDiceRoller && (
            <div className="hidden md:block flex-shrink-0">
              <CampaignSelector />
            </div>
          )}

          {/* Mobile menu placeholder */}
          <div className="lg:hidden flex-shrink-0">
            {/* Pode adicionar um menu hamburguer aqui depois */}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2 mb-4">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
          
          {!isDiceRoller && (
            <div className="md:hidden">
              <CampaignSelector />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
