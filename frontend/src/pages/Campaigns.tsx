import { useState, useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { NewCampaignDialog } from "@/components/NewCampaignDialog";
import { BookOpen, Edit, Trash2, Plus, CheckCircle, Users, Wand2, Shield, Package } from "lucide-react";
import { toast } from "sonner";
import rpgBanner from "@/assets/rpg-banner.png";

interface CampaignStats {
  personagens: number;
  magias: number;
  habilidades: number;
  equipamentos: number;
}

export default function Campaigns() {
  const { campaigns, activeCampaign, setActiveCampaign, deleteCampaign, refreshCampaigns } = useCampaign();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ Nome: "", Descricao: "" });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Record<number, CampaignStats>>({});

  // Carregar estatísticas de cada campanha
  const loadCampaignStats = async (campaignId: number) => {
    try {
      const [personagens, magias, habilidades, equipamentos] = await Promise.all([
        fetch(`http://localhost:8000/personagens/?campanha_id=${campaignId}`).then(r => r.json()),
        fetch(`http://localhost:8000/magias/?campanha_id=${campaignId}`).then(r => r.json()),
        fetch(`http://localhost:8000/habilidades/?campanha_id=${campaignId}`).then(r => r.json()),
        fetch(`http://localhost:8000/equipamentos/?campanha_id=${campaignId}`).then(r => r.json()),
      ]);

      setStats(prev => ({
        ...prev,
        [campaignId]: {
          personagens: personagens.length,
          magias: magias.length,
          habilidades: habilidades.length,
          equipamentos: equipamentos.length,
        }
      }));
    } catch (error) {
      console.error(`Erro ao carregar estatísticas da campanha ${campaignId}:`, error);
    }
  };

  useEffect(() => {
    // Carregar estatísticas de todas as campanhas
    campaigns.forEach(campaign => {
      loadCampaignStats(campaign.Id);
    });
  }, [campaigns]);

  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      Nome: campaign.Nome,
      Descricao: campaign.Descricao || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCampaign) return;
    
    if (!editForm.Nome.trim()) {
      toast.error("O nome da campanha é obrigatório");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/campanhas/${editingCampaign.Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Id: editingCampaign.Id,
          Nome: editForm.Nome.trim(),
          Descricao: editForm.Descricao.trim() || undefined,
          DataCriacao: editingCampaign.DataCriacao,
          Ativa: editingCampaign.Ativa,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar campanha");

      await refreshCampaigns();
      toast.success("Campanha atualizada com sucesso!");
      setShowEditDialog(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao atualizar campanha");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (campaignId: number) => {
    setDeleteConfirmId(campaignId);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;

    const campaign = campaigns.find(c => c.Id === deleteConfirmId);
    if (!campaign) return;

    // Prevenir deletar a última campanha
    if (campaigns.length === 1) {
      toast.error("Não é possível deletar a última campanha");
      setDeleteConfirmId(null);
      return;
    }

    // Prevenir deletar a campanha ativa se for a única
    if (campaign.Ativa === 1 && campaigns.length === 1) {
      toast.error("Não é possível deletar a campanha ativa se for a única");
      setDeleteConfirmId(null);
      return;
    }

    try {
      await deleteCampaign(deleteConfirmId);
      toast.success(`Campanha "${campaign.Nome}" deletada com sucesso`);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar campanha");
      setDeleteConfirmId(null);
    }
  };

  const handleActivate = async (campaignId: number) => {
    try {
      await setActiveCampaign(campaignId);
    } catch (error) {
      console.error("Erro ao ativar:", error);
      toast.error("Erro ao ativar campanha");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Banner */}
      <div 
        className="relative h-48 bg-cover bg-center border-b-4 border-primary/40"
        style={{ backgroundImage: `url(${rpgBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-2" />
            <h1 className="text-4xl font-heading font-bold text-white drop-shadow-lg">
              Gerenciar Campanhas
            </h1>
            <p className="text-white/90 mt-2">
              Edite, ative ou delete suas campanhas
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão de criar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold">
              {campaigns.length} {campaigns.length === 1 ? "Campanha" : "Campanhas"}
            </h2>
            <p className="text-muted-foreground">
              Gerencie todas as suas campanhas de RPG
            </p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Grid de Campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.Id} 
              className={`relative ${campaign.Ativa === 1 ? 'border-2 border-primary shadow-lg' : ''}`}
            >
              {campaign.Ativa === 1 && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-primary gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ativa
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {campaign.Nome}
                </CardTitle>
                <CardDescription>
                  {campaign.Descricao || "Sem descrição"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{stats[campaign.Id]?.personagens || 0}</span>
                    <span className="text-muted-foreground">Personagens</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wand2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{stats[campaign.Id]?.magias || 0}</span>
                    <span className="text-muted-foreground">Magias</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{stats[campaign.Id]?.habilidades || 0}</span>
                    <span className="text-muted-foreground">Habilidades</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{stats[campaign.Id]?.equipamentos || 0}</span>
                    <span className="text-muted-foreground">Equipamentos</span>
                  </div>
                </div>

                {campaign.DataCriacao && (
                  <p className="text-xs text-muted-foreground">
                    Criada em: {new Date(campaign.DataCriacao).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                {campaign.Ativa !== 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActivate(campaign.Id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Ativar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(campaign)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(campaign.Id)}
                  disabled={campaigns.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Campanha</DialogTitle>
            <DialogDescription>
              Atualize o nome e descrição da campanha
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">
                Nome da Campanha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-nome"
                value={editForm.Nome}
                onChange={(e) => setEditForm({ ...editForm, Nome: e.target.value })}
                placeholder="Nome da campanha"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Textarea
                id="edit-descricao"
                value={editForm.Descricao}
                onChange={(e) => setEditForm({ ...editForm, Descricao: e.target.value })}
                placeholder="Descrição da campanha..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving || !editForm.Nome.trim()}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Deleção */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados desta campanha serão permanentemente deletados:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Personagens</li>
                <li>Magias e Habilidades</li>
                <li>Equipamentos</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Deletar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Nova Campanha */}
      <NewCampaignDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
    </div>
  );
}
