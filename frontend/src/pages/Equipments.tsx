import { useState, useMemo, useEffect } from "react";
import { Equipment } from "@/types/equipment";
import { EquipmentCard } from "@/components/EquipmentCard";
import { EquipmentEditor } from "@/components/EquipmentEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Package, Plus, Sword, Shield, Sparkles, RefreshCw, Award } from "lucide-react";
import { toast } from "sonner";
import { useCampaign } from "@/contexts/CampaignContext";
import rpgBanner from "@/assets/rpg-banner.png";
import api, { Equipment as ApiEquipment } from "@/services/api";

const STORAGE_KEY = "rpg-custom-equipments";

// Mapeamento de emojis por tipo de equipamento
const typeToEmoji: Record<string, string> = {
  weapon: "⚔️",
  armor: "🛡️",
  accessory: "💍",
  consumable: "🧪",
  tool: "🔧",
};

const createNewEquipment = (): Equipment => ({
  id: `temp-${Date.now()}`,
  name: "New Equipment",
  description: "A mysterious new item waiting to be defined...",
  type: "weapon",
  rarity: "common",
  icon: "⚔️",
  defense: 0,
  bonus: "",
  weight: 1,
  damage: "1d6",  // Dano padrão
  isCustom: true,
});

// Converter API → Frontend
const fromApiEquipment = (apiEquip: ApiEquipment): Equipment => {
  const equipType = (apiEquip.Tipo as any) || "weapon";
  return {
    id: apiEquip.Id.toString(),
    name: apiEquip.Nome,
    description: apiEquip.Descricao || "",
    type: equipType,
    rarity: (apiEquip.Raridade as any) || "common",
    icon: typeToEmoji[equipType] || apiEquip.Icone || "⚔️",  // Usa emoji baseado no tipo
    attack: apiEquip.Ataque || 0,
    defense: apiEquip.Defesa || 0,
    bonus: apiEquip.Descricao || "",
    weight: apiEquip.Peso || 1,
    damage: apiEquip.Dano || "",  // Campo de dano
    proficiency: apiEquip.Proficiencia || "",  // Campo de proficiência
    modifier: apiEquip.Modificador || undefined,  // Atributo do personagem
    isCustom: true,
  };
};

// Converter Frontend → API
const toApiEquipment = (equip: Equipment): Omit<ApiEquipment, 'Id'> => ({
  Nome: equip.name,
  Descricao: equip.description || "",
  Tipo: equip.type,
  Raridade: equip.rarity,
  Icone: equip.icon,
  Ataque: 0,  // Não usado mais
  Defesa: equip.defense,
  Bonus: equip.defense || 0,
  Peso: equip.weight,
  Dano: equip.damage || "",  // Campo de dano
  Proficiencia: equip.proficiency || "",  // Campo de proficiência
  Modificador: equip.modifier || undefined,  // Atributo do personagem
});

