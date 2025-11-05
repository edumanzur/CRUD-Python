import { useState, useEffect, useMemo } from "react";
import { Character } from "@/types/character";
import { CharacterCard } from "@/components/CharacterCard";
import { CharacterEditor } from "@/components/CharacterEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import rpgBanner from "@/assets/rpg-banner.png";
import api, { Character as ApiCharacter } from "@/services/api";

// Criar um novo personagem vazio
const createNewCharacter = (): Character => ({
  id: `temp-${Date.now()}`,
  name: "New Hero",
  class: "Guerreiro",
  race: "Humano",
  level: 1,
  stats: {
    vida: 100,
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    mana: 100,
    carisma: 10,
    sorte: 10,
    reputacao: 0,
    ca: 10,
    deslocamento: 30,
  },
  equipment: {},
});

// Converter do formato da API para o formato do frontend
const fromApiCharacter = (apiChar: ApiCharacter): Character => ({
  id: apiChar.Id.toString(),
  name: apiChar.Nome,
  class: apiChar.Classe_Nome || "Guerreiro",
  race: apiChar.Raca_Nome || "Humano",
  level: apiChar.Level || 1,
  stats: {
    vida: apiChar.Vida || 100,
    forca: apiChar.Forca || 10,
    destreza: apiChar.Destreza || 10,
    constituicao: apiChar.Constituicao || 10,
    inteligencia: apiChar.Inteligencia || 10,
    sabedoria: apiChar.Sabedoria || 10,
    mana: apiChar.Mana || 100,
    carisma: apiChar.Carisma || 10,
    sorte: apiChar.Sorte || 10,
    reputacao: apiChar.Reputacao || 0,
    ca: apiChar.CA || 10,
    deslocamento: apiChar.Deslocamento || 30,
  },
  equipment: {},
  history: apiChar.Historia,
  alignment: apiChar.Tendencia,
  spells: apiChar.magias?.map(m => m.Id.toString()),
  abilities: apiChar.habilidades?.map(h => h.Id.toString()),
});

