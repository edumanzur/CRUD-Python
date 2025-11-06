import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Save, Heart, Sword, Target, Shield, Brain, Sparkles, Droplets, Users, Clover, Trophy, ShieldCheck, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import { CharacterSpellsAbilitiesManager } from "./CharacterSpellsAbilitiesManager";
import { CharacterEquipmentsManager } from "./CharacterEquipmentsManager";
import { ImageUpload } from "./ImageUpload";

// Classes disponíveis
const CHARACTER_CLASSES = [
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
  "Nenhum",
] as const;

// Raças disponíveis
const CHARACTER_RACES = [
  "Anão",
  "Elfo",
  "Halfling",
  "Humano",
  "Draconato",
  "Gnomo",
  "Meio-Elfo",
  "Meio-Orc",
  "Tiferino",
  "Nenhum",
] as const;

// Tendências disponíveis
const CHARACTER_ALIGNMENTS = [
  "Neutro",
  "Neutro Bom",
  "Neutro Mal",
  "Leal Neutro",
  "Caótico Neutro",
  "Leal Bom",
  "Leal Mal",
  "Caótico Bom",
  "Caótico Mal",
] as const;

interface CharacterEditorProps {
  character: Character;
  onSave: (character: Character) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const CharacterEditor = ({ character, onSave, onDelete, disabled = false }: CharacterEditorProps) => {
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);

  // Sincronizar estado interno quando o personagem selecionado mudar
  useEffect(() => {
    setEditedCharacter(character);
    console.log('🎯 CharacterEditor - Personagem carregado:', {
      id: character.id,
      name: character.name,
      class: character.class,
    });
  }, [character]);

  // Calcular modificador: quando status é 0, mod é -5; a cada 2 pontos, mod aumenta em 1
  const calculateModifier = (statValue: number): string => {
    const modifier = Math.floor((statValue - 10) / 2);
    if (modifier >= 0) {
      return `(+${modifier})`;
    }
    return `(${modifier})`;
  };

  const updateStat = (stat: keyof Character["stats"], delta: number) => {
    setEditedCharacter({
      ...editedCharacter,
      stats: {
        ...editedCharacter.stats,
        [stat]: Math.max(0, editedCharacter.stats[stat] + delta),
      },
    });
  };

  const setStatValue = (stat: keyof Character["stats"], value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (isNaN(numValue)) return;
    setEditedCharacter({
      ...editedCharacter,
      stats: {
        ...editedCharacter.stats,
        [stat]: Math.max(0, numValue),
      },
    });
  };

