// Vercel serverless function — recebe o formulário de contato e envia por e-mail via Resend.
// Requer a variável de ambiente RESEND_API_KEY configurada no painel da Vercel.
const dns = require("dns").promises;

// domínios extra liberados além do próprio host (ex.: preview deploys), se precisar
const ALLOWED_ORIGINS = [];

// ponytail: rate limit em memória por instância, zera em cold start e não é
// compartilhado entre instâncias. Se precisar de limite real entre instâncias,
// trocar por Upstash Redis (Vercel Marketplace).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const origin = req.headers.origin || req.headers.referer || "";
  const sameHost = origin && req.headers.host && origin.includes(req.headers.host);
  if (!sameHost && !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    return res.status(403).json({ error: "Origem não permitida." });
  }

  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Muitas tentativas. Aguarde um minuto." });
  }

  const { name, email, subject, message, company } = req.body || {};

  if (company) {
    // honeypot preenchido só por bots: responde ok sem enviar e-mail
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }
  if (name.length > 100 || subject.length > 150 || message.length > 2000 || email.length > 150) {
    return res.status(400).json({ error: "Campo excede o tamanho máximo." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  const domain = email.split("@")[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return res.status(400).json({ error: "Domínio de e-mail não recebe mensagens." });
    }
  } catch {
    return res.status(400).json({ error: "Domínio de e-mail inválido ou inexistente." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY não configurada.");
    return res.status(500).json({ error: "Configuração do servidor incompleta." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Site LeafCore <onboarding@resend.dev>",
        to: "felipemacielfolhaverde@gmail.com",
        reply_to: email,
        subject: `[Site] ${subject}`,
        text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend error:", detail);
      return res.status(502).json({ error: "Falha ao enviar o e-mail." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro inesperado ao enviar." });
  }
};
