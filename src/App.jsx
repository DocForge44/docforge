import { useState, useRef } from "react";

const DOCUMENT_TYPES = [
  {
    id: "privacy_policy",
    name: "Privacy Policy",
    icon: "🔒",
    description: "GDPR & CCPA compliant privacy policy for your website or app",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Corp" },
      { key: "website_url", label: "Website URL", placeholder: "https://acmecorp.com" },
      { key: "data_collected", label: "What data do you collect?", placeholder: "Email addresses, names, payment info, usage analytics...", multiline: true },
      { key: "country", label: "Country of Operation", placeholder: "United States" },
    ],
  },
  {
    id: "freelance_contract",
    name: "Freelance Contract",
    icon: "✍️",
    description: "Professional client contract for freelancers & consultants",
    fields: [
      { key: "freelancer_name", label: "Your Name / Business", placeholder: "Jane Smith Design" },
      { key: "client_name", label: "Client Name / Company", placeholder: "Client Corp LLC" },
      { key: "services", label: "Services to be Provided", placeholder: "Website redesign, brand identity, 3 logo concepts...", multiline: true },
      { key: "rate", label: "Rate & Payment Terms", placeholder: "$5,000 total, 50% upfront, 50% on delivery" },
      { key: "timeline", label: "Project Timeline", placeholder: "6 weeks, starting March 1" },
    ],
  },
  {
    id: "terms_of_service",
    name: "Terms of Service",
    icon: "📋",
    description: "Legally protective terms of service for your product or platform",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Corp" },
      { key: "product_name", label: "Product / Service Name", placeholder: "AcmeApp" },
      { key: "website_url", label: "Website URL", placeholder: "https://acmecorp.com" },
      { key: "product_description", label: "What does your product do?", placeholder: "A SaaS tool for project management...", multiline: true },
    ],
  },
  {
    id: "sop",
    name: "Standard Operating Procedure",
    icon: "⚙️",
    description: "Clear, step-by-step SOPs for business processes & onboarding",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Corp" },
      { key: "process_name", label: "Process Name", placeholder: "New Employee Onboarding" },
      { key: "process_description", label: "Describe the process", placeholder: "Walk-through of how we onboard a new hire from day 1 through 30 days...", multiline: true },
      { key: "roles", label: "Who is involved?", placeholder: "HR Manager, Team Lead, IT Department" },
    ],
  },
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    icon: "🤫",
    description: "Mutual or one-way NDA to protect your confidential information",
    fields: [
      { key: "party_one", label: "Your Name / Company", placeholder: "Acme Corp" },
      { key: "party_two", label: "Other Party Name / Company", placeholder: "Partner Inc." },
      { key: "purpose", label: "Purpose of Disclosure", placeholder: "Exploring a potential business partnership / acquisition discussions" },
      { key: "nda_type", label: "NDA Type", placeholder: "Mutual (both parties share info) or One-way (only you share)" },
      { key: "duration", label: "Confidentiality Duration", placeholder: "2 years" },
    ],
  },
  {
    id: "job_description",
    name: "Job Description",
    icon: "💼",
    description: "Compelling, inclusive job postings that attract top candidates",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Corp" },
      { key: "role_title", label: "Role Title", placeholder: "Senior Product Designer" },
      { key: "responsibilities", label: "Key Responsibilities", placeholder: "Lead product design, collaborate with engineering, conduct user research...", multiline: true },
      { key: "requirements", label: "Requirements & Nice-to-haves", placeholder: "5+ years experience, Figma proficiency, startup experience preferred..." },
      { key: "compensation", label: "Compensation & Perks", placeholder: "$120k-$150k, equity, remote-friendly, health benefits" },
    ],
  },
  {
    id: "refund_policy",
    name: "Refund Policy",
    icon: "💳",
    description: "Clear refund policy that protects you and builds customer trust",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Corp" },
      { key: "product_type", label: "Product/Service Type", placeholder: "SaaS subscription / Physical goods / Digital downloads" },
      { key: "refund_window", label: "Refund Window", placeholder: "30 days" },
      { key: "conditions", label: "Refund Conditions", placeholder: "Unused subscription time, defective product, etc.", multiline: true },
    ],
  },
  {
    id: "partnership_agreement",
    name: "Partnership Agreement",
    icon: "🤝",
    description: "Business partnership agreement outlining roles, equity & responsibilities",
    fields: [
      { key: "partners", label: "Partner Names", placeholder: "Alice Johnson, Bob Smith" },
      { key: "business_name", label: "Business Name", placeholder: "Johnson & Smith Ventures LLC" },
      { key: "ownership_split", label: "Ownership Split", placeholder: "50/50, or 60/40, or 33/33/33..." },
      { key: "roles", label: "Each Partner's Role", placeholder: "Alice handles operations and finance; Bob handles sales and marketing", multiline: true },
      { key: "profit_distribution", label: "Profit Distribution Terms", placeholder: "Quarterly distributions based on ownership %" },
    ],
  },
];