  const StatEditor = ({
    label,
    icon: Icon,
    stat,
    showModifier = true,
  }: {
    label: string;
    icon: typeof Sword;
    stat: keyof Character["stats"];
    showModifier?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-primary" />
        <Label className="font-heading font-semibold">
          {label} {showModifier && <span className="text-muted-foreground text-sm">{calculateModifier(editedCharacter.stats[stat])}</span>}
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateStat(stat, -1)}
          className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white border-red-700"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Input
          type="number"
          value={editedCharacter.stats[stat]}
          onChange={(e) => setStatValue(stat, e.target.value)}
          className="flex-1 text-center font-heading text-xl font-bold h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="0"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateStat(stat, 1)}
          className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white border-green-700"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="rpg-card">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">Character Editor</h2>
          
          {/* Seção de Imagem */}
          <div className="mb-6 pb-6 border-b border-border">
            <Label className="font-heading font-semibold mb-4 block">Character Image</Label>
            <ImageUpload
              characterId={editedCharacter.id ? parseInt(editedCharacter.id) : undefined}
              currentImagePath={editedCharacter.imagemPath}
              onImageChange={(path) => setEditedCharacter({ ...editedCharacter, imagemPath: path || undefined })}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="font-heading font-semibold">Name</Label>
              <Input
                value={editedCharacter.name}
                onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                className="mt-1 font-body"
              />
            </div>

            <div>
              <Label className="font-heading font-semibold">Class</Label>
              <Select
                value={editedCharacter.class}
                onValueChange={(value) => setEditedCharacter({ ...editedCharacter, class: value })}
              >
                <SelectTrigger className="mt-1 font-body">
                  <SelectValue placeholder="Selecione uma classe" />
                </SelectTrigger>
                <SelectContent>
                  {CHARACTER_CLASSES.map((className) => (
                    <SelectItem key={className} value={className} className="font-body">
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold">Race</Label>
              <Select
                value={editedCharacter.race || ""}
                onValueChange={(value) => setEditedCharacter({ ...editedCharacter, race: value })}
              >
                <SelectTrigger className="mt-1 font-body">
                  <SelectValue placeholder="Selecione uma raça" />
                </SelectTrigger>
                <SelectContent>
                  {CHARACTER_RACES.map((raceName) => (
                    <SelectItem key={raceName} value={raceName} className="font-body">
                      {raceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold">Character Type</Label>
              <Select
                value={editedCharacter.type || "Jogador"}
                onValueChange={(value) => setEditedCharacter({ ...editedCharacter, type: value })}
              >
                <SelectTrigger className="mt-1 font-body">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jogador" className="font-body">
                    Jogador (Player)
                  </SelectItem>
                  <SelectItem value="NPC" className="font-body">
                    NPC (Non-Player Character)
                  </SelectItem>
                  <SelectItem value="Monstro" className="font-body">
                    Monstro (Monster)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold">Level</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditedCharacter({ 
                    ...editedCharacter, 
                    level: Math.max(1, editedCharacter.level - 1) 
                  })}
                  className="h-10 w-10 bg-red-600 hover:bg-red-700 text-white border-red-700"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="flex-1 text-center font-heading text-2xl font-bold text-primary">
                  {editedCharacter.level}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditedCharacter({ 
                    ...editedCharacter, 
                    level: Math.min(100, editedCharacter.level + 1) 
                  })}
                  className="h-10 w-10 bg-green-600 hover:bg-green-700 text-white border-green-700"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="font-heading font-semibold">Tendência (Alignment)</Label>
              <Select
                value={editedCharacter.alignment || "Neutro"}
                onValueChange={(value) => setEditedCharacter({ ...editedCharacter, alignment: value })}
              >
                <SelectTrigger className="mt-1 font-body">
                  <SelectValue placeholder="Selecione a tendência" />
                </SelectTrigger>
                <SelectContent>
                  {CHARACTER_ALIGNMENTS.map((alignment) => (
                    <SelectItem key={alignment} value={alignment}>
                      {alignment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold">História (History)</Label>
              <Textarea
                value={editedCharacter.history || ""}
                onChange={(e) => setEditedCharacter({ ...editedCharacter, history: e.target.value })}
                className="mt-1 font-body"
                placeholder="Conte a história do personagem..."
                rows={4}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-heading font-bold text-primary mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatEditor label="Vida" icon={Heart} stat="vida" showModifier={false} />
            <StatEditor label="Força" icon={Sword} stat="forca" />
            <StatEditor label="Destreza" icon={Target} stat="destreza" />
            <StatEditor label="Constituição" icon={Shield} stat="constituicao" />
            <StatEditor label="Inteligência" icon={Brain} stat="inteligencia" />
            <StatEditor label="Sabedoria" icon={Sparkles} stat="sabedoria" />
            <StatEditor label="Mana" icon={Droplets} stat="mana" showModifier={false} />
            <StatEditor label="Carisma" icon={Users} stat="carisma" />
            <StatEditor label="Sorte" icon={Clover} stat="sorte" />
            <StatEditor label="Reputação" icon={Trophy} stat="reputacao" />
            <StatEditor label="CA" icon={ShieldCheck} stat="ca" showModifier={false} />
            <StatEditor label="Deslocamento" icon={Wind} stat="deslocamento" showModifier={false} />
          </div>
        </div>

        {/* Gerenciador de Magias e Habilidades */}
        {!editedCharacter.id.startsWith('temp-') && (
          <CharacterSpellsAbilitiesManager 
            characterId={editedCharacter.id} 
            characterClass={editedCharacter.class}
          />
        )}

        {/* Gerenciador de Equipamentos */}
        {!editedCharacter.id.startsWith('temp-') && (
          <CharacterEquipmentsManager characterId={editedCharacter.id} />
        )}

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={() => onSave(editedCharacter)} 
            className="rpg-button flex-1"
            disabled={disabled}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          {onDelete && (
            <Button
              onClick={onDelete}
              variant="destructive"
              className="rpg-button"
              disabled={disabled}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
