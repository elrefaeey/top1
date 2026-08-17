/**
 * Seed published testimonials into Firestore (service account).
 * Usage: node scripts/seed-testimonials.mjs
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const now = new Date().toISOString();

/**
 * آراء عملاء مرتبطة بمشاريع أعمالنا الفعلية.
 * لهجات: سعودي + مصري، تعليقات إيجابية طبيعية.
 */
const TESTIMONIALS = [
  {
    id: "t-vee",
    name: "الأستاذة دعاء محمد",
    role: "مالكة المتجر",
    company: "VEE",
    city: "القاهرة",
    quote:
      "تعامل احترافي من أول يوم لحد التسليم. الموقع بقى سريع وعصري وبيعكس ستايل البراند، والزبائن بقوا يطلبوا أسهل من الموبايل. تجربة الشغل مع توب ون كانت فوق الممتازة.",
    rating: 5,
    order: 1,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-al-general",
    name: "الأستاذ محمود رضا",
    role: "مدير العمليات",
    company: "الچينرال لتأجير السيارات",
    city: "دبي",
    quote:
      "الموقع صار يوضّح الأسطول والأسعار بشكل مرتب، والحجز صار أسهل بكثير. الفريق سريع في التعديلات وفاهمين سوق دبي كويس. أنصح فيهم لأي شركة تأجير.",
    rating: 5,
    order: 2,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-alforsan",
    name: "المهندس محروس الصياد",
    role: "مالك",
    company: "الفرسان للواجهات الزجاجية",
    city: "المنصورة",
    quote:
      "كنا محتاجين موقع يبان قد الشغل بتاعنا في الكلادينج والواجهات. عملولنا تصميم نظيف ومعرض مشاريع واضح، والناس بقت تتواصل من الموقع مباشرة. شغل محترم أوي.",
    rating: 5,
    order: 3,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-cutting-experts",
    name: "الأستاذ محمود نجيب",
    role: "مالك الشركة",
    company: "خبراء القص والتخريم",
    city: "الرياض",
    quote:
      "الموقع صار يعكس احترافية شغلنا في القص والتخريم. الاستفسارات زادت، والصفحة واضحة للعميل من أول دخول. تواصلهم سهل والتسليم على الوقت — ما قصروا معنا.",
    rating: 5,
    order: 4,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-malekcure",
    name: "الأستاذ رضا محمد",
    role: "مؤسس",
    company: "MalekCure",
    city: "جدة",
    quote:
      "من أول اجتماع حسينا إنهم فاهمين طبيعة خدماتنا. الموقع سريع، والتصميم يوصل ثقة للعميل الصناعي. بعد الإطلاق صارت الطلبات أوضح وأسهل تتبّعها.",
    rating: 5,
    order: 5,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-lunier",
    name: "الكابتن عبد الله الحربي",
    role: "مدير عام",
    company: "Lunier Marina",
    city: "دبي",
    quote:
      "أبغى موقع يعكس فخامة إدارة اليخوت، وهذا اللي صار. الواجهة راقية، والمحتوى مرتب، والعملاء يقدرون يفهمون الخدمات بدون تعقيد. شكراً لفريق توب ون.",
    rating: 5,
    order: 6,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-my-bag",
    name: "الأستاذة سلمى علاء",
    role: "صاحبة العلامة",
    company: "MY BAG",
    quote:
      "المتجر بقى شكله بريميوم والتصفح سهل جداً على الموبايل. الصور والحجز والطلب كله ماشي بسلاسة، والبنات بقوا يشاركوا اللينك. فرقت معايا كتير في المبيعات.",
    rating: 5,
    order: 7,
    serviceSlug: "web-design-saudi",
  },
  {
    id: "t-vip-padel",
    name: "الأستاذ فهد الشمري",
    role: "مدير النادي",
    company: "VIP PADEL",
    city: "الرياض",
    quote:
      "نظام الحجز صار أوضح للعملاء، والملاعب تظهر بشكل مرتب. قبل كنا نضيع وقت على الواتساب، الحين أغلب الحجوزات من الموقع. شغل سريع ودعم ممتاز بعد الإطلاق.",
    rating: 5,
    order: 8,
    serviceSlug: "web-apps",
  },
];

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON غير موجود في .env");
  const sa = JSON.parse(raw);
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error("Service Account ناقص الحقول المطلوبة");
  }
  sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
  return sa;
}

async function getAccessToken(sa) {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSec,
      exp: nowSec + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer.sign(sa.private_key, "base64url")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`OAuth failed (${res.status})`);
  const json = await res.json();
  return json.access_token;
}

function toFirestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null || value === undefined) continue;
    if (typeof value === "string") fields[key] = { stringValue: value };
    else if (typeof value === "number") {
      fields[key] =
        Number.isInteger(value)
          ? { integerValue: String(value) }
          : { doubleValue: value };
    } else if (typeof value === "boolean") fields[key] = { booleanValue: value };
  }
  return fields;
}

async function upsertTestimonial(projectId, token, item) {
  const { id, ...rest } = item;
  const data = {
    ...rest,
    status: "published",
    createdAt: now,
    updatedAt: now,
  };
  // Drop empty optional strings so they don't linger as ""
  if (!data.city) delete data.city;

  const fields = toFirestoreFields(data);
  const mask = Object.keys(fields)
    .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
    .join("&");
  // Also clear city when not provided
  const clearCity = !item.city ? `&updateMask.fieldPaths=${encodeURIComponent("city")}` : "";

  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/testimonials/${encodeURIComponent(id)}?${mask}${clearCity}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`فشل حفظ ${id} (${res.status}): ${body.slice(0, 180)}`);
  }
}

async function deleteDoc(projectId, token, id) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/testimonials/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    throw new Error(`فشل حذف ${id} (${res.status}): ${body.slice(0, 120)}`);
  }
}

async function listAllTestimonials(projectId, token) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/testimonials?pageSize=100`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  const data = await res.json();
  return (data.documents || []).map((d) => {
    const id = d.name.split("/").pop();
    const name = d.fields?.name?.stringValue || "";
    return { id, name };
  });
}

async function main() {
  const sa = parseServiceAccount();
  const token = await getAccessToken(sa);

  // Remove old awkward-id docs if they still exist
  const legacyIds = [
    "محمود-رضا",
    "تعامل-احترافي-من-بداية-المشروع-وحتى-التسليم.-حصلنا-على-موقع-سريع-وعصري-يعكس-هوية-شركتنا-بشكل-ممتاز،-وكانت-تجربة-العمل-مع-فريق-top1markting-أكثر-من-رائعة.",
  ];
  for (const id of legacyIds) {
    await deleteDoc(sa.project_id, token, id);
    console.log(`✗ removed legacy ${id.slice(0, 40)}…`);
  }

  // Remove any stray docs that still use old names
  const keep = new Set(TESTIMONIALS.map((t) => t.id));
  const existing = await listAllTestimonials(sa.project_id, token);
  for (const doc of existing) {
    if (!keep.has(doc.id)) {
      await deleteDoc(sa.project_id, token, doc.id);
      console.log(`✗ removed stray ${doc.id} (${doc.name})`);
    }
  }

  let ok = 0;
  for (const item of TESTIMONIALS) {
    await upsertTestimonial(sa.project_id, token, item);
    ok += 1;
    console.log(`✓ ${item.id} — ${item.name} (${item.company})`);
  }
  console.log(`\nتم حفظ ${ok} آراء عملاء في Firestore (testimonials).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
