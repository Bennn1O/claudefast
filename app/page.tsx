"use client";

import { useState, useCallback } from "react";
import { SponsorBlock, SponsorEmpty } from "@/components/SponsorBlock";

// --- Types ---
type UseCase = "strategy" | "content" | "code" | "sales" | "ops";
type UseCaseSet = UseCase[];

interface FormData {
  installed: boolean | null;
  disclaimer: boolean;
  role: string;
  useCases: UseCaseSet;
  name: string;
  company: string;
  product: string;
  context: string;
  agentName: string;
}

interface Skill {
  id: string;
  label: string;
  description: string;
  installCmd: string;
  expert?: boolean;
}

interface MCP {
  id: string;
  label: string;
  description: string;
  installCmd: string;
  note?: string;
}

// --- Skills catalog ---
const SKILLS: Record<string, Skill> = {
  superpowers: {
    id: "superpowers",
    label: "Superpowers",
    description: "Pack complet : brainstorming, TDD, debugging, code review, git worktrees",
    installCmd: `claude plugins install superpowers`,
  },
  "setup-wizard": {
    id: "setup-wizard",
    label: "Setup Wizard",
    description: "Configure tout Claude Code en mode guide interactif",
    installCmd: `mkdir -p ~/.claude/skills/setup-wizard && curl -o ~/.claude/skills/setup-wizard/skill.md https://gist.githubusercontent.com/Bennn1O/e5983304f79329e851e90904f5acb50a/raw/skill.md`,
  },
  humanizer: {
    id: "humanizer",
    label: "Humanizer",
    description: "Supprime les traces d'écriture IA dans n'importe quel texte",
    installCmd: `mkdir -p ~/.claude/skills/humanizer && curl -o ~/.claude/skills/humanizer/skill.md https://gist.githubusercontent.com/Bennn1O/6147fccf570725c35f0433472593ad71/raw/skill.md`,
  },
  gtm: {
    id: "gtm",
    label: "GTM",
    description: "Go-to-market en 7 modes (ICP, cold email, plan complet)",
    installCmd: `mkdir -p ~/.claude/skills/gtm && curl -o ~/.claude/skills/gtm/skill.md https://gist.githubusercontent.com/Bennn1O/a44c6720d9ce0346c8f47893aa8c25d8/raw/skill.md`,
  },
  "linkedin-cold-outreach": {
    id: "linkedin-cold-outreach",
    label: "LinkedIn Outreach",
    description: "Templates DMs, séquences, routine hebdo B2B",
    installCmd: `mkdir -p ~/.claude/skills/linkedin-cold-outreach && curl -o ~/.claude/skills/linkedin-cold-outreach/skill.md https://gist.githubusercontent.com/Bennn1O/e65c069d37ec023d58733ef3cd08e048/raw/skill.md`,
  },
  "frontend-design": {
    id: "frontend-design",
    label: "Frontend Design",
    description: "Force Claude à faire de vrais choix de design — fini les UIs génériques",
    installCmd: `claude skills install frontend-design`,
  },
  "mcp-builder": {
    id: "mcp-builder",
    label: "MCP Builder",
    description: "Guide pour créer ses propres MCP servers et intégrer n'importe quelle API",
    installCmd: `claude skills install mcp-builder`,
    expert: true,
  },
  "webapp-testing": {
    id: "webapp-testing",
    label: "Webapp Testing",
    description: "Tests Playwright automatiques sur tes apps web locales",
    installCmd: `claude skills install webapp-testing`,
  },
  pptx: {
    id: "pptx",
    label: "PowerPoint (pptx)",
    description: "Génère des présentations PowerPoint directement depuis Claude",
    installCmd: `claude skills install pptx`,
  },
  xlsx: {
    id: "xlsx",
    label: "Excel (xlsx)",
    description: "Crée et analyse des fichiers Excel avec formules et tableaux",
    installCmd: `claude skills install xlsx`,
  },
  pdf: {
    id: "pdf",
    label: "PDF",
    description: "Crée, extrait et manipule des fichiers PDF",
    installCmd: `claude skills install pdf`,
  },
  "seo-audit": {
    id: "seo-audit",
    label: "SEO Audit",
    description: "Audit SEO complet avec recommandations d'optimisation priorisées",
    installCmd: `npx skills add https://github.com/coreyhaines31/marketingskills --skill seo-audit`,
    expert: true,
  },
  "ui-ux-pro-max": {
    id: "ui-ux-pro-max",
    label: "UI/UX Pro Max",
    description: "Guide UX/UI professionnel — fini les interfaces basiques",
    installCmd: `npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max`,
  },
  "vercel-react-best-practices": {
    id: "vercel-react-best-practices",
    label: "React Best Practices",
    description: "64 règles React/Next.js par Vercel — waterfalls, bundle, performance",
    installCmd: `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices`,
  },
  "twitter-automation": {
    id: "twitter-automation",
    label: "Twitter Automation",
    description: "Automatiser publications, réponses et interactions sur X/Twitter",
    installCmd: `npx skills add https://github.com/inferen-sh/skills --skill twitter-automation`,
    expert: true,
  },
  "browser-use": {
    id: "browser-use",
    label: "Browser Use",
    description: "Framework d'automatisation navigateur pour agents IA",
    installCmd: `npx skills add https://github.com/browser-use/browser-use --skill browser-use`,
    expert: true,
  },
};

