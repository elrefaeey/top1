import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import "../_libs/firebase.mjs";
import { n as getFirebaseApp } from "./config-Dmr7eOvS.mjs";
import { i as signOut, n as onAuthStateChanged, r as signInWithEmailAndPassword, t as getAuth } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthProvider-DW-AkY09.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var authInstance = null;
function getAuthInstance() {
	if (!authInstance) authInstance = getAuth(getFirebaseApp());
	return authInstance;
}
var auth = new Proxy({}, { get(_target, prop) {
	const instance = getAuthInstance();
	const value = Reflect.get(instance, prop, instance);
	return typeof value === "function" ? value.bind(instance) : value;
} });
var BOOTSTRAP_ADMIN_EMAIL = "voltech@admin.com".toLowerCase().trim();
function isBootstrapAdminEmail(email) {
	if (!BOOTSTRAP_ADMIN_EMAIL || !email) return false;
	return email.toLowerCase().trim() === BOOTSTRAP_ADMIN_EMAIL;
}
async function ensureBootstrapAdminRole(user) {
	const existing = await getUserRole(user.uid);
	if (existing) return existing;
	try {
		const { doc, setDoc, serverTimestamp } = await import("../_libs/firebase.mjs").then((n) => n.t);
		const { db, withFirestoreTimeout } = await import("./firestore-CMfHQadS.mjs").then((n) => n.r).then((n) => n.r);
		const role = isBootstrapAdminEmail(user.email) ? "admin" : "editor";
		await withFirestoreTimeout(setDoc(doc(db, "users", user.uid), {
			role,
			email: user.email,
			createdAt: serverTimestamp()
		}), 8e3);
		return role;
	} catch (err) {
		console.error("[auth] bootstrap role failed:", err);
		return null;
	}
}
async function loginWithEmail(email, password) {
	const credential = await signInWithEmailAndPassword(auth, email, password);
	await ensureBootstrapAdminRole(credential.user);
	return credential;
}
async function logout() {
	return signOut(auth);
}
function subscribeToAuth(callback) {
	return onAuthStateChanged(auth, callback);
}
async function getUserRole(uid) {
	try {
		const { doc, getDoc } = await import("../_libs/firebase.mjs").then((n) => n.t);
		const { db, withFirestoreTimeout } = await import("./firestore-CMfHQadS.mjs").then((n) => n.r).then((n) => n.r);
		const snap = await withFirestoreTimeout(getDoc(doc(db, "users", uid)), 5e3);
		if (snap.exists()) {
			const role = snap.data().role;
			if (role === "admin" || role === "editor") return role;
		}
	} catch {}
	return null;
}
async function toAppUser(user) {
	let role = await getUserRole(user.uid);
	if (!role) role = await ensureBootstrapAdminRole(user);
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		role
	};
}
var AuthContext = (0, import_react.createContext)({
	user: null,
	loading: true,
	isAdmin: false,
	isEditor: false,
	refreshUser: async () => {}
});
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		return subscribeToAuth((firebaseUser) => {
			if (!firebaseUser) {
				setUser(null);
				setLoading(false);
				return;
			}
			setLoading(true);
			toAppUser(firebaseUser).then(setUser).finally(() => setLoading(false));
		});
	}, []);
	async function refreshUser() {
		const firebaseUser = auth.currentUser;
		if (!firebaseUser) {
			setUser(null);
			return;
		}
		setLoading(true);
		try {
			await ensureBootstrapAdminRole(firebaseUser);
			setUser(await toAppUser(firebaseUser));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading,
			isAdmin: user?.role === "admin",
			isEditor: user?.role === "admin" || user?.role === "editor",
			refreshUser
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
//#endregion
export { useAuth as i, loginWithEmail as n, logout as r, AuthProvider as t };
