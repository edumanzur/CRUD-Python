/**
 * Interface para Classes de Personagens (ex: Guerreiro, Mago, Ladino)
 */
export interface Class {
  id: string;
  name: string;
  description: string;
  abilities?: string;  // IDs de habilidades relacionadas
  spells?: string;     // IDs de magias relacionadas
  isCustom?: boolean;  // Se foi criada pelo usuário
}

/**
 * Tipo para criação de nova classe (sem ID)
 */
export type ClassCreate = Omit<Class, 'id'>;
