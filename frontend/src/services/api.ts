// API Service - Comunicação com o Backend FastAPI
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos de erro personalizados
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Função auxiliar para fazer requisições
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new ApiError(response.status, error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Erro de conexão com o servidor');
  }
}

// ============================================================
// PERSONAGENS
// ============================================================
export interface Character {
  Id: number;
  Nome: string;
  Historia?: string;
  Tendencia?: string;
  Level?: number;
  Tipo?: string;  // Jogador, NPC, ou Monstro
  ImagemPath?: string;  // Caminho da imagem do personagem
  // Novos status
  Vida?: number;
  Forca?: number;
  Destreza?: number;
  Constituicao?: number;
  Inteligencia?: number;
  Sabedoria?: number;
  Mana?: number;
  Carisma?: number;
  Sorte?: number;
  Reputacao?: number;
  CA?: number;  // Classe de Armadura
  Deslocamento?: number;  // Velocidade de movimento
  Classe_Nome?: string;  // Nome da classe do personagem
  Raca_Nome?: string;  // Nome da raça do personagem
  Raca_id?: number;
  Classe_id?: number;
  Equipamento_id?: number;
  magias?: Spell[];
  habilidades?: Ability[];
}

export const charactersApi = {
  getAll: () => fetchApi<Character[]>('/personagens/'),
  
  getById: (id: number) => fetchApi<Character>(`/personagens/${id}`),
  
  search: (nome: string) => 
    fetchApi<Character[]>(`/personagens/search?nome=${encodeURIComponent(nome)}`),
  
  create: (character: Omit<Character, 'Id'>) =>
    fetchApi<Character>('/personagens/', {
      method: 'POST',
      body: JSON.stringify({ ...character, Id: 0 }),
    }),
  
  update: (id: number, character: Character) =>
    fetchApi<Character>(`/personagens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(character),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/personagens/${id}`, {
      method: 'DELETE',
    }),
  
  // Magias do personagem
  getSpells: (id: number) => fetchApi<Spell[]>(`/personagens/${id}/magias`),
  
  addSpell: (personagemId: number, magiaId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/magias/${magiaId}`, {
      method: 'POST',
    }),
  
  removeSpell: (personagemId: number, magiaId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/magias/${magiaId}`, {
      method: 'DELETE',
    }),
  
  // Habilidades do personagem
  getAbilities: (id: number) => fetchApi<Ability[]>(`/personagens/${id}/habilidades`),
  
  addAbility: (personagemId: number, habilidadeId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/habilidades/${habilidadeId}`, {
      method: 'POST',
    }),
  
  removeAbility: (personagemId: number, habilidadeId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/habilidades/${habilidadeId}`, {
      method: 'DELETE',
    }),

  // Equipamentos do personagem
  getEquipments: (id: number) => fetchApi<Equipment[]>(`/personagens/${id}/equipamentos`),
  
  addEquipment: (personagemId: number, equipamentoId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/equipamentos/${equipamentoId}`, {
      method: 'POST',
    }),
  
  removeEquipment: (personagemId: number, equipamentoId: number) =>
    fetchApi<{ detail: string }>(`/personagens/${personagemId}/equipamentos/${equipamentoId}`, {
      method: 'DELETE',
    }),
};

// ============================================================
// MAGIAS
// ============================================================
export interface Spell {
  Id: number;
  Nome: string;
  Descricao?: string;
  Categoria?: string;
  Nivel?: number;
  Icone?: string;
  CustoMana?: number;
  Cooldown?: number;
  Efeito?: string;
  Dano?: string;  // Dano no formato XdY (ex: 2d6, 1d8+2)
  Modificador?: string;  // Atributo do personagem (Força, Destreza, etc.)
  Classes?: string;  // Classes que podem usar (separadas por vírgula)
}

export const spellsApi = {
  getAll: () => fetchApi<Spell[]>('/magias/'),
  
  getById: (id: number) => fetchApi<Spell>(`/magias/${id}`),
  
  search: (nome: string) => 
    fetchApi<Spell[]>(`/magias/search?nome=${encodeURIComponent(nome)}`),
  
  create: (spell: Omit<Spell, 'Id'>) =>
    fetchApi<Spell>('/magias/', {
      method: 'POST',
      body: JSON.stringify({ ...spell, Id: 0 }),
    }),
  
  update: (id: number, spell: Spell) =>
    fetchApi<Spell>(`/magias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(spell),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/magias/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================
// EQUIPAMENTOS
// ============================================================
export interface Equipment {
  Id: number;
  Nome: string;
  Descricao?: string;
  Tipo?: string;
  Raridade?: string;
  Icone?: string;
  Ataque?: number;
  Defesa?: number;
  Bonus?: number;
  Peso?: number;
  Dano?: string;  // Formato: XdY (ex: 2d4, 1d8, 3d6)
  Proficiencia?: string;  // Ex: Armas Simples, Armas Marciais, Armaduras Leves
  Modificador?: string;  // Atributo do personagem (Força, Destreza, etc.)
}

export const equipmentsApi = {
  getAll: () => fetchApi<Equipment[]>('/equipamentos/'),
  
  getById: (id: number) => fetchApi<Equipment>(`/equipamentos/${id}`),
  
  search: (nome: string) => 
    fetchApi<Equipment[]>(`/equipamentos/search?nome=${encodeURIComponent(nome)}`),
  
  create: (equipment: Omit<Equipment, 'Id'>) =>
    fetchApi<Equipment>('/equipamentos/', {
      method: 'POST',
      body: JSON.stringify({ ...equipment, Id: 0 }),
    }),
  
  update: (id: number, equipment: Equipment) =>
    fetchApi<Equipment>(`/equipamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/equipamentos/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================
// RAÇAS
// ============================================================
export interface Race {
  Id: number;
  Nome: string;
  Passiva?: string;
  Caracteristica?: string;
}

export const racesApi = {
  getAll: () => fetchApi<Race[]>('/racas/'),
  
  getById: (id: number) => fetchApi<Race>(`/racas/${id}`),
  
  search: (nome: string) => 
    fetchApi<Race[]>(`/racas/search?nome=${encodeURIComponent(nome)}`),
  
  create: (race: Omit<Race, 'Id'>) =>
    fetchApi<Race>('/racas/', {
      method: 'POST',
      body: JSON.stringify({ ...race, Id: 0 }),
    }),
  
  update: (id: number, race: Race) =>
    fetchApi<Race>(`/racas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(race),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/racas/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================
// CLASSES
// ============================================================
export interface Class {
  Id: number;
  Nome: string;
  Descricao?: string;
  Habilidades_id?: number;
  Magias_id?: number;
}

export const classesApi = {
  getAll: () => fetchApi<Class[]>('/classes/'),
  
  getById: (id: number) => fetchApi<Class>(`/classes/${id}`),
  
  search: (nome: string) => 
    fetchApi<Class[]>(`/classes/search?nome=${encodeURIComponent(nome)}`),
  
  create: (classData: Omit<Class, 'Id'>) =>
    fetchApi<Class>('/classes/', {
      method: 'POST',
      body: JSON.stringify({ ...classData, Id: 0 }),
    }),
  
  update: (id: number, classData: Class) =>
    fetchApi<Class>(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/classes/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================
// HABILIDADES
// ============================================================
export interface Ability {
  Id: number;
  Nome: string;
  Descricao?: string;
  Tipo?: string;
  Cooldown?: number;
  Icone?: string;
  Efeito?: string;
  Dano?: string;  // Dano no formato XdY (ex: 2d6, 1d8+2)
  Modificador?: string;  // Atributo do personagem (Força, Destreza, etc.)
  Classes?: string;  // Classes que podem usar (separadas por vírgula)
  Campanha_id?: number;
}

export const abilitiesApi = {
  getAll: (campanha_id?: number) => {
    const url = campanha_id 
      ? `/habilidades/?campanha_id=${campanha_id}`
      : '/habilidades/';
    return fetchApi<Ability[]>(url);
  },
  
  getById: (id: number) => fetchApi<Ability>(`/habilidades/${id}`),
  
  search: (nome: string, campanha_id?: number) => {
    const url = campanha_id
      ? `/habilidades/search?nome=${encodeURIComponent(nome)}&campanha_id=${campanha_id}`
      : `/habilidades/search?nome=${encodeURIComponent(nome)}`;
    return fetchApi<Ability[]>(url);
  },
  
  create: (ability: Omit<Ability, 'Id'>) =>
    fetchApi<Ability>('/habilidades/', {
      method: 'POST',
      body: JSON.stringify({ ...ability, Id: 0 }),
    }),
  
  update: (id: number, ability: Ability) =>
    fetchApi<Ability>(`/habilidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ability),
    }),
  
  delete: (id: number) =>
    fetchApi<{ detail: string }>(`/habilidades/${id}`, {
      method: 'DELETE',
    }),
};

// Exportar todas as APIs
export const api = {
  characters: charactersApi,
  spells: spellsApi,
  equipments: equipmentsApi,
  races: racesApi,
  classes: classesApi,
  abilities: abilitiesApi,
};

export default api;
