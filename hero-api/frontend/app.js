const API_BASE = "http://127.0.0.1:8000";
const PAGE_SIZE = 10;
const state = {
    currentPage: 1, totalHeroes: 0, heroes: [], teams: [],
    filters: { name: "", min_age: "", team_id: "" }
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE}${endpoint}`,
        { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options }
    );
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }
    if (!response.ok) {
        const message = data?.detail || data?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
    }
    return data;
}
let toastTimeout = null;
function showToast(message, type = "success") {
    const toast = $("#toast");
    const toastMessage = $("#toast-message");
    const toastIcon = $("#toast-icon");
    toastMessage.textContent = message;
    toast.classList.remove("success", "error", "show");
    toast.classList.add(type);
    toastIcon.textContent = type === "success" ? "✓" : "!";
    requestAnimationFrame(() => { toast.classList.add("show"); });
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove("show"); }, 3000);
}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}
function closeModal(modal) {
    if (!modal) {
        return;
    }
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}
function closeAllModals() {
    $$(".modal").forEach(closeModal);
}
function updatePageTitle() {
    const hash = window.location.hash || "#dashboard";
    const titles = { "#dashboard": "Dashboard", "#heroes": "Heroes", "#teams": "Teams" };
    $("#page-title").textContent = titles[hash] || "Dashboard";
    $$(".nav-item").forEach((item) => { item.classList.toggle("active", item.getAttribute("href") === hash); });
}
function setupNavigation() {
    window.addEventListener("hashchange", updatePageTitle);
    updatePageTitle();
}
async function loadTeams() {
    try {
        const data = await apiRequest("/teams");
        state.teams = Array.isArray(data) ? data : data?.items || [];
        renderTeamFilters();
        renderTeams();
    } catch (error) {
        console.error("Failed to load teams:", error);
        showToast("Could not load teams.", "error");
    }
}
function renderTeamFilters() {
    const filter = $("#team-filter");
    const formTeam = $("#hero-form-team");
    if (filter) {
        filter.innerHTML = `
            <option value="">
                All teams
            </option>
        `;
        state.teams.forEach((team) => {
            filter.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${team.id}">
                    ${escapeHtml(team.name)}
                </option>
                `
            );
        });
        filter.value = state.filters.team_id;
    }
    if (formTeam) {
        formTeam.innerHTML = `
            <option value="">
                No team
            </option>
        `;
        state.teams.forEach((team) => {
            formTeam.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${team.id}">
                    ${escapeHtml(team.name)}
                </option>
                `
            );
        });
    }
}
async function loadHeroes() {
    const tbody = $("#heroes-table-body");
    tbody.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="table-loading">
                    Loading heroes...
                </div>
            </td>
        </tr>
    `;
    try {
        const params = new URLSearchParams();
        params.set("offset", String((state.currentPage - 1) * PAGE_SIZE));
        params.set("limit", String(PAGE_SIZE));
        if (state.filters.name) {
            params.set("name", state.filters.name);
        }
        if (state.filters.min_age) {
            params.set("min_age", state.filters.min_age);
        }
        if (state.filters.team_id) {
            params.set("team_id", state.filters.team_id);
        }
        const data = await apiRequest(
            `/heroes?${params.toString()}`
        );
        state.heroes = Array.isArray(data) ? data : data?.items || [];
        state.totalHeroes = data?.total ?? state.heroes.length;
        renderHeroes();
        updatePagination();
        renderRecentHeroes();
    } catch (error) {
        console.error(
            "Failed to load heroes:",
            error
        );
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        Failed to load heroes.
                    </div>
                </td>
            </tr>
        `;
        showToast(
            "Could not load heroes.",
            "error"
        );
    }
}
function renderHeroes() {
    const tbody = $("#heroes-table-body");
    const resultCount = $("#hero-result-count");
    if (!state.heroes.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        No heroes found.
                    </div>
                </td>
            </tr>
        `;
        resultCount.textContent = "No heroes found.";
        return;
    }
    resultCount.textContent =
        `${state.heroes.length} hero(s) displayed`;
    tbody.innerHTML =
        state.heroes
            .map(hero => {
                const team =
                    findTeam(hero.team_id);
                return `
                    <tr>
                        <td>
                            <span class="table-id">
                                #${hero.id}
                            </span>
                        </td>
                        <td>
                            <span class="hero-name">
                                ${escapeHtml(hero.name)}
                            </span>
                        </td>
                        <td>
                            ${hero.age ?? "-"}
                        </td>
                        <td>
                            ${team
                        ? `
                                    <span class="team-badge">
                                        ${escapeHtml(team.name)}
                                    </span>
                                  `
                        : `
                                    <span class="no-team">
                                        No team
                                    </span>
                                  `
                    }
                        </td>
                        <td>
                            <div class="table-actions">
                                <button
                                    class="icon-button delete"
                                    type="button"
                                    title="Delete hero"
                                    data-delete-hero="${hero.id}"
                                >
                                    ×
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");
}
function renderRecentHeroes() {
    const container = $("#recent-heroes");
    if (!state.heroes.length) {
        container.innerHTML = `
            <div class="empty-state small">
                No heroes available.
            </div>
        `;
        return;
    }
    container.innerHTML =
        state.heroes
            .slice(0, 5)
            .map(hero => {
                const initial =
                    hero.name
                        ? hero.name
                            .charAt(0)
                            .toUpperCase()
                        : "?";
                const team =
                    findTeam(hero.team_id);
                return `
                    <div class="recent-item">
                        <div class="avatar">
                            ${initial}
                        </div>
                        <div>
                            <strong>
                                ${escapeHtml(hero.name)}
                            </strong>
                            <span>
                                ${team
                        ? escapeHtml(team.name)
                        : "No team"
                    }
                            </span>
                        </div>
                    </div>
                `;
            })
            .join("");
}
function updatePagination() {
    const previous = $("#prev-page");
    const next = $("#next-page");
    const pageInfo = $("#page-info");
    const totalPages =
        Math.max(
            1,
            Math.ceil(
                state.totalHeroes /
                PAGE_SIZE
            )
        );
    pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
    previous.disabled = state.currentPage <= 1;
    next.disabled = state.currentPage >= totalPages;
}
async function loadTeamMembers(team) {
    try {
        const heroes = await apiRequest(`/teams/${team.id}/heroes`);
        return Array.isArray(heroes)
            ? heroes
            : heroes?.items || [];
    } catch (error) {
        console.error(`Failed to load heroes for team ${team.id}:`, error);
        return [];
    }
}
async function renderTeams() {
    const container = $("#teams-grid");
    if (!state.teams.length) {
        container.innerHTML = `
            <div class="empty-state">
                No teams available.
            </div>
        `;
        return;
    }
    container.innerHTML =
        state.teams
            .map(team => {
                const initial =
                    team.name
                        ? team.name
                            .charAt(0)
                            .toUpperCase()
                        : "?";
                return `
                    <article
                        class="team-card"
                        data-team-card="${team.id}"
                    >
                        <div class="team-card-header">
                            <div>
                                <h4>
                                    ${escapeHtml(team.name)}
                                </h4>
                                <span class="team-card-location">
                                    ${escapeHtml(
                    team.headquarters ||
                    "No headquarters"
                )}
                                </span>
                            </div>
                            <div class="team-avatar">
                                ${initial}
                            </div>
                        </div>
                        <div class="team-members">
                            <div class="team-members-title">
                                <span>
                                    Members
                                </span>
                                <span
                                    class="member-count"
                                >
                                    ...
                                </span>
                            </div>
                            <div
                                class="member-list"
                                data-members="${team.id}"
                            >
                                <span class="no-team">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    </article>
                `;
            })
            .join("");
    for (const team of state.teams) {
        const members = await loadTeamMembers(team);
        const list = document.querySelector(`[data-members="${team.id}"]`);
        const count =
            document.querySelector(`[data-team-card="${team.id}"] .member-count`);
        if (!list) {
            continue;
        }
        if (count) {
            count.textContent = String(members.length);
        }
        if (!members.length) {
            list.innerHTML = `
                <span class="no-team">
                    No heroes
                </span>
            `;
            continue;
        }
        list.innerHTML =
            members
                .slice(0, 8)
                .map(member => `
                    <span class="member-badge">
                        ${escapeHtml(member.name)}
                    </span>
                `)
                .join("");
    }
}
async function createHero(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
        name:
            formData.get("name").trim(),

        age:
            Number(formData.get("age")),

        secret_name:
            formData.get("secret_name").trim()
    };
    const teamId = formData.get("team_id");
    if (teamId) {
        payload.team_id = Number(teamId);
    }
    try {
        await apiRequest(
            "/heroes",
            {
                method: "POST",
                body:
                    JSON.stringify(payload)
            }
        );
        form.reset();
        closeAllModals();
        showToast("Hero created successfully.");
        await loadTeams();
        await loadHeroes();
        updateDashboardStats();
    } catch (error) {
        console.error("Failed to create hero:", error);
        showToast(
            error.message ||
            "Failed to create hero.",
            "error"
        );
    }
}

async function createTeam(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
        name:
            formData.get("name").trim(),
        headquarters:
            formData
                .get("headquarters")
                .trim()
    };
    try {
        await apiRequest(
            "/teams",
            {
                method: "POST",
                body:
                    JSON.stringify(payload)
            }
        );
        form.reset();
        closeAllModals();
        showToast("Team created successfully.");
        await loadTeams();
        await loadHeroes();
        updateDashboardStats();
    } catch (error) {
        console.error("Failed to create team:", error);
        showToast(
            error.message ||
            "Failed to create team.",
            "error"
        );
    }
}
async function deleteHero(heroId) {
    const confirmed =
        window.confirm("Are you sure you want to delete this hero?");
    if (!confirmed) {
        return;
    }
    try {
        await apiRequest(
            `/heroes/${heroId}`,
            {
                method: "DELETE"
            }
        );
        showToast(
            "Hero deleted successfully."
        );
        await loadHeroes();
        await loadTeams();
        updateDashboardStats();
    } catch (error) {
        console.error("Failed to delete hero:", error
        );
        showToast(
            error.message ||
            "Failed to delete hero.",
            "error"
        );
    }
}
function applyHeroFilters(event) {
    event.preventDefault();
    state.filters.name = $("#hero-name").value.trim();
    state.filters.min_age = $("#min-age").value;
    state.filters.team_id = $("#team-filter").value;
    state.currentPage = 1;
    loadHeroes();
}
async function updateDashboardStats() {
    try {
        const [heroes, teams] =
            await Promise.all([
                apiRequest("/heroes?limit=1000"),
                apiRequest("/teams")
            ]);
        const heroList =
            Array.isArray(heroes)
                ? heroes
                : heroes?.items || [];
        const teamList =
            Array.isArray(teams)
                ? teams
                : teams?.items || [];
        $("#total-heroes")
            .textContent =
            heroes?.total ??
            heroList.length;
        $("#total-teams")
            .textContent =
            teamList.length;
        $("#api-status-text")
            .textContent =
            "Online";
    } catch (error) {
        console.error("Dashboard stats error:", error);
        $("#api-status-text")
            .textContent =
            "Offline";
    }
}
function findTeam(teamId) {
    if (
        teamId === null ||
        teamId === undefined
    ) {
        return null;
    }
    return state.teams.find(
        team =>
            Number(team.id) ===
            Number(teamId)
    ) || null;
}
function escapeHtml(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setupEventListeners() {
    $$("[data-modal]").forEach(button => { button.addEventListener("click", () => { const modalId = button.dataset.modal; openModal(modalId); }); });
    $$("[data-close-modal]").forEach(element => { element.addEventListener("click", () => { closeAllModals(); }); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") { closeAllModals(); } });
    $("#hero-form").addEventListener("submit", createHero);
    $("#team-form").addEventListener("submit", createTeam);
    $("#hero-filter-form").addEventListener("submit", applyHeroFilters);
    $("#prev-page").addEventListener("click", () => { if (state.currentPage <= 1) { return; } state.currentPage--; loadHeroes(); });
    $("#next-page").addEventListener("click", () => { const totalPages = Math.ceil(state.totalHeroes / PAGE_SIZE); if (state.currentPage >= totalPages) { return; } state.currentPage++; loadHeroes(); });
    $("#refresh-btn").addEventListener("click", async () => { await loadTeams(); await loadHeroes(); await updateDashboardStats(); showToast("Dashboard refreshed."); });
    $("#heroes-table-body").addEventListener("click", event => { const button = event.target.closest("[data-delete-hero]"); if (!button) { return; } const heroId = button.dataset.deleteHero; deleteHero(heroId); });
}

async function initializeApp() {
    setupNavigation();
    setupEventListeners();
    try {
        await loadTeams();
        await loadHeroes();
        await updateDashboardStats();
    } catch (error) {
        console.error("Application initialization failed:", error);
        showToast("Failed to initialize dashboard.", "error");
    }
}

document.addEventListener("DOMContentLoaded", initializeApp);