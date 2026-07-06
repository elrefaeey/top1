import { l as getApps, u as initializeApp } from "../_libs/@firebase/analytics+[...].mjs";
import "../_libs/firebase.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/config-Dmr7eOvS.js
var firebaseConfig = {
	apiKey: "AIzaSyC1CBJhK-zbJ1-fxezdI1jU2EPT8Dl6xR4",
	authDomain: "voltech-bf2eb.firebaseapp.com",
	projectId: "voltech-bf2eb",
	storageBucket: "voltech-bf2eb.firebasestorage.app",
	messagingSenderId: "185787145300",
	appId: "1:185787145300:web:f6c5abea92785ee20761c1",
	measurementId: "G-09WBWML921"
};
function isFirebaseConfigured() {
	return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}
function getFirebaseApp() {
	if (getApps().length) return getApps()[0];
	if (!isFirebaseConfigured()) throw new Error("Firebase env vars missing. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID.");
	return initializeApp(firebaseConfig);
}
var SITE_URL = "http://localhost:8080";
//#endregion
export { getFirebaseApp as n, isFirebaseConfigured as r, SITE_URL as t };
