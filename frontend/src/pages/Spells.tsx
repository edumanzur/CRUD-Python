import { useState, useMemo, useEffect } from "react";
import { Spell } from "@/types/spell";
import { Ability } from "@/types/ability";
import { SpellCard } from "@/components/SpellCard";
import { SpellEditor } from "@/components/SpellEditor";
import { AbilityCard } from "@/components/AbilityCard";
import { AbilityEditor } from "@/components/AbilityEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Sparkles, Target, Zap, Plus, RefreshCw, Swords, Users, Dices, Clock } from "lucide-react";
import { toast } from "sonner";
import { useCampaign } from "@/contexts/CampaignContext";
import rpgBanner from "@/assets/rpg-banner.png";
import api, { Spell as ApiSpell, Ability as ApiAbility } from "@/services/api";

const STORAGE_KEY_SPELLS = "rpg-custom-spells";
const STORAGE_KEY_ABILITIES = "rpg-custom-abilities";

const createNewSpell = (): Spell => ({
  id: `temp-${Date.now()}`,
  name: "New Spell",
  description: "A mysterious new spell waiting to be defined...",
  category: "attack",
  level: 1,
  icon: "✨",
  manaCost: 10,
  cooldown: 0,
  effect: "Describe the effect here",
  damage: "", // Dano no formato XdY (ex: 2d6)
  classes: [], // Nenhuma classe selecionada inicialmente
  isCustom: true,
});

const createNewAbility = (): Ability => ({
  id: `temp-${Date.now()}`,
  name: "New Ability",
  description: "A powerful new ability waiting to be defined...",
  type: "active",
  cooldown: 0,
  icon: "⚡",
  effect: "Describe the effect here",
  damage: "", // Dano no formato XdY (ex: 2d6)
  classes: [], // Nenhuma classe selecionada inicialmente
});

// Converter do formato da API para o formato do frontend
const fromApiSpell = (apiSpell: ApiSpell): Spell => ({
  id: apiSpell.Id.toString(),
  name: apiSpell.Nome,
  description: apiSpell.Descricao || "No description available",
  category: (apiSpell.Categoria as any) || "attack",
  level: apiSpell.Nivel || 1,
  icon: apiSpell.Icone || "✨",
  manaCost: apiSpell.CustoMana || 10,
  cooldown: apiSpell.Cooldown || 0,
  effect: apiSpell.Efeito || apiSpell.Descricao,
  damage: apiSpell.Dano || "", // Dano no formato XdY
  modifier: apiSpell.Modificador || undefined, // Atributo do personagem
  classes: apiSpell.Classes ? apiSpell.Classes.split(',').map(c => c.trim()) : [], // Converte string para array
  isCustom: true, // Marcar como custom para permitir edição
});

// Converter do formato do frontend para o formato da API
const toApiSpell = (spell: Spell): Omit<ApiSpell, 'Id'> => ({
  Nome: spell.name,
  Descricao: spell.description,
  Categoria: spell.category,
  Nivel: spell.level,
  Icone: spell.icon,
  CustoMana: spell.manaCost,
  Cooldown: spell.cooldown,
  Efeito: spell.effect,
  Dano: spell.damage || undefined, // Dano no formato XdY
  Modificador: spell.modifier || undefined, // Atributo do personagem
  Classes: spell.classes && spell.classes.length > 0 ? spell.classes.join(',') : undefined, // Converte array para string
});

// Converter do formato da API para o formato do frontend (Abilities)
const fromApiAbility = (apiAbility: ApiAbility): Ability => ({
  id: apiAbility.Id.toString(),
  name: apiAbility.Nome,
  description: apiAbility.Descricao || "No description available",
  type: (apiAbility.Tipo as any) || "active",
  cooldown: apiAbility.Cooldown || 0,
  icon: apiAbility.Icone || "⚡",
  effect: apiAbility.Efeito || apiAbility.Descricao,
  damage: apiAbility.Dano || "", // Dano no formato XdY
  modifier: apiAbility.Modificador || undefined, // Atributo do personagem
  classes: apiAbility.Classes ? apiAbility.Classes.split(',').map(c => c.trim()) : [], // Converte string para array
});

// Converter do formato do frontend para o formato da API (Abilities)
const toApiAbility = (ability: Ability): Omit<ApiAbility, 'Id'> => ({
  Nome: ability.name,
  Descricao: ability.description,
  Tipo: ability.type,
  Cooldown: ability.cooldown,
  Icone: ability.icon,
  Efeito: ability.effect,
  Dano: ability.damage || undefined, // Dano no formato XdY
  Modificador: ability.modifier || undefined, // Atributo do personagem
  Classes: ability.classes && ability.classes.length > 0 ? ability.classes.join(',') : undefined, // Converte array para string
});

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
];

