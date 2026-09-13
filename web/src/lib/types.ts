export type Category = "Tops" | "Bottoms" | "Outerwear" | "Shoes";

export type GarmentShape =
  | "tee"
  | "shirt"
  | "knit"
  | "jacket"
  | "jeans"
  | "shorts"
  | "sneaker"
  | "boot"
  | "loafer";

export type Warmth = "Light" | "Medium" | "Warm" | "Very warm";

export type Formality = "Very casual" | "Casual" | "Smart casual" | "Formal";

export type Material =
  | "Cotton"
  | "Linen"
  | "Denim"
  | "Wool"
  | "Merino"
  | "Nylon"
  | "Polyester"
  | "Leather"
  | "Suede"
  | "Mesh";

export type SlotKind = "Gym" | "Office" | "Casual" | "Dinner out" | "Travel";

export const SLOT_KINDS: SlotKind[] = [
  "Gym",
  "Office",
  "Casual",
  "Dinner out",
  "Travel",
];

export interface Item {
  id: string;
  name: string;
  cat: Category;
  shape: GarmentShape;
  colorName: string;
  warmth: Warmth;
  formality: Formality;
  material: Material;
  /**
   * When the piece was last worn, as an epoch millisecond stamp; `null` means
   * never. A stamp rather than prose, so the rest period can be measured.
   */
  lastWorn: number | null;
  /** Object URL of the photo the piece was added from, when there is one. */
  photo?: string;
}

export interface Slot {
  id: string;
  time: string;
  kind: SlotKind;
}

export interface Outfit {
  id: string;
  ids: string[];
  rank: string;
  note: string;
}

export interface Settings {
  location: string;
  /** Set when the browser has given us a position; cleared by typing a place. */
  coords?: { lat: number; lon: number };
  units: "Celsius" | "Fahrenheit";
  restDays: number;
  formalityMap: Partial<Record<SlotKind, Formality>>;
  email: string;
}

/** The five editable tag fields shared by the edit and add flows. */
export type EditableKey =
  | "name"
  | "cat"
  | "shape"
  | "colorName"
  | "material"
  | "warmth"
  | "formality";
