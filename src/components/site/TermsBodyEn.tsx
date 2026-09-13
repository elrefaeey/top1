import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Mail, Phone, type ReactNode } from "lucide-react";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_SA,
  SITE_NAME,
  SITE_PRODUCTION_URL,
} from "@/lib/site-config";
import { telHref } from "@/lib/phone";
import { useLocale } from "@/providers/LocaleProvider";

const TERMS_NAV_EN = [
  { n: 1, title: "About the services" },
  { n: 2, title: "Acceptance of terms" },
  { n: 3, title: "Requesting services" },
  { n: 4, title: "Quotes and scope of work" },
  { n: 5, title: "Pricing and payment" },
  { n: 6, title: "Project changes" },
  { n: 7, title: "Project timelines" },
  { n: 8, title: "Client responsibilities" },
  { n: 9, title: "Domain, hosting, and external accounts" },
  { n: 10, title: "SEO services" },
  { n: 11, title: "Marketing and advertising services" },
  { n: 12, title: "Client-provided content and materials" },
  { n: 13, title: "Intellectual property" },
  { n: 14, title: "Showing the project in our portfolio" },
  { n: 15, title: "Confidentiality" },
  { n: 16, title: "Login accounts and passwords" },
  { n: 17, title: "Third-party services" },
  { n: 18, title: "Backups" },
  { n: 19, title: "Maintenance and support" },
  { n: 20, title: "Suspending or ending a project" },
  { n: 21, title: "Refund policy" },
  { n: 22, title: "Unlawful use" },
  { n: 23, title: "Limitation of liability" },
  { n: 24, title: "Force majeure" },
  { n: 25, title: "Changes to these terms" },
  { n: 26, title: "Third-party links and sites" },
  { n: 27, title: "Electronic communication" },
  { n: 28, title: "Accuracy of information" },
  { n: 29, title: "Governing law and jurisdiction" },
  { n: 30, title: "Priority of contract or agreement" },
  { n: 31, title: "Contact us" },
  { n: 32, title: "Acknowledgement" },
] as const;

