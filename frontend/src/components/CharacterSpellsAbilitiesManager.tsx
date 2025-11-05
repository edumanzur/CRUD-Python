import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api, { Spell as ApiSpell, Ability as ApiAbility } from "@/services/api";

interface CharacterSpellsAbilitiesManagerProps {
  characterId: string;
}

export const CharacterSpellsAbilitiesManager = ({ characterId }: CharacterSpellsAbilitiesManagerProps) => {
  const [characterSpells, setCharacterSpells] = useState<ApiSpell[]>([]);
  const [characterAbilities, setCharacterAbilities] = useState<ApiAbility[]>([]);
  const [allSpells, setAllSpells] = useState<ApiSpell[]>([]);
  const [allAbilities, setAllAbilities] = useState<ApiAbility[]>([]);
  
  const [showAddSpell, setShowAddSpell] = useState(false);
  const [showAddAbility, setShowAddAbility] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [characterId]);

  const loadData = async () => {
    if (characterId.startsWith('temp-')) return;
    
    try {
      setLoading(true);
      const id = parseInt(characterId);
      
      console.log('🔍 Carregando dados para personagem ID:', id);
      
      // Carregar magias e habilidades do personagem
      const [spells, abilities, allSpellsData, allAbilitiesData] = await Promise.all([
        api.characters.getSpells(id),
        api.characters.getAbilities(id),
        api.spells.getAll(),
        api.abilities.getAll(),
      ]);
      
      console.log('📊 Dados carregados:', {
        characterSpells: spells,
        characterAbilities: abilities,
        allSpells: allSpellsData,
        allAbilities: allAbilitiesData,
      });
      
      setCharacterSpells(spells);
      setCharacterAbilities(abilities);
      setAllSpells(allSpellsData);
      setAllAbilities(allAbilitiesData);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpell = async (spellId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.addSpell(characterIdNum, spellId);
      toast.success("Magia adicionada com sucesso!");
      await loadData();
      setShowAddSpell(false);
    } catch (error: any) {
      console.error('Erro ao adicionar magia:', error);
      toast.error(error.message || "Erro ao adicionar magia");
    }
  };

  const handleRemoveSpell = async (spellId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.removeSpell(characterIdNum, spellId);
      toast.success("Magia removida com sucesso!");
      await loadData();
    } catch (error: any) {
      console.error('Erro ao remover magia:', error);
      toast.error(error.message || "Erro ao remover magia");
    }
  };

  const handleAddAbility = async (abilityId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.addAbility(characterIdNum, abilityId);
      toast.success("Habilidade adicionada com sucesso!");
      await loadData();
      setShowAddAbility(false);
    } catch (error: any) {
      console.error('Erro ao adicionar habilidade:', error);
      toast.error(error.message || "Erro ao adicionar habilidade");
    }
  };

  const handleRemoveAbility = async (abilityId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.removeAbility(characterIdNum, abilityId);
      toast.success("Habilidade removida com sucesso!");
      await loadData();
    } catch (error: any) {
      console.error('Erro ao remover habilidade:', error);
      toast.error(error.message || "Erro ao remover habilidade");
    }
  };

  const availableSpells = allSpells.filter(
    spell => !characterSpells.some(cs => cs.Id === spell.Id)
  );

  const availableAbilities = allAbilities.filter(
    ability => !characterAbilities.some(ca => ca.Id === ability.Id)
  );

  console.log('📋 Listas calculadas:', {
    totalSpells: allSpells.length,
    characterSpells: characterSpells.length,
    availableSpells: availableSpells.length,
    totalAbilities: allAbilities.length,
    characterAbilities: characterAbilities.length,
    availableAbilities: availableAbilities.length,
  });

  if (characterId.startsWith('temp-')) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Salve o personagem primeiro para adicionar magias e habilidades
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Magias */}
      <div className="rpg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-primary">Magias</h3>
          <Button
            onClick={() => setShowAddSpell(true)}
            className="rpg-button"
            size="sm"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : characterSpells.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma magia aprendida</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {characterSpells.map((spell) => (
              <Badge
                key={spell.Id}
                variant="outline"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                <span>{spell.Icone || "✨"}</span>
                <span>{spell.Nome}</span>
                <button
                  onClick={() => handleRemoveSpell(spell.Id)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Habilidades */}
      <div className="rpg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-primary">Habilidades</h3>
          <Button
            onClick={() => setShowAddAbility(true)}
            className="rpg-button"
            size="sm"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : characterAbilities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma habilidade aprendida</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {characterAbilities.map((ability) => (
              <Badge
                key={ability.Id}
                variant="outline"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                <span>{ability.Icone || "⚡"}</span>
                <span>{ability.Nome}</span>
                <button
                  onClick={() => handleRemoveAbility(ability.Id)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Dialog para adicionar magia */}
      <Dialog open={showAddSpell} onOpenChange={setShowAddSpell}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-primary">
              Adicionar Magia
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableSpells.length === 0 ? (
              <p className="text-muted-foreground">Todas as magias já foram adicionadas</p>
            ) : (
              availableSpells.map((spell) => (
                <div
                  key={spell.Id}
                  className="rpg-card p-3 flex items-center justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{spell.Icone || "✨"}</span>
                    <div>
                      <p className="font-heading font-semibold">{spell.Nome}</p>
                      <p className="text-sm text-muted-foreground">{spell.Descricao}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddSpell(spell.Id)}
                    className="rpg-button"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar habilidade */}
      <Dialog open={showAddAbility} onOpenChange={setShowAddAbility}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-primary">
              Adicionar Habilidade
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableAbilities.length === 0 ? (
              <p className="text-muted-foreground">Todas as habilidades já foram adicionadas</p>
            ) : (
              availableAbilities.map((ability) => (
                <div
                  key={ability.Id}
                  className="rpg-card p-3 flex items-center justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ability.Icone || "⚡"}</span>
                    <div>
                      <p className="font-heading font-semibold">{ability.Nome}</p>
                      <p className="text-sm text-muted-foreground">{ability.Descricao}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddAbility(ability.Id)}
                    className="rpg-button"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
