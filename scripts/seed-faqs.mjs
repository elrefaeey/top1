/**
 * Seed published FAQs into Firestore (service account).
 * Usage: node scripts/seed-faqs.mjs
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

/** FAQs tailored for Top1Markting — SA & UAE digital agency */
const FAQS = [
  {
    id: "faq-timeline",
    question: "كم يستغرق تصميم موقع أو متجر إلكتروني؟",
    answer:
      "الموقع التعريفي عادةً من ٢ إلى ٤ أسابيع. المتاجر الإلكترونية والمشاريع الأكبر من ٦ إلى ١٢ أسبوعاً حسب النطاق. نعمل بسبرنتات قصيرة مع تحديثات واضحة في كل مرحلة.",
    order: 1,
  },
  {
    id: "faq-markets",
    question: "هل تخدمون السعودية والإمارات فقط؟",
    answer:
      "لا، بنخدم أي عميل وفي أي دولة. تركيزنا وإعلاناتنا على السعودية والإمارات (الرياض، جدة، الدمام، القصيم، دبي، أبوظبي والشارقة)، ونبني مواقع لأي نشاط في أي مكان — مع دعم عربي كامل (RTL) وتجربة تناسب المستخدم المحلي.",
    order: 2,
  },
  {
    id: "faq-seo",
    question: "هل يشمل العمل تحسين محركات البحث SEO؟",
    answer:
      "نراعي SEO من البداية: بنية الصفحات، السرعة، Core Web Vitals، والبيانات المنظمة. ويمكن إضافة باقة شهرية لتحسين الظهور والمحتوى بعد الإطلاق.",
    order: 3,
  },
  {
    id: "faq-cms",
    question: "هل أقدر أعدّل المحتوى بنفسي بعد التسليم؟",
    answer:
      "نعم. نسلّم لوحة تحكم سهلة لتعديل النصوص والصور والمقالات بدون الحاجة لمطور في كل تغيير بسيط.",
    order: 4,
  },
  {
    id: "faq-pricing",
    question: "كيف يتم التسعير؟ وهل فيه عرض ثابت؟",
    answer:
      "التسعير يعتمد على نطاق المشروع (صفحات، متجر، تكاملات، SEO). بعد استشارة قصيرة نرسل عرضاً واضحاً بالمراحل والتكلفة قبل البدء — بدون مفاجآت.",
    order: 5,
  },
  {
    id: "faq-whatsapp",
    question: "كيف أتواصل معكم بسرعة؟",
    answer:
      "الأسرع عبر واتساب أو نموذج التواصل في الموقع. عادةً نرد خلال ٢٤ ساعة في أيام العمل، ونحدد موعد استشارة قصيرة لفهم احتياجك.",
    order: 6,
  },
  {
    id: "faq-hosting",
    question: "هل توفرون الاستضافة والنطاق؟",
    answer:
      "نساعد في اختيار الاستضافة المناسبة وربط النطاق، ونضبط الموقع ليكون سريعاً وآمناً. يمكن الاستضافة عندكم أو عبر مزوّد نقترحه حسب المشروع.",
    order: 7,
  },
  {
    id: "faq-support",
    question: "ماذا بعد إطلاق الموقع؟ هل فيه دعم؟",
    answer:
      "بعد الإطلاق نقدّم فترة دعم للتعديلات الأساسية، ويمكن الاتفاق على صيانة شهرية للتحديثات، الأمان، والتحسين المستمر للأداء والـ SEO.",
    order: 8,
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
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(sa.private_key, "base64url");
  const jwt = `${unsigned}.${signature}`;

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
    if (typeof value === "string") fields[key] = { stringValue: value };
    else if (typeof value === "number") fields[key] = { integerValue: String(Math.trunc(value)) };
    else if (typeof value === "boolean") fields[key] = { booleanValue: value };
  }
  return fields;
}

async function upsertFaq(projectId, token, faq) {
  const { id, ...rest } = faq;
  const data = {
    ...rest,
    status: "published",
    createdAt: now,
    updatedAt: now,
  };
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/faqs/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`فشل حفظ ${id} (${res.status}): ${body.slice(0, 180)}`);
  }
}

async function main() {
  const sa = parseServiceAccount();
  const token = await getAccessToken(sa);
  let ok = 0;
  for (const faq of FAQS) {
    await upsertFaq(sa.project_id, token, faq);
    ok += 1;
    console.log(`✓ ${faq.id}`);
  }
  console.log(`\nتم حفظ ${ok} أسئلة شائعة في Firestore (faqs).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