// --- MCP catalog ---
const MCPS: Record<string, MCP> = {
  playwright: {
    id: "playwright",
    label: "Playwright",
    description: "Controle un navigateur — scraping, tests, automatisation web",
    installCmd: `claude mcp add playwright -s user -- npx @playwright/mcp@latest`,
  },
  github: {
    id: "github",
    label: "GitHub",
    description: "Lire/écrire issues, PRs, repos directement depuis Claude",
    installCmd: `claude mcp add github -s user -e GITHUB_TOKEN=TON_TOKEN -- npx -y @modelcontextprotocol/server-github`,
    note: "Remplace TON_TOKEN par un Personal Access Token GitHub",
  },
  memory: {
    id: "memory",
    label: "Memory",
    description: "Mémoire persistante entre les sessions Claude",
    installCmd: `claude mcp add memory -s user -- npx -y @modelcontextprotocol/server-memory`,
  },
  notion: {
    id: "notion",
    label: "Notion",
    description: "Lire et écrire dans tes pages et bases Notion",
    installCmd: `claude plugins install @claude-plugins-official/notion`,
  },
  slack: {
    id: "slack",
    label: "Slack",
    description: "Lire les canaux, envoyer des messages, chercher dans Slack",
    installCmd: `claude plugins install @claude-plugins-official/slack`,
  },
  "brave-search": {
    id: "brave-search",
    label: "Brave Search",
    description: "Recherche web en temps réel depuis Claude",
    installCmd: `claude mcp add brave-search -s user -e BRAVE_API_KEY=TON_KEY -- npx -y @modelcontextprotocol/server-brave-search`,
    note: "Clé API gratuite sur search.brave.com/api",
  },
  filesystem: {
    id: "filesystem",
    label: "Filesystem",
    description: "Accès étendu aux fichiers locaux au-delà du projet courant",
    installCmd: `claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem $HOME`,
  },
  postgres: {
    id: "postgres",
    label: "PostgreSQL",
    description: "Requêtes SQL directement depuis Claude sur ta base de données",
    installCmd: `claude mcp add postgres -s user -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost/mabase`,
    note: "Remplace l'URL par celle de ta base",
  },
  hubspot: {
    id: "hubspot",
    label: "HubSpot",
    description: "Accès contacts, deals, companies et activités CRM",
    installCmd: `claude mcp add hubspot -s user -e HUBSPOT_ACCESS_TOKEN=TON_TOKEN -- npx -y @hubspot/mcp-server`,
    note: "Token dans HubSpot → Paramètres → Intégrations → Accès privé",
  },
  stripe: {
    id: "stripe",
    label: "Stripe",
    description: "Consulter paiements, abonnements, clients et revenus",
    installCmd: `claude mcp add stripe -s user -e STRIPE_SECRET_KEY=TON_KEY -- npx -y @stripe/mcp-server-node`,
    note: "Utilise une clé restreinte en lecture seule de préférence",
  },
  "google-drive": {
    id: "google-drive",
    label: "Google Drive",
    description: "Lire et chercher dans tes fichiers Google Drive et Sheets",
    installCmd: `claude mcp add gdrive -s user -- npx -y @modelcontextprotocol/server-gdrive`,
    note: "Nécessite une authentification Google OAuth au premier lancement",
  },
  linear: {
    id: "linear",
    label: "Linear",
    description: "Gérer issues, cycles et projets Linear depuis Claude",
    installCmd: `claude mcp add linear -s user -e LINEAR_API_KEY=TON_KEY -- npx -y @linear/mcp-server`,
    note: "Clé API dans Linear → Paramètres → API",
  },
  figma: {
    id: "figma",
    label: "Figma",
    description: "Lire les composants, styles et fichiers Figma",
    installCmd: `claude mcp add figma -s user -e FIGMA_API_KEY=TON_KEY -- npx -y figma-mcp`,
    note: "Token dans Figma → Account Settings → Personal access tokens",
  },
  supabase: {
    id: "supabase",
    label: "Supabase",
    description: "Requêtes sur ta base Supabase, accès aux tables et fonctions",
    installCmd: `claude mcp add supabase -s user -- npx -y @supabase/mcp-server-supabase@latest --access-token TON_TOKEN`,
    note: "Token dans supabase.com → Account → Access tokens",
  },
  airtable: {
    id: "airtable",
    label: "Airtable",
    description: "Lire et écrire dans tes bases Airtable",
    installCmd: `claude mcp add airtable -s user -e AIRTABLE_API_KEY=TON_KEY -- npx -y airtable-mcp-server`,
    note: "Clé API dans Airtable → Account → API",
  },
  twitter: {
    id: "twitter",
    label: "X / Twitter",
    description: "Publier, rechercher, analyser — accès complet à l'API X v2",
    installCmd: `claude mcp add twitter -s user -- npx -y twitter-mcp`,
    note: "Nécessite un compte développeur X et des clés API (developer.twitter.com)",
  },
  discord: {
    id: "discord",
    label: "Discord",
    description: "Lire/envoyer messages, gérer serveurs et membres Discord",
    installCmd: `claude mcp add discord -s user -e DISCORD_TOKEN=TON_TOKEN -- npx -y discord-mcp-server`,
    note: "Crée un bot Discord sur discord.com/developers et copie le token",
  },
  shopify: {
    id: "shopify",
    label: "Shopify",
    description: "Gérer produits, commandes et clients d'une boutique Shopify",
    installCmd: `claude mcp add shopify -s user -e SHOPIFY_STORE_URL=TON_STORE.myshopify.com -e SHOPIFY_ACCESS_TOKEN=TON_TOKEN -- npx -y shopify-mcp-server`,
    note: "Token dans Shopify Admin → Apps → Develop apps",
  },
  "google-analytics": {
    id: "google-analytics",
    label: "Google Analytics",
    description: "Interroge tes données GA4 en langage naturel directement depuis Claude",
    installCmd: `npm install -g @google/analytics-mcp && claude mcp add google-analytics -s user -- google-analytics-mcp`,
    note: "Nécessite Google Cloud credentials configurés (gcloud auth)",
  },
  jira: {
    id: "jira",
    label: "Jira / Atlassian",
    description: "Issues, sprints, projets Jira et pages Confluence",
    installCmd: `claude mcp add jira -s user -e ATLASSIAN_URL=https://ton-domaine.atlassian.net -e ATLASSIAN_TOKEN=TON_TOKEN -- npx -y mcp-atlassian`,
    note: "Token API dans id.atlassian.com → Security → API tokens",
  },
  sentry: {
    id: "sentry",
    label: "Sentry",
    description: "Analyser erreurs, traces et performances depuis Claude",
    installCmd: `claude mcp add sentry -s user -e SENTRY_AUTH_TOKEN=TON_TOKEN -- npx -y @sentry/mcp-server`,
    note: "Token dans Sentry → Settings → Auth Tokens",
  },
  context7: {
    id: "context7",
    label: "Context7",
    description: "Documentation temps réel de n'importe quelle lib (React, Next.js, etc.)",
    installCmd: `claude mcp add context7 -s user -- npx -y @upstash/context7-mcp`,
  },
  docker: {
    id: "docker",
    label: "Docker",
    description: "Build, run et debug des containers directement depuis Claude",
    installCmd: `claude mcp add docker -s user -- npx -y @docker/mcp-server`,
    note: "Docker Desktop doit être installé et en cours d'exécution",
  },
  "sequential-thinking": {
    id: "sequential-thinking",
    label: "Sequential Thinking",
    description: "Raisonnement structuré et méthodique pour les problèmes complexes",
    installCmd: `claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking`,
  },
  "data-for-seo": {
    id: "data-for-seo",
    label: "DataForSEO",
    description: "Recherche de mots-clés, SERP, analyse concurrents en temps réel",
    installCmd: `claude mcp add dataforseo -s user -e DATAFORSEO_LOGIN=TON_LOGIN -e DATAFORSEO_PASSWORD=TON_MDP -- npx -y dataforseo-mcp-server`,
    note: "Compte DataForSEO requis — plans à partir de 50$/mois",
  },
};

