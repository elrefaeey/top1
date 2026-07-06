import {
  Award,
  BarChart3,
  FolderCheck,
  Heart,
  Rocket,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  FolderCheck,
  Heart,
  TrendingUp,
  Trophy,
  Star,
  Users,
  Zap,
  Award,
  BarChart3,
  Rocket,
};

export const STAT_ICON_OPTIONS = Object.keys(ICONS);

export function statIcon(name?: string): LucideIcon {
  if (!name) return BarChart3;
  return ICONS[name] ?? BarChart3;
}
