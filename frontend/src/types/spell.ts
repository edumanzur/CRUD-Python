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
  isCustom?: boolean;
}
