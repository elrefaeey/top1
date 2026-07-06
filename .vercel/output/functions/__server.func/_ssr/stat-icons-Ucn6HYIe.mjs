import { F as FolderCheck, K as Award, N as Heart, a as Trophy, it as ChartColumn, l as Star, o as TrendingUp, p as Rocket, r as Users, t as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-icons-Ucn6HYIe.js
var ICONS = {
	FolderCheck,
	Heart,
	TrendingUp,
	Trophy,
	Star,
	Users,
	Zap,
	Award,
	BarChart3: ChartColumn,
	Rocket
};
var STAT_ICON_OPTIONS = Object.keys(ICONS);
function statIcon(name) {
	if (!name) return ChartColumn;
	return ICONS[name] ?? ChartColumn;
}
//#endregion
export { statIcon as n, STAT_ICON_OPTIONS as t };
