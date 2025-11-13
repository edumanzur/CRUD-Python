import { Ability } from "@/types/ability";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AbilityCardProps {
  ability: Ability;
  onClick?: () => void;
  onEdit?: () => void;
}

export const AbilityCard = ({ ability, onClick, onEdit }: AbilityCardProps) => {
  const typeColors = {
    passive: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    active: "bg-green-500/20 text-green-400 border-green-500/50",
    ultimate: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    special: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  };

  return (
    <Card 
      className="rpg-card hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl pixel-icon">{ability.icon || "⚡"}</div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {ability.name}
              </h3>
              {ability.type && (
                <Badge 
                  className={`text-xs mt-1 ${typeColors[ability.type]}`}
                  variant="outline"
                >
                  {ability.type}
                </Badge>
              )}
            </div>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground max-h-20 overflow-y-auto line-clamp-4 font-body">
          {ability.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {ability.cooldown !== undefined && (
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="font-semibold text-blue-500">{ability.cooldown}s</span>
            </div>
          )}
          {ability.damage && ability.damage.trim() !== '' && (
            <div className="flex items-center space-x-2">
              <Dices className="h-3 w-3 text-destructive" />
              <span className="font-semibold text-destructive">{ability.damage}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
