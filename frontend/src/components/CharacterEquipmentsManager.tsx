import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api, { Equipment as ApiEquipment } from "@/services/api";

interface CharacterEquipmentsManagerProps {
  characterId: string;
}

export const CharacterEquipmentsManager = ({ characterId }: CharacterEquipmentsManagerProps) => {
  const [characterEquipments, setCharacterEquipments] = useState<ApiEquipment[]>([]);
  const [allEquipments, setAllEquipments] = useState<ApiEquipment[]>([]);
  
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [characterId]);

  const loadData = async () => {
    if (characterId.startsWith('temp-')) return;
    
    try {
      setLoading(true);
      const id = parseInt(characterId);
      
      console.log('🔍 Carregando equipamentos para personagem ID:', id);
      
      // Carregar equipamentos do personagem e todos os equipamentos disponíveis
      const [equipments, allEquipmentsData] = await Promise.all([
        api.characters.getEquipments(id),
        api.equipments.getAll(),
      ]);
      
      console.log('📊 Equipamentos carregados:', {
        characterEquipments: equipments,
        allEquipments: allEquipmentsData,
      });
      
      setCharacterEquipments(equipments);
      setAllEquipments(allEquipmentsData);
    } catch (error) {
      console.error('❌ Erro ao carregar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (equipmentId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.addEquipment(characterIdNum, equipmentId);
      toast.success("Equipamento adicionado com sucesso!");
      await loadData();
      setShowAddEquipment(false);
    } catch (error: any) {
      console.error('Erro ao adicionar equipamento:', error);
      toast.error(error.message || "Erro ao adicionar equipamento");
    }
  };

  const handleRemoveEquipment = async (equipmentId: number) => {
    try {
      const characterIdNum = parseInt(characterId);
      await api.characters.removeEquipment(characterIdNum, equipmentId);
      toast.success("Equipamento removido com sucesso!");
      await loadData();
    } catch (error: any) {
      console.error('Erro ao remover equipamento:', error);
      toast.error(error.message || "Erro ao remover equipamento");
    }
  };

  const availableEquipments = allEquipments.filter(
    equipment => !characterEquipments.some(ce => ce.Id === equipment.Id)
  );

  console.log('📋 Equipamentos calculados:', {
    totalEquipments: allEquipments.length,
    characterEquipments: characterEquipments.length,
    availableEquipments: availableEquipments.length,
  });

  if (characterId.startsWith('temp-')) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Salve o personagem primeiro para adicionar equipamentos
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rpg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-primary">Equipamentos</h3>
          <Button
            onClick={() => setShowAddEquipment(true)}
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
        ) : characterEquipments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum equipamento equipado</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {characterEquipments.map((equipment) => (
              <Badge
                key={equipment.Id}
                variant="outline"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                <span>{equipment.Icone || "⚔️"}</span>
                <span>{equipment.Nome}</span>
                <button
                  onClick={() => handleRemoveEquipment(equipment.Id)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Dialog para adicionar equipamento */}
      <Dialog open={showAddEquipment} onOpenChange={setShowAddEquipment}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-primary">
              Adicionar Equipamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableEquipments.length === 0 ? (
              <p className="text-muted-foreground">Todos os equipamentos já foram adicionados</p>
            ) : (
              availableEquipments.map((equipment) => (
                <div
                  key={equipment.Id}
                  className="rpg-card p-3 flex items-center justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{equipment.Icone || "⚔️"}</span>
                    <div>
                      <p className="font-heading font-semibold">{equipment.Nome}</p>
                      <p className="text-sm text-muted-foreground">{equipment.Descricao}</p>
                      <div className="flex gap-2 mt-1">
                        {equipment.Tipo && (
                          <Badge variant="secondary" className="text-xs">
                            {equipment.Tipo}
                          </Badge>
                        )}
                        {equipment.Raridade && (
                          <Badge variant="outline" className="text-xs">
                            {equipment.Raridade}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddEquipment(equipment.Id)}
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
