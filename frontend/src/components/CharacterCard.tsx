import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sword, Target, Shield, User, Users, Skull, Brain, Sparkles, ShieldCheck, Wind } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onSelect: () => void;
  isSelected: boolean;
}

// Função para calcular modificador de atributo
const calculateModifier = (statValue: number): string => {
  const modifier = Math.floor((statValue - 10) / 2);
  if (modifier >= 0) {
    return `+${modifier}`;
  }
  return `${modifier}`;
};

// Função para obter o ícone e cor baseado no tipo
const getTypeInfo = (type?: string) => {
  switch (type) {
    case "NPC":
      return { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500" };
    case "Monstro":
      return { icon: Skull, color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500" };
    default: // Jogador
      return { icon: User, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500" };
  }
};

export const CharacterCard = ({ character, onSelect, isSelected }: CharacterCardProps) => {
  const typeInfo = getTypeInfo(character.type);
  const TypeIcon = typeInfo.icon;

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

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-semibold">{character.class}</p>
          <Badge variant="outline" className={`${typeInfo.bgColor} ${typeInfo.borderColor} flex items-center gap-1`}>
            <TypeIcon className={`h-3 w-3 ${typeInfo.color}`} />
            <span className={typeInfo.color}>{character.type || "Jogador"}</span>
          </Badge>
        </div>

        <div className="space-y-2">
          {/* Vida, CA e Deslocamento (sem modificadores) */}
          <div className="grid grid-cols-3 gap-3 text-sm pb-2 border-b border-border/50">
            <div className="flex items-center justify-start space-x-1">
              <Heart className="h-4 w-4 text-destructive" />
              <span className="font-semibold">{character.stats.vida}</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{character.stats.ca}</span>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <Wind className="h-4 w-4 text-cyan-500" />
              <span className="font-semibold">{character.stats.deslocamento}m</span>
            </div>
          </div>

          {/* Atributos com modificadores */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sword className="h-4 w-4 text-destructive" />
                <span className="font-semibold">{character.stats.forca}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.forca)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="font-semibold">{character.stats.destreza}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.destreza)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-semibold">{character.stats.constituicao}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.constituicao)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-semibold">{character.stats.inteligencia}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.inteligencia)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{character.stats.sabedoria}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.sabedoria)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-pink-500" />
                <span className="font-semibold">{character.stats.carisma}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {calculateModifier(character.stats.carisma)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