// --- Mapping useCase → MCPs ---
function getRecommendedMCPs(useCases: UseCaseSet): string[] {
  const base = ["memory", "sequential-thinking"];
  const map: Partial<Record<UseCase, string[]>> = {
    strategy: ["notion", "slack", "brave-search", "google-drive", "google-analytics"],
    content: ["brave-search", "notion", "google-drive", "twitter", "data-for-seo"],
    code: ["github", "playwright", "filesystem", "postgres", "supabase", "linear", "docker", "context7", "sentry"],
    sales: ["hubspot", "notion", "brave-search", "twitter"],
    ops: ["notion", "slack", "airtable", "google-drive", "filesystem", "jira"],
  };
  const extra = useCases.flatMap((uc) => map[uc] || []);
  return [...new Set([...base, ...extra])];
}

// --- Mapping useCases → skills ---
function getRecommendedSkills(useCases: UseCaseSet): string[] {
  const base = ["setup-wizard", "humanizer"];
  const map: Partial<Record<UseCase, string[]>> = {
    strategy: ["gtm", "pptx", "xlsx", "seo-audit"],
    content: ["pptx", "pdf", "seo-audit", "twitter-automation"],
    code: ["superpowers", "frontend-design", "mcp-builder", "webapp-testing", "vercel-react-best-practices", "ui-ux-pro-max", "browser-use"],
    sales: ["gtm", "linkedin-cold-outreach", "twitter-automation"],
    ops: ["xlsx", "pdf", "pptx"],
  };
  const extra = useCases.flatMap((uc) => map[uc] || []);
  return [...new Set([...base, ...extra])];
}

// --- CLAUDE.md fallback generator ---
function generateClaudeMd(data: FormData): string {
  const name = data.name || "Utilisateur";
  const company = data.company || "mon entreprise";
  const product = data.product || "mon projet principal";
  const roleLabel = data.role || "Dirigeant";

  return `# ${name} — Contexte ${company}

## Identite

Tu travailles avec **${name}**, ${roleLabel} chez **${company}**.
Projet principal : **${product}**.

Tu n'es pas un assistant generique : tu es le second cerveau de ${name}.
Tu connais ses projets, ses clients, ses objectifs, ses contraintes.
Tu penses en stratege, tu agis en operateur.

---

## Projets actifs

### ${product}
[Decris ici ton projet : ce que c'est, a qui c'est destine, ou tu en es]

---

## Regles de fonctionnement

- **Analyser avant d'agir** : comprendre le vrai besoin derriere la demande
- **Reponses courtes et directes** : pas de recap inutile
- **Honnetete directe** : si une idee est mauvaise, le dire clairement avec une alternative
- **Jamais de validation systematique** : challenger les idees, pas les valider par defaut
- **Pas d'emojis** dans les contenus rediges

---

## Style de collaboration

${name} va vite. Reponses courtes et directes.
Quand il demande quelque chose, analyser et agir.
Ne poser des questions que si c'est vraiment bloquant.
`;
}

