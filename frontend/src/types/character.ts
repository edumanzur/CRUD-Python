export interface Character {
  id: string;
  name: string;
  class: string;
  race?: string;  // Raça do personagem
  level: number;
  type?: string;  // Tipo: Jogador, NPC, ou Monstro
  imagemPath?: string;  // Caminho da imagem do personagem
  stats: {
    vida: number;
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    mana: number;
    carisma: number;
    sorte: number;
    reputacao: number;
    ca: number;  // Classe de Armadura
    deslocamento: number;  // Velocidade de movimento
  };
  // Campos específicos para Monstros
  exp?: number;  // Experiência dada ao derrotar
  imunidade?: string;  // Imunidades do monstro
  resistencia?: string;  // Resistências do monstro
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  history?: string;  // Backend field
  alignment?: string;  // Backend field
  spells?: string[];  // IDs das magias do personagem
  abilities?: string[];  // IDs das habilidades do personagem
}
