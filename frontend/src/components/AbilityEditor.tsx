import { useState, useEffect } from "react";
import { Ability } from "@/types/ability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Trash2, Zap } from "lucide-react";
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

// Classes disponíveis
const AVAILABLE_CLASSES = [
  "Guerreiro",
  "Mago",
  "Ladino",
  "Ranger",
  "Feiticeiro",
  "Druida",
  "Clérigo",
  "Bardo",
  "Paladino",
  "Monge",
  "Bárbaro",
  "Bruxo",
] as const;

interface AbilityEditorProps {
  ability: Ability;
  onSave: (ability: Ability) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function AbilityEditor({ ability, onSave, onDelete, disabled = false }: AbilityEditorProps) {
  const [editedAbility, setEditedAbility] = useState<Ability>(ability);

  useEffect(() => {
    setEditedAbility(ability);
  }, [ability]);

  const handleClassToggle = (className: string) => {
    setEditedAbility((prev) => {
      const currentClasses = prev.classes || [];
      const newClasses = currentClasses.includes(className)
        ? currentClasses.filter((c) => c !== className)
        : [...currentClasses, className];
      return { ...prev, classes: newClasses };
    });
  };

  const handleSave = () => {
    onSave(editedAbility);
  };

  return (
    <Card className="rpg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Zap className="h-5 w-5" />
          <span>Edit Ability</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-heading font-semibold">
            Ability Name
          </Label>
          <Input
            id="name"
            value={editedAbility.name}
            onChange={(e) => setEditedAbility({ ...editedAbility, name: e.target.value })}
            className="font-body"
            placeholder="Enter ability name..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-heading font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={editedAbility.description}
            onChange={(e) => setEditedAbility({ ...editedAbility, description: e.target.value })}
            className="font-body min-h-[100px]"
            placeholder="Describe what this ability does..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="font-heading font-semibold">
              Type
            </Label>
            <Select
              value={editedAbility.type}
              onValueChange={(value: "passive" | "active" | "ultimate" | "special") =>
                setEditedAbility({ ...editedAbility, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passive">Passive</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ultimate">Ultimate</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooldown" className="font-heading font-semibold">
              Cooldown (seconds)
            </Label>
            <Input
              id="cooldown"
              type="number"
              value={editedAbility.cooldown || 0}
              onChange={(e) =>
                setEditedAbility({ ...editedAbility, cooldown: parseInt(e.target.value) || 0 })
              }
              className="font-body"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="damage" className="font-heading font-semibold">
              Dice
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Nº dados"
                  value={editedAbility.damage?.split('d')[0] || ''}
                  onChange={(e) => {
                    const numDice = e.target.value;
                    const diceType = editedAbility.damage?.split('d')[1] || '6';
                    setEditedAbility({ 
                      ...editedAbility, 
                      damage: numDice && diceType ? `${numDice}d${diceType}` : '' 
                    });
                  }}
                  className="font-body"
                />
              </div>
              <span className="text-2xl font-bold">d</span>
              <div className="flex-1">
                <Select
                  value={editedAbility.damage?.split('d')[1] || '6'}
                  onValueChange={(value) => {
                    const numDice = editedAbility.damage?.split('d')[0] || '1';
                    setEditedAbility({ 
                      ...editedAbility, 
                      damage: `${numDice}d${value}` 
                    });
                  }}
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
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ex: 2d6 = 2 dados de 6 lados
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="font-heading font-semibold">
            Icon (emoji)
          </Label>
          <Input
            id="icon"
            value={editedAbility.icon || ""}
            onChange={(e) => setEditedAbility({ ...editedAbility, icon: e.target.value })}
            className="font-body text-2xl"
            placeholder="⚡"
            maxLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="effect" className="font-heading font-semibold">
            Effect Details
          </Label>
          <Textarea
            id="effect"
            value={editedAbility.effect || ""}
            onChange={(e) => setEditedAbility({ ...editedAbility, effect: e.target.value })}
            className="font-body min-h-[80px]"
            placeholder="Detailed effect description..."
          />
        </div>

        {/* Seleção de Classes */}
        <div>
          <Label className="font-heading font-semibold mb-3 block">
            Classes que podem usar esta habilidade
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AVAILABLE_CLASSES.map((className) => (
              <div key={className} className="flex items-center space-x-2">
                <Checkbox
                  id={`ability-class-${className}`}
                  checked={editedAbility.classes?.includes(className) || false}
                  onCheckedChange={() => handleClassToggle(className)}
                />
                <label
                  htmlFor={`ability-class-${className}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {className}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleSave} 
            className="rpg-button flex-1"
            disabled={disabled}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Ability
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
                  <AlertDialogTitle>Delete Ability?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this ability from your collection.
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
      </CardContent>
    </Card>
  );
}
