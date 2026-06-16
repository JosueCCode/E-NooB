const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const API_BASE_URL = window.location.origin.startsWith("file")
  || ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port !== "3001"
  ? "http://localhost:3001"
  : window.location.origin;

const state = {
  route: window.location.pathname === "/admin" ? "admin" : "auth",
  auth: "login",
  authLoading: false,
  authError: "",
  user: JSON.parse(localStorage.getItem("casa-clara-user") || "null"),
  modal: null,
  loading: false,
  transactionTab: "todas",
  bankConnected: false,
  savedPlan: false,
  premiumPlan: "familia",
  generatedInsight: false,
  security: [true, true, false, false],
  notifications: [true, false, true, true, false],
  tutorial: { active: false, index: 0 },
  theme: localStorage.getItem("casa-clara-theme") || "light"
};

const adminState = {
  loading: false,
  error: "",
  tab: "users",
  editing: null,
  data: { users: [], accounts: [], categories: [], transactions: [] }
};

const themes = [
  ["light", "Claro", "CL"],
  ["dark", "Escuro", "ES"],
  ["contrast", "Alto contraste", "AC"],
  ["blue-dark", "Azul escuro", "AZ"]
];

const navItems = [
  ["feed", "home", "Página principal"],
  ["dia", "sun", "Resumo do dia"],
  ["calendario", "calendar", "Calendário financeiro"],
  ["transacoes", "receipt", "Transações"],
  ["contas", "bank", "Contas bancárias"],
  ["metas", "target", "Metas financeiras"],
  ["relatorios", "chart", "Relatórios"],
  ["planejamento", "calculator", "Planejamento"],
  ["ia", "sparkles", "IA financeira"],
  ["perfil", "user", "Perfil"],
  ["configuracoes", "settings", "Configurações"]
];

const mobileNav = [
  ["feed", "home", "Início"],
  ["transacoes", "receipt", "Gastos"],
  ["metas", "target", "Metas"],
  ["ia", "sparkles", "IA"],
  ["perfil", "user", "Perfil"]
];

const svgIcons = {
  activity: '<path d="M22 12h-4l-3 7-6-14-3 7H2"/>',
  alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
  bank: '<path d="m3 10 9-7 9 7"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M4 18h16"/><path d="M2 21h20"/>',
  bell: '<path d="M10 21h4"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
  briefcase: '<path d="M10 6V5a2 2 0 0 1 4 0v1"/><path d="M3 7h18v12H3z"/><path d="M3 13h18"/>',
  calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  car: '<path d="M19 17h2l-2-6H5l-2 6h2"/><path d="M7 17h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M6 11l2-5h8l2 5"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h3l3 13h11l3-9H6"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.1-1.7 1.6-2.4 2.5-.4.5-.5.9-.5 1.5"/><path d="M12 17h.01"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  piggy: '<path d="M19 5c-1.5 0-2.5.8-3 2H8a5 5 0 0 0-5 5v2h2l1 3h3l1-2h4l1 2h3l1-3h2v-3h-2a5 5 0 0 0-.5-2L21 7V5h-2Z"/><path d="M7 9h.01"/>',
  plane: '<path d="M17.8 19.2 16 11l5-5a2.1 2.1 0 0 0-3-3l-5 5-8.2-1.8-1.4 1.4 6.4 3.2-4 4-3-.6-1.2 1.2 4 2 2 4 1.2-1.2-.6-3 4-4 3.2 6.4Z"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>',
  repeat: '<path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  settings: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  sparkles: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/><path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  trend: '<path d="m3 17 6-6 4 4 7-7"/><path d="M14 8h6v6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  wallet: '<path d="M3 7h18v12H3z"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/><path d="M3 7l13-4v4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

const feedCards = [
  { type: "warn", icon: "alert", time: "Agora", title: "Hoje você gastou mais com delivery.", text: "Foram R$ 86,40 em três pedidos. Isso está 28% acima da sua média de terça-feira.", action: "Criar limite de delivery" },
  { type: "good", icon: "check", time: "10:42", title: "Tudo certo. Seu saldo continua saudável.", text: "Mesmo com as saídas da manhã, a previsão para sexta fica positiva em R$ 1.340.", action: "Ver previsão" },
  { type: "violet", icon: "activity", time: "09:10", title: "Comportamento incomum detectado.", text: "A conta de energia ficou R$ 41 mais alta que nos últimos dois meses. Quer acompanhar essa categoria?", action: "Acompanhar energia" },
  { type: "good", icon: "trend", time: "Ontem", title: "Você economizou comparado à semana passada.", text: "Mercado e transporte caíram juntos. A economia estimada foi de R$ 132,00.", action: "Ver comparativo" },
  { type: "danger", icon: "copy", time: "Segunda", title: "Assinatura duplicada encontrada.", text: "Dois serviços de streaming foram cobrados no mesmo dia. A IA marcou isso para revisão.", action: "Revisar cobranças" }
];

const transactions = [
  { name: "Mercado Boa Compra", desc: "Alimentação · hoje 12:31", amount: -248.9, icon: "cart", status: "confirmada" },
  { name: "Salário", desc: "Entrada · hoje 09:00", amount: 5400, icon: "wallet", status: "confirmada" },
  { name: "Transporte por app", desc: "Transporte · ontem", amount: -37.5, icon: "car", status: "confirmada" },
  { name: "Farmácia", desc: "Saúde · ontem", amount: -82.2, icon: "heart", status: "confirmada" },
  { name: "Freelance design", desc: "Entrada · segunda", amount: 760, icon: "briefcase", status: "pendente" },
  { name: "Streaming", desc: "Assinaturas · segunda", amount: -39.9, icon: "repeat", status: "pendente" }
];

const categories = [
  ["Alimentação", "32% do mês", 1248, "cart"],
  ["Moradia", "28% do mês", 1090, "home"],
  ["Transporte", "14% do mês", 548, "car"],
  ["Lazer", "9% do mês", 350, "sparkles"],
  ["Saúde", "6% do mês", 238, "heart"]
];

const goals = [
  ["Reserva de emergência", "R$ 8.400 de R$ 12.000", 70, "piggy"],
  ["Viagem em família", "R$ 2.100 de R$ 5.000", 42, "plane"],
  ["Trocar notebook", "R$ 1.320 de R$ 4.400", 30, "calculator"]
];

const tutorialSteps = [
  {
    route: "feed",
    title: "Bem-vindo ao E-NooB",
    text: "Este feed resume sua vida financeira em cards curtos, com alertas, previsoes e acoes rapidas.",
    action: "Comecar tour"
  },
  {
    route: "transacoes",
    title: "Transacoes",
    text: "Aqui voce acompanha entradas, saidas e pendencias. Use os filtros para entender o dinheiro por tipo.",
    action: "Ver contas"
  },
  {
    route: "contas",
    title: "Contas conectadas",
    text: "Organize saldos, instituicoes e fontes de dinheiro. No produto real, esta area pode receber integracoes bancarias.",
    action: "Ver metas"
  },
  {
    route: "metas",
    title: "Metas financeiras",
    text: "Crie objetivos para reserva, viagem ou compras importantes e acompanhe o progresso sem depender de planilhas.",
    action: "Ver IA"
  },
  {
    route: "ia",
    title: "IA financeira",
    text: "Faca perguntas em linguagem simples e receba sugestoes sobre limites, riscos e oportunidades de economia.",
    action: "Ver configuracoes"
  },
  {
    route: "configuracoes",
    title: "Configuracoes",
    text: "Ajuste seguranca, notificacoes, categorias e preferencias para deixar a experiencia com a sua cara.",
    action: "Concluir"
  }
];

function tutorialStorageKey(user = state.user) {
  return user ? `casa-clara-tutorial-${user.id}` : "casa-clara-tutorial";
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("casa-clara-token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Nao foi possivel concluir a acao");
  }

  return data;
}

