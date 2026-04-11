const SITE_URL = 'https://claudefast.vercel.app'

function emailShell(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,'Times New Roman',serif;">
<span style="display:none;max-height:0;overflow:hidden;">${preheader}&nbsp;&zwnj;&nbsp;</span>

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- Top rules -->
    <tr><td style="border-top:3px solid #141210;padding-top:2px;">
      <div style="border-top:1px solid #141210;margin-bottom:20px;"></div>
    </td></tr>

    <!-- Nameplate -->
    <tr><td style="text-align:center;padding-bottom:20px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#D97B4F;">ClaudeFast</p>
      <h1 style="margin:0;font-size:36px;font-weight:900;color:#141210;letter-spacing:-0.02em;line-height:1.1;">${title}</h1>
    </td></tr>

    <!-- Bottom rules -->
    <tr><td style="border-bottom:1px solid #141210;padding-bottom:2px;">
      <table width="100%"><tr><td style="border-bottom:3px solid #141210;"></td></tr></table>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:32px 0;">
      ${body}
    </td></tr>

    <!-- Footer -->
    <tr><td style="border-top:1px solid #c8bfaa;padding-top:20px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;color:#7a7568;line-height:1.6;">
        Généré sur <a href="${SITE_URL}" style="color:#D97B4F;">${SITE_URL}</a>
      </p>
      <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#a09080;line-height:1.6;">
        © ${new Date().getFullYear()} FastScribe SAS — 200 Rue de la Croix Nivert, 75015 Paris, France<br />
        ClaudeFast est un produit de FastScribe SAS. Contact : <a href="mailto:privacy@fastscribe.io" style="color:#a09080;">privacy@fastscribe.io</a>
      </p>
    </td></tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}

interface SkillItem {
  label: string
  installCmd: string
}
interface McpItem {
  label: string
  installCmd: string
}

function codeBlock(code: string) {
  return `<div style="background:#1e1b17;border-radius:4px;padding:12px 16px;margin:8px 0 0;">
    <code style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#D97B4F;white-space:pre-wrap;word-break:break-all;">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code>
  </div>`
}

export function reportEmail(claudeMd: string, skills: SkillItem[], mcps: McpItem[]) {
  const skillRows = skills.map(s => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ddd8ce;vertical-align:top;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#D97B4F;">${s.label}</p>
        ${codeBlock(s.installCmd)}
      </td>
    </tr>
  `).join('')

  const mcpRows = mcps.map(m => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ddd8ce;vertical-align:top;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#141210;">${m.label}</p>
        ${codeBlock(m.installCmd)}
      </td>
    </tr>
  `).join('')

  const body = `
    <p style="margin:0 0 24px;font-size:14px;color:#5a5245;line-height:1.75;font-family:Arial,sans-serif;">
      Voici ton setup Claude Code complet. Colle le CLAUDE.md, installe les skills, puis connecte tes outils via MCP.
    </p>

    <!-- CLAUDE.md -->
    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#a09080;">
      1 — Ton CLAUDE.md
    </p>
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;color:#5a5245;line-height:1.5;">
      Sauvegarde dans <code style="background:#e8e2d8;padding:1px 5px;border-radius:2px;font-size:10px;">~/.claude/CLAUDE.md</code>
    </p>
    <div style="background:#1e1b17;border-radius:4px;padding:16px;margin:8px 0 28px;max-height:300px;overflow:hidden;">
      <pre style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#f0ead8;white-space:pre-wrap;word-break:break-all;line-height:1.6;">${claudeMd.replace(/</g,'&lt;').replace(/>/g,'&gt;').substring(0, 2000)}${claudeMd.length > 2000 ? '\n...' : ''}</pre>
    </div>

    <!-- Skills -->
    ${skills.length > 0 ? `
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#a09080;">
      2 — Skills à installer
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">${skillRows}</table>
    ` : ''}

    <!-- MCPs -->
    ${mcps.length > 0 ? `
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#a09080;">
      3 — MCPs à connecter
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">${mcpRows}</table>
    ` : ''}

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
      <tr><td style="background:#141210;border-radius:3px;">
        <a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f0ead8;text-decoration:none;">Revenir sur ClaudeFast →</a>
      </td></tr>
    </table>
  `

  return {
    subject: 'Ton setup Claude Code est prêt',
    html: emailShell('Ton setup.', 'CLAUDE.md + skills + MCPs — tout est là.', body),
  }
}
