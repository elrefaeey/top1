/**
 * Fill portfolio project details from live client sites (service account).
 * Usage: node scripts/seed-portfolio-details.mjs
 *
 * Updates only: client, url, challenge, solution, servicesProvided,
 * technologies, resultsSummary, updatedAt. Does not touch title/image/status.
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

const UPDATES = [
  {
    id: "vee",
    title: "VEE\nمتجر أزياء نسائية عصرية",
    client: "الأستاذة دعاء محمد",
    url: "https://vee-design.vercel.app/",
    challenge:
      "علامة أزياء نسائية محتشمة كانت محتاجة متجر إلكتروني يعكس ستايل البراند، ويعرض المجموعات والأسعار والعروض بوضوح، مع تجربة تسوق سهلة على الموبايل.",
    solution:
      "صمّمنا متجر VEE بواجهة عصرية تعرض أحدث المجموعات والمنتجات والتفاصيل والأسعار، مع تصميم متجاوب ورحلة تسوق واضحة من الاستعراض حتى الطلب.",
    servicesProvided: ["تصميم مواقع", "متاجر إلكترونية", "تصميم UI / UX"],
    technologies: ["React", "Vite", "Tailwind CSS"],
    resultsSummary:
      "إطلاق متجر إلكتروني حي يعرض مجموعات VEE ويتيح التصفح والشراء من الموبايل والكمبيوتر.",
  },
  {
    id: "my-bag",
    title: "MY BAG\nمتجر حقائب وإكسسوارات",
    client: "الأستاذة سلمى علاء",
    url: "https://mybaggg.vercel.app/",
    challenge:
      "علامة حقائب وإكسسوارات كانت محتاجة متجر يبان فاخر، ويعرض المنتجات والخصومات بشكل مرتب، مع تصفح سهل على الموبايل.",
    solution:
      "بنينا متجر MY BAG بتصميم minimal راقٍ: هيرو واضح، شبكة منتجات مع شارات الخصم، وتجربة تسوق متجاوبة تركّز على الصور والجودة.",
    servicesProvided: ["تصميم مواقع", "متاجر إلكترونية", "تصميم UI / UX"],
    technologies: ["React", "Vite", "Tailwind CSS"],
    resultsSummary:
      "متجر منشور يعرض الحقائب والإكسسوارات والعروض، بتجربة تسوق واضحة على كل الأجهزة.",
  },
  {
    id: "al-general-car-rental",
    title: "الچينرال\nتأجير سيارات فاخرة في دبي",
    client: "الأستاذ محمود رضا",
    url: "https://algenral.vercel.app/",
    challenge:
      "شركة تأجير سيارات في دبي كانت محتاجة موقع يوضّح الأسطول والخدمات (توصيل المطار وخدمة 24/7) ويخلّي الحجز والتواصل عبر واتساب أسهل من الاعتماد على المكالمات فقط.",
    solution:
      "صمّمنا موقع الچينرال بالعربي يعرض السيارات المتاحة، مميزات الخدمة، تغطية مناطق دبي، وأسئلة شائعة، مع أزرار حجز وتواصل واتساب مباشرة.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تصميم UI / UX"],
    technologies: ["React", "Vite", "Tailwind CSS"],
    resultsSummary:
      "موقع حي لشركة AL GENERAL في دبي يعرض الأسطول ويوجّه العميل للحجز أو واتساب من أول شاشة.",
  },
  {
    id: "vip-padel",
    title: "VIP PADEL\nحجز ملاعب البادل",
    client: "الأستاذ فهد الشمري",
    challenge:
      "حجوزات ملاعب البادل كانت تعتمد على واتساب والمراسلة اليدوية، واللاعبون محتاجين يشوفوا الملاعب والمواعيد بشكل أوضح.",
    solution:
      "صمّمنا موقع VIP PADEL لاستعراض الملاعب والعروض واختيار المواعيد من واجهة بسيطة متجاوبة، بدل الاعتماد الكامل على المحادثات.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تطبيقات ويب"],
    technologies: ["React", "Vite", "Tailwind CSS"],
    resultsSummary:
      "إطلاق منصة حجز أوضح للاعبين: الملاعب والمواعيد ظاهرة، وطلب الحجز أسهل من المراسلة اليدوية.",
  },
  {
    id: "malekcure-concrete-cutting-website",
    title: "MalekCure\nقص وتخريم الخرسانة في السعودية",
    client: "الأستاذ رضا محمد",
    url: "https://www.malekcure.com/",
    challenge:
      "شركة قص وتخريم خرسانة في السعودية كانت محتاجة حضور رقمي يشرح الخدمات الصناعية بوضوح، ويظهر في البحث المحلي لجدة ومكة والطائف، مع تواصل سريع عبر الهاتف وواتساب.",
    solution:
      "طوّرنا موقع MalekCure بصفحات خدمات ومشاريع وفروع ومدونة، مع تصميم متجاوب وتركيز على SEO المحلي ووسائل تواصل واضحة على مدار الساعة.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تحسين محركات البحث (SEO)"],
    technologies: ["React", "Next.js", "Tailwind CSS"],
    resultsSummary:
      "موقع حي على malekcure.com يعرض الخدمات والفروع ويخدم العملاء الباحثين عن قص وتخريم الخرسانة في السعودية.",
  },
  {
    id: "luniermarina-yacht-management",
    title: "Lunayair Marina\nإدارة اليخوت والقوارب",
    client: "الكابتن عبد الله الحربي",
    url: "https://www.lunayairmarina.com/",
    challenge:
      "شركة إدارة يخوت كانت محتاجة موقع يعكس فخامة القطاع، ويشرح خدمات الإدارة والطاقم والمارينا بوضوح لأصحاب اليخوت في السعودية والخليج.",
    solution:
      "صمّمنا موقع Lunayair Marina بمحتوى منظم: نبذة، خدمات الإدارة والوكالة وتشغيل المارينا وتوظيف الطاقم، مع مدونة وأسئلة شائعة ووسائل طلب استشارة.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تصميم UI / UX", "تحسين محركات البحث (SEO)"],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    resultsSummary:
      "موقع احترافي حي على lunayairmarina.com يعرض خدمات إدارة اليخوت من جدة والبحر الأحمر والخليج بشكل واضح.",
  },
  {
    id: "cuttinganddrillingexperts-concrete-cutting-website",
    title: "خبراء القص والتخريم\nقص وتخريم الخرسانة في السعودية",
    client: "الأستاذ محمود نجيب",
    url: "https://www.cuttinganddrillingexperts.com/",
    challenge:
      "شركة قص وتخريم خرسانة تغطي عدة مدن سعودية كانت محتاجة موقع ينظّم الخدمات والمناطق، ويسهّل طلب عرض السعر بدل البحث العشوائي.",
    solution:
      "بنينا موقع خبراء القص والتخريم بصفحات خدمات ومشاريع وتغطية جغرافية (جدة، مكة، الرياض، الدمام وغيرها)، مع تركيز على الأداء وSEO المحلي والتواصل 24/7.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تحسين محركات البحث (SEO)"],
    technologies: ["React", "Next.js", "Tailwind CSS"],
    resultsSummary:
      "موقع حي على cuttinganddrillingexperts.com يشرح الخدمات والمدن ويوجّه العميل لعرض السعر أو الاتصال.",
  },
  {
    id: "alforsancladding",
    title: "الفرسان\nواجهات زجاجية وكلادينج",
    client: "المهندس محروس الصياد",
    url: "https://www.alforsancladding.com/",
    challenge:
      "شركة واجهات زجاجية وكلادينج في المنصورة كانت محتاجة موقع يعرض الخدمات والمشاريع بوضوح، ويعرّف بالخبرة الهندسية، ويخلّي التواصل من المحافظات أسهل.",
    solution:
      "صمّمنا موقع الفرسان بصفحات خدمات (كلادينج وكيرتن وول وسبايدر)، معرض أعمال، تعريف بالمؤسس والفريق، وموقع المنصورة مع أزرار اتصال وواتساب.",
    servicesProvided: ["تصميم مواقع", "تطوير مواقع", "تحسين محركات البحث (SEO)"],
    technologies: ["React", "Next.js", "Tailwind CSS"],
    resultsSummary:
      "موقع حي على alforsancladding.com يعرّف بشركة الفرسان في المنصورة ويحوّل الزائر للاتصال أو واتساب.",
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

function toFirestoreValue(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (typeof value === "boolean") return { booleanValue: value };
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item)),
      },
    };
  }
  throw new Error(`Unsupported value: ${typeof value}`);
}

function toFirestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null || value === undefined) continue;
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

async function patchPortfolio(projectId, token, item) {
  const { id, ...rest } = item;
  const data = { ...rest, updatedAt: now };
  const fields = toFirestoreFields(data);
  const mask = Object.keys(fields)
    .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
    .join("&");
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/portfolio/${encodeURIComponent(id)}?${mask}`;
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
    throw new Error(`فشل حفظ ${id} (${res.status}): ${body.slice(0, 240)}`);
  }
}

const sa = parseServiceAccount();
const token = await getAccessToken(sa);
let ok = 0;
for (const item of UPDATES) {
  await patchPortfolio(sa.project_id, token, item);
  ok += 1;
  console.log(`✓ ${item.id} — ${item.client}`);
}
console.log(`\nتم تحديث تفاصيل ${ok} مشاريع في Firestore (portfolio).`);
