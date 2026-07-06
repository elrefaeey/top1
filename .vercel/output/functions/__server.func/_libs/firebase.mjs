import { r as __exportAll } from "../_runtime.mjs";
import { d as registerVersion } from "./@firebase/analytics+[...].mjs";
import { t as getAuth } from "./firebase__auth.mjs";
import { C as serverTimestamp, _ as where, a as QueryFieldFilterConstraint, b as doc, c as SnapshotMetadata, d as executeWrite, f as getDoc, g as setDoc, h as query, i as QueryDocumentSnapshot, l as WriteBatch, m as limit, n as QueryCompositeFilterConstraint, o as QueryLimitConstraint, p as getDocs, r as QueryConstraint, s as QuerySnapshot, t as DocumentSnapshot, u as deleteDoc, v as writeBatch } from "./@firebase/firestore+[...].mjs";
//#region node_modules/firebase/app/dist/index.mjs
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.15.0", "app");
//#endregion
//#region node_modules/firebase/auth/dist/index.mjs
var dist_exports$1 = /* @__PURE__ */ __exportAll({ getAuth: () => getAuth });
//#endregion
//#region node_modules/firebase/firestore/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	CACHE_SIZE_UNLIMITED: () => -1,
	DocumentSnapshot: () => DocumentSnapshot,
	QueryCompositeFilterConstraint: () => QueryCompositeFilterConstraint,
	QueryConstraint: () => QueryConstraint,
	QueryDocumentSnapshot: () => QueryDocumentSnapshot,
	QueryFieldFilterConstraint: () => QueryFieldFilterConstraint,
	QueryLimitConstraint: () => QueryLimitConstraint,
	QuerySnapshot: () => QuerySnapshot,
	SnapshotMetadata: () => SnapshotMetadata,
	WriteBatch: () => WriteBatch,
	deleteDoc: () => deleteDoc,
	doc: () => doc,
	executeWrite: () => executeWrite,
	getDoc: () => getDoc,
	getDocs: () => getDocs,
	limit: () => limit,
	query: () => query,
	serverTimestamp: () => serverTimestamp,
	setDoc: () => setDoc,
	where: () => where,
	writeBatch: () => writeBatch
});
//#endregion
export { dist_exports$1 as n, dist_exports as t };
