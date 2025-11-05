import { useState, useEffect } from "react";
import { Equipment } from "@/types/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function EquipmentEditor({ equipment, onSave, onDelete, isCustomEquipment = false }: EquipmentEditorProps) {
  const [editedEquipment, setEditedEquipment] = useState<Equipment>(equipment);

  // Sincronizar estado interno quando o equipamento selecionado mudar
  useEffect(() => {
    setEditedEquipment(equipment);
  }, [equipment]);

  const handleChange = (field: keyof Equipment, value: string | number) => {
    setEditedEquipment((prev) => ({
      ...prev,
      [field]: value,
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="attack" className="font-heading font-semibold">
                Attack
              </Label>
              <Input
                id="attack"
                type="number"
                min="0"
                value={editedEquipment.attack}
                onChange={(e) => handleChange("attack", parseInt(e.target.value) || 0)}
                className="font-body"
                disabled={!isCustomEquipment}
              />
            </div>

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

          <div>
            <Label htmlFor="icon" className="font-heading font-semibold">
              Icon (Emoji)
            </Label>
            <Input
              id="icon"
              value={editedEquipment.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="⚔️"
              className="font-body text-2xl"
              maxLength={2}
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
