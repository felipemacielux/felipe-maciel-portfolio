# CLAUDE.md — Portfólio(Felipe Maciel)

Portfólio de uma página, estático (HTML + CSS + JS puro). Réplica fiel de um template Next.js/Tailwind
(tema escuro, gradiente azul→roxo→rosa, fonte JetBrains Mono) que está em docs/template_site.html, com textos do meu curriculo.
**Objetivo do site:** converter visitantes (donos de pequenos negócios) em pedidos de orçamento para sistemas

## Regras para o Claude Code
1. **Não mude layout, cores, espaçamentos nem a estrutura das seções** (Hero → Sobre → Experiência → Contato). Só textos, links e imagens.
2. Todo estilo vem de `css/tailwind.css` (Tailwind **já compilado**, só tem as classes usadas). Se precisar de uma classe nova, escreva em `css/custom.css` — não há build de Tailwind.
3. Dados de contato ficam **só** em `js/config.js`. Textos ficam em `index.html`.
4. Tom de copy: português do Brasil, direto, benefício antes de tecnologia, sem jargão para o cliente final. Verbos no presente, 1ª pessoa.
5. Nunca invente números, clientes ou depoimentos. Se faltar dado, deixe como está e avise.
6. Mantenha acessibilidade (alt em imagens, labels, contraste) e responsividade (testar 390px e 1440px).

## Estrutura
```
index.html            # todo o conteúdo (nav, hero, stats, sobre, experiência, contato)
css/tailwind.css      # utilitários compilados do template (não editar à mão)
css/custom.css        # animações de entrada, menu mobile, typewriter, 3D, formulário
js/config.js          # WhatsApp, e-mail, LinkedIn, GitHub, mensagem do botão
js/main.js            # menu mobile, typewriter, contadores, reveal, formulário, lazy-load do 3D
src/desk3d.js         # cena three.js (bancada dev, arrastável) — fonte
js/desk3d.bundle.js   # gerado: `npm install && npm run build:3d`
assets/               # logo.svg, foto.svg (placeholder), logos das experiências, contato.svg, desk-poster.png
```
Rodar localmente: `npm run dev` (serve em http://localhost:3000) ou abrir `index.html` direto.
Publicar: qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, GitHub Pages) — sem build obrigatório.

## Como cada seção é preenchida (o que o Claude Code deve alterar)
| Seção | Onde | Observação |
|---|---|---|
| Título/Descrição SEO | `<head>` de `index.html` | `<title>`, `description`, `og:*` |
| Hero: frase animada | `#typewriter[data-words]` | Máx. ~17 caracteres por palavra (não quebrar linha em telas grandes) |
| Hero: subtítulo | `<p>` do hero | 1–2 frases: para quem + resultado + convite |
| Botão principal | `#ctaPrimary` | Link vem de `config.js` (WhatsApp) |
| Estatísticas | `<span data-count="N">` + rótulo | 4 itens; só números reais |
| Sobre | `#about` | 2 parágrafos; destaques em gradiente = `<span class="text-transparent ... from-red-500 to-yellow-500">` |
| Experiência | `#experience` `<li data-reveal="up">` | Copiar um `<li>` para adicionar; badge "Atual" só nos vigentes |
| Contato | `#contact` | Formulário abre WhatsApp (ou e-mail) com a mensagem pronta |
| Cena 3D | `src/desk3d.js` | Opcional; rebuild com `npm run build:3d` |

## Fonte de verdade: currículo (`docs/FelipeMaciel.pdf`)
Todo conteúdo factual do site vem do currículo. Se algo não estiver aqui ou no PDF, **não escreva** — pergunte.
Regra de adaptação: o currículo é técnico (para recrutador); o site fala com **dono de pequeno negócio**. Mantenha os fatos, traduza o jargão em benefício
(ex.: "Docker + Nginx + CI/CD em VPS" → "sistema no ar, atualizado sem parar a sua loja"). Detalhe técnico vai em "chips/linhas de stack", não no texto principal.

### Mapa: currículo → seção do site
| Currículo | Vai para | Como |
|---|---|---|
| Nome, GitHub, LinkedIn | `js/config.js` + `<title>` | GitHub e LinkedIn já preenchidos abaixo |
| Resumo profissional | Hero (subtítulo) + Sobre (2 parágrafos) | Reescrever para o cliente; manter "ponte entre infraestrutura e software" e "IA/automação" como diferenciais |
| Competências | Sobre (destaques em gradiente) | Escolher 6–8 termos fortes: Python, FastAPI, React, PostgreSQL, Docker, CI/CD, AWS, Grafana |
| Exp. LeafCore | Experiência (1º item) | Bullets: PDV+ERP do zero à produção; stack; arquitetura OpenAPI/JWT; transações ACID (dados de pedidos/estoque íntegros) |
| Exp. Analista TI Jr | Experiência (2º item) | Usar os resultados mensuráveis (40% menos tempo de resposta a incidentes; automação; AD/IAM) |
| Formação | Experiência (4º item, estilo educação) | Fatec Franca, ADS, ago/2020–jul/2023 |
| Projetos | **Nova subseção opcional dentro de Experiência** (mesmo card `<li data-reveal="up">`) ou 3 itens extras na timeline | Kiosk (−70% chamados), Dell CCTK, Agente CLI RAG (em andamento) |
| Cursos e certificações | Linha de "chips" no Sobre ou contador | Fortinet ×3, DIO ×5, Udemy, Codar.me = 10 |
| Idiomas | Sobre (1 linha) | Inglês intermediário |