// --- Verification script ---
const VERIFY_CMD = `echo "=== Claude Code Setup ===" && for skill in setup-wizard humanizer gtm linkedin-cold-outreach; do [ -f ~/.claude/skills/$skill/skill.md ] && echo "OK $skill" || echo "- $skill (non installe)"; done`;

// --- Audit prompt ---
const AUDIT_PROMPT = `Audite mon setup Claude Code complet et optimise-le.

Lance ces commandes toi-meme :
- cat ~/.claude/CLAUDE.md
- claude mcp list
- ls ~/.claude/skills/

Ensuite donne-moi :
1. Ce qui est redondant ou trop verbeux dans le CLAUDE.md — chaque ligne coute des tokens a chaque session
2. Les MCPs installes mais inutiles selon ce que tu vois dans mon CLAUDE.md
3. Les skills manquants pour mes usages reels
4. Une version raccourcie du CLAUDE.md prete a coller, sans rien perdre d'essentiel

Pas de questions. Tu as tout ce qu'il te faut.`;

// --- Copy helper ---
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-2 px-3 py-1 text-xs rounded bg-[#252118] hover:bg-[#2e2a24] text-[#8a8070] border border-[#2e2a24] transition-colors shrink-0 cursor-pointer"
    >
      {copied ? "Copie !" : (label || "Copier")}
    </button>
  );
}

// --- Step components ---

