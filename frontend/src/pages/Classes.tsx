import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Scroll, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api, { Class as ApiClass } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import rpgBanner from "@/assets/rpg-banner.png";

interface Class {
  id: string;
  name: string;
  description: string;
}

const fromApiClass = (apiClass: ApiClass): Class => ({
  id: apiClass.Id.toString(),
  name: apiClass.Nome,
  description: apiClass.Descricao || "",
});

const toApiClass = (classData: Class): Omit<ApiClass, 'Id'> => ({
  Nome: classData.name,
  Descricao: classData.description,
});

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Carregar classes da API
  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const data = await api.classes.getAll();
      const converted = data.map(fromApiClass);
      setClasses(converted);
    } catch (error) {
      toast.error("Erro ao carregar classes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Criar nova classe
  const handleCreate = () => {
    setEditingClass({
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
    });
    setIsEditorOpen(true);
  };

  // Editar classe existente
  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
    setIsEditorOpen(true);
  };

  // Salvar classe
  const handleSave = async () => {
    if (!editingClass) return;

    if (!editingClass.name.trim()) {
      toast.error("O nome da classe é obrigatório!");
      return;
    }

    try {
      const isNew = editingClass.id.startsWith("temp-");
      const apiData = toApiClass(editingClass);

      if (isNew) {
        const created = await api.classes.create(apiData);
        const newClass = fromApiClass(created);
        setClasses([...classes, newClass]);
        toast.success("Classe criada com sucesso!");
      } else {
        const updated = await api.classes.update(parseInt(editingClass.id), {
          Id: parseInt(editingClass.id),
          ...apiData,
        });
        const updatedClass = fromApiClass(updated);
        setClasses(classes.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
        toast.success("Classe atualizada com sucesso!");
      }

      setIsEditorOpen(false);
      setEditingClass(null);
    } catch (error) {
      toast.error("Erro ao salvar classe");
      console.error(error);
    }
  };

  // Deletar classe
  const handleDelete = async (classData: Class) => {
    try {
      await api.classes.delete(parseInt(classData.id));
      setClasses(classes.filter((c) => c.id !== classData.id));
      toast.success("Classe deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar classe");
      console.error(error);
    }
  };

  // Filtrar classes pela busca
  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden border-b-4 border-double border-primary/40">
        <img
          src={rpgBanner}
          alt="Classes Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary drop-shadow-lg">
            Character Classes
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mt-2 font-body">
            Define powerful classes for your heroes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary">Class Collection</h2>
            <p className="text-sm text-muted-foreground font-body">
              {classes.length > 0 ? `${classes.length} class${classes.length !== 1 ? 'es' : ''} available` : 'No classes created yet'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadClasses} 
              variant="outline" 
              size="icon"
              disabled={isLoading}
              title="Reload from server"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreate} className="rpg-button gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando classes...
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Scroll className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Nenhuma classe encontrada</p>
          <p className="text-sm">Crie sua primeira classe para começar!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classData) => (
            <Card key={classData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{classData.name}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {classData.description || "Sem descrição"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(classData)}
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
                        <AlertDialogTitle>Deletar Classe?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A classe "{classData.name}" será permanentemente removida.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(classData)}
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
              {editingClass?.id.startsWith("temp-") ? "Nova Classe" : "Editar Classe"}
            </DialogTitle>
          </DialogHeader>

          {editingClass && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Classe *</Label>
                <Input
                  id="name"
                  value={editingClass.name}
                  onChange={(e) =>
                    setEditingClass({ ...editingClass, name: e.target.value })
                  }
                  placeholder="Ex: Guerreiro, Mago, Ladino..."
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingClass.description}
                  onChange={(e) =>
                    setEditingClass({ ...editingClass, description: e.target.value })
                  }
                  placeholder="Descreva as características desta classe..."
                  rows={5}
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
