/**
 * Interface para Raças de Personagens (ex: Humano, Elfo, Anão)
 */
export interface Race {
  id: string;
  name: string;
  passive: string;        // Habilidade passiva da raça
  characteristic: string; // Características raciais
  isCustom?: boolean;     // Se foi criada pelo usuário
}

/**
 * Tipo para criação de nova raça (sem ID)
 */
export type RaceCreate = Omit<Race, 'id'>;
