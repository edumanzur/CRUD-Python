import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Heart, Sword, Target, Droplets } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onSelect: () => void;
  isSelected: boolean;
}

export const CharacterCard = ({ character, onSelect, isSelected }: CharacterCardProps) => {
  return (
    <Card
      onClick={onSelect}
      className={`rpg-card cursor-pointer transition-all hover:scale-105 active:scale-95 ${
        isSelected ? "ring-4 ring-primary shadow-2xl" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading font-bold text-primary">{character.name}</h3>
          <span className="text-sm font-semibold bg-secondary/70 px-3 py-1 rounded-full border border-secondary">
            Lv. {character.level}
          </span>
        </div>

        <p className="text-sm text-muted-foreground font-semibold">{character.class}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-destructive" />
            <span className="font-semibold">{character.stats.vida}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">{character.stats.mana}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sword className="h-4 w-4 text-destructive" />
            <span className="font-semibold">{character.stats.forca}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="font-semibold">{character.stats.destreza}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
