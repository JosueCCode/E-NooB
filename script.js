const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const state = {
  route: "feed",
  auth: "login",
  modal: null,
  loading: false,
  tab: "mes",
  theme: localStorage.getItem("casa-clara-theme") || "light"
};

const themes = [
  ["light", "Claro", "CL"],
  ["dark", "Escuro", "ES"],
  ["contrast", "Alto contraste", "AC"],
  ["blue-dark", "Azul escuro", "AZ"]
];

const navItems = [
  ["feed", "P", "Pagina principal"],
  ["dia", "D", "Resumo do dia"],
  ["calendario", "C", "Calendario financeiro"],
  ["transacoes", "T", "Transacoes"],
  ["contas", "B", "Contas bancarias"],
  ["metas", "M", "Metas financeiras"],
  ["relatorios", "R", "Relatorios"],
  ["planejamento", "L", "Planejamento"],
  ["ia", "IA", "IA financeira"],
  ["perfil", "U", "Perfil"],
  ["configuracoes", "S", "Configuracoes"]
];

const mobileNav = [
  ["feed", "P", "Inicio"],
  ["transacoes", "T", "Gastos"],
  ["metas", "M", "Metas"],
  ["ia", "IA", "IA"],
  ["perfil", "U", "Perfil"]
];

const feedCards = [
  {
    type: "warn",
    icon: "!",
    time: "Agora",
    title: "Hoje voce gastou mais com delivery.",
    text: "Foram R$ 86,40 em tres pedidos. Isso esta 28% acima da sua media de terca-feira.",
    action: "Criar limite de delivery"
  },
  {
    type: "good",
    icon: "+",
    time: "10:42",
    title: "Tudo certo. Seu saldo continua saudavel.",
    text: "Mesmo com as saidas da manha, a previsao para sexta fica positiva em R$ 1.340.",
    action: "Ver previsao"
  },
  {
    type: "violet",
    icon: "~",
    time: "09:10",
    title: "Comportamento incomum detectado.",
    text: "A conta de energia ficou R$ 41 mais alta que nos ultimos dois meses. Quer acompanhar essa categoria?",
    action: "Acompanhar energia"
  },
  {
    type: "good",
    icon: "*",
    time: "Ontem",
    title: "Voce economizou comparado a semana passada.",
    text: "Mercado e transporte cairam juntos. A economia estimada foi de R$ 132,00.",
    action: "Ver comparativo"
  },
  {
    type: "danger",
    icon: "-",
    time: "Segunda",
    title: "Assinatura duplicada encontrada.",
    text: "Dois servicos de streaming foram cobrados no mesmo dia. A IA marcou isso para revisao.",
    action: "Revisar cobrancas"
  }
];

const transactions = [
  ["Mercado Boa Compra", "Alimentacao · hoje 12:31", -248.9, "A"],
  ["Salario", "Entrada · hoje 09:00", 5400, "S"],
  ["Transporte por app", "Transporte · ontem", -37.5, "T"],
  ["Farmacia", "Saude · ontem", -82.2, "F"],
  ["Freelance design", "Entrada · segunda", 760, "D"],
  ["Streaming", "Assinaturas · segunda", -39.9, "P"]
];

const categories = [
  ["Alimentacao", "32% do mes", 1248, "A"],
  ["Moradia", "28% do mes", 1090, "M"],
  ["Transporte", "14% do mes", 548, "T"],
  ["Lazer", "9% do mes", 350, "L"],
  ["Saude", "6% do mes", 238, "S"]
];

const goals = [
  ["Reserva de emergencia", "R$ 8.400 de R$ 12.000", 70, "green"],
  ["Viagem em familia", "R$ 2.100 de R$ 5.000", 42, "blue"],
  ["Trocar notebook", "R$ 1.320 de R$ 4.400", 30, "yellow"]
];

