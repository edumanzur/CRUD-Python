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
  isCustom?: boolean;
}
