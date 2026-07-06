import {
  Globe,
  Code2,
  Search,
  Palette,
  Layers,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Globe,
  Code2,
  Search,
  Palette,
  Layers,
  Rocket,
  Zap,
};

export function serviceIcon(name?: string): LucideIcon {
  if (!name) return Globe;
  return ICONS[name] ?? Globe;
}