function setRoute(route) {
  state.route = route;
  state.loading = true;
  render();
  window.setTimeout(() => {
    state.loading = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 260);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem("casa-clara-theme", theme);
  render();
  showToast(`Skin alterada para ${themes.find(([id]) => id === theme)?.[1] || "tema"}`);
}

function themeSwitcher(compact = false) {
  return `
    <div class="theme-switcher" aria-label="Skins do site">
      ${compact ? "" : "<small>Skin do site</small>"}
      <div class="theme-options">
        ${themes.map(([id, label, short]) => `
          <button class="theme-button ${state.theme === id ? "active" : ""}" onclick="setTheme('${id}')" title="${label}" aria-label="${label}">
            <span class="theme-swatch ${id}" aria-hidden="true"></span>
            ${compact ? "" : `<span class="sr-only">${short}</span>`}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function openModal(kind) {
  state.modal = kind;
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

function icon(text, cls = "nav-icon") {
  return `<span class="${cls}" aria-hidden="true">${text}</span>`;
}

function nav(items, mobile = false) {
  return items.map(([route, marker, label]) => `
    <button class="nav-button ${state.route === route ? "active" : ""}" onclick="setRoute('${route}')" title="${label}">
      ${icon(marker)}
      <span>${label}</span>
    </button>
  `).join("");
}

function authScreen() {
  const isLogin = state.auth === "login";
  const isSignup = state.auth === "cadastro";
  const title = isLogin ? "Entrar na Casa Clara" : isSignup ? "Criar sua conta" : "Recuperar acesso";
  const button = isLogin ? "Entrar" : isSignup ? "Comecar onboarding" : "Enviar link";
  return `
    <main class="auth-screen">
      <section class="auth-panel">
        <div class="auth-logo brand">
          <span class="brand-mark">CC</span>
          <div><strong>Casa Clara</strong><span>feed inteligente de financas</span></div>
        </div>
        <p class="eyebrow">${isSignup ? "Cadastro" : isLogin ? "Login" : "Recuperacao"}</p>
        <h1>${title}</h1>
        <p>Veja sua rotina financeira como uma linha do tempo simples, visual e facil de consumir.</p>
        <form class="form" onsubmit="event.preventDefault(); ${isSignup ? "openModal('onboarding')" : "setRoute('feed')"}">
          ${isSignup ? `<label class="field"><span>Nome</span><input placeholder="Seu nome" required></label>` : ""}
          <label class="field"><span>E-mail</span><input type="email" placeholder="voce@email.com" required></label>
          ${state.auth !== "recuperar" ? `<label class="field"><span>Senha</span><input type="password" placeholder="••••••••" required></label>` : ""}
          <button class="primary-button" type="submit">${button}</button>
        </form>
        <div class="button-row" style="margin-top:14px">
          <button class="ghost-button" onclick="state.auth='login'; render()">Login</button>
          <button class="ghost-button" onclick="state.auth='cadastro'; render()">Cadastro</button>
          <button class="ghost-button" onclick="state.auth='recuperar'; render()">Esqueci a senha</button>
        </div>
      </section>
      <section class="auth-art">
        <div class="phone-preview">
          <div class="phone-screen">
            ${feedCards.slice(0, 3).map(card => feedCard(card)).join("")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function appShell() {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-mark">CC</span>
          <div><strong>Casa Clara</strong><span>financas sem ansiedade</span></div>
        </div>
        <nav class="nav">${nav(navItems)}</nav>
        ${themeSwitcher()}
        <div class="sidebar-footer">
          <small>Clareza do mes</small>
          <strong>82% organizado</strong>
          <div class="progress-track"><div class="progress-fill" style="width:82%"></div></div>
        </div>
      </aside>
      <header class="top-mobile">
        <div class="brand" style="border:0;padding:0">
          <span class="brand-mark">CC</span>
          <div><strong>Casa Clara</strong><span>Hoje</span></div>
        </div>
        <div class="button-row">
          ${themeSwitcher(true)}
          <button class="icon-button" onclick="openModal('notificacao')" title="Notificacoes">N</button>
        </div>
      </header>
      <main class="main-area">
        ${state.loading ? loadingView() : pageContent()}
      </main>
      ${rightPanel()}
      <nav class="bottom-nav">${nav(mobileNav, true)}</nav>
      ${state.modal ? modalContent(state.modal) : ""}
    </div>
  `;
}

function loadingView() {
  return `<div class="loader"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;
}

function hero() {
  return `
    <section class="hero-summary">
      <div class="hero-top">
        <div>
          <p class="eyebrow">Resumo inteligente</p>
          <h1>Sua vida financeira em modo feed.</h1>
          <p>A IA organizou os acontecimentos de hoje em historias curtas para voce entender rapido.</p>
        </div>
        <div class="button-row">
          <button class="secondary-button" onclick="openModal('banco')">Conectar banco</button>
          <button class="primary-button" onclick="openModal('insight')">Gerar insight</button>
        </div>
      </div>
      <div class="hero-grid">
        ${metric("Saldo atual", "R$ 8.742", "+6,2% no mes")}
        ${metric("Entradas", "R$ 6.160", "2 fontes")}
        ${metric("Saidas", "R$ 3.924", "dentro do previsto", "warn")}
        ${metric("Risco", "Baixo", "sexta positiva")}
      </div>
    </section>
  `;
}

function metric(label, value, trend, type = "") {
  return `<article class="metric-card"><span class="metric-label">${label}</span><div class="metric-value">${value}</div><span class="trend ${type}">${trend}</span></article>`;
}

function feedCard(card, i = 0) {
  return `
    <article class="feed-card ${card.type}" style="animation-delay:${i * 55}ms">
      <div class="feed-meta">${icon(card.icon, "feed-icon")}<span>${card.time}</span><span>Analise automatica</span></div>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
      <div class="feed-actions">
        <button class="secondary-button" onclick="showToast('Acao registrada no seu feed')">${card.action}</button>
        <button class="ghost-button" onclick="openModal('detalhe')">Detalhes</button>
      </div>
    </article>
  `;
}

function feedPage() {
  return `
    ${hero()}
    <section class="content-grid">
      ${feedCards.map(feedCard).join("")}
    </section>
  `;
}

function rightPanel() {
  return `
    <aside class="right-panel">
      <div class="balance-box">
        <span>Saldo conectado</span>
        <strong>R$ 8.742,18</strong>
        <small>Previsao para 14/06: R$ 7.980,00</small>
      </div>
      <section class="mini-panel">
        <div class="section-header"><h2>Categorias</h2><button class="mini-button" onclick="setRoute('categorias')">Ver</button></div>
        <div class="donut"></div>
      </section>
      <section class="mini-panel">
        <h2>Semana</h2>
        <div class="bars">
          ${bar("Casa", 72, "blue", "R$ 1.090")}
          ${bar("Mercado", 64, "green", "R$ 820")}
          ${bar("Delivery", 42, "yellow", "R$ 286")}
          ${bar("Alertas", 18, "red", "2")}
        </div>
      </section>
      <section class="mini-panel">
        <h2>Insights rapidos</h2>
        <p>Assinaturas somam R$ 219,70. Uma reducao simples liberaria R$ 720 por ano.</p>
        <button class="secondary-button" onclick="setRoute('insights')">Abrir insights</button>
      </section>
    </aside>
  `;
}

function bar(label, value, color, amount) {
  return `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill ${color}" style="width:${value}%"></div></div><strong>${amount}</strong></div>`;
}

function pageContent() {
  const pages = {
    feed: feedPage,
    dia: daySummary,
    calendario: calendarPage,
    transacoes: transactionsPage,
    contas: banksPage,
    metas: goalsPage,
    relatorios: reportsPage,
    configuracoes: settingsPage,
    perfil: profilePage,
    planejamento: planningPage,
    ia: aiPage,
    insights: insightsPage,
    categorias: categoriesPage,
    seguranca: securityPage,
    notificacoes: notificationsPage,
    premium: premiumPage,
    ajuda: helpPage,
    semanal: weeklyPage,
    mensal: monthlyPage
  };
  return (pages[state.route] || feedPage)();
}

function banner(eyebrow, title, text, actions = "") {
  return `<section class="page-banner"><div class="section-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${text}</p></div><div class="button-row">${actions}</div></div></section>`;
}

function daySummary() {
  return `<div class="page">
    ${banner("Resumo do dia", "Terca-feira esta sob controle.", "A IA resumiu entradas, saidas, alertas e proximas cobrancas em poucos pontos.", `<button class="primary-button" onclick="setRoute('semanal')">Resumo semanal</button>`)}
    <div class="cards-grid">${metric("Gasto hoje", "R$ 486", "12 lancamentos", "warn")}${metric("Maior categoria", "Mercado", "R$ 248,90")}${metric("Economia", "R$ 132", "vs semana passada")}</div>
    ${feedCards.slice(0, 3).map(feedCard).join("")}
  </div>`;
}

function calendarPage() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return `<div class="page">
    ${banner("Calendario financeiro", "Vencimentos e previsoes do mes.", "Cada dia mostra o impacto esperado no saldo da casa.", `<button class="secondary-button" onclick="openModal('evento')">Novo evento</button>`)}
    <section class="calendar">${days.map(day => `<div class="day ${day % 9 === 0 ? "warn" : day % 5 === 0 ? "good" : ""}"><small>${day}</small>${day % 5 === 0 ? "<strong>Entrada</strong>" : day % 9 === 0 ? "<strong>Conta vence</strong>" : ""}</div>`).join("")}</section>
  </div>`;
}

function transactionsPage() {
  return `<div class="page">
    ${banner("Transacoes", "Movimentacoes traduzidas.", "Filtre gastos, edite categorias e acompanhe o que a IA reconheceu automaticamente.", `<button class="primary-button" onclick="openModal('transacao')">Adicionar</button>`)}
    <div class="segmented"><button class="tab active">Todas</button><button class="tab">Entradas</button><button class="tab">Saidas</button><button class="tab">Pendentes</button></div>
    <section class="list">${transactions.map(rowTransaction).join("")}</section>
  </div>`;
}

function rowTransaction([name, desc, amount, marker]) {
  return `<button class="transaction-row" onclick="openModal('transacao')">${icon(marker, "mini-icon")}<span><strong>${name}</strong><br><small>${desc}</small></span><span class="amount ${amount > 0 ? "positive" : "negative"}">${money.format(amount)}</span></button>`;
}

function banksPage() {
  return `<div class="page">
    ${banner("Conexao bancaria", "Contas sincronizadas com leitura inteligente.", "O prototipo mostra bancos conectados, status e uma jornada de conexao segura.", `<button class="primary-button" onclick="openModal('banco')">Conectar banco</button>`)}
    <section class="list">
      ${["Nubank", "Banco do Brasil", "Inter", "Carteira manual"].map((b, i) => `<button class="bank-row" onclick="showToast('${b} aberto')">${icon(i + 1, "mini-icon")}<span><strong>${b}</strong><br><small>${i === 3 ? "Atualizado manualmente" : "Sincronizado ha 12 min"}</small></span><span class="mini-button">Ativo</span></button>`).join("")}
    </section>
  </div>`;
}

function goalsPage() {
  return `<div class="page">
    ${banner("Metas financeiras", "Progresso com cara de conquista.", "Acompanhe metas da casa sem transformar sua rotina em planilha.", `<button class="primary-button" onclick="openModal('meta')">Nova meta</button>`)}
    <section class="cards-grid">${goals.map(([name, desc, pct, color]) => `<article class="info-card"><div class="card-header">${icon(name[0], "page-icon")}<span class="trend">${pct}%</span></div><h2>${name}</h2><p>${desc}</p><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></article>`).join("")}</section>
    ${emptyState("Meta concluida", "Quando uma meta chegar ao fim, o feed celebra e sugere o proximo passo.")}
  </div>`;
}

function reportsPage() {
  return `<div class="page">
    ${banner("Relatorios", "Analises mensais sem peso.", "Compare meses, categorias e padroes com visual limpo.", `<button class="secondary-button" onclick="setRoute('mensal')">Comparativos mensais</button>`)}
    <section class="cards-grid two"><article class="info-card"><h2>Gastos por semana</h2><div class="bars">${bar("S1", 48, "green", "R$ 920")}${bar("S2", 78, "yellow", "R$ 1.440")}${bar("S3", 58, "blue", "R$ 1.080")}${bar("S4", 35, "green", "R$ 650")}</div></article><article class="info-card"><h2>Saude financeira</h2><div class="donut"></div><p>O mes esta equilibrado, com atencao leve para delivery e energia.</p></article></section>
  </div>`;
}

function profilePage() {
  return `<div class="page">
    ${banner("Perfil", "Preferencias da sua casa.", "Ajuste renda, familia, objetivos e tom das notificacoes.", `<button class="secondary-button" onclick="setRoute('premium')">Premium</button>`)}
    <section class="cards-grid two">${["Casa com 3 pessoas", "Renda principal mensal", "Tom amigavel da IA", "Objetivo: reserva"].map((t, i) => `<article class="info-card">${icon(i + 1, "page-icon")}<h2>${t}</h2><p>Configuracao usada para personalizar previsoes e alertas.</p></article>`).join("")}</section>
  </div>`;
}

function settingsPage() {
  return `<div class="page">
    ${banner("Configuracoes", "Controle do produto.", "Preferencias, integracoes, seguranca, notificacoes e suporte.", "")}
    <section class="list">
      ${settingRow("Seguranca", "Biometria, PIN e sessoes", "seguranca")}
      ${settingRow("Notificacoes", "Alertas de risco e conquistas", "notificacoes")}
      ${settingRow("Categorias", "Regras automaticas de classificacao", "categorias")}
      ${settingRow("Central de ajuda", "Guias e contato", "ajuda")}
    </section>
  </div>`;
}

function settingRow(title, desc, route) {
  return `<button class="setting-row" onclick="setRoute('${route}')">${icon(title[0], "mini-icon")}<span><strong>${title}</strong><br><small>${desc}</small></span><span class="mini-button">Abrir</span></button>`;
}

function planningPage() {
  return `<div class="page">
    ${banner("Planejamento financeiro", "O proximo mes antes de acontecer.", "Simule contas, renda extra e limites por categoria.", `<button class="primary-button" onclick="openModal('planejamento')">Simular</button>`)}
    <section class="cards-grid">${metric("Saldo previsto", "R$ 9.120", "30/06")}${metric("Folga segura", "R$ 1.480", "apos contas")}${metric("Limite sugerido", "R$ 620", "lazer")}</section>
    <article class="feed-card good">${icon("+", "feed-icon")}<h2>Plano sugerido pela IA</h2><p>Separar R$ 420 no dia do salario reduz a chance de aperto no fim do mes para 8%.</p><button class="secondary-button" onclick="showToast('Plano salvo')">Salvar plano</button></article>
  </div>`;
}

function aiPage() {
  return `<div class="page">
    ${banner("IA financeira", "Pergunte como fala em casa.", "A IA interpreta movimentacoes e responde com contexto, sem termos tecnicos.", `<button class="primary-button" onclick="openModal('pergunta')">Perguntar</button>`)}
    <section class="info-card">
      <label class="field"><span>Pergunta rapida</span><textarea placeholder="Ex: posso gastar R$ 300 no fim de semana?"></textarea></label>
      <button class="primary-button" onclick="showToast('Resposta gerada no feed')">Analisar</button>
    </section>
    ${feedCard({ type: "violet", icon: "IA", time: "Resposta", title: "Voce pode gastar R$ 300, mas ha um jeito melhor.", text: "Se limitar lazer a R$ 220, sua reserva ainda cresce R$ 480 este mes.", action: "Aplicar sugestao" })}
  </div>`;
}

function insightsPage() {
  return `<div class="page">
    ${banner("Insights automaticos", "Padroes que valem sua atencao.", "Alertas leves, previsoes e oportunidades de economia aparecem aqui e no feed.", "")}
    ${feedCards.map(feedCard).join("")}
  </div>`;
}

function categoriesPage() {
  return `<div class="page">
    ${banner("Categorias", "Organizacao automatica dos gastos.", "Edite regras e veja quais categorias pesam mais no mes.", `<button class="secondary-button" onclick="openModal('categoria')">Nova regra</button>`)}
    <section class="list">${categories.map(([name, desc, amount, marker]) => `<button class="category-row" onclick="openModal('categoria')">${icon(marker, "mini-icon")}<span><strong>${name}</strong><br><small>${desc}</small></span><span class="amount negative">${money.format(amount)}</span></button>`).join("")}</section>
  </div>`;
}

function securityPage() {
  return `<div class="page">
    ${banner("Seguranca", "Acesso protegido e transparente.", "Controle sessoes, permissoes bancarias e fatores de autenticacao.", "")}
    <section class="list">${["Biometria ativa", "PIN de emergencia", "Sessao desktop", "Permissoes Open Finance"].map((t, i) => `<div class="setting-row">${icon(i + 1, "mini-icon")}<span><strong>${t}</strong><br><small>Ultima verificacao hoje</small></span><button class="toggle ${i < 2 ? "on" : ""}" onclick="this.classList.toggle('on')" title="Alternar"></button></div>`).join("")}</section>
  </div>`;
}

function notificationsPage() {
  return `<div class="page">
    ${banner("Notificacoes", "Alertas uteis, sem susto.", "Escolha quando a IA deve falar com voce.", "")}
    <section class="list">${["Risco de saldo baixo", "Meta atingida", "Assinatura nova", "Resumo diario", "Resumo semanal"].map((t, i) => `<div class="notification-row">${icon("N", "mini-icon")}<span><strong>${t}</strong><br><small>${i % 2 ? "Silencioso" : "Ativo"}</small></span><button class="toggle ${i % 2 ? "" : "on"}" onclick="this.classList.toggle('on')" title="Alternar"></button></div>`).join("")}</section>
  </div>`;
}

function premiumPage() {
  return `<div class="page">
    <section class="page-banner premium"><p class="eyebrow">Assinatura premium</p><h1>IA mais profunda para a rotina da casa.</h1><p>Previsoes longas, conciliacao automatica, alertas familiares e relatorios compartilhaveis.</p><button class="primary-button" onclick="openModal('premium')">Assinar premium</button></section>
    <section class="cards-grid">${["Previsao de 90 dias", "Regras inteligentes", "Relatorio familiar"].map(t => `<article class="info-card"><h2>${t}</h2><p>Funcao premium pronta no prototipo navegavel.</p></article>`).join("")}</section>
  </div>`;
}

function helpPage() {
  return `<div class="page">
    ${banner("Central de ajuda", "Ajuda que resolve rapido.", "Perguntas, tutoriais e contato com suporte.", `<button class="primary-button" onclick="openModal('suporte')">Falar com suporte</button>`)}
    <section class="list">${["Como conectar meu banco?", "Como a IA categoriza gastos?", "Posso exportar relatorios?", "Como cancelar o premium?"].map(q => `<button class="help-row" onclick="openModal('ajuda')">${icon("?", "mini-icon")}<span><strong>${q}</strong><br><small>Resposta curta e direta</small></span><span class="mini-button">Ler</span></button>`).join("")}</section>
  </div>`;
}

function weeklyPage() {
  return `<div class="page">${banner("Resumo semanal", "A semana em cinco historias.", "Comparativos de gastos, conquistas e riscos antes do fim de semana.", "")}${feedCards.slice(1).map(feedCard).join("")}</div>`;
}

function monthlyPage() {
  return `<div class="page">${banner("Resumo mensal", "Comparativos mensais claros.", "Veja se a casa esta evoluindo e onde ajustar sem perder tempo.", "")}<section class="cards-grid">${metric("Maio", "R$ 5.820", "gastos")}${metric("Junho", "R$ 4.940", "-15%")}${metric("Economia", "R$ 880", "melhor mes")}</section>${reportsPage()}</div>`;
}

function emptyState(title, text) {
  return `<section class="empty-state"><div class="empty-visual"></div><h2>${title}</h2><p>${text}</p><button class="secondary-button" onclick="showToast('Estado vazio demonstrado')">Entendi</button></section>`;
}

function modalContent(kind) {
  const map = {
    onboarding: ["Onboarding", "Vamos configurar renda, metas e bancos para personalizar seu feed.", "Continuar"],
    banco: ["Conectar banco", "Escolha uma instituicao para simular a conexao Open Finance.", "Conectar"],
    insight: ["Novo insight", "A IA vai revisar transacoes recentes e publicar um card no feed.", "Gerar"],
    detalhe: ["Detalhes do insight", "Aqui entram transacoes relacionadas, explicacao da IA e acao recomendada.", "Salvar"],
    evento: ["Novo evento", "Adicione uma conta, vencimento ou entrada prevista ao calendario.", "Adicionar"],
    transacao: ["Transacao", "Edite valor, categoria, recorrencia e observacoes.", "Salvar"],
    meta: ["Nova meta", "Defina objetivo, valor e data desejada.", "Criar meta"],
    planejamento: ["Simulacao", "Teste cenarios de gasto e veja o impacto no saldo previsto.", "Simular"],
    pergunta: ["Perguntar para IA", "Digite uma duvida financeira em linguagem natural.", "Enviar"],
    categoria: ["Regra de categoria", "Automatize a classificacao por nome, valor ou recorrencia.", "Salvar regra"],
    premium: ["Premium", "Ative recursos avancados de previsao e relatorios familiares.", "Assinar"],
    suporte: ["Suporte", "Envie uma mensagem para a central de ajuda.", "Enviar"],
    ajuda: ["Resposta", "A conexao bancaria usa consentimento e pode ser removida a qualquer momento.", "Ok"],
    notificacao: ["Notificacoes", "Resumo diario pronto e dois alertas leves aguardando revisao.", "Abrir"]
  };
  const [title, text, action] = map[kind] || map.detalhe;
  return `<div class="modal-backdrop" onclick="if(event.target.className==='modal-backdrop') closeModal()">
    <section class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal-header"><h2>${title}</h2><button class="icon-button" onclick="closeModal()" title="Fechar">X</button></div>
      <p>${text}</p>
      <div class="form">
        <label class="field"><span>Nome</span><input placeholder="Exemplo de campo"></label>
        <label class="field"><span>Tipo</span><select><option>Automatico</option><option>Manual</option><option>Recorrente</option></select></label>
      </div>
      <div class="button-row" style="margin-top:14px">
        <button class="primary-button" onclick="closeModal(); showToast('${action} concluido')">${action}</button>
        <button class="ghost-button" onclick="closeModal()">Cancelar</button>
      </div>
    </section>
  </div>`;
}

function render() {
  document.body.dataset.theme = state.theme;
  document.querySelector("#app").innerHTML = state.route === "auth" ? authScreen() : appShell();
}

Object.assign(window, {
  setRoute,
  showToast,
  openModal,
  closeModal,
  setTheme,
  render,
  state
});

render();