export default function Equipments() {
  const { activeCampaign } = useCampaign(); // Hook para obter campanha ativa
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [customEquipments, setCustomEquipments] = useState<Equipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar equipamentos do backend filtrados por campanha
  const loadEquipments = async () => {
    try {
      setLoading(true);
      // Adicionar filtro de campanha na URL se houver campanha ativa
      const url = activeCampaign 
        ? `http://localhost:8000/equipamentos/?campanha_id=${activeCampaign.Id}`
        : 'http://localhost:8000/equipamentos/';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar equipamentos');
      
      const apiEquipments = await response.json();
      const converted = apiEquipments.map(fromApiEquipment);
      setCustomEquipments(converted);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(converted));
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      toast.error('Erro ao carregar do servidor. Usando dados locais.');
      
      // Fallback para localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomEquipments(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  // Recarregar quando a campanha ativa mudar
  useEffect(() => {
    if (activeCampaign) {
      loadEquipments();
    }
  }, [activeCampaign]);

  const saveCustomEquipments = (newEquipments: Equipment[]) => {
    setCustomEquipments(newEquipments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEquipments));
  };

  const allEquipments = useMemo(() => [...customEquipments], [customEquipments]);

  const filteredEquipments = useMemo(() => {
    return allEquipments.filter((equipment) => {
      const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || equipment.type === typeFilter;
      const matchesRarity = rarityFilter === "all" || equipment.rarity === rarityFilter;

      return matchesSearch && matchesType && matchesRarity;
    });
  }, [allEquipments, searchTerm, typeFilter, rarityFilter]);

  const handleCreateEquipment = () => {
    const newEquipment = createNewEquipment();
    setEditingEquipment(newEquipment);
    setShowEditor(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    if (equipment.isCustom) {
      setEditingEquipment(equipment);
      setShowEditor(true);
      setSelectedEquipment(null);
    }
  };

  const handleSaveEquipment = async (equipment: Equipment) => {
    try {
      setSaving(true);
      const isNewEquipment = equipment.id.startsWith('temp-');
      
      if (isNewEquipment) {
        const apiData = toApiEquipment(equipment);
        // Adicionar Campanha_id se houver campanha ativa
        const apiEquipWithCampaign = activeCampaign 
          ? { ...apiData, Campanha_id: activeCampaign.Id }
          : apiData;
        
        const apiEquip = await api.equipments.create(apiEquipWithCampaign);
        const converted = fromApiEquipment(apiEquip);
        
        const updated = customEquipments.map((e) =>
          e.id === equipment.id ? converted : e
        );
        // Se não encontrou, adicionar
        if (!updated.find(e => e.id === converted.id)) {
          updated.push(converted);
        }
        saveCustomEquipments(updated);
        toast.success("Equipment created successfully!");
      } else {
        const id = parseInt(equipment.id);
        const apiData = toApiEquipment(equipment);
        // Manter Campanha_id ao atualizar
        const apiEquipWithCampaign = activeCampaign 
          ? { Id: id, ...apiData, Campanha_id: activeCampaign.Id }
          : { Id: id, ...apiData };
        
        const apiEquip = await api.equipments.update(id, apiEquipWithCampaign);
        const converted = fromApiEquipment(apiEquip);
        
        const updated = customEquipments.map((e) => (e.id === equipment.id ? converted : e));
        saveCustomEquipments(updated);
        toast.success("Equipment updated successfully!");
      }
      
      setShowEditor(false);
      setEditingEquipment(null);
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      toast.error('Erro ao salvar no servidor. Salvando localmente.');
      
      // Fallback: salvar apenas localmente
      const isNew = !customEquipments.find((e) => e.id === equipment.id);
      
      if (isNew) {
        saveCustomEquipments([...customEquipments, equipment]);
      } else {
        const updated = customEquipments.map((e) => (e.id === equipment.id ? equipment : e));
        saveCustomEquipments(updated);
      }
      
      setShowEditor(false);
      setEditingEquipment(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!editingEquipment) return;
    
    try {
      setSaving(true);
      
      // Só deletar do backend se não for temporário
      if (!editingEquipment.id.startsWith('temp-')) {
        const id = parseInt(editingEquipment.id);
        await api.equipments.delete(id);
      }
      
      const filtered = customEquipments.filter((e) => e.id !== editingEquipment.id);
      saveCustomEquipments(filtered);
      setShowEditor(false);
      setEditingEquipment(null);
      toast.success("Equipment deleted successfully!");
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error);
      toast.error('Erro ao deletar do servidor. Deletando localmente.');
      
      // Fallback: deletar apenas localmente
      const filtered = customEquipments.filter((e) => e.id !== editingEquipment.id);
      saveCustomEquipments(filtered);
      setShowEditor(false);
      setEditingEquipment(null);
    } finally {
      setSaving(false);
    }
  };

  const rarityColors = {
    common: "bg-gray-500 text-white",
    uncommon: "bg-green-500 text-white",
    rare: "bg-blue-500 text-white",
    epic: "bg-purple-500 text-white",
    legendary: "bg-orange-500 text-white",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="Equipments Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
            Equipment & Items
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
            Gear up with powerful weapons, armor and artifacts
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary">Equipment Collection</h2>
            <p className="text-sm text-muted-foreground font-body">
              {customEquipments.length > 0 
                ? `${customEquipments.length} item${customEquipments.length !== 1 ? 's' : ''} in your inventory`
                : 'Start building your equipment collection'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadEquipments} 
              variant="outline" 
              size="icon"
              disabled={loading || saving}
              title="Reload from server"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreateEquipment} className="rpg-button" disabled={saving}>
              <Plus className="h-4 w-4 mr-2" />
              Create Equipment
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rpg-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                <Search className="h-4 w-4" />
                <span>Search Equipment</span>
              </Label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-body"
              />
            </div>

            <div>
              <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                <Filter className="h-4 w-4" />
                <span>Type</span>
              </Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="weapon">Weapon</SelectItem>
                  <SelectItem value="armor">Armor</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Rarity</span>
              </Label>
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="All rarities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground font-body">
            Showing {filteredEquipments.length} of {allEquipments.length} items
          </p>
        </div>

        {/* Equipments Grid */}
        {loading ? (
          <div className="rpg-card text-center py-16">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground font-body">
              Loading equipments...
            </p>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="rpg-card text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground font-body mb-4">
              {allEquipments.length === 0 
                ? "Your equipment collection is empty"
                : "No equipment found matching your criteria"}
            </p>
            {allEquipments.length === 0 && (
              <Button onClick={handleCreateEquipment} className="rpg-button">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Equipment
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipments.map((equipment) => (
              <EquipmentCard 
                key={equipment.id} 
                equipment={equipment} 
                onClick={() => setSelectedEquipment(equipment)}
                onEdit={equipment.isCustom ? () => handleEditEquipment(equipment) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Equipment Details Dialog */}
      <Dialog open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
        <DialogContent className="rpg-card max-w-2xl">
          {selectedEquipment && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-6xl pixel-icon">{selectedEquipment.icon}</div>
                  <div>
                    <DialogTitle className="text-3xl font-heading text-primary mb-2">
                      {selectedEquipment.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <Badge className={rarityColors[selectedEquipment.rarity]}>
                        {selectedEquipment.rarity}
                      </Badge>
                      <span className="text-sm font-semibold text-muted-foreground capitalize">
                        {selectedEquipment.type}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Description</span>
                  </h3>
                  <DialogDescription className="text-base leading-relaxed">
                    {selectedEquipment.description}
                  </DialogDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedEquipment.damage && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sword className="h-5 w-5 text-destructive" />
                        <h4 className="font-heading font-semibold">Damage</h4>
                      </div>
                      <p className="text-sm text-destructive font-bold">{selectedEquipment.damage}</p>
                    </div>
                  )}

                  {selectedEquipment.defense !== undefined && selectedEquipment.defense > 0 && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h4 className="font-heading font-semibold">Defense</h4>
                      </div>
                      <p className="text-sm text-primary font-bold">+{selectedEquipment.defense}</p>
                    </div>
                  )}

                  {selectedEquipment.weight !== undefined && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h4 className="font-heading font-semibold">Weight</h4>
                      </div>
                      <p className="text-sm">{selectedEquipment.weight} kg</p>
                    </div>
                  )}

                  {selectedEquipment.proficiency && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <h4 className="font-heading font-semibold">Proficiência</h4>
                      </div>
                      <p className="text-sm text-amber-500 font-bold">{selectedEquipment.proficiency}</p>
                    </div>
                  )}
                </div>

                {selectedEquipment.bonus && (
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Special Effects</span>
                    </h3>
                    <div className="rpg-card bg-accent/20">
                      <p className="text-sm leading-relaxed">{selectedEquipment.bonus}</p>
                    </div>
                  </div>
                )}

                {selectedEquipment.isCustom && (
                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => handleEditEquipment(selectedEquipment)} 
                      className="rpg-button w-full"
                      disabled={saving}
                    >
                      Edit Equipment
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Equipment Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={(open) => !open && setShowEditor(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {editingEquipment && (
            <EquipmentEditor
              equipment={editingEquipment}
              onSave={handleSaveEquipment}
              onDelete={handleDeleteEquipment}
              isCustomEquipment={editingEquipment.isCustom}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