### Dados do currículo (estruturados — use estes)
```yaml
nome: Felipe Maciel Folha Verde
marca: LeafCore
github: https://github.com/felipemacielux
linkedin: https://www.linkedin.com/in/felipe-maciel-839915196/
resumo: >
  Engenheiro de Software e especialista em infraestrutura de TI, com foco em automação, DevOps e soluções
  com IA. Faz a ponte entre infraestrutura robusta e desenvolvimento ágil; projeta ambientes escaláveis,
  resilientes e observáveis.
leafcore:
  cargo: Fullstack & DevOps Engineer
  periodo: Abril 2026 - atual
  local: Remoto
  entrega: Sistemas de gestão comercial (PDV + ERP) para pequenas empresas, do zero à produção
  backend: Python 3.12, FastAPI, SQLAlchemy assíncrono, PostgreSQL, Redis
  frontend: Electron + React + TypeScript (PDV); React Web (ERP)
  infra: Docker, Nginx, CI/CD com GitHub Actions, deploy em VPS
  arquitetura: Orientada a especificação (OpenAPI), autenticação JWT + chave de API
  dados: Transações ACID garantindo integridade de pedidos e estoque
loja_do_mecanico:
  cargo: Analista de TI Jr (foco em automação e infraestrutura)
  periodo: Maio 2023 - atual
  destaques:
    - Scripts de automação (Shell/Python) eliminando gargalos manuais
    - Painéis Grafana com alertas proativos; ~40% menos tempo médio de resposta a incidentes
    - Automação de atualizações de hardware (Dell CCTK) sem impactar o usuário
    - IAM centralizado via Active Directory, com políticas de segurança e controle de acesso
    - Padronização de procedimentos e relatórios operacionais
  atendimento_ao_cliente: Out 2021 - Mai 2023
formacao: Análise e Desenvolvimento de Sistemas — Fatec Franca (Ago 2020 - Jul 2023)
projetos:
  - nome: From Boot to Kiosk (Debian + Shell Script)
    periodo: Mai-Jun 2025
    resultado: ~70% menos chamados de suporte para reinicializar painéis de atendimento
  - nome: Eficiência energética e automação de hardware (Dell CCTK)
    periodo: Mai-Jun 2025
    resultado: Menor custo operacional; atualizações críticas nas janelas agendadas
  - nome: Agente CLI de suporte técnico com IA (RAG)
    status: em andamento
    stack: Python, RAG, AWS EC2, Grafana
    resumo: Consulta documentação PDF complexa; telemetria de latência, tokens e precisão no Grafana
certificacoes: [Fortinet x3 (2025), Digital Innovation One x5 (2025-2026), Udemy Arquitetura de Redes (2025), Codar.me Python (2025)]
idiomas: Inglês intermediário
```

### Números reais para o hero (substituem os placeholders)
- `3+` anos de experiência em TI (desde mai/2023)
- `70%` menos chamados de suporte (projeto Kiosk) — use `data-count="70"` com sufixo `%`
- `40%` menos tempo de resposta a incidentes (Grafana) — idem
- `10` cursos e certificações
Escolha 4 e ajuste os rótulos. Sufixo: troque o `+` fixo no HTML por `%` onde for percentual.

### Divergências a corrigir no `index.html` (o primeiro rascunho usou dados genéricos)
- LeafCore: local é **Remoto** (hoje está "Franca, SP").
- Atendimento ao Cliente: **Out 2021 – Mai 2023** (hoje "2021 - 2023").
- Fatec: **Ago 2020 – Jul 2023** (hoje "Concluído em 2023").
- Loja do Mecânico: usar os bullets reais acima no lugar dos genéricos.
- Hero/typewriter: pode incluir "Engenheiro DevOps" e "Automação com IA" (cabem em ≤17 caracteres: "Automação + IA").

## Hospedagem (Vercel)
Site 100% estático: **não precisa de build nem de `vercel.json`**.
1. Suba o repositório no GitHub (`node_modules/` já está no `.gitignore`; commite `js/desk3d.bundle.js`).
2. Vercel → *Add New Project* → importe o repositório → Framework Preset **Other**, Build Command **vazio**, Output Directory **`.`** (raiz).
3. Deploy. Cada `git push` na `main` republica sozinho. Domínio próprio: *Settings → Domains*.
Se alterar `src/desk3d.js`, rode `npm run build:3d` e commite o bundle (ou defina Build Command `npm run build:3d` na Vercel).
Antes de publicar: preencher `js/config.js` (WhatsApp/e-mail), trocar `assets/foto.svg` pela foto real e conferir Lighthouse no mobile.

## Briefing complementar (não está no currículo)
- WhatsApp (+55 (16) 99321-2762) e e-mail comercial → felipemacielfolhaverde@gmail.com `js/config.js`
- Foto de perfil (foto_perfil) em docs assim como a logo oficial da LeafCore (leaf_core_logo) e da Loja do mecânico (loja_do_mecanico_logo)
- Público-alvo (tipos de negócio) seguir com base no que já é informado no curriculo.

## Prompt pronto para colar no Claude Code
```
Leia o CLAUDE.md e o docs/curriculo.pdf. Siga as regras: não altere layout, cores nem estrutura.
Use o currículo como fonte de verdade e o mapa "currículo → seção" do CLAUDE.md para atualizar index.html
(textos, SEO, estatísticas, experiência, sobre, projetos) e js/config.js (contatos), corrigindo as divergências listadas.
Reescreva o tom técnico do currículo para dono de pequeno negócio. Não invente dados: onde faltar informação, mantenha o texto atual
e liste no final o que ficou pendente. Depois, rode `npm run dev` e confira 390px e 1440px.

BRIEFING:
<cole aqui as respostas da seção "Briefing" acima>
```