// Converter do formato do frontend para o formato da API
const toApiCharacter = (char: Character): Omit<ApiCharacter, 'Id'> => ({
  Nome: char.name,
  Historia: char.history || `Level ${char.level} ${char.class}`,
  Tendencia: char.alignment || "Neutro",
  Level: char.level,
  Vida: char.stats.vida,
  Forca: char.stats.forca,
  Destreza: char.stats.destreza,
  Constituicao: char.stats.constituicao,
  Inteligencia: char.stats.inteligencia,
  Sabedoria: char.stats.sabedoria,
  Mana: char.stats.mana,
  Carisma: char.stats.carisma,
  Sorte: char.stats.sorte,
  Reputacao: char.stats.reputacao,
  CA: char.stats.ca,
  Deslocamento: char.stats.deslocamento,
  Classe_Nome: char.class,
  Raca_Nome: char.race || "Humano",
  Raca_id: null,
  Classe_id: null,
  Equipamento_id: null,
});

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar personagens do backend
  const loadCharacters = async () => {
    try {
      setLoading(true);
      const apiCharacters = await api.characters.getAll();
      const converted = apiCharacters.map(fromApiCharacter);
      setCharacters(converted);
      if (converted.length > 0 && !selectedCharacter) {
        setSelectedCharacter(converted[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      toast.error('Erro ao carregar personagens do servidor');
      
      // Fallback para localStorage se o backend estiver offline
      const stored = localStorage.getItem("rpg-characters");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCharacters(parsed);
        if (parsed.length > 0 && !selectedCharacter) {
          setSelectedCharacter(parsed[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  // Filtrar personagens pela busca
  const filteredCharacters = useMemo(() => {
    if (!searchTerm.trim()) return characters;
    
    const search = searchTerm.toLowerCase();
    return characters.filter(char => 
      char.name.toLowerCase().includes(search) ||
      char.class?.toLowerCase().includes(search) ||
      char.alignment?.toLowerCase().includes(search) ||
      char.history?.toLowerCase().includes(search)
    );
  }, [characters, searchTerm]);

  const handleCreateCharacter = async () => {
    const newCharacter = createNewCharacter();
    
    try {
      setSaving(true);
      const apiChar = await api.characters.create(toApiCharacter(newCharacter));
      const converted = fromApiCharacter(apiChar);
      
      const updated = [...characters, converted];
      setCharacters(updated);
      setSelectedCharacter(converted);
      
      // Também salvar no localStorage como backup
      localStorage.setItem("rpg-characters", JSON.stringify(updated));
      
      toast.success("Personagem criado com sucesso!");
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      toast.error('Erro ao criar personagem. Usando modo offline.');
      
      // Fallback: salvar apenas localmente
      const updated = [...characters, newCharacter];
      setCharacters(updated);
      setSelectedCharacter(newCharacter);
      localStorage.setItem("rpg-characters", JSON.stringify(updated));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCharacter = async (updated: Character) => {
    try {
      setSaving(true);
      
      // Se o ID não for numérico, criar novo personagem
      const isNewCharacter = updated.id.startsWith('temp-');
      
      if (isNewCharacter) {
        const apiChar = await api.characters.create(toApiCharacter(updated));
        const converted = fromApiCharacter(apiChar);
        
        const newCharacters = characters.map((c) =>
          c.id === updated.id ? converted : c
        );
        setCharacters(newCharacters);
        setSelectedCharacter(converted);
        localStorage.setItem("rpg-characters", JSON.stringify(newCharacters));
      } else {
        const id = parseInt(updated.id);
        const apiChar = await api.characters.update(id, {
          Id: id,
          ...toApiCharacter(updated),
        });
        const converted = fromApiCharacter(apiChar);
        
        const newCharacters = characters.map((c) =>
          c.id === updated.id ? converted : c
        );
        setCharacters(newCharacters);
        setSelectedCharacter(converted);
        localStorage.setItem("rpg-characters", JSON.stringify(newCharacters));
      }
      
      toast.success("Personagem salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      toast.error('Erro ao salvar personagem. Salvando localmente.');
      
      // Fallback: salvar apenas localmente
      const newCharacters = characters.map((c) =>
        c.id === updated.id ? updated : c
      );
      setCharacters(newCharacters);
      setSelectedCharacter(updated);
      localStorage.setItem("rpg-characters", JSON.stringify(newCharacters));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!selectedCharacter) return;
    
    try {
      setSaving(true);
      
      // Só deletar do backend se não for temporário
      if (!selectedCharacter.id.startsWith('temp-')) {
        const id = parseInt(selectedCharacter.id);
        await api.characters.delete(id);
      }
      
      const filtered = characters.filter((c) => c.id !== selectedCharacter.id);
      setCharacters(filtered);
      setSelectedCharacter(filtered[0] || null);
      localStorage.setItem("rpg-characters", JSON.stringify(filtered));
      
      toast.success("Personagem deletado com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      toast.error('Erro ao deletar personagem. Deletando localmente.');
      
      // Fallback: deletar apenas localmente
      const filtered = characters.filter((c) => c.id !== selectedCharacter.id);
      setCharacters(filtered);
      setSelectedCharacter(filtered[0] || null);
      localStorage.setItem("rpg-characters", JSON.stringify(filtered));
    } finally {
      setSaving(false);
    }
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
              <div className="flex gap-2">
                <Button 
                  onClick={loadCharacters} 
                  variant="outline" 
                  size="icon"
                  disabled={loading || saving}
                  title="Recarregar do servidor"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  onClick={handleCreateCharacter} 
                  className="rpg-button"
                  disabled={saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome, classe, história..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rpg-input"
              />
            </div>

            {loading ? (
              <div className="rpg-card text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                <p className="text-muted-foreground font-body">
                  Carregando personagens...
                </p>
              </div>
            ) : characters.length === 0 ? (
              <div className="rpg-card text-center py-8">
                <p className="text-muted-foreground font-body">
                  No characters yet. Create your first hero!
                </p>
              </div>
            ) : (
              <>
                {/* Results Counter */}
                <div className="text-sm text-muted-foreground font-body px-1">
                  {filteredCharacters.length === characters.length ? (
                    <span>{characters.length} personage{characters.length !== 1 ? 'ns' : 'm'}</span>
                  ) : (
                    <span>{filteredCharacters.length} de {characters.length} personagens</span>
                  )}
                </div>

                {filteredCharacters.length === 0 ? (
                  <div className="rpg-card text-center py-8">
                    <p className="text-muted-foreground font-body">
                      Nenhum personagem encontrado com "{searchTerm}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCharacters.map((character) => (
                      <CharacterCard
                        key={character.id}
                        character={character}
                        onSelect={() => setSelectedCharacter(character)}
                        isSelected={selectedCharacter?.id === character.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Character Editor */}
          <div className="lg:col-span-2">
            {selectedCharacter ? (
              <CharacterEditor
                character={selectedCharacter}
                onSave={handleSaveCharacter}
                onDelete={handleDeleteCharacter}
                disabled={saving}
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