async function adminLoad() {
  adminState.loading = true;
  adminState.error = "";
  render();

  try {
    adminState.data = await apiRequest("/api/admin");
  } catch (error) {
    adminState.error = error.message;
  } finally {
    adminState.loading = false;
    render();
  }
}

function setAuthMode(mode) {
  state.auth = mode;
  state.authError = "";
  render();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const isSignup = state.auth === "cadastro";
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };

  if (isSignup) {
    payload.name = String(formData.get("name") || "").trim();
  }

  state.authLoading = true;
  state.authError = "";
  render();

  try {
    const result = await apiRequest(isSignup ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("casa-clara-token", result.token);
    localStorage.setItem("casa-clara-user", JSON.stringify(result.user));
    state.user = result.user;
    state.authLoading = false;
    if (window.location.pathname === "/admin") {
      state.route = "admin";
      render();
      if (result.user.role === "ADMIN") await adminLoad();
    } else {
      state.route = "feed";
      if (isSignup) {
        state.tutorial = { active: true, index: 0 };
        localStorage.removeItem(tutorialStorageKey(result.user));
      }
      render();
    }
    showToast(isSignup ? "Conta criada com sucesso" : "Login realizado");
  } catch (error) {
    state.authLoading = false;
    state.authError = error.message;
    render();
  }
}

function logout() {
  localStorage.removeItem("casa-clara-token");
  localStorage.removeItem("casa-clara-user");
  state.user = null;
  state.route = window.location.pathname === "/admin" ? "admin" : "auth";
  state.auth = "login";
  state.authError = "";
  adminState.data = { users: [], accounts: [], categories: [], transactions: [] };
  render();
}

