(() => {
  const $ = (selector) => document.querySelector(selector);
  const panel = $("#p-admin");
  if (!panel) return;

  const client = window.gailSupabase;
  const login = $("#admin-login");
  const dashboard = $("#admin-dashboard");
  const status = $("#admin-status");
  const contentList = $("#admin-content-list");
  const feedbackList = $("#admin-feedback-list");
  const researchList = $("#admin-research-list");

  let editingContentId = "";
  let authVersion = 0;
  let cachedContent = [];
  let cachedFeedback = [];
  let cachedResearch = [];

  const setupMessage =
    window.GAIL_SUPABASE_CONFIG?.url && window.GAIL_SUPABASE_CONFIG?.anonKey
      ? "Supabase SDK tidak dapat dimuat. Periksa koneksi internet lalu muat ulang."
      : "Isi URL dan anon key Supabase di supabase-config.js, lalu jalankan supabase-schema.sql.";

  const pages = [
    ["beranda", "Beranda"],
    ["panduan", "Panduan"],
    ["model", "Model"],
    ["lab", "Lab"],
    ["misi", "Misi"],
    ["kartu", "Kartu"],
    ["lacak", "Pelacak"],
    ["log", "Log AI"],
    ["asesmen", "Asesmen"],
    ["riset", "Riset"],
    ["saran", "Saran"],
    ["tentang", "Tentang"],
  ];

  const dimensions = [
    "Knowledge",
    "Awareness",
    "Impact Recognition",
    "Need Evaluation",
    "Efficiency Judgment",
    "Reflection"
  ];

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.setAttribute("role", isError ? "alert" : "status");
    status.dataset.error = String(isError);
  }

  function isMissingTableError(error) {
    return (
      error?.code === "PGRST205" ||
      /Could not find the table 'public\.(site_content|research_results|feedback)' in the schema cache/i.test(
        error?.message || "",
      )
    );
  }

  function getErrorMessage(error) {
    const message = error?.message || "Operasi gagal.";
    if (isMissingTableError(error)) {
      return "Tabel Supabase belum tersedia. Jalankan supabase-schema.sql di SQL Editor proyek Supabase.";
    }
    if (
      error?.code === "invalid_credentials" ||
      /invalid login credentials/i.test(message)
    ) {
      return "Email atau kata sandi salah. Pastikan akun sudah dibuat dan emailnya telah dikonfirmasi.";
    }
    if (
      error?.code === "email_not_confirmed" ||
      /email not confirmed/i.test(message)
    ) {
      return "Konfirmasi email akun admin sebelum masuk.";
    }
    return message;
  }

  function clearList(target, message) {
    target.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "mu";
    empty.textContent = message;
    target.append(empty);
  }

  function addText(parent, tag, value, className = "") {
    const node = document.createElement(tag);
    node.textContent = value ?? "";
    if (className) node.className = className;
    parent.append(node);
    return node;
  }

  function makeButton(label, action, className = "btn o") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", () => handle(action));
    return button;
  }

  function updateKPIs() {
    const feedbackKpi = $("#kpi-feedback");
    const contentKpi = $("#kpi-content");
    const researchKpi = $("#kpi-research");
    const statusKpi = $("#kpi-status");

    if (feedbackKpi) feedbackKpi.textContent = cachedFeedback.length;
    if (contentKpi) {
      const publishedCount = cachedContent.filter((c) => c.is_published).length;
      contentKpi.textContent = publishedCount;
    }
    if (researchKpi) researchKpi.textContent = cachedResearch.length;
    if (statusKpi) {
      statusKpi.textContent = client ? "Online" : "Offline";
      statusKpi.style.color = client ? "var(--g)" : "var(--b)";
    }
  }

  function setupAdminTabs() {
    const tabs = document.querySelectorAll(".admin-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        const target = tab.dataset.tab;

        const contentSec = $("#admin-section-content");
        const feedbackSec = $("#admin-section-feedback");
        const researchSec = $("#admin-section-research");

        if (target === "all") {
          if (contentSec) contentSec.hidden = false;
          if (feedbackSec) feedbackSec.hidden = false;
          if (researchSec) researchSec.hidden = false;
        } else {
          if (contentSec) contentSec.hidden = target !== "content";
          if (feedbackSec) feedbackSec.hidden = target !== "feedback";
          if (researchSec) researchSec.hidden = target !== "research";
        }
      });
    });
  }

  function setupLivePreview() {
    const titleInput = $("#content-title");
    const bodyInput = $("#content-body");
    const previewContainer = $("#content-preview-container");
    const previewTitle = $("#content-preview-title");
    const previewBody = $("#content-preview-body");

    function updatePreview() {
      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();
      if (!title && !body) {
        if (previewContainer) previewContainer.hidden = true;
        return;
      }
      if (previewContainer) previewContainer.hidden = false;
      if (previewTitle) previewTitle.textContent = title || "Judul blok konten";
      if (previewBody) previewBody.textContent = body || "Isi teks blok konten...";
    }

    if (titleInput) titleInput.addEventListener("input", updatePreview);
    if (bodyInput) bodyInput.addEventListener("input", updatePreview);
  }

  async function loadPublishedContent() {
    if (!client) return;
    const { data, error } = await client
      .from("site_content")
      .select("id,page,title,body,sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      const log = isMissingTableError(error) ? console.warn : console.error;
      log.call(console, "Gagal memuat konten terbitan:", getErrorMessage(error));
      return;
    }

    document.querySelectorAll(".dynamic-content").forEach((node) => node.remove());
    for (const item of data ?? []) {
      const page = document.querySelector(`#p-${CSS.escape(item.page)}`);
      if (!page) continue;
      let section = page.querySelector(".dynamic-content");
      if (!section) {
        section = document.createElement("section");
        section.className = "dynamic-content";
        const wrapper = document.createElement("div");
        wrapper.className = "w";
        section.append(wrapper);
        page.append(section);
      }
      const article = document.createElement("article");
      article.className = "dynamic-content-item";
      addText(article, "h2", item.title);
      addText(article, "p", item.body);
      section.querySelector(".w").append(article);
    }
  }

  function resetContentForm() {
    editingContentId = "";
    $("#content-form").reset();
    $("#content-form-title").textContent = "Tambah blok konten";
    $("#content-save").textContent = "Simpan blok";
    const previewContainer = $("#content-preview-container");
    if (previewContainer) previewContainer.hidden = true;
  }

  function renderContentList() {
    contentList.replaceChildren();
    const filterPage = $("#content-filter-page")?.value || "all";
    const items = filterPage === "all"
      ? cachedContent
      : cachedContent.filter((c) => c.page === filterPage);

    if (!items.length) {
      clearList(contentList, "Belum ada blok konten untuk halaman ini.");
      return;
    }

    for (const item of items) {
      const article = document.createElement("article");
      article.className = "admin-entry";
      const pageName = pages.find(([key]) => key === item.page)?.[1] ?? item.page;

      const headerRow = document.createElement("div");
      headerRow.className = "row";
      headerRow.style.justifyContent = "space-between";
      headerRow.style.alignItems = "center";
      headerRow.style.margin = "0 0 0.5rem 0";

      addText(headerRow, "h3", item.title);

      const statusBadge = document.createElement("span");
      statusBadge.className = item.is_published ? "badge-published" : "badge-draft";
      statusBadge.textContent = item.is_published ? "Terbit" : "Draf";
      headerRow.append(statusBadge);

      article.append(headerRow);
      addText(article, "p", `${pageName} · Urutan ${item.sort_order}`, "mu");
      addText(article, "p", item.body);

      const actionRow = document.createElement("div");
      actionRow.className = "row";
      actionRow.style.marginTop = "1rem";

      actionRow.append(
        makeButton("Ubah", () => {
          editingContentId = item.id;
          $("#content-page").value = item.page;
          $("#content-title").value = item.title;
          $("#content-body").value = item.body;
          $("#content-order").value = item.sort_order;
          $("#content-published").checked = item.is_published;
          $("#content-form-title").textContent = "Ubah blok konten";
          $("#content-save").textContent = "Simpan perubahan";
          const previewContainer = $("#content-preview-container");
          const previewTitle = $("#content-preview-title");
          const previewBody = $("#content-preview-body");
          if (previewContainer) previewContainer.hidden = false;
          if (previewTitle) previewTitle.textContent = item.title;
          if (previewBody) previewBody.textContent = item.body;
          $("#content-title").focus();
        }),
        makeButton("Hapus", async () => {
          if (!confirm(`Hapus blok "${item.title}"?`)) return;
          const { error: deleteError } = await client
            .from("site_content")
            .delete()
            .eq("id", item.id);
          if (deleteError) throw deleteError;
          await refreshDashboard();
          setStatus("Blok konten dihapus.");
        }),
      );

      article.append(actionRow);
      contentList.append(article);
    }
  }

  async function loadContent() {
    const { data, error } = await client
      .from("site_content")
      .select("id,page,title,body,sort_order,is_published")
      .order("page", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw error;

    cachedContent = data || [];
    renderContentList();
    updateKPIs();
  }

  function renderFeedbackList() {
    feedbackList.replaceChildren();

    const search = $("#feedback-search")?.value.trim().toLowerCase() || "";
    const category = $("#feedback-filter-category")?.value || "all";
    const kind = $("#feedback-filter-kind")?.value || "all";

    const filtered = cachedFeedback.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchKind = kind === "all" || item.kind === kind;
      const matchSearch =
        !search ||
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.message && item.message.toLowerCase().includes(search));
      return matchCat && matchKind && matchSearch;
    });

    if (!filtered.length) {
      clearList(feedbackList, "Tidak ada masukan yang sesuai dengan filter.");
      return;
    }

    for (const item of filtered) {
      const article = document.createElement("article");
      article.className = "admin-entry";

      const headerRow = document.createElement("div");
      headerRow.className = "row";
      headerRow.style.justifyContent = "space-between";
      headerRow.style.alignItems = "center";
      headerRow.style.margin = "0 0 0.5rem 0";

      const title = `${item.category} · ${item.role}`;
      addText(headerRow, "h3", title);

      const kindBadge = document.createElement("span");
      kindBadge.className = `badge-kind ${item.kind.toLowerCase()}`;
      kindBadge.textContent = item.kind;
      headerRow.append(kindBadge);

      article.append(headerRow);

      const meta = `${item.name || "Anonim"} · ${new Date(item.created_at).toLocaleString("id-ID")}`;
      addText(article, "p", meta, "mu");
      addText(article, "p", item.message);

      const actionRow = document.createElement("div");
      actionRow.className = "row";
      actionRow.style.marginTop = "1rem";
      actionRow.append(
        makeButton("Hapus", async () => {
          if (!confirm("Hapus masukan ini?")) return;
          const { error: deleteError } = await client
            .from("feedback")
            .delete()
            .eq("id", item.id);
          if (deleteError) throw deleteError;
          await refreshDashboard();
          setStatus("Masukan dihapus.");
        }),
      );

      article.append(actionRow);
      feedbackList.append(article);
    }
  }

  function exportFeedbackCSV() {
    if (!cachedFeedback.length) {
      alert("Belum ada masukan untuk diekspor.");
      return;
    }

    const headers = ["ID", "Waktu", "Nama", "Peran", "Kategori", "Jenis", "Pesan"];
    const rows = cachedFeedback.map((f) => [
      f.id,
      new Date(f.created_at).toLocaleString("id-ID"),
      f.name || "Anonim",
      f.role,
      f.category,
      f.kind,
      `"${(f.message || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `masukan-pengguna-gail-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus("File CSV masukan berhasil diunduh.");
  }

  async function loadFeedback() {
    const { data, error } = await client
      .from("feedback")
      .select("id,role,category,kind,message,name,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;

    cachedFeedback = data || [];
    renderFeedbackList();
    updateKPIs();
  }

  async function loadResearch() {
    const { data, error } = await client
      .from("research_results")
      .select("id,participant_count,pre_scores,post_scores,notes,is_published,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    cachedResearch = data || [];
    researchList.replaceChildren();

    if (!cachedResearch.length) {
      clearList(researchList, "Belum ada hasil riset.");
      updateKPIs();
      return;
    }

    for (const item of cachedResearch) {
      const article = document.createElement("article");
      article.className = "admin-entry";

      const headerRow = document.createElement("div");
      headerRow.className = "row";
      headerRow.style.justifyContent = "space-between";
      headerRow.style.alignItems = "center";
      headerRow.style.margin = "0 0 0.5rem 0";

      addText(headerRow, "h3", `${item.participant_count} Peserta`);

      const statusBadge = document.createElement("span");
      statusBadge.className = item.is_published ? "badge-published" : "badge-draft";
      statusBadge.textContent = item.is_published ? "Terbit" : "Draf";
      headerRow.append(statusBadge);

      article.append(headerRow);
      addText(article, "p", `Tanggal: ${new Date(item.created_at).toLocaleDateString("id-ID")}`, "mu");

      const grid = document.createElement("div");
      grid.className = "research-dim-grid";

      item.pre_scores.forEach((preVal, idx) => {
        const postVal = item.post_scores[idx];
        const delta = (postVal - preVal).toFixed(1);
        const dimBox = document.createElement("div");
        dimBox.className = "research-dim-card";

        const dimTitle = document.createElement("span");
        dimTitle.className = "dim-name";
        dimTitle.textContent = dimensions[idx];

        const scoreText = document.createElement("span");
        scoreText.className = "dim-scores";
        scoreText.textContent = `${preVal} → ${postVal}`;

        const deltaTag = document.createElement("span");
        deltaTag.className = Number(delta) >= 0 ? "delta-pos" : "delta-neg";
        deltaTag.textContent = Number(delta) >= 0 ? `+${delta}` : delta;

        dimBox.append(dimTitle, scoreText, deltaTag);
        grid.append(dimBox);
      });

      article.append(grid);

      if (item.notes) {
        addText(article, "p", item.notes, "admin-research-notes");
      }

      const actionRow = document.createElement("div");
      actionRow.className = "row";
      actionRow.style.marginTop = "1rem";

      actionRow.append(
        makeButton(item.is_published ? "Jadikan draf" : "Terbitkan", async () => {
          const { error: updateError } = await client
            .from("research_results")
            .update({ is_published: !item.is_published })
            .eq("id", item.id);
          if (updateError) throw updateError;
          await refreshDashboard();
          setStatus("Status publikasi hasil riset diperbarui.");
        }),
        makeButton("Hapus", async () => {
          if (!confirm("Hapus hasil riset ini?")) return;
          const { error: deleteError } = await client
            .from("research_results")
            .delete()
            .eq("id", item.id);
          if (deleteError) throw deleteError;
          await refreshDashboard();
          setStatus("Hasil riset dihapus.");
        }),
      );

      article.append(actionRow);
      researchList.append(article);
    }

    updateKPIs();
  }

  async function refreshDashboard() {
    try {
      await Promise.all([loadContent(), loadFeedback(), loadResearch()]);
    } catch (error) {
      setStatus(`Gagal memuat dashboard: ${getErrorMessage(error)}`, true);
    }
  }

  async function setSession(session) {
    const currentVersion = ++authVersion;
    login.hidden = !!session;
    dashboard.hidden = !session;
    $("#admin-nav").hidden = true;
    if (!session) {
      setStatus(
        client
          ? "Masuk dengan akun super admin untuk membuka dashboard."
          : setupMessage,
      );
      return;
    }

    setStatus("Memeriksa akses super admin...");
    let profile;
    let error;
    try {
      const result = await client
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();
      profile = result.data;
      error = result.error;
    } catch (requestError) {
      error = requestError;
    }
    if (currentVersion !== authVersion) return;
    if (error) {
      login.hidden = false;
      dashboard.hidden = true;
      setStatus(`Gagal memverifikasi role: ${getErrorMessage(error)}`, true);
      return;
    }
    if (profile?.role !== "super_admin") {
      await client.auth.signOut();
      login.hidden = false;
      dashboard.hidden = true;
      setStatus("Akun ini tidak memiliki akses super admin.", true);
      return;
    }

    $("#admin-nav").hidden = false;
    setStatus(`Masuk sebagai ${session.user.email}.`);
    await refreshDashboard();
  }

  async function handle(action) {
    try {
      await action();
    } catch (error) {
      setStatus(getErrorMessage(error), true);
    }
  }

  $("#admin-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) {
      setStatus("Supabase belum dikonfigurasi.", true);
      return;
    }
    const submit = event.currentTarget.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      await handle(async () => {
        setStatus("Sedang masuk...");
        const { error } = await client.auth.signInWithPassword({
          email: $("#admin-email").value.trim(),
          password: $("#admin-password").value,
        });
        if (error) throw error;
        $("#admin-password").value = "";
      });
    } finally {
      submit.disabled = false;
    }
  });

  $("#admin-logout").addEventListener("click", () => {
    handle(async () => {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      setStatus("Sesi admin ditutup.");
    });
  });

  $("#content-cancel").addEventListener("click", resetContentForm);
  $("#content-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handle(async () => {
      if (!client) throw new Error("Supabase belum dikonfigurasi.");
      const values = {
        page: $("#content-page").value,
        title: $("#content-title").value.trim(),
        body: $("#content-body").value.trim(),
        sort_order: Number($("#content-order").value) || 0,
        is_published: $("#content-published").checked,
      };
      const query = editingContentId
        ? client.from("site_content").update(values).eq("id", editingContentId)
        : client.from("site_content").insert(values);
      const { error } = await query;
      if (error) throw error;
      resetContentForm();
      await Promise.all([loadContent(), loadPublishedContent()]);
      setStatus("Blok konten tersimpan.");
    });
  });

  $("#research-form").addEventListener("submit", (event) => {
    event.preventDefault();
    handle(async () => {
      if (!client) throw new Error("Supabase belum dikonfigurasi.");
      const preScores = Array.from({ length: 6 }, (_, index) =>
        Number($("#research-pre-" + index).value),
      );
      const postScores = Array.from({ length: 6 }, (_, index) =>
        Number($("#research-post-" + index).value),
      );
      if (
        [...preScores, ...postScores].some(
          (score) => !Number.isFinite(score) || score < 4 || score > 16,
        )
      ) {
        throw new Error("Semua skor harus berada di antara 4 dan 16.");
      }
      const { error } = await client.from("research_results").insert({
        participant_count: Number($("#research-count").value),
        pre_scores: preScores,
        post_scores: postScores,
        notes: $("#research-notes").value.trim(),
        is_published: $("#research-published").checked,
      });
      if (error) throw error;
      $("#research-form").reset();
      await Promise.all([loadResearch(), loadPublishedContent()]);
      setStatus("Hasil riset tersimpan.");
    });
  });

  $("#admin-refresh").addEventListener("click", () => {
    handle(refreshDashboard);
  });

  $("#content-filter-page")?.addEventListener("change", renderContentList);
  $("#feedback-search")?.addEventListener("input", renderFeedbackList);
  $("#feedback-filter-category")?.addEventListener("change", renderFeedbackList);
  $("#feedback-filter-kind")?.addEventListener("change", renderFeedbackList);
  $("#feedback-export-csv")?.addEventListener("click", exportFeedbackCSV);

  setupAdminTabs();
  setupLivePreview();

  if (!client) {
    login.hidden = false;
    dashboard.hidden = true;
    setStatus(setupMessage);
    return;
  }

  client.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      setSession(session).catch((error) =>
        setStatus(`Gagal memeriksa akses: ${error.message}`, true),
      );
    }, 0);
  });

  client.auth
    .getSession()
    .then(({ data, error }) => {
      if (error) throw error;
      return setSession(data.session);
    })
    .catch((error) =>
      setStatus(`Gagal memeriksa sesi Supabase: ${error.message}`, true),
    );

  loadPublishedContent();
})();
