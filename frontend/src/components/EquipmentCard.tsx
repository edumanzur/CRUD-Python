import { Equipment } from "@/types/equipment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Sword, Shield, Sparkles, Package, Wrench } from "lucide-react";

interface EquipmentCardProps {
  equipment: Equipment;
  onClick?: () => void;
  onEdit?: () => void;
}

const typeIcons = {
  weapon: Sword,
  armor: Shield,
  accessory: Sparkles,
  consumable: Package,
  tool: Wrench,
};

const rarityColors = {
  common: "bg-gray-500 text-white",
  uncommon: "bg-green-500 text-white",
  rare: "bg-blue-500 text-white",
  epic: "bg-purple-500 text-white",
  legendary: "bg-orange-500 text-white",
};

const typeColors = {
  weapon: "bg-red-500 text-white",
  armor: "bg-blue-600 text-white",
  accessory: "bg-pink-500 text-white",
  consumable: "bg-emerald-500 text-white",
  tool: "bg-amber-500 text-white",
};

export const EquipmentCard = ({ equipment, onClick, onEdit }: EquipmentCardProps) => {
  const TypeIcon = typeIcons[equipment.type];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <Card className="rpg-card hover:scale-105 transition-all cursor-pointer" onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-4xl pixel-icon">{equipment.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-heading font-bold text-primary">{equipment.name}</h3>
                {equipment.isCustom && (
                  <Badge variant="outline" className="border-primary text-primary text-[10px] px-1 py-0">
                    Custom
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                <Badge className={typeColors[equipment.type]}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {equipment.type}
                </Badge>
                <Badge className={rarityColors[equipment.rarity]}>
                  {equipment.rarity}
                </Badge>
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

        <p className="text-sm text-foreground/80 leading-relaxed">{equipment.description}</p>

        {(equipment.attack || equipment.defense || equipment.bonus) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {equipment.attack !== undefined && equipment.attack > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <Sword className="h-3 w-3 text-destructive" />
                <span className="font-semibold text-destructive">+{equipment.attack}</span>
              </div>
            )}
            {equipment.defense !== undefined && equipment.defense > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <Shield className="h-3 w-3 text-primary" />
                <span className="font-semibold text-primary">+{equipment.defense}</span>
              </div>
            )}
            {equipment.bonus && (
              <span className="text-xs text-muted-foreground italic">{equipment.bonus}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
