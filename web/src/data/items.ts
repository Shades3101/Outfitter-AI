import type { Item } from "@/lib/types";

/**
 * Seed stamps are relative to load time, so the sample wardrobe reads the same
 * however long the app has been sitting there.
 */
const daysAgo = (n: number) => Date.now() - n * 86_400_000;

export const SEED_ITEMS: Item[] = [
  { id: "1", name: "White cotton tee", cat: "Tops", shape: "tee", colorName: "Off white", warmth: "Light", formality: "Casual", material: "Cotton", lastWorn: daysAgo(6) },
  { id: "2", name: "Indigo oxford shirt", cat: "Tops", shape: "shirt", colorName: "Indigo", warmth: "Light", formality: "Smart casual", material: "Cotton", lastWorn: daysAgo(2) },
  { id: "3", name: "Sage linen shirt", cat: "Tops", shape: "shirt", colorName: "Sage", warmth: "Light", formality: "Smart casual", material: "Linen", lastWorn: daysAgo(9) },
  { id: "4", name: "Charcoal training tee", cat: "Tops", shape: "tee", colorName: "Charcoal", warmth: "Light", formality: "Very casual", material: "Polyester", lastWorn: daysAgo(1) },
  { id: "5", name: "Oat merino knit", cat: "Tops", shape: "knit", colorName: "Oat", warmth: "Warm", formality: "Smart casual", material: "Merino", lastWorn: daysAgo(21) },
  { id: "6", name: "Dark wash jeans", cat: "Bottoms", shape: "jeans", colorName: "Dark blue", warmth: "Medium", formality: "Casual", material: "Denim", lastWorn: daysAgo(4) },
  { id: "7", name: "Stone chinos", cat: "Bottoms", shape: "jeans", colorName: "Stone", warmth: "Light", formality: "Smart casual", material: "Cotton", lastWorn: daysAgo(8) },
  { id: "8", name: "Black gym shorts", cat: "Bottoms", shape: "shorts", colorName: "Black", warmth: "Light", formality: "Very casual", material: "Nylon", lastWorn: daysAgo(1) },
  { id: "9", name: "Navy tailored trousers", cat: "Bottoms", shape: "jeans", colorName: "Navy", warmth: "Medium", formality: "Formal", material: "Wool", lastWorn: daysAgo(14) },
  { id: "10", name: "Sand overshirt", cat: "Outerwear", shape: "jacket", colorName: "Sand", warmth: "Medium", formality: "Casual", material: "Cotton", lastWorn: daysAgo(11) },
  { id: "11", name: "Black bomber", cat: "Outerwear", shape: "jacket", colorName: "Black", warmth: "Warm", formality: "Casual", material: "Nylon", lastWorn: daysAgo(35) },
  { id: "12", name: "White court sneakers", cat: "Shoes", shape: "sneaker", colorName: "White", warmth: "Light", formality: "Casual", material: "Leather", lastWorn: daysAgo(3) },
  { id: "13", name: "Grey running shoes", cat: "Shoes", shape: "sneaker", colorName: "Grey", warmth: "Light", formality: "Very casual", material: "Mesh", lastWorn: daysAgo(1) },
  { id: "14", name: "Brown leather loafers", cat: "Shoes", shape: "loafer", colorName: "Brown", warmth: "Medium", formality: "Formal", material: "Leather", lastWorn: daysAgo(21) },
  { id: "15", name: "Tan chelsea boots", cat: "Shoes", shape: "boot", colorName: "Tan", warmth: "Medium", formality: "Smart casual", material: "Suede", lastWorn: daysAgo(30) },
];
