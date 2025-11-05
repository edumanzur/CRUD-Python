import { useState, useEffect } from "react";
import { Spell } from "@/types/spell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Trash2, Sparkles } from "lucide-react";
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

interface SpellEditorProps {
  spell: Spell;
  onSave: (spell: Spell) => void;
  onDelete?: () => void;
  isCustomSpell?: boolean;
  disabled?: boolean;
}

export function SpellEditor({ spell, onSave, onDelete, isCustomSpell = false, disabled = false }: SpellEditorProps) {
  const [editedSpell, setEditedSpell] = useState<Spell>(spell);

  // Sincronizar estado interno quando a magia selecionada mudar
  useEffect(() => {
    setEditedSpell(spell);
  }, [spell]);

  const handleChange = (field: keyof Spell, value: string | number) => {
    setEditedSpell((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedSpell);
  };

  return (
    <Card className="rpg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-heading">
          <span className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>{isCustomSpell ? "Edit Spell" : "Spell Details"}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-heading font-semibold">
              Spell Name
            </Label>
            <Input
              id="name"
              value={editedSpell.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter spell name"
              className="font-body"
              disabled={!isCustomSpell}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level" className="font-heading font-semibold">
                Level
              </Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="10"
                value={editedSpell.level}
                onChange={(e) => handleChange("level", parseInt(e.target.value) || 1)}
                className="font-body"
                disabled={!isCustomSpell}
              />
            </div>

            <div>
              <Label htmlFor="category" className="font-heading font-semibold">
                Category
              </Label>
              <Select
                value={editedSpell.category}
                onValueChange={(value) => handleChange("category", value)}
                disabled={!isCustomSpell}
              >
                <SelectTrigger id="category" className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attack">Attack</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="buff">Buff</SelectItem>
                  <SelectItem value="debuff">Debuff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manaCost" className="font-heading font-semibold">
                Mana Cost
              </Label>
              <Input
                id="manaCost"
                type="number"
                min="0"
                value={editedSpell.manaCost}
                onChange={(e) => handleChange("manaCost", parseInt(e.target.value) || 0)}
                className="font-body"
                disabled={!isCustomSpell}
              />
            </div>

            <div>
              <Label htmlFor="cooldown" className="font-heading font-semibold">
                Cooldown (turns)
              </Label>
              <Input
                id="cooldown"
                type="number"
                min="0"
                value={editedSpell.cooldown}
                onChange={(e) => handleChange("cooldown", parseInt(e.target.value) || 0)}
                className="font-body"
                disabled={!isCustomSpell}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="font-heading font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedSpell.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the spell's effects..."
              className="font-body min-h-[100px]"
              disabled={!isCustomSpell}
            />
          </div>

          <div>
            <Label htmlFor="effect" className="font-heading font-semibold">
              Effect
            </Label>
            <Textarea
              id="effect"
              value={editedSpell.effect}
              onChange={(e) => handleChange("effect", e.target.value)}
              placeholder="Describe the mechanical effect..."
              className="font-body min-h-[80px]"
              disabled={!isCustomSpell}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isCustomSpell && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              onClick={handleSave} 
              className="rpg-button flex-1"
              disabled={disabled}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Spell
            </Button>

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Spell?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this spell from your collection.
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