// Atributos do personagem disponíveis como modificadores
const AVAILABLE_MODIFIERS = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma",
];

export default function Spells() {
  const { activeCampaign } = useCampaign(); // Hook para obter campanha ativa
  // Estados para Spells
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [customSpells, setCustomSpells] = useState<Spell[]>([]);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para Abilities
  const [searchTermAbility, setSearchTermAbility] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [classFilterAbility, setClassFilterAbility] = useState<string>("all");
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [editingAbility, setEditingAbility] = useState<Ability | null>(null);
  const [showAbilityEditor, setShowAbilityEditor] = useState(false);
  const [loadingAbilities, setLoadingAbilities] = useState(true);
  const [savingAbility, setSavingAbility] = useState(false);

  // Estado para classes carregadas da API
  const [availableClasses, setAvailableClasses] = useState<string[]>(AVAILABLE_CLASSES);

  // Carregar classes do backend
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classesData = await api.classes.getAll();
        const classNames = classesData.map((c: any) => c.Nome);
        setAvailableClasses(classNames);
      } catch (error) {
        console.error("Erro ao carregar classes:", error);
        // Mantém o fallback AVAILABLE_CLASSES se houver erro
      }
    };

    loadClasses();
  }, []);

  // Carregar magias do backend filtradas por campanha
  const loadSpells = async () => {
    try {
      setLoading(true);
      // Adicionar filtro de campanha na URL se houver campanha ativa
      const url = activeCampaign 
        ? `http://localhost:8000/magias/?campanha_id=${activeCampaign.Id}`
        : 'http://localhost:8000/magias/';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar magias');
      
      const apiSpells = await response.json();
      const converted = apiSpells.map(fromApiSpell);
      setCustomSpells(converted);
    } catch (error) {
      console.error('Erro ao carregar magias:', error);
      toast.error('Erro ao carregar magias do servidor. Usando dados locais.');
      
      // Fallback para localStorage se o backend estiver offline
      const stored = localStorage.getItem(STORAGE_KEY_SPELLS);
      if (stored) {
        setCustomSpells(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  // Carregar habilidades do backend filtradas por campanha
  const loadAbilities = async () => {
    try {
      setLoadingAbilities(true);
      // Adicionar filtro de campanha na URL se houver campanha ativa
      const url = activeCampaign 
        ? `http://localhost:8000/habilidades/?campanha_id=${activeCampaign.Id}`
        : 'http://localhost:8000/habilidades/';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar habilidades');
      
      const apiAbilities = await response.json();
      const converted = apiAbilities.map(fromApiAbility);
      setAbilities(converted);
    } catch (error) {
      console.error('Erro ao carregar habilidades:', error);
      toast.error('Erro ao carregar habilidades do servidor. Usando dados locais.');
      
      // Fallback para localStorage se o backend estiver offline
      const stored = localStorage.getItem(STORAGE_KEY_ABILITIES);
      if (stored) {
        setAbilities(JSON.parse(stored));
      }
    } finally {
      setLoadingAbilities(false);
    }
  };

  // Recarregar quando a campanha ativa mudar
  useEffect(() => {
    if (activeCampaign) {
      loadSpells();
      loadAbilities();
    }
  }, [activeCampaign]);

  const saveCustomSpells = (newSpells: Spell[]) => {
    setCustomSpells(newSpells);
    localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(newSpells));
  };

  const saveAbilities = (newAbilities: Ability[]) => {
    setAbilities(newAbilities);
    localStorage.setItem(STORAGE_KEY_ABILITIES, JSON.stringify(newAbilities));
  };

  // Usar apenas magias do banco de dados (customSpells)
  const allSpells = useMemo(() => customSpells, [customSpells]);

  const filteredSpells = useMemo(() => {
    return allSpells.filter((spell) => {
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spell.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || spell.category === categoryFilter;
      const matchesLevel = levelFilter === "all" || spell.level.toString() === levelFilter;
      
      // Filtro por classe: se "all", mostra tudo; se uma classe específica, mostra APENAS as que incluem essa classe
      const matchesClass = classFilter === "all" || 
        (spell.classes && spell.classes.includes(classFilter));

      return matchesSearch && matchesCategory && matchesLevel && matchesClass;
    });
  }, [allSpells, searchTerm, categoryFilter, levelFilter, classFilter]);

  const uniqueLevels = Array.from(new Set(allSpells.map(s => s.level))).sort((a, b) => a - b);

  // Filtros para Abilities
  const filteredAbilities = useMemo(() => {
    return abilities.filter((ability) => {
      const matchesSearch = ability.name.toLowerCase().includes(searchTermAbility.toLowerCase()) ||
        ability.description.toLowerCase().includes(searchTermAbility.toLowerCase());
      const matchesType = typeFilter === "all" || ability.type === typeFilter;
      
      // Filtro por classe: se "all", mostra tudo; se uma classe específica, mostra APENAS as que incluem essa classe
      const matchesClass = classFilterAbility === "all" || 
        (ability.classes && ability.classes.includes(classFilterAbility));

      return matchesSearch && matchesType && matchesClass;
    });
  }, [abilities, searchTermAbility, typeFilter, classFilterAbility]);

  const handleCreateSpell = () => {
    const newSpell = createNewSpell();
    setEditingSpell(newSpell);
    setShowEditor(true);
  };

  const handleEditSpell = (spell: Spell) => {
    if (spell.isCustom) {
      setEditingSpell(spell);
      setShowEditor(true);
      setSelectedSpell(null);
    }
  };

  const handleSaveSpell = async (spell: Spell) => {
    try {
      setSaving(true);
      const isNewSpell = spell.id.startsWith('temp-');
      
      if (isNewSpell) {
        // Criar nova magia
        const apiData = toApiSpell(spell);
        // Adicionar Campanha_id se houver campanha ativa
        const apiSpellWithCampaign = activeCampaign 
          ? { ...apiData, Campanha_id: activeCampaign.Id }
          : apiData;
        
        const apiSpell = await api.spells.create(apiSpellWithCampaign);
        const converted = fromApiSpell(apiSpell);
        
        const updated = [...customSpells, converted];
        setCustomSpells(updated);
        localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(updated));
        toast.success("Spell created successfully!");
      } else {
        // Atualizar magia existente
        const id = parseInt(spell.id);
        const apiData = toApiSpell(spell);
        // Manter Campanha_id ao atualizar
        const apiSpellWithCampaign = activeCampaign 
          ? { Id: id, ...apiData, Campanha_id: activeCampaign.Id }
          : { Id: id, ...apiData };
        
        const apiSpell = await api.spells.update(id, apiSpellWithCampaign);
        const converted = fromApiSpell(apiSpell);
        
        const updated = customSpells.map((s) => (s.id === spell.id ? converted : s));
        setCustomSpells(updated);
        localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(updated));
        toast.success("Spell updated successfully!");
      }
      
      setShowEditor(false);
      setEditingSpell(null);
    } catch (error) {
      console.error('Erro ao salvar magia:', error);
      toast.error('Erro ao salvar magia. Salvando localmente.');
      
      // Fallback: salvar apenas localmente
      const isNew = !customSpells.find((s) => s.id === spell.id);
      if (isNew) {
        saveCustomSpells([...customSpells, spell]);
      } else {
        const updated = customSpells.map((s) => (s.id === spell.id ? spell : s));
        saveCustomSpells(updated);
      }
      
      setShowEditor(false);
      setEditingSpell(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpell = async () => {
    if (!editingSpell) return;
    
    try {
      setSaving(true);
      
      // Só deletar do backend se não for temporário
      if (!editingSpell.id.startsWith('temp-')) {
        const id = parseInt(editingSpell.id);
        await api.spells.delete(id);
      }
      
      const filtered = customSpells.filter((s) => s.id !== editingSpell.id);
      setCustomSpells(filtered);
      localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(filtered));
      
      setShowEditor(false);
      setEditingSpell(null);
      toast.success("Spell deleted successfully!");
    } catch (error) {
      console.error('Erro ao deletar magia:', error);
      toast.error('Erro ao deletar magia. Deletando localmente.');
      
      // Fallback: deletar apenas localmente
      const filtered = customSpells.filter((s) => s.id !== editingSpell.id);
      saveCustomSpells(filtered);
      setShowEditor(false);
      setEditingSpell(null);
    } finally {
      setSaving(false);
    }
  };

  // Funções para Abilities
  const handleCreateAbility = () => {
    const newAbility = createNewAbility();
    setEditingAbility(newAbility);
    setShowAbilityEditor(true);
  };

  const handleEditAbility = (ability: Ability) => {
    setEditingAbility(ability);
    setShowAbilityEditor(true);
    setSelectedAbility(null);
  };

  const handleSaveAbility = async (ability: Ability) => {
    try {
      setSavingAbility(true);
      const isNewAbility = ability.id.startsWith('temp-');
      
      if (isNewAbility) {
        // Criar nova habilidade
        const apiData = toApiAbility(ability);
        // Adicionar Campanha_id se houver campanha ativa
        const apiAbilityWithCampaign = activeCampaign 
          ? { ...apiData, Campanha_id: activeCampaign.Id }
          : apiData;
        
        const apiAbility = await api.abilities.create(apiAbilityWithCampaign);
        const converted = fromApiAbility(apiAbility);
        
        const updated = [...abilities, converted];
        setAbilities(updated);
        localStorage.setItem(STORAGE_KEY_ABILITIES, JSON.stringify(updated));
        toast.success("Ability created successfully!");
      } else {
        // Atualizar habilidade existente
        const id = parseInt(ability.id);
        const apiData = toApiAbility(ability);
        // Manter Campanha_id ao atualizar
        const apiAbilityWithCampaign = activeCampaign 
          ? { Id: id, ...apiData, Campanha_id: activeCampaign.Id }
          : { Id: id, ...apiData };
        
        const apiAbility = await api.abilities.update(id, apiAbilityWithCampaign);
        const converted = fromApiAbility(apiAbility);
        
        const updated = abilities.map((a) => (a.id === ability.id ? converted : a));
        setAbilities(updated);
        localStorage.setItem(STORAGE_KEY_ABILITIES, JSON.stringify(updated));
        toast.success("Ability updated successfully!");
      }
      
      setShowAbilityEditor(false);
      setEditingAbility(null);
    } catch (error) {
      console.error('Erro ao salvar habilidade:', error);
      toast.error('Erro ao salvar habilidade. Salvando localmente.');
      
      // Fallback: salvar apenas localmente
      const isNew = !abilities.find((a) => a.id === ability.id);
      if (isNew) {
        saveAbilities([...abilities, ability]);
      } else {
        const updated = abilities.map((a) => (a.id === ability.id ? ability : a));
        saveAbilities(updated);
      }
      
      setShowAbilityEditor(false);
      setEditingAbility(null);
    } finally {
      setSavingAbility(false);
    }
  };

  const handleDeleteAbility = async () => {
    if (!editingAbility) return;
    
    try {
      setSavingAbility(true);
      
      // Só deletar do backend se não for temporário
      if (!editingAbility.id.startsWith('temp-')) {
        const id = parseInt(editingAbility.id);
        await api.abilities.delete(id);
      }
      
      const filtered = abilities.filter((a) => a.id !== editingAbility.id);
      setAbilities(filtered);
      localStorage.setItem(STORAGE_KEY_ABILITIES, JSON.stringify(filtered));
      
      setShowAbilityEditor(false);
      setEditingAbility(null);
      toast.success("Ability deleted successfully!");
    } catch (error) {
      console.error('Erro ao deletar habilidade:', error);
      toast.error('Erro ao deletar habilidade. Deletando localmente.');
      
      // Fallback: deletar apenas localmente
      const filtered = abilities.filter((a) => a.id !== editingAbility.id);
      saveAbilities(filtered);
      setShowAbilityEditor(false);
      setEditingAbility(null);
    } finally {
      setSavingAbility(false);
    }
  };

  const categoryColors = {
    attack: "bg-destructive text-destructive-foreground",
    defense: "bg-primary text-primary-foreground",
    support: "bg-accent text-accent-foreground",
    buff: "bg-secondary text-secondary-foreground",
    debuff: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="Spells Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
            Spells & Abilities
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
            Discover mystical powers and ancient magic
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="spells" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="spells" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Spells
            </TabsTrigger>
            <TabsTrigger value="abilities" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              Abilities
            </TabsTrigger>
          </TabsList>

          {/* TAB: SPELLS */}
          <TabsContent value="spells">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary">Spell Collection</h2>
                <p className="text-sm text-muted-foreground font-body">
                  {customSpells.length > 0 ? `${customSpells.length} spell${customSpells.length !== 1 ? 's' : ''} in database` : 'No spells in database'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={loadSpells} 
                  variant="outline" 
                  size="icon"
                  disabled={loading || saving}
                  title="Recarregar do servidor"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  onClick={handleCreateSpell} 
                  className="rpg-button"
                  disabled={saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Spell
                </Button>
              </div>
            </div>

        {/* Search and Filters */}
        <div className="rpg-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                <Search className="h-4 w-4" />
                <span>Search Spells</span>
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
                <span>Category</span>
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="attack">Attack</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="buff">Buff</SelectItem>
                  <SelectItem value="debuff">Debuff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold mb-2 block">Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4" />
                <span>Class</span>
              </Label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {availableClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground font-body">
            Showing {filteredSpells.length} of {allSpells.length} spells
          </p>
        </div>

        {/* Spells Grid */}
        {loading ? (
          <div className="rpg-card text-center py-16">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
            <p className="text-muted-foreground font-body">
              Carregando magias...
            </p>
          </div>
        ) : filteredSpells.length === 0 ? (
          <div className="rpg-card text-center py-16">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground font-body mb-2">
              {allSpells.length === 0 
                ? 'No spells in database yet' 
                : 'No spells found matching your criteria'}
            </p>
            {allSpells.length === 0 && (
              <p className="text-sm text-muted-foreground font-body">
                Click "Create Spell" to add your first spell!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpells.map((spell) => (
              <SpellCard 
                key={spell.id} 
                spell={spell} 
                onClick={() => setSelectedSpell(spell)}
                onEdit={spell.isCustom ? () => handleEditSpell(spell) : undefined}
              />
            ))}
          </div>
        )}

            {/* Spell Details Dialog */}
            <Dialog open={!!selectedSpell} onOpenChange={(open) => !open && setSelectedSpell(null)}>
              <DialogContent className="rpg-card max-w-2xl max-h-[90vh] overflow-y-auto">
                {selectedSpell && (
                  <>
              <DialogHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-6xl pixel-icon">{selectedSpell.icon}</div>
                  <div>
                    <DialogTitle className="text-3xl font-heading text-primary mb-2">
                      {selectedSpell.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={categoryColors[selectedSpell.category]}>
                        {selectedSpell.category}
                      </Badge>
                      <span className="text-sm font-semibold text-muted-foreground">
                        Level {selectedSpell.level}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Descrição</span>
                  </h3>
                  <DialogDescription className="text-base leading-relaxed max-h-32 overflow-y-auto pr-2">
                    {selectedSpell.description}
                  </DialogDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rpg-card bg-accent/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-heading font-semibold">Categoria</h4>
                    </div>
                    <p className="text-sm capitalize">{selectedSpell.category}</p>
                  </div>

                  <div className="rpg-card bg-accent/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h4 className="font-heading font-semibold">Nível Requerido</h4>
                    </div>
                    <p className="text-sm">Level {selectedSpell.level}</p>
                  </div>

                  {selectedSpell.manaCost !== undefined && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h4 className="font-heading font-semibold">Mana Cost</h4>
                      </div>
                      <p className="text-sm">{selectedSpell.manaCost} MP</p>
                    </div>
                  )}

                  {selectedSpell.cooldown !== undefined && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <h4 className="font-heading font-semibold">Cooldown</h4>
                      </div>
                      <p className="text-sm">{selectedSpell.cooldown} second{selectedSpell.cooldown !== 1 ? 's' : ''}</p>
                    </div>
                  )}

                  {selectedSpell.damage && (
                    <div className="rpg-card bg-accent/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Dices className="h-5 w-5 text-destructive" />
                        <h4 className="font-heading font-semibold">Dice</h4>
                      </div>
                      <p className="text-sm font-semibold text-destructive">{selectedSpell.damage}</p>
                    </div>
                  )}
                </div>

                {selectedSpell.effect && (
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Effect</span>
                    </h3>
                    <DialogDescription className="text-base leading-relaxed">
                      {selectedSpell.effect}
                    </DialogDescription>
                  </div>
                )}

                {selectedSpell.classes && selectedSpell.classes.length > 0 && (
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Classes that can use</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpell.classes.map((className) => (
                        <Badge key={className} variant="outline" className="border-primary text-primary">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSpell.isCustom && (
                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => handleEditSpell(selectedSpell)} 
                      className="rpg-button w-full"
                    >
                      Edit Spell
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
            </DialogContent>
          </Dialog>
        </TabsContent>

          {/* TAB: ABILITIES */}
          <TabsContent value="abilities">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary">Ability Collection</h2>
                <p className="text-sm text-muted-foreground font-body">
                  {abilities.length > 0 ? `${abilities.length} abilit${abilities.length !== 1 ? 'ies' : 'y'} in database` : 'No abilities in database'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={loadAbilities} 
                  variant="outline" 
                  size="icon"
                  disabled={loadingAbilities || savingAbility}
                  title="Recarregar do servidor"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingAbilities ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  onClick={handleCreateAbility} 
                  className="rpg-button"
                  disabled={savingAbility}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ability
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="rpg-card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                    <Search className="h-4 w-4" />
                    <span>Search Abilities</span>
                  </Label>
                  <Input
                    placeholder="Search by name or description..."
                    value={searchTermAbility}
                    onChange={(e) => setSearchTermAbility(e.target.value)}
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
                      <SelectItem value="passive">Passive</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ultimate">Ultimate</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-heading font-semibold flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span>Class</span>
                  </Label>
                  <Select value={classFilterAbility} onValueChange={setClassFilterAbility}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {availableClasses.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground font-body">
                Showing {filteredAbilities.length} of {abilities.length} abilities
              </p>
            </div>

            {/* Abilities Grid */}
            {loadingAbilities ? (
              <div className="rpg-card text-center py-16">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                <p className="text-muted-foreground font-body">
                  Carregando habilidades...
                </p>
              </div>
            ) : filteredAbilities.length === 0 ? (
              <div className="rpg-card text-center py-16">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground font-body mb-2">
                  {abilities.length === 0 
                    ? 'No abilities in database yet' 
                    : 'No abilities found matching your criteria'}
                </p>
                {abilities.length === 0 && (
                  <p className="text-sm text-muted-foreground font-body">
                    Click "Create Ability" to add your first ability!
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAbilities.map((ability) => (
                  <AbilityCard 
                    key={ability.id} 
                    ability={ability} 
                    onClick={() => setSelectedAbility(ability)}
                    onEdit={() => handleEditAbility(ability)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Ability Details Dialog */}
        <Dialog open={!!selectedAbility} onOpenChange={(open) => !open && setSelectedAbility(null)}>
          <DialogContent className="rpg-card max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedAbility && (
              <>
                <DialogHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-6xl pixel-icon">{selectedAbility.icon || "⚡"}</div>
                    <div>
                      <DialogTitle className="text-3xl font-heading text-primary mb-2">
                        {selectedAbility.name}
                      </DialogTitle>
                      {selectedAbility.type && (
                        <Badge variant="outline">
                          {selectedAbility.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Descrição</span>
                    </h3>
                    <DialogDescription className="text-base leading-relaxed max-h-32 overflow-y-auto pr-2">
                      {selectedAbility.description}
                    </DialogDescription>
                  </div>

                  {selectedAbility.effect && (
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span>Effect</span>
                      </h3>
                      <DialogDescription className="text-base leading-relaxed max-h-32 overflow-y-auto pr-2">
                        {selectedAbility.effect}
                      </DialogDescription>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedAbility.cooldown !== undefined && (
                      <div className="rpg-card bg-accent/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <h4 className="font-heading font-semibold">Cooldown</h4>
                        </div>
                        <p className="text-sm">{selectedAbility.cooldown}s</p>
                      </div>
                    )}

                    {selectedAbility.damage && selectedAbility.damage.trim() !== '' && (
                      <div className="rpg-card bg-accent/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Dices className="h-5 w-5 text-destructive" />
                          <h4 className="font-heading font-semibold">Dice</h4>
                        </div>
                        <p className="text-sm font-semibold text-destructive">{selectedAbility.damage}</p>
                      </div>
                    )}
                  </div>

                  {selectedAbility.classes && selectedAbility.classes.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2 flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Classes that can use</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAbility.classes.map((className) => (
                          <Badge key={className} variant="outline" className="border-primary text-primary">
                            {className}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => handleEditAbility(selectedAbility)} 
                      className="rpg-button w-full"
                    >
                      Edit Ability
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Ability Editor Dialog */}
        <Dialog open={showAbilityEditor} onOpenChange={(open) => !open && setShowAbilityEditor(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {editingAbility && (
              <AbilityEditor
                ability={editingAbility}
                onSave={handleSaveAbility}
                onDelete={handleDeleteAbility}
                disabled={savingAbility}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Spell Editor Dialog */}
        <Dialog open={showEditor} onOpenChange={(open) => !open && setShowEditor(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {editingSpell && (
              <SpellEditor
                spell={editingSpell}
                onSave={handleSaveSpell}
                onDelete={handleDeleteSpell}
                isCustomSpell={true}
                disabled={saving}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
