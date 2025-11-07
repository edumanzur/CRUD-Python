import { useState, useEffect } from "react";
import { Equipment } from "@/types/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EquipmentEditorProps {
  equipment: Equipment;
  onSave: (equipment: Equipment) => void;
  onDelete?: () => void;
  isCustomEquipment?: boolean;
}

// Mapeamento de emojis por tipo de equipamento
const typeToEmoji: Record<string, string> = {
  weapon: "⚔️",
  armor: "🛡️",
  accessory: "💍",
  consumable: "🧪",
  tool: "🔧",
};

export function EquipmentEditor({ equipment, onSave, onDelete, isCustomEquipment = false }: EquipmentEditorProps) {
  const [editedEquipment, setEditedEquipment] = useState<Equipment>(equipment);

  // Sincronizar estado interno quando o equipamento selecionado mudar
  useEffect(() => {
    setEditedEquipment(equipment);
  }, [equipment]);

  const handleChange = (field: keyof Equipment, value: string | number) => {
    const updates: Partial<Equipment> = { [field]: value };
    
    // Se mudar o tipo, atualiza o emoji automaticamente
    if (field === "type") {
      updates.icon = typeToEmoji[value as string] || "⚔️";
    }
    
    setEditedEquipment((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSave = () => {
    onSave(editedEquipment);
  };

  return (
    <Card className="rpg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-heading">
          <span className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>{isCustomEquipment ? "Edit Equipment" : "Equipment Details"}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-heading font-semibold">
              Equipment Name
            </Label>
            <Input
              id="name"
              value={editedEquipment.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter equipment name"
              className="font-body"
              disabled={!isCustomEquipment}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="font-heading font-semibold">
                Type
              </Label>
              <Select
                value={editedEquipment.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={!isCustomEquipment}
              >
                <SelectTrigger id="type" className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weapon">Weapon</SelectItem>
                  <SelectItem value="armor">Armor</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rarity" className="font-heading font-semibold">
                Rarity
              </Label>
              <Select
                value={editedEquipment.rarity}
                onValueChange={(value) => handleChange("rarity", value)}
                disabled={!isCustomEquipment}
              >
                <SelectTrigger id="rarity" className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="defense" className="font-heading font-semibold">
                Defense
              </Label>
              <Input
                id="defense"
                type="number"
                min="0"
                value={editedEquipment.defense}
                onChange={(e) => handleChange("defense", parseInt(e.target.value) || 0)}
                className="font-body"
                disabled={!isCustomEquipment}
              />
            </div>

            <div>
              <Label htmlFor="proficiency" className="font-heading font-semibold">
                Proficiência Necessária
              </Label>
              <Select
                value={editedEquipment.proficiency || "none"}
                onValueChange={(value) => handleChange("proficiency", value === "none" ? "" : value)}
                disabled={!isCustomEquipment}
              >
                <SelectTrigger id="proficiency" className="font-body">
                  <SelectValue placeholder="Selecione a proficiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="Armas Simples">Armas Simples</SelectItem>
                  <SelectItem value="Armas Marciais">Armas Marciais</SelectItem>
                  <SelectItem value="Armaduras Leves">Armaduras Leves</SelectItem>
                  <SelectItem value="Armaduras Médias">Armaduras Médias</SelectItem>
                  <SelectItem value="Armaduras Pesadas">Armaduras Pesadas</SelectItem>
                  <SelectItem value="Escudos">Escudos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="weight" className="font-heading font-semibold">
              Weight
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={editedEquipment.weight}
              onChange={(e) => handleChange("weight", parseFloat(e.target.value) || 0)}
              className="font-body"
              disabled={!isCustomEquipment}
            />
          </div>

          {/* Dano da Arma */}
          <div>
            <Label className="font-heading font-semibold">
              Dano da Arma (Weapon Damage)
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Nº dados"
                  value={editedEquipment.damage?.split('d')[0] || ''}
                  onChange={(e) => {
                    const numDice = e.target.value;
                    const diceType = editedEquipment.damage?.split('d')[1] || '6';
                    handleChange("damage", numDice && diceType ? `${numDice}d${diceType}` : '');
                  }}
                  className="font-body"
                  disabled={!isCustomEquipment}
                />
              </div>
              <span className="text-2xl font-bold">d</span>
              <div className="flex-1">
                <Select
                  value={editedEquipment.damage?.split('d')[1] || '6'}
                  onValueChange={(value) => {
                    const numDice = editedEquipment.damage?.split('d')[0] || '1';
                    handleChange("damage", `${numDice}d${value}`);
                  }}
                  disabled={!isCustomEquipment}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">d2</SelectItem>
                    <SelectItem value="4">d4</SelectItem>
                    <SelectItem value="6">d6</SelectItem>
                    <SelectItem value="8">d8</SelectItem>
                    <SelectItem value="10">d10</SelectItem>
                    <SelectItem value="12">d12</SelectItem>
                    <SelectItem value="20">d20</SelectItem>
                    <SelectItem value="100">d100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editedEquipment.damage && (
                <div className="flex-1 text-center">
                  <Badge variant="outline" className="text-lg font-heading">
                    {editedEquipment.damage}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Modificador (Atributo do Personagem) */}
          <div>
            <Label htmlFor="modifier" className="font-heading font-semibold">
              Modifier (Character Attribute)
            </Label>
            <Select
              value={editedEquipment.modifier || "none"}
              onValueChange={(value) => handleChange("modifier", value === "none" ? undefined : value)}
              disabled={!isCustomEquipment}
            >
              <SelectTrigger className="font-body">
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Força">Força (Strength)</SelectItem>
                <SelectItem value="Destreza">Destreza (Dexterity)</SelectItem>
                <SelectItem value="Constituição">Constituição (Constitution)</SelectItem>
                <SelectItem value="Inteligência">Inteligência (Intelligence)</SelectItem>
                <SelectItem value="Sabedoria">Sabedoria (Wisdom)</SelectItem>
                <SelectItem value="Carisma">Carisma (Charisma)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Attribute used to calculate damage/effect bonus
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="font-heading font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedEquipment.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the equipment..."
              className="font-body min-h-[100px]"
              disabled={!isCustomEquipment}
            />
          </div>

          <div>
            <Label htmlFor="bonus" className="font-heading font-semibold">
              Bonus Effects
            </Label>
            <Textarea
              id="bonus"
              value={editedEquipment.bonus}
              onChange={(e) => handleChange("bonus", e.target.value)}
              placeholder="Special bonuses or effects..."
              className="font-body min-h-[80px]"
              disabled={!isCustomEquipment}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isCustomEquipment && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} className="rpg-button flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Equipment
            </Button>

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Equipment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this equipment from your collection.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
