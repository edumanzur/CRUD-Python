export interface Campaign {
  Id: number;
  Nome: string;
  Descricao?: string;
  DataCriacao?: string;
  Ativa?: number;
}

export interface CampaignCreate {
  Nome: string;
  Descricao?: string;
}

export interface CampaignUpdate {
  Nome?: string;
  Descricao?: string;
}
