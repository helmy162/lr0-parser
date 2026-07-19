const LAST_UPDATED = "July 19, 2026";
const LINKEDIN = "https://www.linkedin.com/in/helmy16/";
const REPO = "https://github.com/helmy162/lr0-parser";

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function PrivacyContent() {
  return (
    <>
      <h2 className="legal-title">Privacy Policy</h2>
      <p className="legal-meta">Last updated {LAST_UPDATED}</p>

      <p>
        This Privacy Policy describes how LR(0) Parser (<strong>lr0parser.com</strong>), a free educational tool
        operated by Mohamed Abdelmaksoud, handles information when you use it.
      </p>

      <h3>Information you enter</h3>
      <p>
        Grammars and input strings you type are processed entirely in your browser to build the automaton and
        tables. They are not transmitted to or stored on our servers.
      </p>

      <h3>Analytics</h3>
      <p>
        We use Google Analytics (through Google Tag Manager), Vercel Analytics, and Vercel Speed Insights to collect
        aggregated, non-identifying usage and performance data, such as page views, approximate location, device and
        browser type, and load times. This helps us understand how the tool is used and improve it.
      </p>

      <h3>Advertising</h3>
      <p>
        We display ads through Google AdSense. Google and its partners may use cookies and similar technologies to
        serve and personalise ads based on your visits to this and other websites. You can review and control ad
        personalisation in your{" "}
        <ExternalLink href="https://adssettings.google.com">Google Ads settings</ExternalLink>, and learn more in{" "}
        <ExternalLink href="https://policies.google.com/technologies/ads">
          Google&rsquo;s advertising policies
        </ExternalLink>
        .
      </p>

      <h3>Cookies</h3>
      <p>
        This site and the third-party services above may store cookies or similar identifiers in your browser. You
        can block or delete cookies in your browser settings; some features or ads may then behave differently.
      </p>

      <h3>Third-party links</h3>
      <p>
        Pages here may link to external sites, such as <ExternalLink href={REPO}>GitHub</ExternalLink>,{" "}
        <ExternalLink href={LINKEDIN}>LinkedIn</ExternalLink>, and Buy Me a Coffee. We are not responsible for the
        content or privacy practices of those sites.
      </p>

      <h3>Children&rsquo;s privacy</h3>
      <p>The site is intended for a general audience and is not directed to children under 13.</p>

      <h3>Changes</h3>
      <p>
        We may update this policy from time to time. When we do, the &ldquo;last updated&rdquo; date above will
        change accordingly.
      </p>

      <h3>Contact</h3>
      <p>
        Questions about this policy? Reach out via <ExternalLink href={LINKEDIN}>LinkedIn</ExternalLink>.
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <h2 className="legal-title">Terms &amp; Conditions</h2>
      <p className="legal-meta">Last updated {LAST_UPDATED}</p>

      <p>
        By accessing or using LR(0) Parser (<strong>lr0parser.com</strong>), you agree to these Terms. If you do not
        agree, please do not use the site.
      </p>

      <h3>The service</h3>
      <p>
        LR(0) Parser is a free educational tool that visualises LR(0) grammar analysis: the augmented grammar, item
        sets, the DFA, the parsing table, and parse traces. It is provided for learning and reference.
      </p>

      <h3>No warranty</h3>
      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind.
        While we aim for correctness, results may contain errors and should be verified before you rely on them for
        coursework, assessments, or production use.
      </p>

      <h3>Limitation of liability</h3>
      <p>
        To the fullest extent permitted by law, the author is not liable for any loss or damage arising from your use
        of, or inability to use, the site.
      </p>

      <h3>Acceptable use</h3>
      <p>
        Do not attempt to disrupt, overload, or gain unauthorised access to the site, and do not use it for unlawful
        purposes.
      </p>

      <h3>Intellectual property</h3>
      <p>
        The name, branding, design, and original content are the property of the author. The source code is public
        on <ExternalLink href={REPO}>GitHub</ExternalLink> and may be used under the terms stated in that repository.
      </p>

      <h3>Third-party services</h3>
      <p>
        The site uses third-party services such as Google AdSense and Google Analytics, which are governed by their
        own terms and policies.
      </p>

      <h3>Changes</h3>
      <p>
        We may update these Terms from time to time. Continued use of the site after changes take effect means you
        accept the updated Terms.
      </p>

      <h3>Contact</h3>
      <p>
        Questions? Reach out via <ExternalLink href={LINKEDIN}>LinkedIn</ExternalLink>.
      </p>
    </>
  );
}

export default function LegalPage({ type, onHome }) {
  return (
    <main className="app-main legal">
      <a
        className="legal-back"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onHome();
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to LR(0) Parser
      </a>

      <article className="legal-doc">{type === "privacy" ? <PrivacyContent /> : <TermsContent />}</article>
    </main>
  );
}