function Section({ n, children }: { n: number; children: ReactNode }) {
  const title = TERMS_NAV_EN.find((item) => item.n === n)?.title ?? "";
  return (
    <section id={`term-${n}`} className="legal-card">
      <div className="legal-card-head">
        <span className="legal-card-num">{String(n).padStart(2, "0")}</span>
        <h2>{title}</h2>
      </div>
      <div className="legal-card-body">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="legal-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Full English terms body (courtesy translation; Arabic remains legally binding). */
export function TermsBodyEn({ phoneDisplay }: { phoneDisplay: string }) {
  const { m, t } = useLocale();

  return (
    <>
      <div className="legal-intro">
        <p className="mb-3 text-sm font-semibold text-primary">{m.legal.arabicNotice}</p>
        <p className="font-semibold text-foreground">{t(m.legal.welcome, { name: SITE_NAME })}</p>
        <p>
          By using this website or requesting any of our services, you agree to these terms and
          conditions. Please read them carefully before using the site or contracting with us.
        </p>
        <p>
          In these terms, {SITE_NAME} may be referred to as “the company”, “we”, or “us”, and the
          site user or client as “the client”, “you”, or “the user”.
        </p>
      </div>

      <Section n={1}>
        <p>
          {SITE_NAME} provides digital and marketing services including, without limitation:
        </p>
        <List
          items={[
            "Website design and development.",
            "E-commerce design and development.",
            "UI/UX design.",
            "Search engine optimization (SEO).",
            "Website management and improvement.",
            "Content management.",
            "Digital marketing.",
            "Social media account management.",
            "Digital content creation and development.",
            "Support, maintenance, and updates.",
            "Digital and marketing consulting.",
            "Any other digital services agreed between the company and the client.",
          ]}
        />
        <p>
          The scope of each project or service is defined by the quote, agreement, invoice, or
          contract provided to the client.
        </p>
      </Section>

      <Section n={2}>
        <p>By using the site or requesting any service from {SITE_NAME}, you confirm that you:</p>
        <List
          items={[
            "Have read and understood these terms.",
            "Agree to be bound by them.",
            "Have the legal capacity to enter into agreements related to the services.",
            "Will provide accurate information when requesting services.",
            "Are responsible for ensuring materials you provide do not infringe third-party rights.",
          ]}
        />
        <p>If you do not agree to any of these terms, please do not use the site or request services.</p>
      </Section>

      <Section n={3}>
        <p>
          Clients may request services via the website, messaging channels, email, or any other
          channel the company accepts.
        </p>
        <p>
          Sending a request or contacting the company is not final acceptance of a project until the
          request is confirmed and scope, cost, timeline, and payment terms are agreed.
        </p>
        <p>The company may decline any service request or project at its discretion.</p>
      </Section>

      <Section n={4}>
        <p>Project pricing is based on the requirements the client provides.</p>
        <p>A quote may include:</p>
        <List
          items={[
            "Scope of work.",
            "Included services.",
            "Estimated timeline.",
            "Number of revisions.",
            "Project fee.",
            "Payment schedule.",
            "Services or benefits not included.",
          ]}
        />
        <p>Requests outside the agreed scope may incur additional cost and time.</p>
        <p>
          A material change in requirements, or adding new features, pages, systems, or
          integrations beyond the original scope, is treated as an additional request.
        </p>
      </Section>

      <Section n={5}>
        <p>Service fees follow the quote or agreement provided to the client.</p>
        <p>Some projects require a deposit before work begins.</p>
        <p>The company may not start certain projects until the agreed payment is received.</p>
        <p>Where milestone payments apply, the client must pay each installment on time.</p>
        <p>
          If a due payment is late, the company may pause work until the payment is received.
        </p>
        <p>Time lost due to late payment is not counted as part of the original delivery timeline.</p>
      </Section>

      <Section n={6}>
        <p>
          Projects include a defined number of revisions when stated in the quote or agreement.
        </p>
        <p>A revision means changes within the agreed project scope.</p>
        <p>
          A full redesign, change of core concept, new features, or major requirement changes after
          work has started may be treated as additional work.
        </p>
        <p>The company may set any extra cost and time needed for out-of-scope work.</p>
      </Section>

      <Section n={7}>
        <p>Timelines are estimates based on project size and requirements.</p>
        <p>Delivery time may be affected by:</p>
        <List
          items={[
            "Client delay in sending content or data.",
            "Client delay in approving designs.",
            "Additional revision requests.",
            "Late payment.",
            "Issues or outages in third-party services.",
            "Scope changes.",
            "Technical or operational circumstances beyond the company’s control.",
          ]}
        />
        <p>
          The company is not responsible for delays caused directly by the client or external
          parties.
        </p>
      </Section>

      <Section n={8}>
        <p>
          The client must provide the information and materials needed to deliver the project,
          including where applicable:
        </p>
        <List
          items={[
            "Copy/text.",
            "Images.",
            "Logos.",
            "Contact details.",
            "Product and service data.",
            "Account credentials.",
            "Marketing content.",
            "Any necessary technical requirements.",
          ]}
        />
        <p>
          The client is responsible for having the legal rights to use materials sent to the
          company.
        </p>
        <p>
          The client is also responsible for reviewing and approving final content and information
          before publication.
        </p>
      </Section>

      <Section n={9}>
        <p>Some services rely on external platforms such as:</p>
        <List
          items={[
            "Domain registration services.",
            "Hosting.",
            "Email services.",
            "Google.",
            "Meta.",
            "Firebase.",
            "Vercel.",
            "Payment providers.",
            "Analytics tools.",
            "Marketing and advertising services.",
            "Any other services or platforms used in the project.",
          ]}
        />
        <p>Those services are governed by their providers’ terms and policies.</p>
        <p>
          {SITE_NAME} is not liable for change, suspension, outage, or loss of service caused by an
          external provider, unless it results directly from the company’s negligence or error.
        </p>
        <p>
          Where a domain or accounts are registered in the client’s name, ownership remains with the
          client subject to the provider’s terms.
        </p>
      </Section>

      <Section n={10}>
        <p>
          SEO services aim to improve a site’s visibility and performance in search engines using
          suitable practices and strategies.
        </p>
        <p>However, {SITE_NAME} does not guarantee:</p>
        <List
          items={[
            "Ranking #1 on Google.",
            "A specific number of visits.",
            "A specific number of leads or sales.",
            "That every keyword will appear in search results.",
            "Specific results within a fixed timeframe.",
          ]}
        />
        <p>
          SEO outcomes depend on many factors, including competition, search-engine updates, content
          quality, site age, niche, user behaviour, and other external factors.
        </p>
        <p>
          Any performance indicators shared are goals or estimates, not a guarantee of a specific
          outcome.
        </p>
      </Section>

      <Section n={11}>
        <p>
          For digital marketing or paid campaign management, management fees are separate from ad
          spend unless otherwise agreed.
        </p>
        <p>Ad budgets are paid to the relevant ad platform or as otherwise agreed.</p>
        <p>{SITE_NAME} does not guarantee a specific number of:</p>
        <List
          items={[
            "Clients.",
            "Messages.",
            "Calls.",
            "Sales.",
            "Visits.",
            "Views.",
            "Followers.",
          ]}
        />
        <p>
          Results depend on market, audience, budget, competition, platform, creative, and user
          behaviour.
        </p>
      </Section>

      <Section n={12}>
        <p>
          The client confirms they own or have permission to use any content provided to the
          company.
        </p>
        <p>This includes:</p>
        <List
          items={[
            "Images.",
            "Videos.",
            "Text.",
            "Logos.",
            "Trademarks.",
            "Designs.",
            "Documents.",
            "Data.",
          ]}
        />
        <p>
          {SITE_NAME} is not liable for legal claims arising from client content used without the
          necessary rights.
        </p>
      </Section>

      <Section n={13}>
        <p>
          After all project fees due are paid, the client receives the agreed rights in the final
          deliverables, as set out in the quote or contract.
        </p>
        <p>This does not necessarily include:</p>
        <List
          items={[
            "General software tools.",
            "Open-source libraries.",
            "Pre-existing code or systems owned by the company.",
            "Reusable templates or components.",
            "External tools and services.",
            "Third-party licences.",
          ]}
        />
        <p>
          Each party retains intellectual property in materials they owned before the project
          started.
        </p>
      </Section>

      <Section n={14}>
        <p>
          Unless agreed otherwise in writing, {SITE_NAME} may show the project name, design
          screenshots, or the final site URL in its portfolio or marketing materials.
        </p>
        <p>
          If the project is confidential or must not be published, the client must tell the company
          before or during contracting.
        </p>
      </Section>

      <Section n={15}>
        <p>
          {SITE_NAME} will keep non-public information received from the client confidential in the
          course of the project.
        </p>
        <p>
          Confidential information may only be used as needed to deliver the agreed services, except
          where disclosure is required by law.
        </p>
      </Section>

      <Section n={16}>
        <p>The team may need access to certain accounts and services to deliver the project.</p>
        <p>The client must provide necessary access in a secure way.</p>
        <p>
          Passwords, API keys, or sensitive credentials should not be shared over insecure channels
          when a safer method is available.
        </p>
        <p>The company will use access only as needed to deliver the agreed services.</p>
      </Section>

      <Section n={17}>
        <p>Parts of a project may depend on external services or platforms.</p>
        <p>
          If a provider changes policy, pricing, features, APIs, or terms, the project may need
          technical or commercial adjustments.
        </p>
        <p>The company is not responsible for decisions or changes made by external parties.</p>
      </Section>

      <Section n={18}>
        <p>Clients are always advised to keep independent backups of important data and files.</p>
        <p>
          Without a separate backup agreement, comprehensive backups of all client data are not
          automatically included in the company’s services.
        </p>
      </Section>

      <Section n={19}>
        <p>
          Support and maintenance after handoff follow the agreed service scope or package.
        </p>
        <p>Maintenance may include:</p>
        <List
          items={[
            "Fixing project-related software bugs.",
            "Minor updates.",
            "Content edits.",
            "Specific technical updates.",
          ]}
        />
        <p>
          It does not necessarily include rebuilding the site, adding new features, or building new
          systems unless agreed.
        </p>
      </Section>

      <Section n={20}>
        <p>Either party may request to end a project under the terms of their agreement.</p>
        <p>
          If a project is cancelled after work has started, amounts due are based on work completed
          up to cancellation and any other terms in the contract or quote.
        </p>
        <p>The company may suspend or end service if:</p>
        <List
          items={[
            "Fees are unpaid.",
            "The company’s services are misused.",
            "Misleading information is provided.",
            "Services are used for unlawful activities.",
            "The company’s or others’ rights are infringed.",
            "These terms are breached.",
          ]}
        />
      </Section>

      <Section n={21}>
        <p>Refunds follow the agreement or quote for the service.</p>
        <p>
          Because many digital services involve custom time and effort, amounts for work already
          completed may not be refundable.
        </p>
        <p>
          Any refund request is assessed against project status, service type, payments, and work
          completed.
        </p>
      </Section>

      <Section n={22}>
        <p>It is prohibited to use the site or {SITE_NAME} services for:</p>
        <List
          items={[
            "Any activity that violates applicable law.",
            "Fraud or deception.",
            "Intellectual property infringement.",
            "Publishing unlawful content.",
            "Hacking or attempting to hack systems.",
            "Distributing malware.",
            "Sending spam or unwanted messages.",
            "Impersonating people or organisations.",
            "Any activity that may harm the company, its clients, or others.",
          ]}
        />
        <p>The company may take appropriate action if misuse is discovered.</p>
      </Section>

      <Section n={23}>
        <p>
          {SITE_NAME} works to deliver professional, reliable services, but some outcomes depend on
          factors outside our control.
        </p>
        <p>The company is not liable for damage arising from:</p>
        <List
          items={[
            "Third-party service outages.",
            "Hosting or domain issues outside the company’s control.",
            "Search-engine changes.",
            "External platforms suspending or blocking client accounts.",
            "Content provided by the client.",
            "Incorrect use of the services by the client.",
            "Data loss where backups were not agreed.",
            "Events beyond the company’s reasonable control.",
          ]}
        />
      </Section>

      <Section n={24}>
        <p>
          The company is not liable for delay or inability to perform due to circumstances beyond
          reasonable control, such as:
        </p>
        <List
          items={[
            "Natural disasters.",
            "Widespread service outages.",
            "Infrastructure failures.",
            "War or unrest.",
            "Government decisions.",
            "Large-scale cyberattacks.",
            "Major provider outages.",
            "Any other exceptional circumstances beyond reasonable control.",
          ]}
        />
      </Section>

      <Section n={25}>
        <p>{SITE_NAME} may update or amend these terms from time to time.</p>
        <p>
          The updated version will be published on this page with a revised “last updated” date.
        </p>
        <p>Users are encouraged to review this page periodically.</p>
      </Section>

      <Section n={26}>
        <p>The site may contain links to third-party sites or services.</p>
        <p>
          Links are provided for convenience only and do not mean {SITE_NAME} is responsible for
          those sites’ content, policies, or services.
        </p>
        <p>
          Users should review any external site’s terms and privacy policy before using it.
        </p>
      </Section>

      <Section n={27}>
        <p>
          When you contact {SITE_NAME} by email, messaging apps, or site forms, you agree that we
          may use electronic channels to communicate with you about services, requests, and
          projects.
        </p>
      </Section>

      <Section n={28}>
        <p>
          {SITE_NAME} aims to keep site information accurate and current, but we do not guarantee
          that all information is error-free or always up to date.
        </p>
        <p>Services, prices, and content may change without prior notice.</p>
        <p>
          That does not affect projects already agreed under a separate contract or quote, which
          follow the terms agreed between the parties.
        </p>
      </Section>

      <Section n={29}>
        <p>
          These terms are governed by the laws and regulations of the jurisdiction specified in the
          client’s contract.
        </p>
        <p>
          If no separate contract names governing law, disputes are handled under the law and forum
          agreed commercially between the company and the client.
        </p>
      </Section>

      <Section n={30}>
        <p>
          If these terms conflict with a written contract, quote, or signed agreement between{" "}
          {SITE_NAME} and the client, the project-specific agreement prevails to the extent of that
          conflict.
        </p>
      </Section>

      <Section n={31}>
        <p>
          If you have questions about these terms or {SITE_NAME} services, contact us via:
        </p>
        <div className="legal-contacts">
          <a href={SITE_PRODUCTION_URL} className="legal-contact legal-contact--web">
            <span className="legal-contact-icon">
              <Globe className="h-4 w-4" />
            </span>
            <span className="legal-contact-copy">
              <span>Website</span>
              <strong dir="ltr">{SITE_PRODUCTION_URL.replace("https://", "")}</strong>
            </span>
          </a>
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="legal-contact legal-contact--mail">
            <span className="legal-contact-icon">
              <Mail className="h-4 w-4" />
            </span>
            <span className="legal-contact-copy">
              <span>Email</span>
              <strong dir="ltr">{SITE_CONTACT_EMAIL}</strong>
            </span>
          </a>
          <a
            href={telHref(SITE_CONTACT_PHONE_SA, SITE_CONTACT_PHONE_SA)}
            className="legal-contact legal-contact--phone"
          >
            <span className="legal-contact-icon">
              <Phone className="h-4 w-4" />
            </span>
            <span className="legal-contact-copy">
              <span>Phone / WhatsApp</span>
              <strong dir="ltr">{phoneDisplay}</strong>
            </span>
          </a>
        </div>
      </Section>

      <Section n={32}>
        <p>
          By using the {SITE_NAME} website or requesting any of our services, you acknowledge that
          you have read, understood, and agree to these terms and conditions, in addition to any
          special terms agreed between you and {SITE_NAME}.
        </p>
        <div className="legal-signoff">
          <p className="font-semibold text-foreground">{SITE_NAME}</p>
          <p className="text-sm text-muted-foreground" dir="ltr">
            Saudi Identity. Global Digital Ambition.
          </p>
        </div>
      </Section>

      <div className="legal-cta">
        <h2 className="page-intro-title page-intro-title--section">{m.legal.question}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{m.legal.questionDesc}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary">
            {m.common.contactUs} <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
          <Link to="/privacy" className="btn-ghost">
            {m.legal.privacy}
          </Link>
        </div>
      </div>
    </>
  );
}
