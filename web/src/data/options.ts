import type {
  Category,
  Formality,
  GarmentShape,
  Material,
  Warmth,
} from "@/lib/types";

/** Colour name -> swatch hex, ported from the prototype. */
export const SWATCH: Record<string, string> = {
  "Off white": "#F1EFE8",
  White: "#FBFAF6",
  Sand: "#C9A97B",
  Stone: "#C4B79C",
  Oat: "#D6C9AE",
  Sage: "#8B9B7C",
  Indigo: "#43587F",
  Navy: "#2C3550",
  "Dark blue": "#33456B",
  Charcoal: "#3B4046",
  Black: "#2A2E33",
  Grey: "#8E9299",
  Brown: "#7A5433",
  Tan: "#9A6B44",
  Olive: "#6F7343",
  Rust: "#A8552F",
};

export const CATEGORIES: Category[] = ["Tops", "Bottoms", "Outerwear", "Shoes"];

/**
 * Every drawing, grouped by the category it belongs to. Only four of the nine
 * used to be reachable, because the category picked the shape and nothing let
 * you change it — so chinos, trousers and jeans all drew as jeans.
 */
export const SHAPES_BY_CATEGORY: Record<Category, GarmentShape[]> = {
  Tops: ["tee", "shirt", "knit"],
  Bottoms: ["jeans", "shorts"],
  Outerwear: ["jacket", "knit"],
  Shoes: ["sneaker", "boot", "loafer"],
};

/** What each drawing is called in the picker. */
export const SHAPE_LABEL: Record<GarmentShape, string> = {
  tee: "T-shirt",
  shirt: "Shirt",
  knit: "Knit",
  jacket: "Jacket",
  jeans: "Trousers",
  shorts: "Shorts",
  sneaker: "Sneaker",
  boot: "Boot",
  loafer: "Loafer",
};
export const COLOR_NAMES: string[] = Object.keys(SWATCH);
export const WARMTHS: Warmth[] = ["Light", "Medium", "Warm", "Very warm"];
export const FORMALITIES: Formality[] = [
  "Very casual",
  "Casual",
  "Smart casual",
  "Formal",
];
export const MATERIALS: Material[] = [
  "Cotton",
  "Linen",
  "Denim",
  "Wool",
  "Merino",
  "Nylon",
  "Polyester",
  "Leather",
  "Suede",
  "Mesh",
];

export const swatchFor = (colorName: string) => SWATCH[colorName] ?? "#C4B79C";
