import { useState, useEffect } from "react";
import { Character } from "@/types/character";
import { CharacterCard } from "@/components/CharacterCard";
import { CharacterEditor } from "@/components/CharacterEditor";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import rpgBanner from "@/assets/rpg-banner.png";

const STORAGE_KEY = "rpg-characters";

const createNewCharacter = (): Character => ({
  id: crypto.randomUUID(),
  name: "New Hero",
  class: "Warrior",
  level: 1,
  stats: {
    strength: 10,
    agility: 10,
    intelligence: 10,
    health: 100,
  },
  equipment: {},
});

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCharacters(parsed);
      if (parsed.length > 0) {
        setSelectedCharacter(parsed[0]);
      }
    }
  }, []);

  const saveCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharacters));
  };

  const handleCreateCharacter = () => {
    const newCharacter = createNewCharacter();
    const updated = [...characters, newCharacter];
    saveCharacters(updated);
    setSelectedCharacter(newCharacter);
    toast.success("New character created!");
  };

  const handleSaveCharacter = (updated: Character) => {
    const newCharacters = characters.map((c) =>
      c.id === updated.id ? updated : c
    );
    saveCharacters(newCharacters);
    setSelectedCharacter(updated);
    toast.success("Character saved!");
  };

  const handleDeleteCharacter = () => {
    if (!selectedCharacter) return;
    const filtered = characters.filter((c) => c.id !== selectedCharacter.id);
    saveCharacters(filtered);
    setSelectedCharacter(filtered[0] || null);
    toast.success("Character deleted!");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="RPG Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
            Character Management
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
            Create and manage your heroes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-primary">Your Heroes</h2>
              <Button onClick={handleCreateCharacter} className="rpg-button">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>

            {characters.length === 0 ? (
              <div className="rpg-card text-center py-8">
                <p className="text-muted-foreground font-body">
                  No characters yet. Create your first hero!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {characters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onSelect={() => setSelectedCharacter(character)}
                    isSelected={selectedCharacter?.id === character.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Character Editor */}
          <div className="lg:col-span-2">
            {selectedCharacter ? (
              <CharacterEditor
                character={selectedCharacter}
                onSave={handleSaveCharacter}
                onDelete={handleDeleteCharacter}
              />
            ) : (
              <div className="rpg-card text-center py-16">
                <p className="text-lg text-muted-foreground font-body">
                  Select a character to edit or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
