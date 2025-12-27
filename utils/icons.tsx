import React from 'react';
import { 
  Home, Car, Utensils, ShoppingBag, Zap, Droplet, Wifi, Gift, 
  Briefcase, GraduationCap, HeartPulse, Plane, Gamepad, Shirt, 
  DollarSign, Smartphone, Coffee, Music, Hammer, Book, Dog, Baby,
  ShoppingCart, Dumbbell, Stethoscope, Bus, Fuel, Lightbulb,
  CreditCard, Tag
} from 'lucide-react';

// Map of icon names to components
export const iconRegistry: Record<string, React.ElementType> = {
  Home, Car, Utensils, ShoppingBag, Zap, Droplet, Wifi, Gift, 
  Briefcase, GraduationCap, HeartPulse, Plane, Gamepad, Shirt, 
  DollarSign, Smartphone, Coffee, Music, Hammer, Book, Dog, Baby,
  ShoppingCart, Dumbbell, Stethoscope, Bus, Fuel, Lightbulb,
  CreditCard, Tag
};

export const getIconComponent = (iconName: string, className?: string) => {
  const Icon = iconRegistry[iconName] || Tag; // Default to Tag if not found
  return <Icon className={className} />;
};

export const availableIcons = Object.keys(iconRegistry);
