export interface Spell {
  id: string;
  name: string;
  description: string;
  category: "attack" | "defense" | "support" | "buff" | "debuff";
  level: number;
  icon: string;
  manaCost?: number;
  cooldown?: number;
  effect?: string;
  damage?: string;  // Dano no formato XdY (ex: 2d6, 1d8+2)
  classes?: string[];  // Classes que podem usar esta magia
  isCustom?: boolean;
}
