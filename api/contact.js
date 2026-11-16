// Vercel serverless function — recebe o formulário de contato e envia por e-mail via Resend.
// Requer a variável de ambiente RESEND_API_KEY configurada no painel da Vercel.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
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
