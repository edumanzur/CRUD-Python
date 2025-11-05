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
import { Search, Filter, Package, Plus, Sword, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import rpgBanner from "@/assets/rpg-banner.png";

const STORAGE_KEY = "rpg-custom-equipments";

const createNewEquipment = (): Equipment => ({
  id: crypto.randomUUID(),
  name: "New Equipment",
  description: "A mysterious new item waiting to be defined...",
  type: "weapon",
  rarity: "common",
  icon: "⚔️",
  attack: 0,
  defense: 0,
  bonus: "",
  weight: 1,
  isCustom: true,
});

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [customEquipments, setCustomEquipments] = useState<Equipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load custom equipments from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCustomEquipments(JSON.parse(stored));
    }
  }, []);

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

  const handleSaveEquipment = (equipment: Equipment) => {
    const isNew = !customEquipments.find((e) => e.id === equipment.id);
    
    if (isNew) {
      saveCustomEquipments([...customEquipments, equipment]);
      toast.success("Equipment created successfully!");
    } else {
      const updated = customEquipments.map((e) => (e.id === equipment.id ? equipment : e));
      saveCustomEquipments(updated);
      toast.success("Equipment updated successfully!");
    }
    
    setShowEditor(false);
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = () => {
    if (!editingEquipment) return;
    
    const filtered = customEquipments.filter((e) => e.id !== editingEquipment.id);
    saveCustomEquipments(filtered);
    setShowEditor(false);
    setEditingEquipment(null);
    toast.success("Equipment deleted successfully!");
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
          <Button onClick={handleCreateEquipment} className="rpg-button">
            <Plus className="h-4 w-4 mr-2" />
            Create Equipment
          </Button>
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
        {filteredEquipments.length === 0 ? (
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
                  {selectedEquipment.attack !== undefined && selectedEquipment.attack > 0 && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sword className="h-5 w-5 text-destructive" />
                        <h4 className="font-heading font-semibold">Attack</h4>
                      </div>
                      <p className="text-sm text-destructive font-bold">+{selectedEquipment.attack}</p>
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
