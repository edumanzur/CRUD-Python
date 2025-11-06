import { Spell } from "@/types/spell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Dices, Clock } from "lucide-react";

interface SpellCardProps {
  spell: Spell;
  onClick?: () => void;
  onEdit?: () => void;
}

const categoryColors = {
  attack: "bg-destructive text-destructive-foreground",
  defense: "bg-primary text-primary-foreground",
  support: "bg-accent text-accent-foreground",
  buff: "bg-secondary text-secondary-foreground",
  debuff: "bg-muted text-muted-foreground",
};

export const SpellCard = ({ spell, onClick, onEdit }: SpellCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <Card className="rpg-card hover:scale-105 transition-all cursor-pointer" onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-4xl pixel-icon">{spell.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-heading font-bold text-primary">{spell.name}</h3>
                {spell.isCustom && (
                  <Badge variant="outline" className="border-primary text-primary text-[10px] px-1 py-0">
                    Custom
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={categoryColors[spell.category]}>
                  {spell.category}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  Level {spell.level}
                </span>
              </div>
            </div>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/20"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">{spell.description}</p>

        {/* Exibir dano e cooldown se disponíveis */}
        {(spell.damage || spell.cooldown !== undefined) && (
          <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
            {spell.damage && (
              <div className="flex items-center space-x-2">
                <Dices className="h-4 w-4 text-destructive" />
                <span className="font-semibold text-destructive">{spell.damage}</span>
              </div>
            )}
            {spell.cooldown !== undefined && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">{spell.cooldown}s</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
