import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as ImagePlus, O as Link2, Q as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as getFirebaseApp } from "./config-Dmr7eOvS.mjs";
import { i as AdminField, u as adminInputClass } from "./AdminUi-CmDBDlY3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ImageUploadField-DgKFY-7o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** ينتظر وعداً أو يرفض بعد مهلة — يمنع «جاري الرفع» اللانهائي */
function withTimeout(promise, ms, timeoutMessage) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
		promise.then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (error) => {
			clearTimeout(timer);
			reject(error);
		});
	});
}
var MAX_WIDTH = 1600;
var JPEG_QUALITY = .78;
var COMPRESS_TIMEOUT_MS = 25e3;
function isHeic(file) {
	const type = file.type.toLowerCase();
	const name = file.name.toLowerCase();
	return type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
}
async function compressWithBitmap(file, maxWidth, quality) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxWidth / bitmap.width);
	const width = Math.round(bitmap.width * scale);
	const height = Math.round(bitmap.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("canvas unavailable");
	}
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	const blob = await new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("تعذّر ضغط الصورة")), "image/jpeg", quality);
	});
	const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
	return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
async function compressWithImageElement(file, maxWidth, quality) {
	const objectUrl = URL.createObjectURL(file);
	try {
		const img = new Image();
		img.decoding = "async";
		await withTimeout(new Promise((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(/* @__PURE__ */ new Error("تعذّر قراءة الصورة"));
			img.src = objectUrl;
		}), COMPRESS_TIMEOUT_MS, "تعذّر قراءة الصورة — جرّب JPG أو PNG");
		const scale = Math.min(1, maxWidth / img.naturalWidth);
		const width = Math.round(img.naturalWidth * scale);
		const height = Math.round(img.naturalHeight * scale);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("canvas unavailable");
		ctx.drawImage(img, 0, 0, width, height);
		const blob = await new Promise((resolve, reject) => {
			canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("تعذّر ضغط الصورة")), "image/jpeg", quality);
		});
		const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
		return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
async function compressImage(file, maxWidth = MAX_WIDTH, quality = JPEG_QUALITY) {
	if (!file.type.startsWith("image/")) return file;
	if (isHeic(file)) throw new Error("صيغة HEIC غير مدعومة — حوّل إلى JPG أو استخدم «رابط خارجي»");
	try {
		return await withTimeout(compressWithBitmap(file, maxWidth, quality), COMPRESS_TIMEOUT_MS, "compress-timeout");
	} catch {
		try {
			return await withTimeout(compressWithImageElement(file, maxWidth, quality), COMPRESS_TIMEOUT_MS, "compress-fallback-failed");
		} catch {
			return file;
		}
	}
}
var MAX_INPUT_MB = 12;
/** رفع عبر السيرver — يتجاوز CORS من localhost */
async function uploadViaServer(folder, file) {
	const { getAuth } = await import("../_libs/firebase.mjs").then((n) => n.n);
	const user = getAuth(getFirebaseApp()).currentUser;
	if (!user) throw new Error("يجب تسجيل الدخول قبل رفع الصور");
	const token = await user.getIdToken();
	const form = new FormData();
	form.append("file", file);
	form.append("folder", folder);
	const res = await withTimeout(fetch("/api/upload-image", {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		body: form
	}), 9e4, "انتهت مهلة الرفع — تحقق من تفعيل Firebase Storage");
	const json = await res.json();
	if (!res.ok) throw new Error(json.error ?? "فشل رفع الصورة");
	if (!json.url) throw new Error("لم يُرجَع رابط الصورة");
	return json.url;
}
/** رفع صورة من الجهاز — ضغط ثم رفع عبر API السيرver */
async function uploadMediaImage(folder, file, onStage) {
	if (file.size > MAX_INPUT_MB * 1024 * 1024) throw new Error(`الحد الأقصى ${MAX_INPUT_MB} ميجابايت`);
	onStage?.("compress");
	let prepared;
	try {
		prepared = await compressImage(file);
	} catch (err) {
		if (err instanceof Error && err.message.includes("HEIC")) throw err;
		prepared = file;
	}
	onStage?.("upload");
	return uploadViaServer(folder, prepared);
}
var STAGE_LABEL = {
	compress: "جاري تحضير الصورة…",
	upload: "جاري الرفع…"
};
function ImageUploadField({ id, label = "الصورة", value, onChange, folder, hint, required }) {
	const inputRef = (0, import_react.useRef)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)("upload");
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [showUrl, setShowUrl] = (0, import_react.useState)(false);
	async function handleFile(file) {
		if (!file) return;
		setError("");
		setNotice("");
		setUploading(true);
		setStage("compress");
		try {
			onChange(await uploadMediaImage(folder, file, setStage));
			setNotice("تم رفع الصورة بنجاح");
		} catch (err) {
			setError(err instanceof Error ? err.message : "فشل رفع الصورة");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminField, {
		id,
		label,
		hint: hint ?? "ارفع JPG/PNG — يعمل حتى بدون Firebase Storage (يُضغط تلقائياً). للصور الكبيرة فعّل Storage من Console.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl border border-border bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: value,
						alt: "",
						className: "max-h-48 w-full object-contain"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "file",
							accept: "image/jpeg,image/png,image/webp,image/gif",
							className: "sr-only",
							id: `${id}-file`,
							disabled: uploading,
							onChange: (e) => void handleFile(e.target.files?.[0])
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: `${id}-file`,
							className: cn("btn-primary !py-2 !px-4 !text-sm cursor-pointer", uploading && "pointer-events-none opacity-60"),
							children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
								" ",
								STAGE_LABEL[stage]
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4" }), " رفع صورة"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowUrl((v) => !v),
							className: "btn-ghost !py-2 !px-3 !text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4" }),
								" ",
								showUrl ? "إخفاء الرابط" : "رابط خارجي"
							]
						})
					]
				}),
				(showUrl || !value) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id,
					dir: "ltr",
					required: required && !value,
					value,
					onChange: (e) => onChange(e.target.value),
					placeholder: "https://…",
					className: adminInputClass("text-start")
				}),
				notice && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-emerald-700 leading-relaxed rounded-lg bg-emerald-500/10 px-3 py-2",
					children: notice
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive leading-relaxed rounded-lg bg-destructive/10 px-3 py-2",
					children: error
				})
			]
		})
	});
}
//#endregion
export { ImageUploadField as t };
