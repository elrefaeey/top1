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

export function getServiceIcon(name?: string): LucideIcon {
  if (!name) return MonitorSmartphone;
  return SERVICE_ICON_MAP[name] ?? MonitorSmartphone;
}

/** Alias used on the home page — same map as getServiceIcon. */
export const serviceIcon = getServiceIcon;

