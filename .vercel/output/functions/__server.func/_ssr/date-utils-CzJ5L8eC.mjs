//#region node_modules/.nitro/vite/services/ssr/assets/date-utils-CzJ5L8eC.js
/** تاريخ من Firestore — بدون fallback-data */
function formatPostDate(iso) {
	try {
		return new Date(iso).toLocaleDateString("ar-EG", {
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	} catch {
		return iso;
	}
}
//#endregion
export { formatPostDate as t };
