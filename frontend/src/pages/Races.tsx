import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Users2, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api, { Race as ApiRace } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import rpgBanner from "@/assets/rpg-banner.png";

interface Race {
  id: string;
  name: string;
  passive: string;
  characteristic: string;
}

const fromApiRace = (apiRace: ApiRace): Race => ({
  id: apiRace.Id.toString(),
  name: apiRace.Nome,
  passive: apiRace.Passiva || "",
  characteristic: apiRace.Caracteristica || "",
});

const toApiRace = (race: Race): Omit<ApiRace, 'Id'> => ({
  Nome: race.name,
  Passiva: race.passive,
  Caracteristica: race.characteristic,
});

export default function Races() {
  const [races, setRaces] = useState<Race[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Carregar raças da API
  const loadRaces = async () => {
    setIsLoading(true);
    try {
      const data = await api.races.getAll();
      const converted = data.map(fromApiRace);
      setRaces(converted);
    } catch (error) {
      toast.error("Erro ao carregar raças");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRaces();
  }, []);

  // Criar nova raça
  const handleCreate = () => {
    setEditingRace({
      id: `temp-${Date.now()}`,
      name: "",
      passive: "",
      characteristic: "",
    });
    setIsEditorOpen(true);
  };

  // Editar raça existente
  const handleEdit = (race: Race) => {
    setEditingRace(race);
    setIsEditorOpen(true);
  };

  // Salvar raça
  const handleSave = async () => {
    if (!editingRace) return;

    if (!editingRace.name.trim()) {
      toast.error("O nome da raça é obrigatório!");
      return;
    }

    try {
      const isNew = editingRace.id.startsWith("temp-");
      const apiData = toApiRace(editingRace);

      if (isNew) {
        const created = await api.races.create(apiData);
        const newRace = fromApiRace(created);
        setRaces([...races, newRace]);
        toast.success("Raça criada com sucesso!");
      } else {
        const updated = await api.races.update(parseInt(editingRace.id), {
          Id: parseInt(editingRace.id),
          ...apiData,
        });
        const updatedRace = fromApiRace(updated);
        setRaces(races.map((r) => (r.id === updatedRace.id ? updatedRace : r)));
        toast.success("Raça atualizada com sucesso!");
      }

      setIsEditorOpen(false);
      setEditingRace(null);
    } catch (error) {
      toast.error("Erro ao salvar raça");
      console.error(error);
    }
  };

  // Deletar raça
  const handleDelete = async (race: Race) => {
    try {
      await api.races.delete(parseInt(race.id));
      setRaces(races.filter((r) => r.id !== race.id));
      toast.success("Raça deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar raça");
      console.error(error);
    }
  };

  // Filtrar raças pela busca
  const filteredRaces = races.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="Races Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
            Character Races
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
            Discover unique races and ancestries
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary">Race Collection</h2>
            <p className="text-sm text-muted-foreground font-body">
              {races.length > 0 ? `${races.length} race${races.length !== 1 ? 's' : ''} available` : 'No races created yet'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadRaces} 
              variant="outline" 
              size="icon"
              disabled={isLoading}
              title="Reload from server"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreate} className="rpg-button gap-2">
              <Plus className="h-4 w-4" />
              Create Race
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search races..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

      {/* Races Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando raças...
        </div>
      ) : filteredRaces.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Nenhuma raça encontrada</p>
          <p className="text-sm">Crie sua primeira raça para começar!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRaces.map((race) => (
            <Card key={race.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-green-500" />
                      {race.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-1">
                        {race.passive && (
                          <div>
                            <span className="font-semibold">Passiva:</span> {race.passive}
                          </div>
                        )}
                        {race.characteristic && (
                          <div className="line-clamp-2">
                            <span className="font-semibold">Característica:</span> {race.characteristic}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(race)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Raça?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A raça "{race.name}" será permanentemente removida.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(race)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRace?.id.startsWith("temp-") ? "Nova Raça" : "Editar Raça"}
            </DialogTitle>
          </DialogHeader>

          {editingRace && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Raça *</Label>
                <Input
                  id="name"
                  value={editingRace.name}
                  onChange={(e) =>
                    setEditingRace({ ...editingRace, name: e.target.value })
                  }
                  placeholder="Ex: Humano, Elfo, Anão, Orc..."
                />
              </div>

              <div>
                <Label htmlFor="passive">Habilidade Passiva</Label>
                <Textarea
                  id="passive"
                  value={editingRace.passive}
                  onChange={(e) =>
                    setEditingRace({ ...editingRace, passive: e.target.value })
                  }
                  placeholder="Descreva a habilidade passiva da raça..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="characteristic">Características Raciais</Label>
                <Textarea
                  id="characteristic"
                  value={editingRace.characteristic}
                  onChange={(e) =>
                    setEditingRace({ ...editingRace, characteristic: e.target.value })
                  }
                  placeholder="Descreva as características e traços únicos desta raça..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