function setRoute(route) {
  if (route === "admin") {
    window.history.pushState({}, "", "/admin");
    state.route = "admin";
    adminLoad();
    return;
  }

  if (window.location.pathname === "/admin") {
    window.history.pushState({}, "", "/");
  }

  state.route = route;
  state.tutorial.active = false;
  state.loading = route !== "auth";
  render();
  window.setTimeout(() => {
    state.loading = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 220);
}

function startTutorial() {
  state.route = tutorialSteps[0].route;
  state.loading = false;
  state.tutorial = { active: true, index: 0 };
  render();
}

function nextTutorialStep() {
  const nextIndex = state.tutorial.index + 1;
  if (nextIndex >= tutorialSteps.length) {
    finishTutorial();
    return;
  }

  state.tutorial.index = nextIndex;
  state.route = tutorialSteps[nextIndex].route;
  state.loading = false;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function previousTutorialStep() {
  if (state.tutorial.index <= 0) return;
  state.tutorial.index -= 1;
  state.route = tutorialSteps[state.tutorial.index].route;
  state.loading = false;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finishTutorial() {
  state.tutorial = { active: false, index: 0 };
  localStorage.setItem(tutorialStorageKey(), "done");
  showToast("Tutorial concluido");
  render();
}

function adminSetTab(tab) {
  adminState.tab = tab;
  adminState.editing = null;
  adminState.error = "";
  render();
}

function adminStartEdit(resource, id) {
  adminState.editing = { resource, id };
  render();
}

function adminCancelEdit() {
  adminState.editing = null;
  render();
}

function adminOptions(resource, selected = "") {
  return adminState.data[resource].map(item => {
    const label = item.email || item.name || item.description;
    return `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${label}</option>`;
  }).join("");
}

function adminValue(item, key, fallback = "") {
  if (!item) return fallback;
  if (key === "occurredAt") return item[key] ? new Date(item[key]).toISOString().slice(0, 10) : fallback;
  return item[key] ?? fallback;
}

async function adminSubmit(resource, event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const editing = adminState.editing?.resource === resource ? adminState.editing : null;

  if (!payload.password) delete payload.password;
  if (payload.isDefault) payload.isDefault = true;
  if (resource === "categories" && !payload.isDefault) payload.isDefault = false;

  adminState.loading = true;
  adminState.error = "";
  render();

  try {
    await apiRequest(`/api/admin/${resource}${editing ? `/${editing.id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    adminState.editing = null;
    await adminLoad();
    showToast(editing ? "Registro atualizado" : "Registro criado");
  } catch (error) {
    adminState.error = error.message;
    adminState.loading = false;
    render();
  }
}

async function adminDelete(resource, id) {
  if (!window.confirm("Excluir este registro?")) return;
  adminState.loading = true;
  adminState.error = "";
  render();

  try {
    await apiRequest(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    await adminLoad();
    showToast("Registro excluido");
  } catch (error) {
    adminState.error = error.message;
    adminState.loading = false;
    render();
  }
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
  showToast(`Tema alterado para ${themes.find(([id]) => id === theme)?.[1] || "tema"}`);
}

function setTransactionTab(tab) {
  state.transactionTab = tab;
  render();
}

function toggleState(group, index) {
  state[group][index] = !state[group][index];
  render();
  showToast(state[group][index] ? "Opção ativada" : "Opção desativada");
}

function savePlan() {
  state.savedPlan = true;
  render();
  showToast("Plano salvo no planejamento");
}

function openModal(kind) {
  state.modal = kind;
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

function icon(name, cls = "nav-icon") {
  const path = svgIcons[name] || svgIcons.sparkles;
  return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg></span>`;
}

function themeSwitcher(compact = false) {
  return `
    <div class="theme-switcher" aria-label="Temas do site">
      ${compact ? "" : "<small>Tema do site</small>"}
      <div class="theme-options">
        ${themes.map(([id, label, short]) => `
          <button class="theme-button ${state.theme === id ? "active" : ""}" onclick="setTheme('${id}')" title="${label}" aria-label="${label}" aria-pressed="${state.theme === id}">
            <span class="theme-swatch ${id}" aria-hidden="true"></span>
            ${compact ? "" : `<span class="sr-only">${short}</span>`}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function nav(items) {
  return items.map(([route, marker, label]) => `
    <button class="nav-button ${state.route === route ? "active" : ""}" onclick="setRoute('${route}')" title="${label}" aria-current="${state.route === route ? "page" : "false"}">
      ${icon(marker)}
      <span>${label}</span>
    </button>
  `).join("");
}

function authScreen() {
  const isLogin = state.auth === "login";
  const isSignup = state.auth === "cadastro";
  const title = isLogin ? "Entrar na Casa Clara" : isSignup ? "Criar sua conta" : "Recuperar acesso";
  const button = isLogin ? "Entrar" : isSignup ? "Começar onboarding" : "Enviar link";
  return `
    <main class="auth-screen">
      <section class="auth-panel">
        <div class="auth-logo brand">
          <span class="brand-mark">CC</span>
          <div><strong>Casa Clara</strong><span>feed inteligente de finanças</span></div>
        </div>
        <p class="eyebrow">${isSignup ? "Cadastro" : isLogin ? "Login" : "Recuperação"}</p>
        <h1>${title}</h1>
        <p>Veja sua rotina financeira como uma linha do tempo simples, visual e fácil de consumir.</p>
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
          <button class="secondary-button" onclick="setRoute('feed')">Ver demo</button>
        </div>
      </section>
      <section class="auth-art">
        <div class="phone-preview"><div class="phone-screen">${feedCards.slice(0, 3).map(feedCard).join("")}</div></div>
      </section>
    </main>
  `;
}

function appShell() {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">CC</span><div><strong>Casa Clara</strong><span>finanças sem ansiedade</span></div></div>
        <nav class="nav">${nav(navItems)}</nav>
        ${themeSwitcher()}
        <div class="sidebar-footer">
          <small>Clareza do mês</small>
          <strong>82% organizado</strong>
          <div class="progress-track"><div class="progress-fill" style="width:82%"></div></div>
          <button class="ghost-button full" onclick="logout()">${icon("lock", "inline-icon")} Sair</button>
        </div>
      </aside>
      <header class="top-mobile">
        <div class="brand" style="border:0;padding:0"><span class="brand-mark">CC</span><div><strong>Casa Clara</strong><span>Hoje</span></div></div>
        <div class="button-row">
          ${themeSwitcher(true)}
          <button class="icon-button" onclick="openModal('notificacao')" title="Notificações" aria-label="Notificações">${icon("bell", "inline-icon")}</button>
        </div>
      </header>
      <main class="main-area">${state.loading ? loadingView() : pageContent()}</main>
      ${rightPanel()}
      <nav class="bottom-nav">${nav(mobileNav)}</nav>
      ${state.modal ? modalContent(state.modal) : ""}
    </div>
  `;
}

function loadingView() {
  return `<div class="loader"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;
}

function hero() {
  const cards = state.generatedInsight ? [
    ...feedCards,
    { type: "violet", icon: "sparkles", time: "Novo", title: "Insight gerado agora.", text: "A IA cruzou delivery, mercado e transporte e sugeriu um limite semanal mais confortável.", action: "Aplicar limite" }
  ] : feedCards;
  return `
    <section class="hero-summary">
      <div class="hero-top">
        <div>
          <p class="eyebrow">Resumo inteligente</p>
          <h1>Sua vida financeira em modo feed.</h1>
          <p>A IA organizou os acontecimentos de hoje em histórias curtas para você entender rápido.</p>
        </div>
        <div class="button-row">
          <button class="secondary-button" onclick="openModal('banco')">${icon("bank", "inline-icon")} Conectar banco</button>
          <button class="primary-button" onclick="openModal('insight')">${icon("sparkles", "inline-icon")} Gerar insight</button>
        </div>
      </div>
      <div class="hero-grid">
        ${metric("Saldo atual", "R$ 8.742", "+6,2% no mês")}
        ${metric("Entradas", "R$ 6.160", "2 fontes")}
        ${metric("Saídas", "R$ 3.924", "dentro do previsto", "warn")}
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
      <div class="feed-meta">${icon(card.icon, "feed-icon")}<span>${card.time}</span><span>Análise automática</span></div>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
      <div class="feed-actions">
        <button class="secondary-button" onclick="showToast('Ação registrada no seu feed')">${card.action}</button>
        <button class="ghost-button" onclick="openModal('detalhe')">Detalhes</button>
      </div>
    </article>
  `;
}

function visibleFeedCards() {
  return state.generatedInsight ? [
    { type: "violet", icon: "sparkles", time: "Novo", title: "Insight gerado agora.", text: "A IA cruzou delivery, mercado e transporte e sugeriu um limite semanal mais confortável.", action: "Aplicar limite" },
    ...feedCards
  ] : feedCards;
}

function feedPage() {
  return `${hero()}<section class="content-grid">${visibleFeedCards().map(feedCard).join("")}</section>`;
}

function rightPanel() {
  return `
    <aside class="right-panel">
      <div class="balance-box">
        <span>Saldo conectado</span>
        <strong>R$ 8.742,18</strong>
        <small>Previsão para 14/06: R$ 7.980,00</small>
      </div>
      <section class="mini-panel">
        <div class="section-header"><h2>Categorias</h2><button class="mini-button" onclick="setRoute('categorias')">Ver</button></div>
        <div class="donut"></div>
      </section>
      <section class="mini-panel">
        <h2>Semana</h2>
        <div class="bars">${bar("Casa", 72, "blue", "R$ 1.090")}${bar("Mercado", 64, "green", "R$ 820")}${bar("Delivery", 42, "yellow", "R$ 286")}${bar("Alertas", 18, "red", "2")}</div>
      </section>
      <section class="mini-panel">
        <h2>Insights rápidos</h2>
        <p>Assinaturas somam R$ 219,70. Uma redução simples liberaria R$ 720 por ano.</p>
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
    ${banner("Resumo do dia", "Terça-feira está sob controle.", "A IA resumiu entradas, saídas, alertas e próximas cobranças em poucos pontos.", `<button class="primary-button" onclick="setRoute('semanal')">Resumo semanal</button>`)}
    <div class="cards-grid">${metric("Gasto hoje", "R$ 486", "12 lançamentos", "warn")}${metric("Maior categoria", "Mercado", "R$ 248,90")}${metric("Economia", "R$ 132", "vs semana passada")}</div>
    ${feedCards.slice(0, 3).map(feedCard).join("")}
  </div>`;
}

function calendarPage() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return `<div class="page">
    ${banner("Calendário financeiro", "Vencimentos e previsões do mês.", "Cada dia mostra o impacto esperado no saldo da casa.", `<button class="secondary-button" onclick="openModal('evento')">Novo evento</button>`)}
    <section class="calendar">${days.map(day => `<div class="day ${day % 9 === 0 ? "warn" : day % 5 === 0 ? "good" : ""}"><small>${day}</small>${day % 5 === 0 ? "<strong>Entrada</strong>" : day % 9 === 0 ? "<strong>Conta vence</strong>" : ""}</div>`).join("")}</section>
  </div>`;
}

function transactionFilter(row) {
  if (state.transactionTab === "entradas") return row.amount > 0;
  if (state.transactionTab === "saidas") return row.amount < 0;
  if (state.transactionTab === "pendentes") return row.status === "pendente";
  return true;
}

function transactionsPage() {
  const tabs = [["todas", "Todas"], ["entradas", "Entradas"], ["saidas", "Saídas"], ["pendentes", "Pendentes"]];
  const filtered = transactions.filter(transactionFilter);
  return `<div class="page">
    ${banner("Transações", "Movimentações traduzidas.", "Filtre gastos, edite categorias e acompanhe o que a IA reconheceu automaticamente.", `<button class="primary-button" onclick="openModal('transacao')">${icon("plus", "inline-icon")} Adicionar</button>`)}
    <div class="segmented" role="tablist">${tabs.map(([id, label]) => `<button class="tab ${state.transactionTab === id ? "active" : ""}" role="tab" aria-selected="${state.transactionTab === id}" onclick="setTransactionTab('${id}')">${label}</button>`).join("")}</div>
    <section class="list">${filtered.map(rowTransaction).join("") || emptyState("Nada por aqui", "Este filtro não tem lançamentos no momento.")}</section>
  </div>`;
}

function rowTransaction(row) {
  return `<button class="transaction-row" onclick="openModal('transacao')">${icon(row.icon, "mini-icon")}<span><strong>${row.name}</strong><br><small>${row.desc}</small></span><span class="amount ${row.amount > 0 ? "positive" : "negative"}">${money.format(row.amount)}</span></button>`;
}

function banksPage() {
  const status = state.bankConnected ? "Conectado agora" : "Sincronizado há 12 min";
  return `<div class="page">
    ${banner("Conexão bancária", "Contas sincronizadas com leitura inteligente.", "O protótipo mostra bancos conectados, status e uma jornada de conexão segura.", `<button class="primary-button" onclick="openModal('banco')">${icon("bank", "inline-icon")} Conectar banco</button>`)}
    <section class="list">
      ${["Nubank", "Banco do Brasil", "Inter", "Carteira manual"].map((b, i) => `<button class="bank-row" onclick="showToast('${b} aberto')">${icon(i === 3 ? "wallet" : "bank", "mini-icon")}<span><strong>${b}</strong><br><small>${i === 3 ? "Atualizado manualmente" : status}</small></span><span class="mini-button">${state.bankConnected || i !== 3 ? "Ativo" : "Manual"}</span></button>`).join("")}
    </section>
  </div>`;
}

function goalsPage() {
  return `<div class="page">
    ${banner("Metas financeiras", "Progresso com cara de conquista.", "Acompanhe metas da casa sem transformar sua rotina em planilha.", `<button class="primary-button" onclick="openModal('meta')">${icon("plus", "inline-icon")} Nova meta</button>`)}
    <section class="cards-grid">${goals.map(([name, desc, pct, marker]) => `<article class="info-card"><div class="card-header">${icon(marker, "page-icon")}<span class="trend">${pct}%</span></div><h2>${name}</h2><p>${desc}</p><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></article>`).join("")}</section>
    ${emptyState("Meta concluída", "Quando uma meta chegar ao fim, o feed celebra e sugere o próximo passo.")}
  </div>`;
}

function reportCharts() {
  return `<section class="cards-grid two"><article class="info-card"><h2>Gastos por semana</h2><div class="bars">${bar("S1", 48, "green", "R$ 920")}${bar("S2", 78, "yellow", "R$ 1.440")}${bar("S3", 58, "blue", "R$ 1.080")}${bar("S4", 35, "green", "R$ 650")}</div></article><article class="info-card"><h2>Saúde financeira</h2><div class="donut"></div><p>O mês está equilibrado, com atenção leve para delivery e energia.</p></article></section>`;
}

function reportsPage() {
  return `<div class="page">
    ${banner("Relatórios", "Análises mensais sem peso.", "Compare meses, categorias e padrões com visual limpo.", `<button class="secondary-button" onclick="setRoute('mensal')">Comparativos mensais</button>`)}
    ${reportCharts()}
  </div>`;
}

function profilePage() {
  return `<div class="page">
    ${banner("Perfil", "Preferências da sua casa.", "Ajuste renda, família, objetivos e tom das notificações.", `<button class="secondary-button" onclick="setRoute('premium')">Premium</button><button class="ghost-button" onclick="setRoute('auth')">Login</button>`)}
    <section class="cards-grid two">${["Casa com 3 pessoas", "Renda principal mensal", "Tom amigável da IA", "Objetivo: reserva"].map((t, i) => `<article class="info-card">${icon(["home", "wallet", "sparkles", "target"][i], "page-icon")}<h2>${t}</h2><p>Configuração usada para personalizar previsões e alertas.</p></article>`).join("")}</section>
  </div>`;
}

function settingsPage() {
  return `<div class="page">
    ${banner("Configurações", "Controle do produto.", "Preferências, integrações, segurança, notificações e suporte.", "")}
    <section class="list">
      ${settingRow("Segurança", "Biometria, PIN e sessões", "seguranca", "lock")}
      ${settingRow("Notificações", "Alertas de risco e conquistas", "notificacoes", "bell")}
      ${settingRow("Categorias", "Regras automáticas de classificação", "categorias", "chart")}
      ${settingRow("Central de ajuda", "Guias e contato", "ajuda", "help")}
    </section>
  </div>`;
}

function settingRow(title, desc, route, marker) {
  return `<button class="setting-row" onclick="setRoute('${route}')">${icon(marker, "mini-icon")}<span><strong>${title}</strong><br><small>${desc}</small></span><span class="mini-button">Abrir</span></button>`;
}

function planningPage() {
  return `<div class="page">
    ${banner("Planejamento financeiro", "O próximo mês antes de acontecer.", "Simule contas, renda extra e limites por categoria.", `<button class="primary-button" onclick="openModal('planejamento')">Simular</button>`)}
    <section class="cards-grid">${metric("Saldo previsto", "R$ 9.120", "30/06")}${metric("Folga segura", "R$ 1.480", "após contas")}${metric("Limite sugerido", "R$ 620", "lazer")}</section>
    <article class="feed-card good">${icon("check", "feed-icon")}<h2>Plano sugerido pela IA</h2><p>Separar R$ 420 no dia do salário reduz a chance de aperto no fim do mês para 8%.</p><button class="secondary-button" onclick="savePlan()">${state.savedPlan ? "Plano salvo" : "Salvar plano"}</button></article>
  </div>`;
}

function aiPage() {
  return `<div class="page">
    ${banner("IA financeira", "Pergunte como fala em casa.", "A IA interpreta movimentações e responde com contexto, sem termos técnicos.", `<button class="primary-button" onclick="openModal('pergunta')">Perguntar</button>`)}
    <section class="info-card">
      <label class="field"><span>Pergunta rápida</span><textarea placeholder="Ex: posso gastar R$ 300 no fim de semana?"></textarea></label>
      <button class="primary-button" onclick="state.generatedInsight=true; render(); showToast('Resposta gerada no feed')">Analisar</button>
    </section>
    ${feedCard({ type: "violet", icon: "sparkles", time: "Resposta", title: "Você pode gastar R$ 300, mas há um jeito melhor.", text: "Se limitar lazer a R$ 220, sua reserva ainda cresce R$ 480 este mês.", action: "Aplicar sugestão" })}
  </div>`;
}

function insightsPage() {
  return `<div class="page">${banner("Insights automáticos", "Padrões que valem sua atenção.", "Alertas leves, previsões e oportunidades de economia aparecem aqui e no feed.", "")}${visibleFeedCards().map(feedCard).join("")}</div>`;
}

function categoriesPage() {
  return `<div class="page">
    ${banner("Categorias", "Organização automática dos gastos.", "Edite regras e veja quais categorias pesam mais no mês.", `<button class="secondary-button" onclick="openModal('categoria')">Nova regra</button>`)}
    <section class="list">${categories.map(([name, desc, amount, marker]) => `<button class="category-row" onclick="openModal('categoria')">${icon(marker, "mini-icon")}<span><strong>${name}</strong><br><small>${desc}</small></span><span class="amount negative">${money.format(amount)}</span></button>`).join("")}</section>
  </div>`;
}

function securityPage() {
  const items = ["Biometria ativa", "PIN de emergência", "Sessão desktop", "Permissões Open Finance"];
  return `<div class="page">
    ${banner("Segurança", "Acesso protegido e transparente.", "Controle sessões, permissões bancárias e fatores de autenticação.", "")}
    <section class="list">${items.map((t, i) => `<div class="setting-row">${icon(i < 2 ? "lock" : "settings", "mini-icon")}<span><strong>${t}</strong><br><small>${state.security[i] ? "Ativo" : "Desativado"} · última verificação hoje</small></span><button class="toggle ${state.security[i] ? "on" : ""}" onclick="toggleState('security', ${i})" role="switch" aria-checked="${state.security[i]}" title="Alternar ${t}"></button></div>`).join("")}</section>
  </div>`;
}

function notificationsPage() {
  const items = ["Risco de saldo baixo", "Meta atingida", "Assinatura nova", "Resumo diário", "Resumo semanal"];
  return `<div class="page">
    ${banner("Notificações", "Alertas úteis, sem susto.", "Escolha quando a IA deve falar com você.", "")}
    <section class="list">${items.map((t, i) => `<div class="notification-row">${icon("bell", "mini-icon")}<span><strong>${t}</strong><br><small>${state.notifications[i] ? "Ativo" : "Silencioso"}</small></span><button class="toggle ${state.notifications[i] ? "on" : ""}" onclick="toggleState('notifications', ${i})" role="switch" aria-checked="${state.notifications[i]}" title="Alternar ${t}"></button></div>`).join("")}</section>
  </div>`;
}

function premiumPage() {
  return `<div class="page">
    <section class="page-banner premium"><p class="eyebrow">Assinatura premium</p><h1>IA mais profunda para a rotina da casa.</h1><p>Previsões longas, conciliação automática, alertas familiares e relatórios compartilháveis.</p><button class="primary-button" onclick="openModal('premium')">Assinar premium</button></section>
    <section class="cards-grid">${["Previsão de 90 dias", "Regras inteligentes", "Relatório familiar"].map(t => `<article class="info-card"><h2>${t}</h2><p>Função premium pronta no protótipo navegável.</p></article>`).join("")}</section>
  </div>`;
}

function helpPage() {
  return `<div class="page">
    ${banner("Central de ajuda", "Ajuda que resolve rápido.", "Perguntas, tutoriais e contato com suporte.", `<button class="primary-button" onclick="openModal('suporte')">Falar com suporte</button>`)}
    <section class="list">${["Como conectar meu banco?", "Como a IA categoriza gastos?", "Posso exportar relatórios?", "Como cancelar o premium?"].map(q => `<button class="help-row" onclick="openModal('ajuda')">${icon("help", "mini-icon")}<span><strong>${q}</strong><br><small>Resposta curta e direta</small></span><span class="mini-button">Ler</span></button>`).join("")}</section>
  </div>`;
}

function weeklyPage() {
  return `<div class="page">${banner("Resumo semanal", "A semana em cinco histórias.", "Comparativos de gastos, conquistas e riscos antes do fim de semana.", "")}${feedCards.slice(1).map(feedCard).join("")}</div>`;
}

function monthlyPage() {
  return `<div class="page">
    ${banner("Resumo mensal", "Comparativos mensais claros.", "Veja se a casa está evoluindo e onde ajustar sem perder tempo.", "")}
    <section class="cards-grid">${metric("Maio", "R$ 5.820", "gastos")}${metric("Junho", "R$ 4.940", "-15%")}${metric("Economia", "R$ 880", "melhor mês")}</section>
    ${reportCharts()}
  </div>`;
}

function emptyState(title, text) {
  return `<section class="empty-state"><div class="empty-visual"></div><h2>${title}</h2><p>${text}</p><button class="secondary-button" onclick="showToast('Estado vazio demonstrado')">Entendi</button></section>`;
}

function modalFields(kind) {
  const fields = {
    onboarding: `<label class="field"><span>Renda mensal da casa</span><input type="number" placeholder="6800"></label><label class="field"><span>Objetivo principal</span><select><option>Reserva de emergência</option><option>Quitar dívidas</option><option>Organizar rotina</option></select></label>`,
    banco: `<label class="field"><span>Instituição</span><select><option>Nubank</option><option>Banco do Brasil</option><option>Inter</option><option>Itaú</option></select></label><label class="check-field"><input type="checkbox" checked> <span>Autorizo a simulação de consentimento Open Finance.</span></label><div class="status-line">${state.bankConnected ? "Conta já conectada neste protótipo." : "Status: aguardando consentimento seguro."}</div>`,
    insight: `<label class="field"><span>Período analisado</span><select><option>Últimos 7 dias</option><option>Este mês</option><option>Últimos 90 dias</option></select></label><label class="field"><span>Foco</span><select><option>Economia rápida</option><option>Risco de saldo</option><option>Assinaturas</option></select></label>`,
    detalhe: `<div class="status-line">2 transações relacionadas · confiança da IA: 91%</div><label class="field"><span>Ação recomendada</span><select><option>Criar limite</option><option>Ignorar por enquanto</option><option>Revisar categoria</option></select></label>`,
    evento: `<label class="field"><span>Descrição</span><input placeholder="Conta de luz"></label><label class="field"><span>Data</span><input type="date"></label><label class="field"><span>Valor previsto</span><input type="number" placeholder="180"></label>`,
    transacao: `<label class="field"><span>Valor</span><input type="number" placeholder="129,90"></label><label class="field"><span>Categoria</span><select><option>Alimentação</option><option>Moradia</option><option>Transporte</option><option>Saúde</option></select></label><label class="field"><span>Data</span><input type="date"></label><label class="field"><span>Recorrência</span><select><option>Única</option><option>Mensal</option><option>Semanal</option></select></label>`,
    meta: `<label class="field"><span>Nome da meta</span><input placeholder="Reserva da casa"></label><label class="field"><span>Valor-alvo</span><input type="number" placeholder="12000"></label><label class="field"><span>Valor atual</span><input type="number" placeholder="8400"></label><label class="field"><span>Prazo</span><input type="date"></label>`,
    planejamento: `<label class="field"><span>Renda prevista</span><input type="number" placeholder="6160"></label><label class="field"><span>Contas previstas</span><input type="number" placeholder="3924"></label><label class="field"><span>Limite de lazer</span><input type="number" placeholder="620"></label>`,
    pergunta: `<label class="field"><span>Sua pergunta</span><textarea placeholder="Posso gastar R$ 300 no fim de semana?"></textarea></label>`,
    categoria: `<label class="field"><span>Nome da regra</span><input placeholder="Delivery"></label><label class="field"><span>Quando encontrar</span><input placeholder="iFood, restaurante, lanche"></label><label class="field"><span>Classificar como</span><select><option>Alimentação</option><option>Lazer</option><option>Assinaturas</option></select></label>`,
    premium: `<label class="field"><span>Plano</span><select onchange="state.premiumPlan=this.value"><option value="familia">Família · R$ 29/mês</option><option value="solo">Solo · R$ 19/mês</option></select></label><div class="status-line">Inclui previsão de 90 dias, alertas familiares e relatórios compartilháveis.</div>`,
    suporte: `<label class="field"><span>Assunto</span><select><option>Conexão bancária</option><option>Categorias</option><option>Assinatura</option></select></label><label class="field"><span>Mensagem</span><textarea placeholder="Conte o que aconteceu"></textarea></label>`,
    ajuda: `<div class="status-line">A conexão bancária usa consentimento Open Finance e pode ser removida a qualquer momento em Segurança.</div>`,
    notificacao: `<div class="status-line">Resumo diário pronto · dois alertas leves aguardando revisão.</div><button class="secondary-button" onclick="closeModal(); setRoute('notificacoes')">Abrir preferências</button>`
  };
  return fields[kind] || fields.detalhe;
}

function completeModal(kind, action) {
  if (kind === "banco") state.bankConnected = true;
  if (kind === "insight" || kind === "pergunta") state.generatedInsight = true;
  if (kind === "premium") showToast(`Plano ${state.premiumPlan === "familia" ? "Família" : "Solo"} selecionado`);
  closeModal();
  showToast(`${action} concluído`);
}

function modalContent(kind) {
  const map = {
    onboarding: ["Onboarding", "Vamos configurar renda, metas e bancos para personalizar seu feed.", "Continuar"],
    banco: ["Conectar banco", "Escolha uma instituição para simular a conexão Open Finance.", "Conectar"],
    insight: ["Novo insight", "A IA vai revisar transações recentes e publicar um card no feed.", "Gerar"],
    detalhe: ["Detalhes do insight", "Transações relacionadas, explicação da IA e ação recomendada.", "Salvar"],
    evento: ["Novo evento", "Adicione uma conta, vencimento ou entrada prevista ao calendário.", "Adicionar"],
    transacao: ["Transação", "Edite valor, categoria, recorrência e observações.", "Salvar"],
    meta: ["Nova meta", "Defina objetivo, valor atual, valor-alvo e data desejada.", "Criar meta"],
    planejamento: ["Simulação", "Teste cenários de gasto e veja o impacto no saldo previsto.", "Simular"],
    pergunta: ["Perguntar para IA", "Digite uma dúvida financeira em linguagem natural.", "Enviar"],
    categoria: ["Regra de categoria", "Automatize a classificação por nome, valor ou recorrência.", "Salvar regra"],
    premium: ["Premium", "Ative recursos avançados de previsão e relatórios familiares.", "Assinar"],
    suporte: ["Suporte", "Envie uma mensagem para a central de ajuda.", "Enviar"],
    ajuda: ["Resposta", "Guia rápido da Casa Clara.", "Ok"],
    notificacao: ["Notificações", "Resumo diário e alertas recentes.", "Ok"]
  };
  const [title, text, action] = map[kind] || map.detalhe;
  return `<div class="modal-backdrop" onclick="if(event.target.className==='modal-backdrop') closeModal()">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header"><h2 id="modal-title">${title}</h2><button class="icon-button" onclick="closeModal()" title="Fechar" aria-label="Fechar">${icon("x", "inline-icon")}</button></div>
      <p>${text}</p>
      <div class="form">${modalFields(kind)}</div>
      <div class="button-row" style="margin-top:14px">
        <button class="primary-button" onclick="completeModal('${kind}', '${action}')">${action}</button>
        <button class="ghost-button" onclick="closeModal()">Cancelar</button>
      </div>
    </section>
  </div>`;
}

function authScreen2() {
  const isLogin = state.auth === "login";
  const isSignup = state.auth === "cadastro";
  const title = isLogin ? "Entrar na Casa Clara" : "Criar sua conta";
  const button = isLogin ? "Entrar" : "Criar conta";

  return `
    <main class="auth-screen">
      <section class="auth-panel">
        <div class="auth-logo brand">
          <span class="brand-mark">CC</span>
          <div><strong>Casa Clara</strong><span>feed inteligente de financas</span></div>
        </div>
        <div class="auth-tabs" role="tablist" aria-label="Acesso">
          <button class="tab ${isLogin ? "active" : ""}" type="button" role="tab" aria-selected="${isLogin}" onclick="setAuthMode('login')">Login</button>
          <button class="tab ${isSignup ? "active" : ""}" type="button" role="tab" aria-selected="${isSignup}" onclick="setAuthMode('cadastro')">Registrar</button>
        </div>
        <p class="eyebrow">${isSignup ? "Cadastro" : "Login"}</p>
        <h1>${title}</h1>
        <p>Veja sua rotina financeira como uma linha do tempo simples, visual e facil de consumir.</p>
        <form class="form" onsubmit="handleAuthSubmit(event)">
          ${isSignup ? `<label class="field"><span>Nome</span><input name="name" autocomplete="name" placeholder="Seu nome" required></label>` : ""}
          <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com" required></label>
          <label class="field"><span>Senha</span><input name="password" type="password" autocomplete="${isSignup ? "new-password" : "current-password"}" minlength="8" placeholder="********" required></label>
          ${state.authError ? `<div class="auth-error" role="alert">${state.authError}</div>` : ""}
          <button class="primary-button full" type="submit" ${state.authLoading ? "disabled" : ""}>${state.authLoading ? "Aguarde..." : button}</button>
        </form>
      </section>
      <section class="auth-art">
        <div class="phone-preview"><div class="phone-screen">${feedCards.slice(0, 3).map(feedCard).join("")}</div></div>
      </section>
    </main>
  `;
}

function adminLoginScreen() {
  return `
    <main class="admin-screen">
      <section class="auth-panel admin-login">
        <div class="auth-logo brand">
          <span class="brand-mark">AD</span>
          <div><strong>Admin Casa Clara</strong><span>dados ficticios para testes</span></div>
        </div>
        <p class="eyebrow">Area protegida</p>
        <h1>Entrar no admin</h1>
        <p>Use um usuario com role ADMIN para gerenciar dados volateis do ambiente.</p>
        <form class="form" onsubmit="handleAuthSubmit(event)">
          <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label>
          <label class="field"><span>Senha</span><input name="password" type="password" autocomplete="current-password" required></label>
          ${state.authError || adminState.error ? `<div class="auth-error" role="alert">${state.authError || adminState.error}</div>` : ""}
          <button class="primary-button full" type="submit" ${state.authLoading ? "disabled" : ""}>${state.authLoading ? "Aguarde..." : "Entrar"}</button>
        </form>
      </section>
    </main>
  `;
}

function adminLayout() {
  if (!state.user) return adminLoginScreen();
  if (state.user.role !== "ADMIN") {
    return `<main class="admin-screen"><section class="auth-panel admin-login"><h1>Acesso negado</h1><p>Seu usuario nao possui role ADMIN.</p><button class="primary-button" onclick="logout()">Sair</button></section></main>`;
  }

  const tabs = [
    ["users", "Users"],
    ["accounts", "Accounts"],
    ["categories", "Categories"],
    ["transactions", "Transactions"]
  ];

  return `
    <main class="admin-shell">
      <header class="admin-header">
        <div><p class="eyebrow">Admin</p><h1>CRUD de testes</h1><p>Dados ficticios no PostgreSQL via Prisma.</p></div>
        <div class="button-row">
          <button class="secondary-button" onclick="goHome()">Inicio</button>
          <button class="secondary-button" onclick="adminLoad()">Atualizar</button>
          <button class="ghost-button" onclick="logout()">Sair</button>
        </div>
      </header>
      ${adminState.error ? `<div class="auth-error" role="alert">${adminState.error}</div>` : ""}
      <nav class="admin-tabs">${tabs.map(([id, label]) => `<button class="tab ${adminState.tab === id ? "active" : ""}" onclick="adminSetTab('${id}')">${label}</button>`).join("")}</nav>
      ${adminState.loading ? loadingView() : adminResource(adminState.tab)}
    </main>
  `;
}

function adminResource(resource) {
  const item = adminState.editing?.resource === resource
    ? adminState.data[resource].find(row => row.id === adminState.editing.id)
    : null;

  return `
    <section class="admin-grid">
      <article class="info-card">
        <h2>${item ? "Editar" : "Criar"} ${resource}</h2>
        ${adminForm(resource, item)}
      </article>
      <article class="info-card admin-table-card">
        <div class="section-header"><h2>Registros</h2><span class="mini-button">${adminState.data[resource].length}</span></div>
        ${adminTable(resource)}
      </article>
    </section>
  `;
}

function adminForm(resource, item) {
  const forms = {
    users: `
      <form class="form" onsubmit="adminSubmit('users', event)">
        <label class="field"><span>Nome</span><input name="name" value="${adminValue(item, "name")}" required></label>
        <label class="field"><span>E-mail</span><input name="email" type="email" value="${adminValue(item, "email")}" required></label>
        <label class="field"><span>Senha</span><input name="password" type="password" minlength="8" placeholder="${item ? "Manter senha atual" : "Minimo 8 caracteres"}" ${item ? "" : "required"}></label>
        <label class="field"><span>Role</span><select name="role"><option ${adminValue(item, "role", "USER") === "USER" ? "selected" : ""}>USER</option><option ${adminValue(item, "role") === "ADMIN" ? "selected" : ""}>ADMIN</option></select></label>
        ${adminFormActions()}
      </form>`,
    accounts: `
      <form class="form" onsubmit="adminSubmit('accounts', event)">
        <label class="field"><span>User</span><select name="userId" required>${adminOptions("users", adminValue(item, "userId"))}</select></label>
        <label class="field"><span>Nome</span><input name="name" value="${adminValue(item, "name")}" required></label>
        <label class="field"><span>Tipo</span><select name="type">${["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"].map(v => `<option ${adminValue(item, "type", "CHECKING") === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
        <label class="field"><span>Saldo</span><input name="balance" type="number" step="0.01" value="${adminValue(item, "balance", 0)}"></label>
        <label class="field"><span>Instituicao</span><input name="institution" value="${adminValue(item, "institution")}"></label>
        ${adminFormActions()}
      </form>`,
    categories: `
      <form class="form" onsubmit="adminSubmit('categories', event)">
        <label class="field"><span>User</span><select name="userId" required>${adminOptions("users", adminValue(item, "userId"))}</select></label>
        <label class="field"><span>Nome</span><input name="name" value="${adminValue(item, "name")}" required></label>
        <label class="field"><span>Tipo</span><select name="type"><option ${adminValue(item, "type", "EXPENSE") === "EXPENSE" ? "selected" : ""}>EXPENSE</option><option ${adminValue(item, "type") === "INCOME" ? "selected" : ""}>INCOME</option></select></label>
        <label class="field"><span>Cor</span><input name="color" value="${adminValue(item, "color", "#2563eb")}"></label>
        <label class="field"><span>Icone</span><input name="icon" value="${adminValue(item, "icon", "cart")}"></label>
        <label class="check-field"><input name="isDefault" type="checkbox" ${adminValue(item, "isDefault") ? "checked" : ""}> <span>Padrao</span></label>
        ${adminFormActions()}
      </form>`,
    transactions: `
      <form class="form" onsubmit="adminSubmit('transactions', event)">
        <label class="field"><span>User</span><select name="userId" required>${adminOptions("users", adminValue(item, "userId"))}</select></label>
        <label class="field"><span>Conta</span><select name="accountId" required>${adminOptions("accounts", adminValue(item, "accountId"))}</select></label>
        <label class="field"><span>Categoria</span><select name="categoryId"><option value="">Sem categoria</option>${adminOptions("categories", adminValue(item, "categoryId"))}</select></label>
        <label class="field"><span>Tipo</span><select name="type">${["INCOME", "EXPENSE", "TRANSFER"].map(v => `<option ${adminValue(item, "type", "EXPENSE") === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
        <label class="field"><span>Valor</span><input name="amount" type="number" step="0.01" value="${adminValue(item, "amount", 1)}" required></label>
        <label class="field"><span>Descricao</span><input name="description" value="${adminValue(item, "description")}" required></label>
        <label class="field"><span>Data</span><input name="occurredAt" type="date" value="${adminValue(item, "occurredAt", new Date().toISOString().slice(0, 10))}" required></label>
        <label class="field"><span>Status</span><select name="status">${["PENDING", "CONFIRMED", "CANCELED"].map(v => `<option ${adminValue(item, "status", "CONFIRMED") === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
        <label class="field"><span>Notas</span><textarea name="notes">${adminValue(item, "notes")}</textarea></label>
        ${adminFormActions()}
      </form>`
  };

  return forms[resource];
}

function adminFormActions() {
  return `<div class="button-row"><button class="primary-button" type="submit">Salvar</button>${adminState.editing ? `<button class="ghost-button" type="button" onclick="adminCancelEdit()">Cancelar</button>` : ""}</div>`;
}

function adminTable(resource) {
  const rows = adminState.data[resource];
  if (!rows.length) return emptyState("Sem registros", "Crie dados ficticios pelo formulario ao lado.");

  return `<div class="admin-table">${rows.map(row => `
    <div class="admin-row">
      <div><strong>${row.email || row.name || row.description}</strong><small>${adminRowMeta(resource, row)}</small></div>
      <div class="button-row">
        <button class="mini-button" onclick="adminStartEdit('${resource}', '${row.id}')">Editar</button>
        <button class="mini-button danger" onclick="adminDelete('${resource}', '${row.id}')">Excluir</button>
      </div>
    </div>
  `).join("")}</div>`;
}

function adminRowMeta(resource, row) {
  const map = {
    users: `${row.role} · ${row.id}`,
    accounts: `${row.type} · ${row.user?.email || row.userId}`,
    categories: `${row.type} · ${row.user?.email || row.userId}`,
    transactions: `${money.format(Number(row.amount))} · ${row.status} · ${row.account?.name || row.accountId}`
  };

  return map[resource];
}

function render() {
  document.body.dataset.theme = state.theme;
  document.querySelector("#app").innerHTML = `${state.route === "admin" ? adminLayout() : state.route === "auth" ? authScreen2() : appShell()}${tutorialOverlay()}${adminShortcut()}`;
  if (state.modal) window.setTimeout(() => document.querySelector(".modal button, .modal input, .modal select, .modal textarea")?.focus(), 0);
}

function tutorialOverlay() {
  if (!state.tutorial.active || state.route === "admin" || state.route === "auth") return "";

  const step = tutorialSteps[state.tutorial.index];
  const current = state.tutorial.index + 1;
  const total = tutorialSteps.length;
  const progress = Math.round((current / total) * 100);

  return `
    <div class="tutorial-layer" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section class="tutorial-card">
        <div class="tutorial-top">
          <span class="tutorial-pill">Tutorial ${current}/${total}</span>
          <button class="ghost-button" onclick="finishTutorial()">Pular</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        <h2 id="tutorial-title">${step.title}</h2>
        <p>${step.text}</p>
        <div class="tutorial-actions">
          <button class="ghost-button" onclick="previousTutorialStep()" ${state.tutorial.index === 0 ? "disabled" : ""}>Voltar</button>
          <button class="primary-button" onclick="nextTutorialStep()">${step.action}</button>
        </div>
      </section>
    </div>
  `;
}

function adminShortcut() {
  return `<a class="admin-shortcut" href="/admin" onclick="openAdminLogin(event)" title="Abrir E-NooB ADM">E-NooB ADM</a>`;
}

function goHome() {
  window.history.pushState({}, "", "/");
  state.route = state.user ? "feed" : "auth";
  adminState.error = "";
  adminState.editing = null;
  render();
}

function openAdminLogin(event) {
  event.preventDefault();
  localStorage.removeItem("casa-clara-token");
  localStorage.removeItem("casa-clara-user");
  state.user = null;
  state.route = "admin";
  state.auth = "login";
  state.authError = "";
  adminState.error = "";
  adminState.editing = null;
  adminState.data = { users: [], accounts: [], categories: [], transactions: [] };
  window.history.pushState({}, "", "/admin");
  render();
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && state.modal) closeModal();
});

Object.assign(window, {
  setRoute,
  startTutorial,
  nextTutorialStep,
  previousTutorialStep,
  finishTutorial,
  showToast,
  openModal,
  closeModal,
  setAuthMode,
  handleAuthSubmit,
  logout,
  setTheme,
  setTransactionTab,
  toggleState,
  savePlan,
  completeModal,
  adminLoad,
  adminSetTab,
  adminStartEdit,
  adminCancelEdit,
  adminSubmit,
  adminDelete,
  goHome,
  openAdminLogin,
  render,
  state
});

render();
if (state.route === "admin" && state.user?.role === "ADMIN") adminLoad();
