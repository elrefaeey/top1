import { $ as Layers, P as Globe, et as CodeXml, f as Search, v as Palette } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/icons-C3jPTdr6.js
var SERVICE_ICON_MAP = {
	Globe,
	Code2: CodeXml,
	Search,
	Palette,
	Layers
};
function getServiceIcon(name) {
	return SERVICE_ICON_MAP[name] ?? Globe;
}
//#endregion
export { getServiceIcon as t };
