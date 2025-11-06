export interface Equipment {
  id: string;
  name: string;
  description: string;
  type: "weapon" | "armor" | "accessory" | "consumable" | "tool";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  icon: string;
  attack?: number;
  defense?: number;
  bonus?: string;
  weight?: number;
  damage?: string;  // Formato: XdY (ex: 2d4, 1d8, 3d6)
  proficiency?: string;  // Ex: Armas Simples, Armas Marciais, Armaduras Leves
  isCustom?: boolean;
}
