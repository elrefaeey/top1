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

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
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

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICON_MAP[name] ?? MonitorSmartphone;
}