function StepInstall({ value, onChange, disclaimer, onDisclaimerChange }: { value: boolean | null; onChange: (v: boolean) => void; disclaimer: boolean; onDisclaimerChange: (v: boolean) => void }) {
  return (
    <div className="space-y-3">
      {[
        {
          val: true,
          label: "Oui, Claude Code est installé",
          sub: "Je l'utilise déjà dans mon terminal ou mon IDE",
        },
        {
          val: false,
          label: "Non, je pars de zéro",
          sub: "Je n'ai pas encore Claude Code — je veux savoir comment démarrer",
        },
      ].map((opt) => (
        <button
          key={String(opt.val)}
          onClick={() => onChange(opt.val)}
          className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer ${
            value === opt.val
              ? "border-[#D97B4F] bg-[rgba(217,123,79,0.08)] text-[#f0ead8]"
              : "border-[#2e2a24] bg-[#1e1b17] text-[#c8bfaa] hover:border-[#403a32]"
          }`}
        >
          <div className="font-semibold">{opt.label}</div>
          <div className={`text-sm mt-0.5 ${value === opt.val ? "text-[#D97B4F]" : "text-[#8a8070]"}`}>{opt.sub}</div>
        </button>
      ))}
      <label className="flex items-start gap-3 mt-4 cursor-pointer group">
        <div
          onClick={() => onDisclaimerChange(!disclaimer)}
          className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
            disclaimer ? "bg-[#D97B4F] border-[#D97B4F]" : "border-[#403a32] group-hover:border-[#403a32]"
          }`}
        >
          {disclaimer && <span className="text-white text-xs leading-none">✓</span>}
        </div>
        <span className="text-xs text-[#8a8070] leading-relaxed">
          Je comprends que ce setup modifie le comportement de Claude Code. ClaudeFast ne peut etre tenu responsable d&apos;un mauvais parametrage, d&apos;une suspension de compte ou de tout incident lie a l&apos;utilisation de ces configurations.
        </span>
      </label>
    </div>
  );
}

function InstallGuide() {
  const options = [
    {
      label: "Terminal (recommande)",
      description: "La version la plus puissante — tourne directement dans ton terminal.",
      cmd: "npm install -g @anthropic-ai/claude-code",
      note: "Nécessite Node.js 18+. Vérifie avec : node --version",
    },
  ];

  const ides = [
    {
      label: "Warp",
      description: "Terminal moderne avec IA intégrée — idéal pour débuter. Claude Code tourne nativement dedans.",
      url: "https://www.warp.dev",
      badge: "Recommande pour les non-devs",
    },
    {
      label: "VS Code",
      description: "Installe l'extension Claude Code depuis le marketplace VS Code.",
      url: "https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code",
      badge: "Pour les devs",
    },
    {
      label: "JetBrains (IntelliJ, WebStorm...)",
      description: "Plugin disponible dans le JetBrains Marketplace.",
      url: "https://plugins.jetbrains.com/plugin/24979-claude-code",
      badge: "Pour les devs",
    },
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.25)] rounded-xl p-4">
        <div className="font-semibold text-[#D97B4F] mb-1 text-sm">Avant tout : installe Claude Code</div>
        <p className="text-xs text-[rgba(217,123,79,0.85)] mb-3">Tu as besoin d&apos;un compte Anthropic et d&apos;une des options ci-dessous.</p>
        {options.map((o) => (
          <div key={o.label}>
            <div className="text-xs font-semibold text-[#D97B4F] mb-1">{o.label}</div>
            <code className="block text-xs text-[#D97B4F] bg-[#1a1713] border border-[rgba(217,123,79,0.25)] rounded-lg px-3 py-2 font-mono mb-1">
              {o.cmd}
            </code>
            <p className="text-xs text-[rgba(217,123,79,0.75)]">{o.note}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-[#8a8070] uppercase tracking-wider mb-2">Ou via un IDE</p>
        <div className="space-y-2">
          {ides.map((ide) => (
            <a
              key={ide.label}
              href={ide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-3 bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4 hover:border-[#403a32] transition-colors group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#f0ead8] text-sm">{ide.label}</span>
                  <span className="text-xs bg-[#252118] text-[#8a8070] px-2 py-0.5 rounded-full">{ide.badge}</span>
                </div>
                <div className="text-xs text-[#8a8070] mt-0.5">{ide.description}</div>
              </div>
              <span className="text-[#8a8070] group-hover:text-[#8a8070] transition-colors text-lg shrink-0">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepRole({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Founder d'un SaaS RH, DG d'une PME industrielle, Dev freelance React..."
          autoFocus
          className="w-full bg-[#1a1713] border border-[#2e2a24] rounded-lg px-4 py-3 text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] focus:ring-1 focus:ring-[#D97B4F] transition-colors"
        />
        <p className="text-xs text-[#8a8070] mt-2">Sois specifique — ca conditionne tout le setup genere</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "Founder SaaS B2B",
          "DG agence digitale",
          "Dev indie hacker",
          "Consultant freelance",
          "Directeur commercial",
          "Growth marketer",
          "Chef de projet",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onChange(suggestion)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all cursor-pointer ${
              value === suggestion
                ? "border-[#D97B4F] bg-[rgba(217,123,79,0.08)] text-[#D97B4F]"
                : "border-[#2e2a24] text-[#8a8070] hover:border-[#403a32] hover:text-[#c8bfaa] bg-[#1a1713]"
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepUseCase({ value, onChange }: { value: UseCaseSet; onChange: (v: UseCaseSet) => void }) {
  const cases: { id: UseCase; label: string; sub: string }[] = [
    { id: "strategy", label: "Strategie & decisions", sub: "Analyser, prioriser, structurer des plans" },
    { id: "content", label: "Content & redaction", sub: "Emails, posts, articles, copy" },
    { id: "code", label: "Dev & code", sub: "Features, bugs, reviews, architecture" },
    { id: "sales", label: "Sales & outreach", sub: "Prospection, DMs, sequences cold" },
    { id: "ops", label: "Ops & process", sub: "Process internes, reporting, delegation" },
  ];

  function toggle(id: UseCase) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#8a8070]">Selectione tout ce qui s&apos;applique</p>
      {cases.map((c) => {
        const selected = value.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              selected
                ? "border-[#D97B4F] bg-[rgba(217,123,79,0.08)] text-[#f0ead8]"
                : "border-[#2e2a24] bg-[#1e1b17] text-[#c8bfaa] hover:border-[#403a32]"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
              selected ? "bg-[#D97B4F] border-[#D97B4F]" : "border-[#403a32]"
            }`}>
              {selected && <span className="text-white text-xs leading-none">✓</span>}
            </div>
            <div>
              <div className="font-semibold">{c.label}</div>
              <div className={`text-sm mt-0.5 ${selected ? "text-[#D97B4F]" : "text-[#8a8070]"}`}>{c.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepContext({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div className="space-y-4">
      {[
        { key: "name" as const, label: "Ton prenom", placeholder: "Alex" },
        { key: "company" as const, label: "Ton entreprise / agence", placeholder: "Acme" },
        { key: "product" as const, label: "Ton projet principal", placeholder: "SaaS B2B, agence acquisition..." },
      ].map((f) => (
        <div key={f.key}>
          <label className="block text-sm text-[#8a8070] mb-1.5">{f.label}</label>
          <input
            type="text"
            value={data[f.key] as string}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full bg-[#1a1713] border border-[#2e2a24] rounded-lg px-4 py-3 text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] focus:ring-1 focus:ring-[#D97B4F] transition-colors"
          />
        </div>
      ))}
      <div className="border-t border-[#252118] pt-4">
        <label className="block text-sm text-[#8a8070] mb-1.5">
          Nom de ton agent <span className="text-[#8a8070]">(optionnel)</span>
        </label>
        <input
          type="text"
          value={data.agentName}
          onChange={(e) => onChange("agentName", e.target.value)}
          placeholder="Ex: Vik, Alex, Max..."
          className="w-full bg-[#1a1713] border border-[#2e2a24] rounded-lg px-4 py-3 text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] focus:ring-1 focus:ring-[#D97B4F] transition-colors"
        />
        <p className="text-xs text-[#8a8070] mt-1">Donne une identite a ton assistant — il s&apos;appellera ainsi dans toutes vos interactions</p>
      </div>
      <div>
        <label className="block text-sm text-[#8a8070] mb-1.5">
          Decris ton business en quelques phrases
        </label>
        <textarea
          value={data.context}
          onChange={(e) => onChange("context", e.target.value)}
          placeholder="Ex: On aide les agences B2B a generer des leads via cold email et LinkedIn. Nos clients sont des fondateurs de 5-20 personnes. Probleme principal : volume de leads insuffisant et sequences qui convertissent pas..."
          rows={4}
          className="w-full bg-[#1a1713] border border-[#2e2a24] rounded-lg px-4 py-3 text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] focus:ring-1 focus:ring-[#D97B4F] transition-colors resize-none text-sm"
        />
        <p className="text-xs text-[#8a8070] mt-1">Plus c&apos;est precis, meilleur sera le CLAUDE.md</p>
      </div>
    </div>
  );
}

function StepBlock({ number, title, subtitle, essential }: { number: number; title: string; subtitle: string; essential?: boolean }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${essential ? "bg-[#D97B4F] text-white" : "bg-[#252118] text-[#8a8070]"}`}>
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#f0ead8]">{title}</span>
          {essential && <span className="text-xs bg-[rgba(217,123,79,0.08)] text-[#D97B4F] border border-[rgba(217,123,79,0.25)] px-2 py-0.5 rounded-full">Essentiel</span>}
        </div>
        <p className="text-sm text-[#8a8070] mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe() {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.25)] rounded-xl p-4 text-center">
        <p className="text-sm text-[#D97B4F] font-medium">Tu es dans la liste.</p>
        <p className="text-xs text-[#8a8070] mt-0.5">Updates ClaudeFast + nouveaux MCPs chaque semaine.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
      <p className="text-sm font-medium text-[#f0ead8] mb-1">Rester à jour</p>
      <p className="text-xs text-[#8a8070] mb-3">Nouveaux MCPs, skills et updates ClaudeFast — une fois par semaine.</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && subscribe()}
          placeholder="ton@email.com"
          className="flex-1 bg-[#141210] border border-[#2e2a24] rounded-lg px-3 py-2 text-sm text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] transition-colors"
        />
        <button
          onClick={subscribe}
          disabled={status === "loading"}
          className="px-4 py-2 bg-[#D97B4F] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "..." : "OK"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-[rgba(217,123,79,0.75)] mt-1.5">Erreur — réessaie.</p>}
    </div>
  );
}

function SendReportBlock({ claudeMd, skills, mcps }: { claudeMd: string; skills: { label: string; installCmd: string }[]; mcps: { label: string; installCmd: string }[] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function send() {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, claudeMd, skills, mcps }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.25)] rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-[#D97B4F]">Setup envoyé.</p>
        <p className="text-xs text-[#8a8070] mt-0.5">Vérifie ta boîte mail — CLAUDE.md + skills + MCPs.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
      <p className="text-sm font-medium text-[#f0ead8] mb-1">Recevoir le setup par email</p>
      <p className="text-xs text-[#8a8070] mb-3">CLAUDE.md + commandes d'installation — dans ta boîte.</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="ton@email.com"
          className="flex-1 bg-[#141210] border border-[#2e2a24] rounded-lg px-3 py-2 text-sm text-[#f0ead8] placeholder-[#6a6058] focus:outline-none focus:border-[#D97B4F] transition-colors"
        />
        <button
          onClick={send}
          disabled={status === "loading"}
          className="px-4 py-2 bg-[#D97B4F] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "..." : "Envoyer"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-[rgba(217,123,79,0.75)] mt-1.5">Erreur — réessaie.</p>}
    </div>
  );
}

function StepResults({ data, claudeMd, loading }: { data: FormData; claudeMd: string; loading: boolean }) {
  const [showAllMcps, setShowAllMcps] = useState(false);

  const skillIds = getRecommendedSkills(data.useCases);
  const skills = skillIds.map((id) => SKILLS[id]).filter(Boolean);
  const essentialSkills = skills.filter(s => ["setup-wizard", "superpowers"].includes(s.id));
  const bonusSkills = skills.filter(s => !["setup-wizard", "superpowers"].includes(s.id));
  const allSkillCmds = skills.map((s) => s.installCmd).join(" && \\\n");

  const mcpIds = getRecommendedMCPs(data.useCases);
  const mcps = mcpIds.map((id) => MCPS[id]).filter(Boolean);
  const visibleMcps = showAllMcps ? mcps : mcps.slice(0, 3);

  return (
    <div className="space-y-8">

      {/* Installation si pas encore installé */}
      {!data.installed && <InstallGuide />}

      {/* Etape 1 — CLAUDE.md */}
      <div>
        <StepBlock number={1} title="Colle ton CLAUDE.md" subtitle="Le fichier qui donne à Claude le contexte de ton business" essential />
        {loading ? (
          <div className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-8 flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#D97B4F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#8a8070]">Claude génère ton fichier...</p>
          </div>
        ) : (
          <>
            <div className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
              <pre className="text-xs text-[#a09080] font-mono whitespace-pre-wrap overflow-auto max-h-52">
                {claudeMd}
              </pre>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-[#8a8070]">
                Sauvegarde dans <code className="text-[#8a8070] bg-[#252118] px-1 rounded">~/.claude/CLAUDE.md</code> pour qu&apos;il soit actif partout
              </p>
              {claudeMd && <CopyButton text={claudeMd} label="Copier le fichier" />}
            </div>
          </>
        )}
      </div>

      {/* Etape 2 — Skills */}
      <div>
        <StepBlock number={2} title="Installe les skills" subtitle="Des comportements avancés activables avec /commande dans Claude" essential />
        <div className="space-y-2">
          {essentialSkills.map((skill) => (
            <div key={skill.id} className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f0ead8] text-sm">{skill.label}</span>
                    {skill.expert && <span className="text-xs bg-[rgba(217,123,79,0.08)] text-[rgba(217,123,79,0.75)] border border-[rgba(217,123,79,0.25)] px-2 py-0.5 rounded-full">Expertise requise</span>}
                  </div>
                  <div className="text-xs text-[#8a8070] mt-0.5">{skill.description}</div>
                </div>
                <CopyButton text={skill.installCmd} />
              </div>
              <code className="block mt-2 text-xs text-[#8a8070] bg-[#1a1713] border border-[#2e2a24] rounded-lg p-2.5 font-mono break-all">
                {skill.installCmd}
              </code>
            </div>
          ))}
          {bonusSkills.length > 0 && (
            <>
              <p className="text-xs text-[#8a8070] pt-1 pl-1">Recommandes pour ton profil</p>
              {bonusSkills.map((skill) => (
                <div key={skill.id} className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[#f0ead8] text-sm">{skill.label}</div>
                      <div className="text-xs text-[#8a8070] mt-0.5">{skill.description}</div>
                    </div>
                    <CopyButton text={skill.installCmd} />
                  </div>
                  <code className="block mt-2 text-xs text-[#8a8070] bg-[#1a1713] border border-[#2e2a24] rounded-lg p-2.5 font-mono break-all">
                    {skill.installCmd}
                  </code>
                </div>
              ))}
            </>
          )}
        </div>
        {skills.length > 1 && (
          <div className="bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.25)] rounded-xl p-3 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D97B4F]">Installer tous les skills d&apos;un coup</span>
              <CopyButton text={allSkillCmds} label="Tout copier" />
            </div>
          </div>
        )}
      </div>

      {/* Etape 3 — MCPs */}
      <div>
        <StepBlock number={3} title="Connecte tes outils via MCP" subtitle="Donne à Claude un accès direct à tes apps — optionnel mais puissant" />
        <div className="space-y-2">
          {visibleMcps.map((mcp) => (
            <div key={mcp.id} className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#f0ead8] text-sm">{mcp.label}</div>
                  <div className="text-xs text-[#8a8070] mt-0.5">{mcp.description}</div>
                </div>
                <CopyButton text={mcp.installCmd} />
              </div>
              <code className="block mt-2 text-xs text-[#8a8070] bg-[#1a1713] border border-[#2e2a24] rounded-lg p-2.5 font-mono break-all">
                {mcp.installCmd}
              </code>
              {mcp.note && (
                <p className="text-xs text-[rgba(217,123,79,0.75)] bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.15)] rounded-lg px-3 py-1.5 mt-2">{mcp.note}</p>
              )}
            </div>
          ))}
        </div>
        {mcps.length > 3 && (
          <button
            onClick={() => setShowAllMcps(v => !v)}
            className="mt-3 w-full py-2 text-sm text-[#8a8070] hover:text-[#a09080] border border-[#2e2a24] rounded-xl transition-colors cursor-pointer"
          >
            {showAllMcps ? "Voir moins" : `Voir ${mcps.length - 3} autres MCPs recommandes`}
          </button>
        )}
      </div>

      {/* Verification */}
      <div className="bg-[#1a1713] border border-[#2e2a24] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#c8bfaa]">Verifier ton installation</span>
          <CopyButton text={VERIFY_CMD} />
        </div>
        <code className="block text-xs text-[#8a8070] font-mono break-all">
          {VERIFY_CMD}
        </code>
      </div>

      {/* Audit prompt */}
      <div className="bg-[rgba(217,123,79,0.08)] border border-[rgba(217,123,79,0.25)] rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-sm font-semibold text-[#D97B4F]">Auditer ton setup existant</span>
            <p className="text-xs text-[#D97B4F] mt-0.5">Colle ce prompt dans Claude Code — il analyse et recommande sans rien toucher</p>
          </div>
          <CopyButton text={AUDIT_PROMPT} label="Copier le prompt" />
        </div>
      </div>

      {/* Sponsor */}
      {!loading && <SponsorBlock />}

      {/* Envoyer le rapport */}
      {!loading && claudeMd && (
        <SendReportBlock
          claudeMd={claudeMd}
          skills={skills.map(s => ({ label: s.label, installCmd: s.installCmd }))}
          mcps={mcps.map(m => ({ label: m.label, installCmd: m.installCmd }))}
        />
      )}

      {/* Email capture newsletter */}
      <EmailCapture />

      {/* Footer */}
      <div className="border-t border-[#252118] pt-4 text-center space-y-1">
        <p className="text-sm text-[#8a8070]">
          Par{" "}
          <a href="https://hypergrowth.fr" target="_blank" rel="noopener noreferrer" className="text-[#D97B4F] hover:opacity-70 transition-opacity">
            HyperGrowth
          </a>
          {" "}· voir aussi{" "}
          <a href="https://mcpfast.xyz" target="_blank" rel="noopener noreferrer" className="text-[#D97B4F] hover:opacity-70 transition-opacity">
            MCPFast
          </a>
        </p>
        <p className="text-xs text-[#8a8070]">
          Tu transcris des reunions ou interviews ?{" "}
          <a href="https://fastscribe.io" target="_blank" rel="noopener noreferrer" className="text-[#D97B4F] hover:opacity-70 transition-opacity">
            Essaie FastScribe
          </a>
        </p>
      </div>
    </div>
  );
}

// --- Main ---
export default function Home() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    installed: null,
    disclaimer: false,
    role: "",
    useCases: [],
    name: "",
    company: "",
    product: "",
    context: "",
    agentName: "",
  });
  const [claudeMd, setClaudeMd] = useState("");
  const [generating, setGenerating] = useState(false);

  const steps = [
    { title: "Claude Code est installe ?", subtitle: "Pour adapter les instructions a ta situation" },
    { title: "Quel est ton role ?", subtitle: "Pour recommander les bons comportements Claude" },
    { title: "Usage principal", subtitle: "Comment tu utilises Claude au quotidien" },
    { title: "Ton contexte", subtitle: "Pour generer ton CLAUDE.md personnalise" },
    { title: "Ton setup Claude Code", subtitle: "Commandes pretes a coller dans ton terminal" },
  ];

  const canNext =
    (step === 0 && form.installed !== null && form.disclaimer) ||
    (step === 1 && form.role.trim().length > 0) ||
    (step === 2 && form.useCases.length > 0) ||
    (step === 3 && form.name.trim().length > 0 && form.company.trim().length > 0 && form.product.trim().length > 0);

  function handleChange(key: keyof FormData, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const generate = useCallback(async () => {
    setGenerating(true);
    setClaudeMd("");
    setStep(4);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setClaudeMd(data.claudeMd || generateClaudeMd(form));
    } catch {
      setClaudeMd(generateClaudeMd(form));
    } finally {
      setGenerating(false);
    }
  }, [form]);

  return (
    <div className="min-h-screen text-[#f0ead8] flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-lg mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 mb-8">
          <span className="text-xl font-bold tracking-tight text-[#f0ead8]" style={{ fontFamily: "var(--font-serif)" }}>ClaudeFast</span>
          <span className="text-xs text-[#D97B4F] font-semibold tracking-widest uppercase mt-1">beta</span>
        </div>
        <h1 className="text-3xl font-bold mb-3 leading-snug" style={{ fontFamily: "var(--font-serif)" }}>
          Configure Claude Code<br /><span className="italic text-[#D97B4F]">en 2 minutes.</span>
        </h1>
        <p className="text-[#8a8070]">
          3 questions. Ton CLAUDE.md personnalisé, tes skills et MCPs — prêts à coller.
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="w-full max-w-lg mb-6">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-[#D97B4F]" : "bg-[#2e2a24]"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#8a8070] mt-2">Etape {step + 1} sur 4</p>
        </div>
      )}

      {/* Card */}
      <div className="step-card w-full max-w-lg bg-[#1e1b17] border border-[#2e2a24] rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#f0ead8]" style={{ fontFamily: "var(--font-serif)" }}>{steps[step].title}</h2>
          <p className="text-sm text-[#8a8070] mt-1">{steps[step].subtitle}</p>
        </div>

        {step === 0 && (
          <StepInstall
            value={form.installed}
            onChange={(v) => setForm((p) => ({ ...p, installed: v }))}
            disclaimer={form.disclaimer}
            onDisclaimerChange={(v) => setForm((p) => ({ ...p, disclaimer: v }))}
          />
        )}
        {step === 1 && (
          <StepRole value={form.role} onChange={(v) => setForm((p) => ({ ...p, role: v }))} />
        )}
        {step === 2 && (
          <StepUseCase value={form.useCases} onChange={(v) => setForm((p) => ({ ...p, useCases: v }))} />
        )}
        {step === 3 && <StepContext data={form} onChange={handleChange} />}
        {step === 4 && <StepResults data={form} claudeMd={claudeMd} loading={generating} />}

        {/* Nav */}
        {step < 4 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 rounded-xl border border-[#2e2a24] text-[#8a8070] hover:border-[#403a32] hover:text-[#c8bfaa] transition-colors text-sm cursor-pointer"
              >
                Retour
              </button>
            )}
            <button
              onClick={() => {
                if (!canNext) return;
                if (step === 3) generate();
                else setStep((s) => s + 1);
              }}
              disabled={!canNext}
              className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                canNext
                  ? "bg-[#D97B4F] hover:bg-[rgba(217,123,79,0.08)]0 text-white cursor-pointer"
                  : "bg-[#252118] text-[#8a8070] cursor-not-allowed"
              }`}
            >
              {step === 3 ? "Generer mon setup" : "Continuer"}
            </button>
          </div>
        )}

        {step === 4 && !generating && (
          <button
            onClick={() => {
              setStep(0);
              setForm({ installed: null, disclaimer: false, role: "", useCases: [], name: "", company: "", product: "", context: "", agentName: "" });
              setClaudeMd("");
            }}
            className="mt-6 w-full px-5 py-2.5 rounded-xl border border-[#2e2a24] text-[#8a8070] hover:border-[#403a32] hover:text-[#a09080] transition-colors text-sm cursor-pointer"
          >
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
