export interface Ability {
  id: string;
  name: string;
  description: string;
  type?: "passive" | "active" | "ultimate" | "special";
  cooldown?: number;
  icon?: string;
  effect?: string;
  damage?: string;  // Dano no formato XdY (ex: 2d6, 1d8+2)
  modifier?: string;  // Atributo do personagem usado como modificador (Força, Destreza, etc.)
  classes?: string[];  // Classes que podem usar esta habilidade
}
