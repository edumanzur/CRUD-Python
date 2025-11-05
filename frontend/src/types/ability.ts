export interface Ability {
  id: string;
  name: string;
  description: string;
  type?: "passive" | "active" | "ultimate" | "special";
  cooldown?: number;
  icon?: string;
  effect?: string;
  damage?: number;
}
