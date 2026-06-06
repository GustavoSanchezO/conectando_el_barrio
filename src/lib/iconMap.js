import { 
  Utensils, 
  Coffee, 
  Palette, 
  Wrench, 
  ShoppingBag, 
  Beer, 
  Croissant, 
  Scissors, 
  Flower2, 
  MapPin 
} from 'lucide-react';

export const IconMap = {
  Utensils,
  Coffee,
  Palette,
  Wrench,
  ShoppingBag,
  Beer,
  Croissant,
  Scissors,
  Flower2,
  MapPin
};

export function getIconComponent(iconName) {
  return IconMap[iconName] || MapPin;
}
