function env(name: string): string {
  return (process.env[name] ?? process.env[`VITE_${name}`] ?? "").trim();
}

type LookupUser = { localId?: string };

export async function verifyFirebaseIdToken(idToken: string): Promise<string> {
  const apiKey = env("FIREBASE_API_KEY") || env("VITE_FIREBASE_API_KEY");
  if (!apiKey) throw new Error("Firebase API key missing on server");

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!res.ok) throw new Error("رمز الدخول غير صالح");
  const data = (await res.json()) as { users?: LookupUser[] };
  const uid = data.users?.[0]?.localId;
  if (!uid) throw new Error("رمز الدخول غير صالح");
  return uid;
}

export async function verifyFirebaseEditorRole(idToken: string): Promise<string> {
  const uid = await verifyFirebaseIdToken(idToken);
  const projectId = env("FIREBASE_PROJECT_ID") || env("VITE_FIREBASE_PROJECT_ID");
  if (!projectId) throw new Error("Firebase project id missing on server");

  const docRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );

  if (!docRes.ok) throw new Error("لا توجد صلاحية رفع — حساب غير مصرح");

  const doc = (await docRes.json()) as {
    fields?: { role?: { stringValue?: string } };
  };
  const role = doc.fields?.role?.stringValue;
  if (role !== "admin" && role !== "editor") {
    throw new Error("لا توجد صلاحية رفع — يتطلب دور محرر أو مدير");
  }

  return uid;
}