function buildPrompt(docType, fields) {
  const docInfo = DOCUMENT_TYPES.find(d => d.id === docType);
  let prompt = `Generate a professional ${docInfo.name} with the following details:\n\n`;
  for (const [key, value] of Object.entries(fields)) {
    if (value && value.trim()) {
      const fieldDef = docInfo.fields.find(f => f.key === key);
      prompt += `${fieldDef?.label || key}: ${value}\n`;
    }
  }
  prompt += `\nGenerate the complete, ready-to-use document now.`;
  return prompt;
}

function MarkdownRenderer({ content }) {
  const html = content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]/g, '<span class="placeholder">[$1]</span>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return (
    <div
      className="doc-content"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

export default function DocForge() {
  const [step, setStep] = useState("home");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formFields, setFormFields] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const docRef = useRef(null);

  const selectDocType = (doc) => {
    setSelectedDoc(doc);
    const initial = {};
    doc.fields.forEach(f => { initial[f.key] = ""; });
    setFormFields(initial);
    setStep("form");
  };

  const generateDocument = async () => {
    setStep("generating");
    setGeneratedDoc("");
    setError(null);

    try {
      const prompt = buildPrompt(selectedDoc.id, formFields);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullText += parsed.delta.text;
              setGeneratedDoc(fullText);
            }
          } catch {}
        }
      }

      if (fullText.length > 0) {
        setStep("result");
      } else {
        throw new Error("No content received. Please try again.");
      }

    } catch (err) {
      setError(err.message || "Failed to generate document. Please try again.");
      setStep("form");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDoc.name.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  const resetToHome = () => {
    setStep("home");
    setSelectedDoc(null);
    setFormFields({});
    setGeneratedDoc("");
    setError(null);
  };

  const allFilled = selectedDoc && selectedDoc.fields.slice(0, 2).every(f => formFields[f.key]?.trim());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0c0c0e; --surface: #13131a; --surface2: #1c1c28;
          --border: #2a2a3a; --accent: #e8c97a; --accent2: #c8a84a;
          --text: #f0ede8; --muted: #8885a0; --danger: #e06c75;
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .app { min-height: 100vh; background: var(--bg); background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,201,122,0.08), transparent); }
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid var(--border); background: rgba(12,12,14,0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; }
        .logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; background: linear-gradient(135deg, var(--accent), #fff8e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; letter-spacing: -0.5px; }
        .nav-tagline { font-size: 13px; color: var(--muted); }
        .nav-badge { background: var(--accent); color: #0c0c0e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; }
        .hero { text-align: center; padding: 80px 24px 60px; max-width: 700px; margin: 0 auto; }
        .hero-eyebrow { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; border: 1px solid rgba(232,201,122,0.3); padding: 6px 14px; border-radius: 20px; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(42px, 7vw, 72px); font-weight: 900; line-height: 1.05; margin-bottom: 20px; letter-spacing: -2px; }
        .hero h1 em { font-style: italic; color: var(--accent); }
        .hero p { font-size: 17px; color: var(--muted); line-height: 1.7; max-width: 500px; margin: 0 auto 16px; }
        .price-note { font-size: 14px; color: var(--accent); font-weight: 500; margin-top: 8px; }
        .pricing-row { display: flex; gap: 12px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
        .pricing-btn { display: inline-flex; flex-direction: column; align-items: center; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-family: 'DM Sans', sans-serif; transition: all 0.2s; cursor: pointer; border: none; }
        .pricing-btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #0c0c0e; }
        .pricing-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,201,122,0.35); }
        .pricing-btn-secondary { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
        .pricing-btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
        .pricing-btn-label { font-size: 15px; font-weight: 700; }
        .pricing-btn-sub { font-size: 11px; opacity: 0.75; margin-top: 2px; font-weight: 400; }
        .pricing-divider { display: flex; align-items: center; color: var(--muted); font-size: 12px; padding: 0 4px; }
        .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 0 48px 80px; max-width: 1200px; margin: 0 auto; }
        .doc-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; }
        .doc-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(232,201,122,0.06), transparent); opacity: 0; transition: opacity 0.2s; }
        .doc-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .doc-card:hover::before { opacity: 1; }
        .doc-icon { font-size: 28px; margin-bottom: 12px; }
        .doc-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .doc-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
        .doc-arrow { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--accent); opacity: 0; transition: opacity 0.2s; }
        .doc-card:hover .doc-arrow { opacity: 1; }
        .form-container { max-width: 640px; margin: 0 auto; padding: 48px 24px 80px; }
        .back-btn { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; border: none; background: none; padding: 0; margin-bottom: 32px; transition: color 0.2s; }
        .back-btn:hover { color: var(--text); }
        .form-header { margin-bottom: 36px; }
        .form-header .doc-icon { font-size: 36px; margin-bottom: 12px; display: block; }
        .form-header h2 { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; margin-bottom: 8px; letter-spacing: -1px; }
        .form-header p { font-size: 14px; color: var(--muted); }
        .field-group { margin-bottom: 22px; }
        label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text); letter-spacing: 0.3px; }
        input, textarea { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 16px; border-radius: 8px; outline: none; transition: border-color 0.2s; resize: vertical; }
        input:focus, textarea:focus { border-color: var(--accent); }
        input::placeholder, textarea::placeholder { color: var(--muted); }
        textarea { min-height: 90px; }
        .generate-btn { width: 100%; padding: 16px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #0c0c0e; margin-top: 8px; letter-spacing: 0.3px; transition: all 0.2s; }
        .generate-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,201,122,0.3); }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .generating-screen { max-width: 640px; margin: 0 auto; padding: 48px 24px; }
        .generating-screen h2 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
        .generating-screen p { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
        .stream-preview { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; min-height: 300px; font-size: 13px; line-height: 1.8; color: var(--muted); white-space: pre-wrap; overflow-y: auto; max-height: 500px; }
        .stream-preview::after { content: '▋'; animation: blink 1s infinite; color: var(--accent); font-size: 14px; }
        @keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        .progress-bar { height: 2px; background: var(--border); border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); animation: progress 3s ease-in-out infinite alternate; }
        @keyframes progress { from { width: 20%; } to { width: 85%; } }
        .result-container { max-width: 800px; margin: 0 auto; padding: 48px 24px 80px; }
        .result-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; flex-wrap: wrap; }
        .result-title h2 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .result-title p { font-size: 13px; color: var(--muted); }
        .result-actions { display: flex; gap: 10px; }
        .action-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .action-btn:hover { border-color: var(--accent); color: var(--accent); }
        .action-btn.primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #0c0c0e; border-color: transparent; }
        .action-btn.primary:hover { color: #0c0c0e; opacity: 0.9; }
        .doc-output { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 40px; }
        .doc-content h1 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; margin: 0 0 24px; }
        .doc-content h2 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin: 28px 0 12px; color: var(--accent); }
        .doc-content h3 { font-size: 15px; font-weight: 600; margin: 20px 0 8px; }
        .doc-content p { font-size: 14px; line-height: 1.8; color: #ccc8e0; margin-bottom: 12px; }
        .doc-content br { display: block; margin: 4px 0; content: ''; }
        .placeholder { background: rgba(232,201,122,0.15); color: var(--accent); padding: 1px 4px; border-radius: 3px; font-weight: 500; }
        .new-doc-btn { display: block; margin: 32px auto 0; padding: 14px 32px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .new-doc-btn:hover { color: var(--text); border-color: var(--text); }
        .error-msg { color: var(--danger); font-size: 13px; margin-top: 8px; padding: 12px; background: rgba(224,108,117,0.1); border-radius: 6px; border: 1px solid rgba(224,108,117,0.2); }
        .footer { text-align: center; padding: 24px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }
        @media (max-width: 600px) { .nav { padding: 16px 20px; } .doc-grid { padding: 0 20px 60px; } .hero { padding: 48px 20px 40px; } }
      `}</style>
      <div className="app">
        <nav className="nav">
          <div className="logo" onClick={resetToHome}>DocForge</div>
          <span className="nav-tagline">AI Business Documents</span>
          <span className="nav-badge">Beta</span>
        </nav>

        {step === "home" && (
          <>
            <div className="hero">
              <span className="hero-eyebrow">AI Document Generator</span>
              <h1>Legal docs in <em>seconds,</em> not hours</h1>
              <p>Professional contracts, policies & agreements tailored to your business — no lawyers, no templates, no waiting.</p>
              <p className="price-note">⚡ 8 document types · Powered by Claude AI · Instant download</p>
              <div className="pricing-row">
                <a
                  href="https://buy.stripe.com/5kQ4gs8Yn6jb3Fde148ww00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pricing-btn pricing-btn-primary"
                >
                  <span className="pricing-btn-label">Get Pro Access — $19/mo</span>
                  <span className="pricing-btn-sub">Unlimited documents · Cancel anytime</span>
                </a>
                <span className="pricing-divider">or</span>
                <a
                  href="https://buy.stripe.com/28E28kdeD6jbdfNcX08ww01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pricing-btn pricing-btn-secondary"
                >
                  <span className="pricing-btn-label">Single Document — $9</span>
                  <span className="pricing-btn-sub">One-time · No subscription</span>
                </a>
              </div>
              <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '16px'}}>
                Or scroll down and try a document free ↓
              </p>
            </div>
            <div className="doc-grid">
              {DOCUMENT_TYPES.map(doc => (
                <div className="doc-card" key={doc.id} onClick={() => selectDocType(doc)}>
                  <div className="doc-icon">{doc.icon}</div>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-desc">{doc.description}</div>
                  <span className="doc-arrow">→</span>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "form" && selectedDoc && (
          <div className="form-container">
            <button className="back-btn" onClick={resetToHome}>← Back to documents</button>
            <div className="form-header">
              <span className="doc-icon">{selectedDoc.icon}</span>
              <h2>{selectedDoc.name}</h2>
              <p>{selectedDoc.description}</p>
            </div>
            {selectedDoc.fields.map(field => (
              <div className="field-group" key={field.key}>
                <label>{field.label}</label>
                {field.multiline ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={formFields[field.key] || ""}
                    onChange={e => setFormFields(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formFields[field.key] || ""}
                    onChange={e => setFormFields(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            {error && <div className="error-msg">⚠️ {error}</div>}
            <button
              className="generate-btn"
              onClick={generateDocument}
              disabled={!allFilled}
            >
              Generate {selectedDoc.name} →
            </button>
          </div>
        )}

        {step === "generating" && (
          <div className="generating-screen">
            <h2>Drafting your {selectedDoc?.name}...</h2>
            <p>DocForge is writing your complete document. This takes about 15–30 seconds.</p>
            <div className="progress-bar"><div className="progress-fill" /></div>
            <div className="stream-preview">{generatedDoc}</div>
          </div>
        )}

        {step === "result" && (
          <div className="result-container">
            <div className="result-header">
              <div className="result-title">
                <h2>{selectedDoc?.icon} {selectedDoc?.name}</h2>
                <p>Your document is ready. Review, copy, or download below.</p>
              </div>
              <div className="result-actions">
                <button className="action-btn" onClick={copyToClipboard}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
                <button className="action-btn primary" onClick={downloadTxt}>
                  ↓ Download .txt
                </button>
              </div>
            </div>
            <div className="doc-output" ref={docRef}>
              <MarkdownRenderer content={generatedDoc} />
            </div>
            <button className="new-doc-btn" onClick={resetToHome}>
              + Generate another document
            </button>
          </div>
        )}

        <footer className="footer">
          DocForge · AI-generated documents for small businesses & freelancers · Not a substitute for licensed legal counsel
        </footer>
      </div>
    </>
  );
}
