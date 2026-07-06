import { Globe, Code2, Search, Palette, Layers, type LucideIcon } from "lucide-react";

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Code2,
  Search,
  Palette,
  Layers,
};

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICON_MAP[name] ?? Globe;
}
