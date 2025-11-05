import { useState, useEffect } from "react";
import { Ability } from "@/types/ability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              Damage
            </Label>
            <Input
              id="damage"
              type="number"
              value={editedAbility.damage || 0}
              onChange={(e) =>
                setEditedAbility({ ...editedAbility, damage: parseInt(e.target.value) || 0 })
              }
              className="font-body"
              min="0"
            />
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
