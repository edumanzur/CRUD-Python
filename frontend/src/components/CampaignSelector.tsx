import { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { NewCampaignDialog } from './NewCampaignDialog';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function CampaignSelector() {
  const { activeCampaign, campaigns, setActiveCampaign, isLoading } = useCampaign();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCampaignChange = async (value: string) => {
    const campaignId = parseInt(value);
    try {
      await setActiveCampaign(campaignId);
      const campaign = campaigns.find(c => c.Id === campaignId);
      toast.success(`Campanha "${campaign?.Nome}" ativada`);
    } catch (error) {
      console.error('Erro ao trocar campanha:', error);
      toast.error('Erro ao trocar campanha');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 animate-pulse" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <Select
          value={activeCampaign?.Id.toString()}
          onValueChange={handleCampaignChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione uma campanha" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.Id} value={campaign.Id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{campaign.Nome}</span>
                  {campaign.Ativa === 1 && (
                    <span className="text-xs text-green-500">●</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Nova
        </Button>
      </div>

      <NewCampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
