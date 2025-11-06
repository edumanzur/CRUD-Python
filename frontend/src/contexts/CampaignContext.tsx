import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign, CampaignCreate } from '../types/campaign';

interface CampaignContextType {
  activeCampaign: Campaign | null;
  campaigns: Campaign[];
  isLoading: boolean;
  setActiveCampaign: (campaignId: number) => Promise<void>;
  createCampaign: (data: CampaignCreate) => Promise<Campaign>;
  refreshCampaigns: () => Promise<void>;
  deleteCampaign: (campaignId: number) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000';

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [activeCampaign, setActiveCampaignState] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar todas as campanhas
  const refreshCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/campanhas/`);
      if (!response.ok) throw new Error('Erro ao buscar campanhas');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
    }
  };

  // Buscar campanha ativa
  const fetchActiveCampaign = async () => {
    try {
      const response = await fetch(`${API_URL}/campanhas/ativa`);
      if (!response.ok) throw new Error('Erro ao buscar campanha ativa');
      const data = await response.json();
      setActiveCampaignState(data);
    } catch (error) {
      console.error('Erro ao buscar campanha ativa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ativar uma campanha
  const setActiveCampaign = async (campaignId: number) => {
    try {
      const response = await fetch(`${API_URL}/campanhas/${campaignId}/ativar`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Erro ao ativar campanha');
      
      // Atualizar estado local
      const campaign = campaigns.find(c => c.Id === campaignId);
      if (campaign) {
        setActiveCampaignState(campaign);
        // Atualizar lista de campanhas
        setCampaigns(prev => prev.map(c => ({
          ...c,
          Ativa: c.Id === campaignId ? 1 : 0
        })));
      }
    } catch (error) {
      console.error('Erro ao ativar campanha:', error);
      throw error;
    }
  };

  // Criar nova campanha
  const createCampaign = async (data: CampaignCreate): Promise<Campaign> => {
    try {
      const response = await fetch(`${API_URL}/campanhas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: 0,
          ...data,
          Ativa: 0,
        }),
      });
      
      if (!response.ok) throw new Error('Erro ao criar campanha');
      
      const newCampaign = await response.json();
      
      // Atualizar lista de campanhas
      await refreshCampaigns();
      
      // Ativar automaticamente a nova campanha
      await setActiveCampaign(newCampaign.Id);
      
      return newCampaign;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  };

  // Deletar campanha
  const deleteCampaign = async (campaignId: number) => {
    try {
      const response = await fetch(`${API_URL}/campanhas/${campaignId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar campanha');
      
      // Se deletou a campanha ativa, buscar nova ativa
      if (activeCampaign?.Id === campaignId) {
        await fetchActiveCampaign();
      }
      
      // Atualizar lista
      await refreshCampaigns();
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  };

  // Inicialização
  useEffect(() => {
    const init = async () => {
      await refreshCampaigns();
      await fetchActiveCampaign();
    };
    init();
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        activeCampaign,
        campaigns,
        isLoading,
        setActiveCampaign,
        createCampaign,
        refreshCampaigns,
        deleteCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}
