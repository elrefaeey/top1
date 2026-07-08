import {
  Globe,
  Code2,
  Search,
  Palette,
  Layers,
  Rocket,
  Zap,
  MonitorSmartphone,
  LineChart,
  Megaphone,
  Sparkles,
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
  MonitorSmartphone,
  LineChart,
  Megaphone,
  Sparkles,
};

export function serviceIcon(name?: string): LucideIcon {
  if (!name) return MonitorSmartphone;
  return ICONS[name] ?? MonitorSmartphone;
}
