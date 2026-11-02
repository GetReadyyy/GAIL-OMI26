const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-go]");
  if (b) route(b.dataset.go, true);
  const l = e.target.closest("[data-login]");
  if (l) op(l.dataset.login);
});
$("#th").onclick = () => {
  const r = document.documentElement,
    d =
      r.dataset.theme === "dark" ||
      (!r.dataset.theme && matchMedia("(prefers-color-scheme:dark)").matches);
  r.dataset.theme = d ? "light" : "dark";
};

const steps = [
  "Prompt dikirim",
  "Pemrosesan di server atau perangkat",
  "Komputasi memakai listrik",
  "Pusat data perlu pendinginan, air bisa terpakai",
  "Dampak bergantung pada konteks",
];
const caps = [
  "Kamu mengirim prompt. Dari sinilah rantainya mulai.",
  "Model yang sudah dilatih memproses inputmu (inference). Ini bisa di pusat data atau di perangkatmu.",
  "Pemrosesan membutuhkan listrik, dan sumber listriknya berbeda di tiap tempat.",
  "Perangkat keras menghasilkan panas. Sebagian sistem pendingin memakai air.",
  "Dampak lingkungan berbeda menurut model, lokasi, sumber energi, dan jenis tugas. Banyak orang sekaligus membuat jejaknya terasa.",
];
$("#chain").innerHTML = steps
  .map((s) => '<div class="node">' + s + "</div>")
  .join("");
let busy = 0;
$("#ask").onsubmit = (e) => {
  e.preventDefault();
  if (busy) return;
  busy = 1;
  const ns = document.querySelectorAll(".node");
  ns.forEach((n) => n.classList.remove("on", "done"));
  let i = 0;
  (function nx() {
    if (i >= 5) {
      busy = 0;
      return;
    }
    if (i > 0) ns[i - 1].classList.replace("on", "done");
    ns[i].classList.add("on");
    $("#cap").textContent = caps[i];
    i++;
    setTimeout(nx, 1400);
  })();
};

const M = [
  [
    "G",
    "Get Awareness",
    "“Apa yang biasanya saya lakukan sebelum bertanya ke AI?”",
    "Mengaudit kebiasaan tanpa label baik atau buruk, lalu menulis Jurnal Entri 1.",
    "Profil kesadaran awal",
    "4.7, 12.8",
  ],
  [
    "R",
    "Recognize Impact",
    "“Dari mana jejak lingkungan penggunaan AI berasal?”",
    "Memahami training dan inference, menelusuri studi kasus, menyusun peta sebab-akibat.",
    "Peta sebab-akibat",
    "6.3, 6.4, 7.2, 7.3, 12.5, 13.3",
  ],
  [
    "E",
    "Evaluate Need",
    "“Apakah tugas ini benar-benar memerlukan AI?”",
    "Memilih pakai AI, sebagian, atau tidak, lengkap dengan alasan.",
    "Lembar Keputusan",
    "4.7, 12.2",
  ],
  [
    "E",
    "Execute Efficient Use",
    "“Bagaimana mendapat bantuan yang berguna dengan interaksi seperlunya?”",
    "Menyusun prompt R.A.C.E., memverifikasi hasil, dan berhenti saat tujuan tercapai.",
    "Tugas Kinerja dan Catatan Penggunaan AI",
    "12.2",
  ],
  [
    "N",
    "Nurture Sustainable Habits",
    "“Kebiasaan apa yang ingin saya pertahankan?”",
    "Membandingkan kebiasaan awal dan sekarang, lalu menyusun aturan Green-AI pribadi.",
    "Aturan jika-maka dan Kartu Komitmen",
    "4.7, 12.5, 13.3",
  ],
];
function tab(i) {
  document
    .querySelectorAll("#tabs button")
    .forEach((b, j) => b.setAttribute("aria-selected", j === i));
  const m = M[i];
  $("#pn").innerHTML =
    "<h3>" +
    m[1] +
    "</h3><dl><dt>Pertanyaan kunci</dt><dd>" +
    m[2] +
    "</dd><dt>Kegiatan</dt><dd>" +
    m[3] +
    "</dd><dt>Produk belajar</dt><dd>" +
    m[4] +
    "</dd><dt>Target SDG</dt><dd>" +
    m[5] +
    "</dd></dl>";
}
$("#tabs").innerHTML = M.map(
  (m, i) =>
    '<button role="tab">' + m[0] + " " + m[1].split(" ")[1] + "</button>",
).join("");
document
  .querySelectorAll("#tabs button")
  .forEach((b, i) => (b.onclick = () => tab(i)));
tab(0);

const LV = [
  ["Cermin", "Pengamat"],
  ["Rantai", "Pelacak"],
  ["Perlu AI?", "Pemutus"],
  ["Prompt lab", "Verifikator"],
  ["Jika-maka", "Penjaga"],
  ["Kasus", "Pemandu"],
];
let done = [0, 0, 0, 0, 0, 0],
  cur = 0,
  er = 0;
try {
  const s = JSON.parse(localStorage.getItem("gal") || "null");
  if (Array.isArray(s) && s.length >= 5) done = [...s, 0].slice(0, 6);
} catch (e) {}
function save() {
  try {
    localStorage.setItem("gal", JSON.stringify(done));
  } catch (e) {}
}
function hud() {
  const t = done.reduce((a, b) => a + b, 0);
  $("#xb").style.width = (t / 18) * 100 + "%";
  $("#xt").textContent =
    "Poin kesadaran: " + Math.round((t / 18) * 100) + " dari 100";
  $("#hud").innerHTML = LV.map((l, i) => {
    const k = (i && !done[i - 1]) || (i >= 2 && ROLE === "g");
    return (
      '<button data-i="' +
      i +
      '"' +
      (k ? " disabled" : "") +
      (i === cur ? ' aria-current="true"' : "") +
      (done[i] ? ' class="d"' : "") +
      ">Level " +
      (i + 1) +
      "<small>" +
      (k
        ? ROLE === "g" && i >= 2
          ? "Masuk dulu"
          : "Terkunci"
        : l[0] + (done[i] ? " · " + done[i] : "")) +
      "</small></button>"
    );
  }).join("");
  document
    .querySelectorAll("#hud button")
    .forEach((b) => (b.onclick = () => go(+b.dataset.i)));
}
function fin(i) {
  done[i] = er < 1 ? 3 : er < 3 ? 2 : 1;
  save();
  hud();
  navs();
  const all = done.slice(0, 5).every(Boolean) && i === 4;
  if (all) boom();
  say(
    all
      ? "Hebat! Kamu Penjaga Jejak sekarang."
      : "Lencana didapat. Poinmu bertambah.",
  );
  const n = document.createElement("div");
  n.className = "ok";
  n.setAttribute("role", "status");
  n.innerHTML = all
    ? "Semua level selesai. Kamu Penjaga Jejak! Kartu Komitmen kini terbuka."
    : "Lencana “" +
      LV[i][1] +
      "” didapat." +
      (i < 4 ? " Level " + (i + 2) + " terbuka." : "");
  $("#stage").appendChild(n);
}
function go(i) {
  if ((i && !done[i - 1]) || (i >= 2 && ROLE === "g")) {
    if (i >= 2 && ROLE === "g")
      say("Masuk sebagai siswa untuk membuka level ini.");
    return;
  }
  cur = i;
  er = 0;
  hud();
  [l1, l2, l3, l4, l5, l6][i]();
  say(HNT[i]);
}

function l1() {
  const H = [
      "Aku langsung bertanya ke AI tanpa mencoba sendiri dulu.",
      "Aku meminta ulang jawaban beberapa kali.",
      "Aku memeriksa jawaban AI ke buku atau sumber lain.",
      "Aku meminta AI mengerjakan seluruh tugas.",
    ],
    a = [];
  $("#stage").innerHTML =
    "<h3>Cermin kebiasaan</h3><p>Pilih yang paling mirip dengan dirimu. Tidak ada jawaban benar atau salah.</p>" +
    H.map(
      (h, i) =>
        "<div><div>" +
        h +
        '</div><div class="row">' +
        ["Sering", "Kadang", "Jarang"]
          .map(
            (v) =>
              '<button class="opt" data-i="' +
              i +
              '" data-v="' +
              v +
              '">' +
              v +
              "</button>",
          )
          .join("") +
        "</div></div>",
    ).join("") +
    '<div id="o"></div>';
  document.querySelectorAll("#stage .opt").forEach(
    (b) =>
      (b.onclick = () => {
        const i = +b.dataset.i;
        a[i] = b.dataset.v;
        b.parentNode
          .querySelectorAll(".opt")
          .forEach((x) => x.classList.toggle("s", x === b));
        if (a.filter(Boolean).length === 4 && !$("#o").textContent) {
          const n = a.filter((x) => x === "Sering").length;
          $("#o").innerHTML =
            "<p>Kamu menandai " +
            n +
            " kebiasaan sebagai “sering”. Ini hanya pola, bukan nilai. Pertanyaan untukmu: apa yang kamu lakukan sebelum bertanya ke AI?</p>";
          fin(0);
        }
      }),
  );
}

function l2() {
  const o = [0, 1, 2, 3, 4],
    sh = [3, 0, 4, 2, 1];
  let n = 0;
  $("#stage").innerHTML =
    '<h3>Rantai jejak</h3><p>Ketuk potongan sesuai urutan, dari prompt sampai dampak.</p><div class="row" id="pool">' +
    sh
      .map(
        (i) =>
          '<button class="opt" data-i="' + i + '">' + steps[i] + "</button>",
      )
      .join("") +
    '</div><p><b>Rantaimu:</b></p><ol id="ch"></ol><div class="err" id="e" role="alert"></div><div id="o"></div>';
  document.querySelectorAll("#pool .opt").forEach(
    (b) =>
      (b.onclick = () => {
        if (+b.dataset.i === n) {
          const li = document.createElement("li");
          li.textContent = b.textContent;
          $("#ch").appendChild(li);
          b.remove();
          $("#e").textContent = "";
          n++;
          if (n === 5) {
            $("#o").innerHTML =
              '<p>Sekarang: bergantung pada apa dampaknya? Pilih sumber listriknya.</p><div class="row"><button class="opt" data-k="a">Banyak energi terbarukan</button><button class="opt" data-k="b">Banyak bahan bakar fosil</button></div><div id="r"></div>';
            document.querySelectorAll("#o .opt").forEach(
              (x) =>
                (x.onclick = () => {
                  $("#r").innerHTML =
                    x.dataset.k === "a"
                      ? "<p>Emisi dari listrik cenderung lebih kecil. Kebutuhan air dan perangkat tetap ada.</p>"
                      : "<p>Emisi dari listrik cenderung lebih besar. Besarnya tetap berbeda menurut model, lokasi, dan jenis tugas.</p>";
                  if (!done[1]) fin(1);
                }),
            );
          }
        } else
          $("#e").textContent =
            (er++, "") +
            "Belum urutan itu. Apa yang terjadi tepat setelah “" +
            steps[n] +
            "” sebelumnya?";
      }),
  );
}

function l3() {
  const S = [
      "Kamu belajar menyusun kerangka esai Bahasa Indonesia.",
      "Kamu perlu menerjemahkan satu kata ke bahasa Inggris.",
      "Kamu ingin memahami konsep yang tadi diterangkan guru, tetapi belum paham.",
    ],
    F = {
      "Tanpa AI":
        "Pilihan yang sah. Apa yang kamu pelajari dengan mengerjakannya sendiri?",
      Sebagian:
        "Bagian mana kamu kerjakan sendiri, dan bagian mana dibantu AI?",
      Sepenuhnya:
        "Pilihan yang sah bila beralasan. Apa yang akan kamu periksa lebih dulu?",
    };
  let k = 0,
    c = "";
  function show() {
    $("#stage").innerHTML =
      "<h3>Perlu AI? (" +
      (k + 1) +
      " dari 3)</h3><p>" +
      S[k] +
      '</p><div class="row">' +
      Object.keys(F)
        .map((x) => '<button class="opt">' + x + "</button>")
        .join("") +
      '</div><div class="f"><textarea id="rs" rows="2" aria-label="Alasanmu" placeholder="Tulis alasanmu"></textarea></div><div class="err" id="e" role="alert"></div><button class="btn" id="sv">Simpan pilihan</button><div id="o"></div>';
    c = "";
    document.querySelectorAll("#stage .opt").forEach(
      (b) =>
        (b.onclick = () => {
          c = b.textContent;
          document
            .querySelectorAll("#stage .opt")
            .forEach((x) => x.classList.toggle("s", x === b));
          $("#e").textContent = "";
        }),
    );
    $("#rs").oninput = () => ($("#e").textContent = "");
    $("#sv").onclick = () => {
      if (!c) {
        $("#e").textContent = "Pilih salah satu dulu.";
        return;
      }
      if ($("#rs").value.trim().length < 8) {
        $("#e").textContent = "Tulis alasanmu, minimal satu kalimat pendek.";
        return;
      }
      $("#sv").disabled = true;
      $("#o").innerHTML =
        '<div class="ok">' +
        F[c] +
        "</div>" +
        (k < 2
          ? '<button class="btn o" id="nx">Skenario berikutnya</button>'
          : "");
      if (k < 2) {
        $("#nx").onclick = () => {
          k++;
          show();
        };
      } else fin(2);
    };
  }
  show();
}

function l4() {
  let A = 0,
    B = 0;
  const P = [
      ["Role", "Kamu adalah guru biologi."],
      ["Action", "Jelaskan fotosintesis."],
      ["Context", "Untuk siswa kelas 10."],
      ["Expectation", "Maksimal tiga paragraf."],
    ],
    T = [
      "Candi Borobudur adalah candi Buddha dari abad ke-9.",
      "Candi ini terletak di Kota Yogyakarta.",
      "UNESCO menetapkannya sebagai Warisan Dunia pada 1991.",
    ];
  $("#stage").innerHTML =
    "<h3>Prompt lab</h3><p>Bagian A: isi unsur prompt R.A.C.E. Yang dinilai kejelasannya, bukan panjangnya.</p>" +
    P.map(
      (p, i) =>
        '<div class="f" style="margin:6px 0"><input data-i="' +
        i +
        '" aria-label="' +
        p[0] +
        '" placeholder="' +
        p[0] +
        ": " +
        p[1] +
        '"></div>',
    ).join("") +
    '<p id="m"><b>Unsur terisi:</b> 0 dari 4</p><p><b>Bagian B: detektif fakta.</b> Satu kalimat jawaban AI ini keliru. Ketuk yang menurutmu salah.</p>' +
    T.map(
      (t, i) => '<button class="sent" data-i="' + i + '">' + t + "</button>",
    ).join("") +
    '<div id="o"></div>';
  const chk = () => {
    if (A >= 3 && B && !done[3]) fin(3);
  };
  document.querySelectorAll("#stage input").forEach(
    (x) =>
      (x.oninput = () => {
        A = [...document.querySelectorAll("#stage input")].filter(
          (y) => y.value.trim().length > 4,
        ).length;
        $("#m").innerHTML = "<b>Unsur terisi:</b> " + A + " dari 4";
        chk();
      }),
  );
  document.querySelectorAll(".sent").forEach(
    (b) =>
      (b.onclick = () => {
        if (+b.dataset.i === 1) {
          b.classList.add("bad");
          B = 1;
          $("#o").innerHTML =
            '<div class="ok">Tepat. Borobudur ada di Kabupaten Magelang, Jawa Tengah. Periksa dengan buku atau sumber tepercaya, lalu berhenti saat tujuanmu sudah tercapai. Isi minimal tiga unsur di Bagian A untuk menyelesaikan level.</div>';
          chk();
        } else
          $("#o").innerHTML =
            (er++, "") + "<p>Kalimat itu benar. Coba periksa lagi.</p>";
      }),
  );
}

function l5() {
  $("#stage").innerHTML =
    '<h3>Aturan jika-maka</h3><p>Buat satu aturan kecil yang bisa dicek dalam 14 hari.</p><div class="f" style="display:grid;gap:8px;max-width:520px"><input id="nm" aria-label="Namamu" placeholder="Namamu"><input id="tg" aria-label="Pemicu" placeholder="Jika aku ingin bertanya ke AI untuk tugas…"><input id="ac" aria-label="Tindakan" placeholder="maka aku mencoba menjawab sendiri dulu selama 5 menit."></div><p class="mu">Uji kejelasan: bisakah aturan ini dicek dalam 14 hari?</p><div class="err" id="e" role="alert"></div><button class="btn" id="mk">Buat Kartu Komitmen</button><div id="o"></div>';
  $("#mk").onclick = () => {
    const n = $("#nm").value.trim(),
      t = $("#tg").value.trim(),
      a = $("#ac").value.trim();
    if (!n || t.length < 5 || a.length < 5) {
      $("#e").textContent = "Isi nama, pemicu, dan tindakan.";
      return;
    }
    $("#e").textContent = "";
    const d = new Date(),
      c = new Date(Date.now() + 12096e5),
      f = (x) =>
        x.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    $("#o").innerHTML =
      '<div class="kartu"><h3>Kartu Komitmen</h3><p><b>' +
      esc(n) +
      "</b></p><p>Jika " +
      esc(t.replace(/^jika\s+/i, "")) +
      ", maka " +
      esc(a.replace(/^maka\s+/i, "")) +
      '</p><p class="mu">Dibuat ' +
      f(d) +
      ". Cek ulang pada " +
      f(c) +
      '.</p></div><p class="mu">Kartu resmi terbuka di halaman Kartu setelah semua level selesai.</p>';
    setRule(
      "Jika " +
        t.replace(/^jika\s+/i, "") +
        ", maka " +
        a.replace(/^maka\s+/i, ""),
    );
    fin(4);
  };
}
function say(t) {
  const m = $("#mc");
  const b = $("#mb");
  if (!m || !b) return;
  b.textContent = t;
  m.classList.add("show");
  clearTimeout(say.t);
  say.t = setTimeout(() => m.classList.remove("show"), 6500);
}
function boom() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const c = ["#111111", "#f3f3f1", "#c8c8c8"];
  for (let i = 0; i < 48; i++) {
    const d = document.createElement("i");
    d.className = "cf";
    d.style.left = Math.random() * 100 + "vw";
    d.style.background = c[i % 3];
    d.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 3200);
  }
}
addEventListener(
  "scroll",
  () => {
    const h = document.documentElement,
      m = h.scrollHeight - innerHeight;
    $("#pg").style.width =
      (m > 0 ? Math.min(100, (scrollY / m) * 100) : 0) + "%";
  },
  { passive: true },
);
function lab() {
  const v = (n) =>
      +document.querySelector('input[name="' + n + '"]:checked').value,
    el = v("el"),
    ai = v("ai"),
    ou = v("ou"),
    em = Math.min(5, el + ou * 0.5),
    aw = Math.min(5, (ai ? 3 : 1) + ou * 0.5),
    cp = Math.min(5, 1 + ou * 1.5 + (ai ? 0 : 0.5));
  [em, aw, cp].forEach(
    (x, i) => ($("#m" + (i + 1)).style.width = (x / 5) * 100 + "%"),
  );
  $("#lc").textContent =
    (el === 1
      ? "Listrik terbarukan cenderung menurunkan emisi. "
      : el === 4
        ? "Listrik dari bahan bakar fosil cenderung menaikkan emisi. "
        : "Bauran listrik campuran ada di tengah. ") +
    (ai
      ? "Pendingin air cenderung menambah pemakaian air. "
      : "Pendingin udara cenderung memakai lebih banyak listrik tetapi lebih sedikit air. ") +
    (ou === 0
      ? "Teks cenderung paling ringan. "
      : ou === 1
        ? "Gambar cenderung lebih berat daripada teks. "
        : "Video cenderung paling berat. ") +
    "Hasil nyata bergantung pada model dan lokasi.";
}
document.querySelectorAll("#lab input").forEach((i) => (i.onchange = lab));
lab();
const MY = [
  [
    "“Satu prompt kan tidak berdampak.”",
    "Satu prompt memang kecil, tetapi banyak pengguna sekaligus membuat jejaknya terasa. Besarnya bergantung pada model dan konteks.",
  ],
  [
    "“AI itu boros, jangan dipakai.”",
    "Tujuannya bukan berhenti. Pakailah dengan sadar: perlu atau tidak, seberapa banyak, dan kapan cukup.",
  ],
  [
    "“Makin banyak prompt, makin bagus hasilnya.”",
    "Prompt yang jelas lebih berguna daripada banyak prompt. Efisien berarti seperlunya, bukan sesedikit mungkin.",
  ],
  [
    "“Kalau AI yang menjawab, pasti benar.”",
    "AI bisa keliru. Periksa informasi penting ke buku atau sumber tepercaya. Keputusan akhir tetap di tanganmu.",
  ],
];
$("#my").innerHTML = MY.map(
  (m, i) =>
    '<button aria-pressed="false" data-i="' + i + '">' + m[0] + "</button>",
).join("");
document.querySelectorAll("#my button").forEach(
  (b) =>
    (b.onclick = () => {
      const p = b.getAttribute("aria-pressed") === "true",
        m = MY[+b.dataset.i];
      b.setAttribute("aria-pressed", !p);
      b.textContent = p ? m[0] : m[1];
    }),
);
const BG = ["kartu-1.jpg", "kartu-2.jpg"],
  PG = [
    "akses",
    "panduan",
    "log",
    "beranda",
    "model",
    "lab",
    "misi",
    "kartu",
    "lacak",
    "asesmen",
    "riset",
    "saran",
    "tentang",
    "admin",
  ];
let IM = [],
  rt = 0,
  N = 0;
try {
  N = +localStorage.getItem("galt") || 0;
} catch (e) {}
const sv = () => {
  try {
    localStorage.setItem("galt", N);
  } catch (e) {}
};
const card = () => {
  try {
    return JSON.parse(localStorage.getItem("galc") || "null");
  } catch (e) {
    return null;
  }
};
function setRule(r) {
  try {
    localStorage.setItem("galr", r);
  } catch (e) {}
}
function navs() {
  const a = document.querySelector('[data-go="kartu"]'),
    b = document.querySelector('[data-go="lacak"]');
  a.textContent = done.slice(0, 5).every(Boolean) ? "Kartu" : "Kartu tertutup";
  b.textContent = card() ? "Pelacak" : "Pelacak tertutup";
  pj();
}
let WANT = "";
function route(p, moveFocus = false) {
  if (!PG.includes(p) || !document.getElementById("p-" + p)) p = "beranda";
  const want = p;
  WANT = "";
  {
    const nv = document.querySelector('.nav .l[data-go="' + p + '"]');
    if (nv && !nv.dataset.r.includes(ROLE)) {
      const need = nv.dataset.r;
      p = "akses";
      WANT = want;
      $('#p-akses [data-login="s"]').hidden = !need.includes("s");
      $('#p-akses [data-login="f"]').hidden = !need.includes("f");
      $("#akses-msg").textContent =
        need === "f"
          ? "Halaman ini khusus fasilitator. Masuk dengan kode fasilitator untuk membukanya."
          : need === "s"
            ? "Halaman ini khusus siswa. Masuk sebagai siswa untuk membukanya."
            : "Halaman ini dibatasi menurut peran. Masuk sebagai siswa atau fasilitator untuk membukanya.";
    }
  }
  if (location.hash !== "#" + want)
    (location.hash ? history.pushState : history.replaceState).call(
      history,
      null,
      "",
      "#" + want,
    );
  document
    .querySelectorAll(".pg")
    .forEach((x) => x.classList.toggle("on", x.id === "p-" + p));
  document
    .querySelectorAll(".nav .l")
    .forEach((b) =>
      b.setAttribute("aria-current", b.dataset.go === p ? "page" : "false"),
    );
  document.querySelectorAll(".nav-menu").forEach((menu) => {
    menu.classList.toggle(
      "current",
      !!menu.querySelector('.l[aria-current="page"]'),
    );
    menu.open = false;
  });
  const sec = document.getElementById("sec");
  if (sec)
    sec.textContent =
      {
        beranda: "Awal",
        panduan: "Panduan",
        model: "Model",
        lab: "Lab",
        misi: "Misi",
        kartu: "Kartu",
        lacak: "Pelacak",
        log: "Log",
        asesmen: "Asesmen",
        riset: "Riset",
        saran: "Saran",
        tentang: "Tentang",
        admin: "Admin",
        akses: "Masuk",
      }[p] || "";
  scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "instant",
  });
  if (moveFocus) {
    const heading = document.querySelector(
      `#p-${p} h1, #p-${p} h2, #p-${p} h3`,
    );
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  if (p === "kartu") kt();
  if (p === "lacak") trk();
  if (p === "asesmen") as();
  if (p === "riset") rs();
  if (p === "saran") sr();
  if (p === "log") lgp();
  if (p === "panduan") pd();
  rvi();
}
function kt() {
  const ok = done.slice(0, 5).every(Boolean);
  $("#kl").hidden = ok;
  $("#kf").hidden = !ok;
  if (!ok) return;
  if (!$("#kn").dataset.i) {
    $("#kn").dataset.i = 1;
    const c = card();
    let r = "";
    try {
      r = localStorage.getItem("galr") || "";
    } catch (e) {}
    $("#kn").value = c ? c.kn : "";
    $("#kk").value = c ? c.kk : "";
    $("#kb").value = c ? c.kb : "";
    $("#km").value = c ? c.km : r;
  }
  rc();
}
function wr(x, t, w, mx) {
  const L = [];
  let l = "";
  t.split(/\s+/)
    .filter(Boolean)
    .forEach((q) => {
      const n = l ? l + " " + q : q;
      if (x.measureText(n).width > w && l) {
        L.push(l);
        l = q;
      } else l = n;
    });
  if (l) L.push(l);
  return L.slice(0, mx);
}
function ft(x, t, w, f, px) {
  x.font = f.replace("#", px);
  while (x.measureText(t).width > w && px > 14) {
    px--;
    x.font = f.replace("#", px);
  }
}
async function rc() {
  const my = ++rt;
  try {
    await document.fonts.load("700 30px Montserrat");
    await document.fonts.load("600 26px Montserrat");
  } catch (e) {}
  if (!IM.length)
    IM = await Promise.all(
      BG.map(
        (u) =>
          new Promise((r) => {
            const m = new Image();
            m.onload = () => r(m);
            m.src = u;
          }),
      ),
    );
  if (my !== rt) return;
  const v = (id) => $("#" + id).value.trim(),
    d = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    F = "700 #px Montserrat,sans-serif";
  IM.forEach((m, i) => {
    const c = document.createElement("canvas"),
      x = c.getContext("2d"),
      k = m.width / 1372;
    c.width = m.width;
    c.height = m.height;
    x.drawImage(m, 0, 0);
    x.setTransform(k, 0, 0, k, 0, 0);
    x.fillStyle = "#0e3b2e";
    x.textAlign = "center";
    if (i === 0) {
      ft(x, v("kn"), 270, F, 30);
      x.fillText(v("kn"), 447, 718);
      ft(x, v("kk"), 270, F, 30);
      x.fillText(v("kk"), 935, 718);
    } else {
      x.textAlign = "left";
      x.font = "600 26px Montserrat,sans-serif";
      wr(x, v("kb"), 735, 2).forEach((t, j) =>
        x.fillText(t, 330, 254 + j * 40),
      );
      x.font = "600 22px Montserrat,sans-serif";
      wr(x, v("km"), 470, 2).forEach((t, j) =>
        x.fillText(t, 500, 592 + j * 30),
      );
      x.textAlign = "center";
      x.font = "600 25px Montserrat,sans-serif";
      x.fillText("Padang Pariaman, " + d, 688, 728);
      x.font = "italic 600 28px Montserrat,sans-serif";
      x.fillText(v("kn"), 690, 852);
    }
    $("#i" + (i + 1)).src = c.toDataURL("image/jpeg", 0.9);
  });
}
["kn", "kk", "kb", "km"].forEach((i) => ($("#" + i).oninput = () => rc()));
$("#ks").onclick = () => {
  const g = (id) => $("#" + id).value.trim(),
    c = { kn: g("kn"), kk: g("kk"), kb: g("kb"), km: g("km") };
  if (!c.kn || !c.kk || c.kb.length < 5 || c.km.length < 5) {
    $("#ke").textContent = "Lengkapi nama, kelas, kebiasaan, dan komitmenmu.";
    return;
  }
  $("#ke").textContent = "";
  if (!card()) {
    N = 0;
    sv();
  }
  try {
    localStorage.setItem("galc", JSON.stringify(c));
  } catch (e) {}
  navs();
  say("Kartu tersimpan. Pelacak 14 hari terbuka!");
  route("lacak");
};
function trk(f) {
  const c = card();
  $("#tl").hidden = !!c;
  $("#tf").hidden = !c;
  if (!c) return;
  $("#rl").textContent = "Aturanmu: " + c.km;
  $("#tb").style.width = (N / 14) * 100 + "%";
  $("#days").innerHTML = Array.from(
    { length: 14 },
    (_, i) =>
      "<button" +
      (i === N ? ' class="nx"' : "") +
      ' aria-pressed="' +
      (i < N) +
      '"' +
      (i > N ? " disabled" : "") +
      ' aria-label="Hari ' +
      (i + 1) +
      (i > N ? ", terkunci" : i < N ? ", selesai" : ", tandai sekarang") +
      '">' +
      (i < N ? "\u2713" : i + 1) +
      "</button>",
  ).join("");
  document.querySelectorAll("#days button").forEach(
    (b, i) =>
      (b.onclick = () => {
        if (i === N) {
          N++;
          sv();
          if (N === 14) {
            boom();
            say("14 hari selesai! Saatnya cek ulang.");
          } else say("Hari " + N + " tercatat. Lanjut besok!");
        } else if (i === N - 1) {
          N--;
          sv();
        } else return;
        trk(i);
      }),
  );
  $("#ds").textContent =
    N +
    " dari 14 hari. " +
    (N < 14
      ? "Hari berikutnya terbuka setelah hari ini kamu tandai. Kamu bisa membatalkan hari terakhir saja."
      : "Semua hari selesai.");
  $("#cu").hidden = N < 14;
  if (f !== undefined && $("#days").children[f]) $("#days").children[f].focus();
}
$("#cb").onclick = () => {
  const s = document.querySelector('input[name="st"]:checked'),
    h = $("#hb").value.trim(),
    t = +$("#tp").value;
  if (!s || h.length < 5) {
    $("#ce").textContent = "Pilih penilaianmu dan tulis hambatannya.";
    return;
  }
  $("#ce").textContent = "";
  $("#cr").innerHTML =
    '<div class="ok">Kartumu: <b>' +
    esc(s.value) +
    "</b>. Hambatan: \u201C" +
    esc(h) +
    "\u201D. Hambatan adalah bahan perbaikan, bukan kesalahan pribadi. Kamu memilih mengulang Level " +
    (t + 1) +
    " (" +
    LV[t][0] +
    ').</div><button class="btn" id="rp" type="button">Mulai putaran baru</button>';
  $("#rp").onclick = () => {
    for (let i = t; i < 6; i++) done[i] = 0;
    N = 0;
    save();
    sv();
    navs();
    route("misi");
    go(t);
  };
};
const SY = {
  model: "Ketuk tiap tahap untuk melihat isinya.",
  lab: "Coba ubah kondisinya dan lihat apa yang bergeser.",
  game: "Siap? Level mana saja boleh dimulai dulu.",
  lacak: "Centang satu hari tiap kali aturanmu terlaksana.",
};
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        say(SY[e.target.id]);
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.35 },
);
Object.keys(SY).forEach((k) => io.observe($("#" + k)));
setTimeout(() => say("Hai, aku Sulur. Coba kirim satu prompt di atas!"), 1500);
const D = {
    L: [
      {
        d: "Knowledge",
        lv: [
          "Sangat memahami",
          "Memahami",
          "Kurang memahami",
          "Tidak memahami",
        ],
        it: [
          "Saya dapat menjelaskan dengan kata-kata sendiri perbedaan training (model belajar dari data) dan inference (model yang sudah dilatih menghasilkan keluaran dari input baru).",
          "Saya memahami bahwa komputasi AI membutuhkan perangkat keras (misalnya GPU dan server) yang memakai energi listrik. Green Green AI AI Literacy Literacy assessment Module - OMI toolkitsRisetOMI 2026Riset 2026 i1 1III 3. Saya memahami bahwa pusat data membutuhkan pendinginan yang dapat menggunakan air.",
          "Saya memahami bahwa pusat data membutuhkan pendinginan yang dapat menggunakan air.",
          "Saya memahami bahwa kebutuhan sumber daya berbeda antar model, layanan, dan jenis keluaran (teks, gambar, video).",
        ],
      },
      {
        d: "Awareness",
        lv: [
          "Sangat menyadari",
          "Menyadari",
          "Kurang menyadari",
          "Tidak menyadari atau tidak peduli",
        ],
        it: [
          "Saya menyadari bahwa setiap penggunaan AI meninggalkan jejak sumber daya yang tidak terlihat di layar.",
          "Saya menyadari bahwa banyak layanan AI memakai server atau pusat data yang membutuhkan energi dan air, sementara sebagian pemrosesan dapat terjadi pada perangkat.",
          "Saya menyadari bahwa penggunaan AI oleh banyak orang sekaligus dapat menimbulkan kebutuhan energi dan air yang besar.",
          "Saya menyadari bahwa kebiasaan saya memakai AI ikut menyumbang jejak tersebut.",
        ],
      },
      {
        d: "Impact Recognition",
        lv: [
          "Sangat mempertimbangkan",
          "Mempertimbangkan",
          "Kurang mempertimbangkan",
          "Tidak mempertimbangkan",
        ],
        it: [
          "Saya mempertimbangkan bahwa tingginya kebutuhan listrik AI dapat menambah pemakaian sumber daya alam untuk pembangkitan dan emisi.",
          "Saya mempertimbangkan bahwa pengambilan air bersih untuk pendinginan dapat bersaing dengan kebutuhan warga, nelayan, dan pertanian, serta dapat menyebabkan pencemaran air.",
          "Saya mempertimbangkan bahwa perangkat yang tidak terpakai menjadi sampah elektronik (e-waste) yang dapat merusak lingkungan.",
          "Saya mempertimbangkan bahwa besarnya dampak berbeda menurut sumber energi, sistem pendinginan, dan lokasi pusat data.",
        ],
      },
      {
        d: "Need Evaluation",
        lv: [
          "Sangat mempertimbangkan",
          "Mempertimbangkan",
          "Kurang mempertimbangkan",
          "Tidak mempertimbangkan",
        ],
        it: [
          "Sebelum memakai AI, saya mempertimbangkan apakah tugas ini benar-benar membutuhkannya.",
          "Saya mempertimbangkan apakah AI memberi nilai tambah dibandingkan dengan mengerjakan sendiri atau memakai buku/sumber lain.",
          "Saya mempertimbangkan perbedaan antara kebutuhan belajar dan keinginan instan sebelum membuka AI.",
          "Saya mempertimbangkan bagian tugas mana yang sebaiknya saya kerjakan sendiri.",
        ],
      },
      {
        d: "Efficiency Judgment",
        lv: [
          "Sangat mempertimbangkan",
          "Mempertimbangkan",
          "Kurang mempertimbangkan",
          "Tidak mempertimbangkan",
        ],
        it: [
          "Saya mempertimbangkan kejelasan tujuan, konteks, bentuk keluaran, dan batasan sebelum mengirim prompt.",
          "Saya mempertimbangkan apakah perbaikan atau pertanyaan lanjutan benar-benar diperlukan sebelum meminta ulang.",
          "Saya mempertimbangkan jenis keluaran yang sesuai kebutuhan (misalnya teks singkat bila gambar atau video tidak diperlukan).",
          "Saya mempertimbangkan kapan harus berhenti karena tujuan belajar sudah tercapai",
        ],
      },
      {
        d: "Reflection",
        lv: ["Selalu", "Sering", "Jarang", "Tidak pernah"],
        it: [
          "Saya meninjau kembali kebiasaan saya memakai AI. iGreen Green AI AI Literacy Literacy assessment Module - OMI toolkitsRisetOMI 2026Riset 2026 i2III 22. Saya mengenali pola penggunaan AI saya yang kurang perlu atau boros. 23. Setelah tugas selesai, saya memikirkan apa yang perlu dipertahankan atau diubah pada penggunaan AI berikutnya.",
          "Saya mengenali pola penggunaan AI saya yang kurang perlu atau boros.",
          "Setelah tugas selesai, saya memikirkan apa yang perlu dipertahankan atau diubah pada penggunaan AI berikutnya.",
          "Saya membandingkan kebiasaan saya sekarang dengan sebelumnya. Penskoran: skor per dimensi 4-16, total 24-96. Batas kategori (tinggi/sedang/rendah) ditetapkan dari analisis data.",
        ],
      },
    ],
    B: [
      {
        d: "Kritis",
        lv: [
          "Sangat mempertimbangkan",
          "Mempertimbangkan",
          "Kurang mempertimbangkan",
          "Tidak mempertimbangkan",
        ],
        it: [
          "Saya mempertimbangkan perlu atau tidaknya AI sebelum menggunakannya.",
          "Saya mencoba memikirkan atau mencari jawaban sendiri sebelum bertanya kepada AI.",
          "Saya mempertimbangkan apakah AI sesuai untuk jenis tugas ini sebelum memakainya.",
          "Saya memeriksa informasi penting dari AI dengan buku atau sumber tepercaya sebelum memakainya.",
        ],
      },
      {
        d: "Proporsional",
        lv: ["Selalu", "Sering", "Jarang", "Tidak pernah"],
        it: [
          "Saya memakai AI hanya pada bagian tugas yang memang membutuhkan bantuan.",
          "Saya tetap membuat keputusan akhir sendiri atas hasil AI.",
          "Saya meminta bantuan AI sebatas porsi yang saya perlukan, bukan seluruh tugas.",
          "Saya mengerjakan sendiri bagian tugas yang bertujuan melatih kemampuan saya.",
        ],
      },
      {
        d: "Efisien",
        lv: ["Selalu", "Sering", "Jarang", "Tidak pernah"],
        it: [
          "Saya menyusun permintaan dengan jelas (tujuan, konteks, bentuk keluaran, batasan) sebelum mengirim.",
          "Saya hanya melakukan interaksi tambahan jika memang diperlukan.",
          "Saya menggabungkan kebutuhan yang masih berkaitan bila itu membantu, tanpa memaksakan semuanya dalam satu prompt.",
          "Saya meminta keluaran secukupnya sesuai kebutuhan tugas dan berhenti ketika sudah cukup.",
        ],
      },
      {
        d: "Bertanggung Jawab",
        lv: ["Selalu", "Sering", "Jarang", "Tidak pernah"],
        it: [
          "Saya menyampaikan penggunaan AI secara jujur ketika aturan guru atau tugas meminta transparansi.",
          "Saya menjelaskan bagian tugas yang dibantu AI bila diminta.",
          "Saya tidak menyalin hasil AI tanpa memahami isinya.",
          "Saya mengakui sumber lain di luar AI yang saya pakai pada tugas.",
        ],
      },
      {
        d: "Berkelanjutan",
        lv: ["Selalu", "Sering", "Jarang", "Tidak pernah"],
        it: [
          "Saya berusaha memakai perangkat yang masih layak selama mungkin untuk mengurangi e-waste.",
          "Saya mempertimbangkan dampak jangka panjang sebelum mengganti perangkat.",
          "Saya mengurangi pemakaian aplikasi atau fitur AI yang tidak saya perlukan.",
          "Saya mengisi daya perangkat secukupnya dan mencabut pengisi daya setelah penuh. iGreen Green Green AI AI Literacy Literacy assessment Module - OMI toolkitsRisetOMI 2026Riset 2026 i1 2III",
        ],
      },
    ],
    R: [
      [
        "Analisis kebutuhan",
        "Tidak ada analisis.",
        "Masih umum.",
        "Cukup jelas dan beralasan.",
        "Jelas, mendalam, dan beralasan.",
      ],
      [
        "Proporsionalitas",
        "Tidak proporsional.",
        "Kadang berlebihan atau kurang.",
        "Sebagian besar sesuai kebutuhan.",
        "Bantuan AI sesuai kebutuhan tugas secara konsisten.",
      ],
      [
        "Efisiensi interaksi",
        "Berulang tanpa alasan.",
        "Ada interaksi kurang perlu.",
        "Cukup terarah, sedikit tambahan.",
        "Prompt terarah dan interaksi proporsional.",
      ],
      [
        "Verifikasi",
        "Tidak memeriksa.",
        "Pemeriksaan terbatas.",
        "Memeriksa sebagian besar aspek.",
        "Memeriksa fakta, relevansi, bias, dan konteks.",
      ],
      [
        "Human agency",
        "AI menggantikan pekerjaan murid.",
        "Masih bergantung pada AI.",
        "Peran murid cukup terlihat.",
        "Pemikiran dan keputusan murid sangat terlihat.",
      ],
      [
        "Sustainability reasoning",
        "Tidak menunjukkan pemahaman dampak lingkungan.",
        "Pemahaman masih umum atau dangkal.",
        "Menjelaskan sebagian besar dampak dengan cukup akurat.",
        "Menjelaskan jejak karbon, air, dan e-waste secara akurat dan kontekstual.",
      ],
      [
        "Reflection",
        "Tidak bermakna.",
        "Masih umum.",
        "Relevan dengan rencana sederhana.",
        "Konkret dengan rencana tindak lanjut.",
      ],
    ],
  },
  HNT = [
    "Cermin dulu: lihat kebiasaanmu tanpa menghakimi.",
    "Telusuri rantai jejak dari prompt sampai dampak.",
    "Timbang dulu: perlu AI atau tidak?",
    "Susun prompt jelas, lalu periksa hasilnya.",
    "Ubah niat jadi aturan kecil yang bisa dicek.",
    "Level bonus: satu kasus utuh dari awal sampai akhir.",
  ],
  TIM = "greenailiteracy@gmail.com";
let AT = 0,
  AK = "awal",
  GS = {},
  RV = Array(7).fill(0),
  SD = [];
try {
  GS = JSON.parse(localStorage.getItem("gals") || "{}");
} catch (e) {}
const gs = (k, w) => GS[k + w] || (GS[k + w] = Array(D[k].length * 4).fill(0)),
  sc = (k, w) =>
    D[k].map((_, i) =>
      gs(k, w)
        .slice(i * 4, i * 4 + 4)
        .reduce((x, y) => x + y, 0),
    );
function pj() {
  const g = (a, b) => "<div><b>" + a + "</b>" + b + "</div>";
  let n = 0;
  ["L", "B"].forEach((k) =>
    ["awal", "akhir"].forEach((w) => {
      if (gs(k, w).every(Boolean)) n++;
    }),
  );
  $("#pj").innerHTML =
    g(done.slice(0, 5).filter(Boolean).length + "/5", "level Misi selesai") +
    g(card() ? "Ya" : "Belum", "Kartu Komitmen") +
    g(N + "/14", "hari terlaksana") +
    g(n + "/4", "skala asesmen terisi");
}
function l6() {
  const S = [
    [
      "Tugasmu: presentasi tentang energi terbarukan. Apa langkah pertamamu?",
      [
        "Langsung meminta AI membuat seluruh presentasi",
        "Menyusun kerangka sendiri, lalu meminta AI melengkapi bagian tertentu",
        "Mengerjakan semuanya tanpa AI",
      ],
      -1,
    ],
    [
      "Kamu memutuskan meminta bantuan AI. Prompt mana yang paling jelas?",
      [
        "Buatkan presentasi.",
        "Kamu adalah guru IPA. Jelaskan tiga jenis energi terbarukan untuk siswa kelas 10, maksimal lima poin singkat.",
        "Jelaskan semuanya tentang energi dari awal sejarah sampai masa depan selengkap dan sepanjang mungkin.",
      ],
      1,
    ],
    [
      "Jawaban AI muncul. Apa yang kamu lakukan?",
      [
        "Menyalin langsung ke slide",
        "Memeriksa angka dan fakta penting ke buku atau sumber tepercaya",
        "Meminta AI mengecek dirinya sendiri tanpa sumber lain",
      ],
      1,
    ],
    [
      "Hasilnya sudah cukup. Apa langkah terakhirmu?",
      [
        "Terus meminta versi baru sampai terasa sempurna",
        "Berhenti saat tujuan tercapai, lalu menyunting dengan kata-kataku sendiri",
        "Mengulang prompt yang sama berkali-kali berharap lebih bagus",
      ],
      1,
    ],
  ];
  let k = 0;
  function st() {
    const q = S[k];
    $("#stage").innerHTML =
      "<h3>Kasus lengkap (" +
      (k + 1) +
      " dari 4)</h3><p>" +
      q[0] +
      '</p><div class="row" style="flex-direction:column;align-items:stretch">' +
      q[1]
        .map(
          (x) =>
            '<button class="opt" style="text-align:left">' + x + "</button>",
        )
        .join("") +
      '</div><div id="o"></div>';
    document.querySelectorAll("#stage .opt").forEach(
      (b, i) =>
        (b.onclick = () => {
          document
            .querySelectorAll("#stage .opt")
            .forEach((x) => (x.disabled = true));
          b.classList.add("s");
          const bad = q[2] >= 0 && i !== q[2];
          if (bad) er++;
          $("#o").innerHTML =
            '<div class="ok">' +
            (q[2] < 0
              ? "Semua pilihan bisa sah bila beralasan. Pilihanmu memengaruhi langkah berikutnya."
              : bad
                ? "Hampir. Yang lebih tepat: " + q[1][q[2]] + "."
                : "Tepat.") +
            "</div>" +
            (k < 3
              ? '<button class="btn o" id="nx" type="button">Lanjut</button>'
              : "");
          if (k < 3)
            $("#nx").onclick = () => {
              k++;
              st();
            };
          else fin(5);
        }),
    );
  }
  st();
}
function as() {
  const T =
    ROLE === "f"
      ? [
          ["Rubrik guru", rb],
          ["Rekap kelas", rk],
        ]
      : [
          ["Skala Literasi", () => sk("L")],
          ["Skala Perilaku", () => sk("B")],
          ["Kirim ke guru", kg],
        ];
  if (AT >= T.length) AT = 0;
  $("#at").innerHTML = T.map(
    (t, i) =>
      '<button role="tab" aria-selected="' +
      (i === AT) +
      '" data-i="' +
      i +
      '">' +
      t[0] +
      "</button>",
  ).join("");
  document.querySelectorAll("#at button").forEach(
    (b) =>
      (b.onclick = () => {
        AT = +b.dataset.i;
        as();
      }),
  );
  T[AT][1]();
}
function sk(k) {
  const T = D[k],
    a = gs(k, AK),
    tot = T.length * 4;
  let h =
    '<div class="row"><label>Waktu pengisian: <select id="aw"><option value="awal">Awal (sebelum belajar)</option><option value="akhir">Akhir (sesudah belajar)</option></select></label></div><p class="mu">Skor 4 untuk jenjang tertinggi, 1 untuk terendah. <span id="ap">' +
    a.filter(Boolean).length +
    " dari " +
    tot +
    " terisi.</span></p>";
  T.forEach((g, i) => {
    h +=
      '<fieldset style="margin:12px 0"><legend>' +
      esc(g.d) +
      "</legend>" +
      g.it
        .map((q, j) => {
          const x = i * 4 + j;
          return (
            '<p style="margin:10px 0 4px">' +
            (x + 1) +
            ". " +
            esc(q) +
            '</p><div class="row">' +
            [4, 3, 2, 1]
              .map(
                (v) =>
                  '<button class="opt' +
                  (a[x] === v ? " s" : "") +
                  '" data-x="' +
                  x +
                  '" data-v="' +
                  v +
                  '">' +
                  v +
                  " " +
                  esc(g.lv[4 - v]) +
                  "</button>",
              )
              .join("") +
            "</div>"
          );
        })
        .join("") +
      "</fieldset>";
  });
  $("#ab").innerHTML = h + '<div id="ar"></div>';
  $("#aw").value = AK;
  $("#aw").onchange = (e) => {
    AK = e.target.value;
    sk(k);
  };
  document.querySelectorAll("#ab .opt").forEach(
    (b) =>
      (b.onclick = () => {
        a[+b.dataset.x] = +b.dataset.v;
        try {
          localStorage.setItem("gals", JSON.stringify(GS));
        } catch (e) {}
        b.parentNode
          .querySelectorAll(".opt")
          .forEach((y) => y.classList.toggle("s", y === b));
        $("#ap").textContent =
          a.filter(Boolean).length + " dari " + tot + " terisi.";
        ar(k);
        pj();
      }),
  );
  ar(k);
}
function ar(k) {
  const a = gs(k, AK);
  if (!a.every(Boolean)) {
    $("#ar").innerHTML = "";
    return;
  }
  const s = sc(k, AK),
    p = sc(k, "awal"),
    q = sc(k, "akhir"),
    both = gs(k, "awal").every(Boolean) && gs(k, "akhir").every(Boolean);
  $("#ar").innerHTML =
    '<div class="ok">Skor total ' +
    AK +
    ": <b>" +
    s.reduce((x, y) => x + y, 0) +
    "</b> dari " +
    D[k].length * 16 +
    ". Hasil ini untuk melihat perkembangan, bukan menghakimi.</div>" +
    D[k]
      .map(
        (g, i) =>
          '<div class="mt"><div><b>' +
          esc(g.d) +
          " (" +
          s[i] +
          '/16)</b><span><i style="width:' +
          (s[i] / 16) * 100 +
          '%"></i></span></div></div>',
      )
      .join("") +
    (both
      ? "<p><b>Perubahan awal ke akhir:</b> " +
        D[k]
          .map(
            (g, i) => g.d + " " + (q[i] - p[i] >= 0 ? "+" : "") + (q[i] - p[i]),
          )
          .join(", ") +
        ".</p>"
      : "");
}
function rb() {
  const R = D.R;
  let h =
    '<div class="f" style="margin-bottom:12px"><input id="rm" placeholder="Nama siswa yang dinilai"></div><p class="mu">Pilih skor 1 sampai 4 tiap aspek, berdasarkan Tugas Kinerja dan pola perilaku siswa.</p>';
  R.forEach((r, i) => {
    h +=
      '<fieldset style="margin:10px 0"><legend>' +
      r[0] +
      '</legend><div class="row">' +
      [4, 3, 2, 1]
        .map(
          (v) =>
            '<button class="opt" data-i="' +
            i +
            '" data-v="' +
            v +
            '">' +
            v +
            " - " +
            esc(r[v]) +
            "</button>",
        )
        .join("") +
      "</div></fieldset>";
  });
  $("#ab").innerHTML =
    h +
    '<p id="rt" role="status"></p><div class="row"><button class="btn o" id="r1" type="button">Salin penilaian</button><button class="btn o" id="r2" type="button">Unduh CSV</button></div><div class="err" id="rg" role="alert"></div>';
  const up = () => {
    $("#rt").textContent =
      "Terisi " +
      RV.filter(Boolean).length +
      " dari 7 aspek. Skor total: " +
      RV.reduce((a, b) => a + b, 0) +
      " dari 28.";
  };
  document.querySelectorAll("#ab .opt").forEach((b) => {
    if (RV[+b.dataset.i] === +b.dataset.v) b.classList.add("s");
    b.onclick = () => {
      RV[+b.dataset.i] = +b.dataset.v;
      b.parentNode
        .querySelectorAll(".opt")
        .forEach((y) => y.classList.toggle("s", y === b));
      up();
    };
  });
  up();
  const tx = () =>
    "Rubrik Observasi Green AI\nSiswa: " +
    $("#rm").value.trim() +
    "\n" +
    R.map((r, i) => r[0] + ": " + (RV[i] || "-")).join("\n") +
    "\nTotal: " +
    RV.reduce((a, b) => a + b, 0) +
    "/28";
  $("#r1").onclick = async () => {
    try {
      await navigator.clipboard.writeText(tx());
      $("#rg").textContent = "Tersalin.";
    } catch (e) {
      $("#rg").textContent = "Penyalinan tidak tersedia. Gunakan Unduh CSV.";
    }
  };
  $("#r2").onclick = () =>
    dl(
      "rubrik-green-ai.csv",
      "nama," +
        R.map((r) => r[0]).join(",") +
        ",total\n" +
        '"' +
        $("#rm").value.trim().replace(/"/g, "") +
        '",' +
        RV.map((x) => x || "").join(",") +
        "," +
        RV.reduce((a, b) => a + b, 0),
      "#rg",
    );
}
function dl(f, d, m) {
  try {
    const csv = /\.csv$/i.test(f),
      u = URL.createObjectURL(
        new Blob([csv ? "\ufeff" + d : d], {
          type: csv ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
        }),
      ),
      a = document.createElement("a");
    a.href = u;
    a.download = f;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 1500);
    $(m).textContent = "Tersimpan.";
  } catch (e) {
    $(m).textContent = "Unduhan gagal. Coba lagi atau gunakan Salin.";
  }
}
function rp() {
  const c = card(),
    v = (id) => $("#" + id).value.trim(),
    L = [
      "LAPORAN GREEN AI LITERACY",
      "Nama: " + v("gn"),
      "Kelas: " + v("gk"),
      "Misi: " +
        done.slice(0, 5).filter(Boolean).length +
        " dari 5 level selesai, bintang " +
        done.reduce((a, b) => a + b, 0) +
        "/18",
      "Kartu Komitmen: " + (c ? c.km : "belum dibuat"),
      "Pelacak: " + N + " dari 14 hari",
    ];
  L.push("Kode laporan: " + kode());
  ["awal", "akhir"].forEach((w) =>
    ["L", "B"].forEach((k) => {
      if (gs(k, w).every(Boolean)) {
        const s = sc(k, w);
        L.push(
          (k === "L" ? "Skala Literasi " : "Skala Perilaku ") +
            w +
            ": total " +
            s.reduce((a, b) => a + b, 0) +
            " (" +
            D[k].map((g, i) => g.d + " " + s[i]).join(", ") +
            ")",
        );
      }
    }),
  );
  return L.join("\n");
}
function kg() {
  const c = card() || {};
  $("#ab").innerHTML =
    '<p>Isi email gurumu, lalu kirim laporan progresmu. Laporan dibuat dari data di perangkat ini dan dikirim lewat aplikasi emailmu, bukan oleh situs.</p><div class="f" style="display:grid;gap:10px;max-width:520px"><input id="gn" placeholder="Namamu" autocomplete="name"><input id="gk" placeholder="Kelas"><input id="ge" type="email" placeholder="Email guru"></div><textarea id="gr" rows="9" readonly style="width:100%;margin:12px 0;padding:12px;border-radius:12px;border:2px solid var(--ln);background:var(--sf);color:var(--ink);font:inherit"></textarea><div class="err" id="gm" role="alert"></div><div class="row"><button class="btn" id="g1" type="button">Buka email</button><button class="btn o" id="g2" type="button">Salin laporan</button><button class="btn o" id="g3" type="button">Unduh laporan</button></div>';
  $("#gn").value = c.kn || ME.n || "";
  $("#gk").value = c.kk || ME.k || "";
  const up = () => ($("#gr").value = rp());
  ["gn", "gk"].forEach((i) => ($("#" + i).oninput = up));
  up();
  $("#g1").onclick = () => {
    const e = $("#ge").value.trim(),
      n = $("#gn").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) || !n) {
      $("#gm").textContent = "Isi namamu dan email guru yang valid.";
      return;
    }
    $("#gm").textContent = "Jika email tidak terbuka, gunakan Salin laporan.";
    const a = document.createElement("a");
    a.href =
      "mailto:" +
      e +
      "?subject=" +
      encodeURIComponent("Laporan Green AI Literacy - " + n) +
      "&body=" +
      encodeURIComponent(rp());
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  };
  $("#g2").onclick = async () => {
    try {
      await navigator.clipboard.writeText(rp());
      $("#gm").textContent = "Tersalin.";
    } catch (e) {
      $("#gr").select();
      $("#gm").textContent = "Tekan Ctrl+C untuk menyalin.";
    }
  };
  $("#g3").onclick = () => dl("laporan-green-ai.txt", rp(), "#gm");
}
async function rs() {
  if (window.gailSupabase) {
    $("#sd")?.setAttribute("hidden", "");
    const { data, error } = await window.gailSupabase
      .from("research_results")
      .select("participant_count,pre_scores,post_scores,notes,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    const root = $("#rh");
    root.replaceChildren();
    if (error) {
      const missingTable =
        error.code === "PGRST205" ||
        /Could not find the table 'public\.research_results' in the schema cache/i.test(
          error.message || "",
        );
      if (missingTable) {
        console.warn(
          "Tabel hasil riset Supabase belum tersedia. Jalankan supabase-schema.sql di SQL Editor proyek Supabase.",
        );
      } else {
        console.error("Hasil riset gagal dimuat:", error);
      }
      const message = document.createElement("p");
      message.className = "err";
      message.textContent =
        missingTable
          ? "Data riset belum tersedia karena konfigurasi database belum selesai."
          : "Hasil riset tidak dapat dimuat saat ini. Silakan coba lagi nanti.";
      root.append(message);
      return;
    }
    if (!data?.length) {
      const empty = document.createElement("div");
      empty.className = "gate";
      const title = document.createElement("h3");
      title.textContent = "Hasil riset segera hadir";
      const message = document.createElement("p");
      message.textContent = "Tim peneliti belum menerbitkan hasil riset.";
      empty.append(title, message);
      root.append(empty);
      return;
    }
    for (const result of data) {
      if (
        !Array.isArray(result.pre_scores) ||
        !Array.isArray(result.post_scores) ||
        result.pre_scores.length !== D.L.length ||
        result.post_scores.length !== D.L.length
      ) {
        console.error(
          "Hasil riset terbit memiliki format skor yang tidak valid.",
        );
        continue;
      }
      const article = document.createElement("article");
      const title = document.createElement("h3");
      title.textContent = `Hasil riset · ${result.participant_count} peserta`;
      article.append(title);
      const summary = document.createElement("p");
      summary.textContent =
        "Rata-rata skor Skala Literasi per dimensi (4 sampai 16).";
      article.append(summary);
      D.L.forEach((dimension, index) => {
        const row = document.createElement("p");
        row.textContent = `${dimension.d}: awal ${result.pre_scores[index]}, akhir ${result.post_scores[index]}`;
        article.append(row);
      });
      if (result.notes) {
        const notes = document.createElement("p");
        notes.className = "mu";
        notes.textContent = result.notes;
        article.append(notes);
      }
      root.append(article);
    }
    if (!root.childElementCount) {
      const message = document.createElement("p");
      message.textContent =
        "Data hasil riset terbit belum memiliki format skor yang valid.";
      root.append(message);
    }
    return;
  }
  $("#rh").innerHTML =
    '<div class="gate"><h3>Data belum tersedia</h3><p>Hasil riset akan tampil di sini setelah analisis selesai dan dipublikasikan oleh tim peneliti.</p></div>';
}
function sr() {
  $("#sd")?.setAttribute("hidden", "");
}
$("#sk")?.addEventListener("click", async () => {
  const v = (id) => $("#" + id).value.trim(),
    j = document.querySelector('input[name="sj"]:checked'),
    m = {
      t: Date.now(),
      peran: v("sp"),
      kat: v("sc"),
      jenis: j ? j.value : "Saran",
      pesan: v("sm"),
      nama: v("sn"),
    };
  if (m.pesan.length < 10) {
    $("#se").textContent = "Tulis pesan minimal 10 karakter.";
    return;
  }
  $("#se").textContent = "";
  if (window.gailSupabase) {
    try {
      const { error } = await window.gailSupabase.from("feedback").insert({
        role: m.peran,
        category: m.kat,
        kind: m.jenis,
        message: m.pesan,
        name: m.nama,
      });
      if (error) throw error;
      $("#sm").value = "";
      $("#so").textContent =
        "Terima kasih! Masukanmu terkirim ke tim peneliti.";
      $("#so").className = "ok";
      say("Terima kasih atas masukanmu!");
    } catch (error) {
      $("#se").textContent = `Masukan gagal dikirim: ${error.message}`;
    }
    return;
  }
  const tx =
    "Saran Green AI Literacy\n" +
    m.jenis +
    " / " +
    m.kat +
    " / " +
    m.peran +
    "\n" +
    m.pesan +
    (m.nama ? "\nDari: " + m.nama : "");
  $("#so").innerHTML =
    '<div class="ok">Pengiriman langsung tidak tersedia di tampilan ini. Salin pesanmu dan kirim ke tim peneliti.</div><textarea id="sx" rows="4" readonly style="width:100%;padding:10px;border-radius:10px;border:2px solid var(--ln);background:var(--sf);color:var(--ink);font:inherit"></textarea>' +
    (TIM
      ? '<a class="btn" href="mailto:' +
        TIM +
        "?subject=" +
        encodeURIComponent("Saran Green AI Literacy") +
        "&body=" +
        encodeURIComponent(tx) +
        '" target="_blank" rel="noopener">Kirim lewat email</a>'
      : "");
  $("#sx").value = tx;
});
const KODE_F = "sulur-hijau-2026",
  HR = [
    [
      "Ada istilah baru di buku yang belum kamu pahami. Apa langkah pertamamu?",
      [
        "Langsung bertanya ke AI",
        "Mencari di buku atau catatan dulu",
        "Bertanya ke teman, lalu memeriksa dengan AI",
      ],
      "Mencoba sendiri dulu melatih pemahaman. AI tetap boleh dipakai bila perlu.",
    ],
    [
      "Kamu mau meminta AI merangkum artikel untuk tugas. Apa yang kamu pertimbangkan?",
      [
        "Meminta ringkasan lalu menyalinnya",
        "Membaca dulu, lalu meminta AI membantu memeriksa ringkasanku",
        "Meminta lima versi ringkasan",
      ],
      "Keputusan akhir tetap di tanganmu. Ringkasan yang kamu pahami lebih berguna.",
    ],
    [
      "Jawaban AI terasa meyakinkan. Apa yang kamu lakukan?",
      [
        "Langsung memakainya",
        "Memeriksa bagian pentingnya ke sumber tepercaya",
        "Bertanya ulang sampai jawabannya sama",
      ],
      "Verifikasi adalah tugas manusia, bukan bagian dari prompt.",
    ],
    [
      "Prompt pertamamu kurang pas. Apa langkahmu?",
      [
        "Mengetik prompt baru yang sama sekali berbeda",
        "Memperjelas tujuan, konteks, dan bentuk keluaran",
        "Menekan regenerasi berkali-kali",
      ],
      "Prompt yang jelas lebih berguna daripada banyak percobaan.",
    ],
    [
      "Tugasmu bertujuan melatih kemampuanmu sendiri. Bagaimana memakai AI?",
      [
        "Meminta AI mengerjakan seluruhnya",
        "Mengerjakan sendiri, memakai AI hanya untuk memeriksa",
        "Tidak memakai AI sama sekali",
      ],
      "Ketiganya sah bila beralasan. Yang penting kamu tahu alasannya.",
    ],
    [
      "Perangkatmu masih berfungsi tetapi ada model baru. Apa yang kamu timbang?",
      [
        "Langsung mengganti",
        "Menimbang kebutuhan dan dampak jangka panjang",
        "Menunda tanpa alasan",
      ],
      "Memakai perangkat selama layak membantu mengurangi limbah elektronik.",
    ],
  ];
let ROLE = "g",
  ME = {};
try {
  ME = JSON.parse(localStorage.getItem("galu") || "{}");
  ROLE = ME.r || "g";
} catch (e) {}
function gof() {
  const f = done.slice(0, 5).findIndex((x) => !x);
  go(Math.min(f < 0 ? 4 : f, ROLE === "g" ? 1 : 4));
}
function applyRole() {
  $("#me").textContent =
    ROLE === "g"
      ? ""
      : (ROLE === "f" ? "Fasilitator" : "Siswa") + (ME.n ? ": " + ME.n : "");
  $("#lgb").textContent = ROLE === "g" ? "Masuk" : "Keluar";
  gof();
}
function op(r) {
  $("#dlg").showModal();
  document.querySelector('input[name="pr"][value="' + r + '"]').checked = true;
  tg();
}
function tg() {
  $("#dkd").hidden =
    document.querySelector('input[name="pr"]:checked').value !== "f";
}
document.querySelectorAll('input[name="pr"]').forEach((i) => (i.onchange = tg));
$("#dcl")?.addEventListener("click", () => $("#dlg")?.close());
$("#lgb").onclick = () => {
  if (ROLE !== "g") {
    ROLE = "g";
    ME = {};
    try {
      localStorage.removeItem("galu");
    } catch (e) {}
    applyRole();
    route("beranda");
    say("Kamu keluar. Progres tetap tersimpan di perangkat ini.");
    return;
  }
  op("s");
};
$("#ddn")?.addEventListener("click", async () => {
  const r = document.querySelector('input[name="pr"]:checked').value,
    n = $("#dnm").value.trim();
  if (n.length < 2) {
    $("#dde").textContent = "Isi namamu.";
    return;
  }
  if (r === "f") {
    if ($("#dkd").value.trim().toLowerCase() !== KODE_F) {
      $("#dde").textContent = "Kode fasilitator belum tepat.";
      return;
    }
  }
  $("#dde").textContent = "";
  ME = {
    r,
    n,
    k: $("#dkl").value.trim(),
    kc: $("#dkc").value.trim().toUpperCase(),
  };
  try {
    localStorage.setItem("galu", JSON.stringify(ME));
  } catch (e) {}
  ROLE = r;
  $("#dlg").close();
  applyRole();
  say("Selamat datang, " + n + "!");
  const tgt =
    WANT &&
    document
      .querySelector('.nav .l[data-go="' + WANT + '"]')
      ?.dataset.r.includes(r)
      ? WANT
      : r === "f"
        ? "panduan"
        : "beranda";
  route(tgt, true);
});
function lgs() {
  try {
    return JSON.parse(localStorage.getItem("gall") || "[]");
  } catch (e) {
    return [];
  }
}
function kode() {
  const g = lgs(),
    c = card() || {},
    q = (id) => ($("#" + id) ? $("#" + id).value.trim() : ""),
    o = {
      v: 1,
      n: q("gn") || ME.n || "",
      k: q("gk") || ME.k || "",
      kc: ME.kc || "",
      m: done.slice(0, 5).filter(Boolean).length,
      p: done.reduce((a, b) => a + b, 0),
      N,
      c: (c.km || "").slice(0, 140),
      g: [
        g.length,
        g.length
          ? Math.round((g.filter((x) => x.v === "Ya").length / g.length) * 100)
          : 0,
        g.length
          ? +(g.reduce((a, x) => a + (+x.i || 0), 0) / g.length).toFixed(1)
          : 0,
      ],
    };
  ["L", "B"].forEach((k) =>
    ["awal", "akhir"].forEach((w) => {
      if (gs(k, w).every(Boolean)) (o[k] = o[k] || {})[w] = sc(k, w);
    }),
  );
  return "GAIL1:" + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
}
function lgp() {
  const g = lgs(),
    n = g.length,
    sv = (a) => a.reduce((s, x) => s + (+x.i || 0), 0) / (a.length || 1),
    vf = (a) => a.filter((x) => x.v === "Ya").length / (a.length || 1);
  let tr = "";
  if (n >= 4) {
    const h = Math.floor(n / 2),
      e = g.slice(0, h),
      l = g.slice(h);
    tr =
      "Dibanding paruh awal, interaksi per tugas " +
      (sv(l) < sv(e)
        ? "cenderung menurun"
        : sv(l) > sv(e)
          ? "cenderung naik"
          : "relatif sama") +
      " dan verifikasi " +
      (vf(l) > vf(e)
        ? "cenderung meningkat"
        : vf(l) < vf(e)
          ? "cenderung menurun"
          : "relatif sama") +
      ". Ini gambaran pola, bukan nilai.";
  }
  $("#ga_sum").innerHTML =
    '<div class="stats"><div><b>' +
    n +
    "</b>catatan</div><div><b>" +
    (n ? sv(g).toFixed(1) : 0) +
    "</b>interaksi rata-rata per tugas</div><div><b>" +
    Math.round(vf(g) * 100) +
    "%</b>tugas yang diverifikasi</div></div>" +
    (tr
      ? "<p>" + tr + "</p>"
      : '<p class="mu">Pola muncul setelah empat catatan.</p>');
  $("#ga_l").innerHTML = g
    .map(
      (x, i) =>
        '<div class="sr"><small>' +
        new Date(x.t).toLocaleDateString("id-ID") +
        " - AI: " +
        esc(x.p) +
        " - " +
        x.i +
        " interaksi - verifikasi: " +
        esc(x.v) +
        '</small><p style="margin:6px 0 0"><b>' +
        esc(x.tg) +
        "</b>" +
        (x.pr ? "<br>Prompt: " + esc(x.pr) : "") +
        (x.c ? "<br>Cara verifikasi: " + esc(x.c) : "") +
        (x.d ? "<br>Dipakai/diubah/ditolak: " + esc(x.d) : "") +
        (x.b ? "<br>Berhenti karena: " + esc(x.b) : "") +
        '</p><button class="opt" data-d="' +
        i +
        '">Hapus</button></div>',
    )
    .reverse()
    .join("");
  document.querySelectorAll("#ga_l [data-d]").forEach(
    (b) =>
      (b.onclick = () => {
        g.splice(+b.dataset.d, 1);
        try {
          localStorage.setItem("gall", JSON.stringify(g));
        } catch (e) {}
        lgp();
      }),
  );
}
if ($("#ga_s"))
  $("#ga_s").onclick = () => {
    const v = (i) => $("#" + i).value.trim(),
      e = {
        t: Date.now(),
        tg: v("ga_t"),
        p: v("ga_p"),
        i: +v("ga_i") || 0,
        pr: v("ga_m"),
        v: v("ga_v"),
        c: v("ga_c"),
        d: v("ga_d"),
        b: v("ga_b"),
      };
    if (!e.tg) {
      $("#ga_e").textContent = "Isi tugasnya dulu.";
      return;
    }
    $("#ga_e").textContent = "";
    const g = lgs();
    g.push(e);
    try {
      localStorage.setItem("gall", JSON.stringify(g));
    } catch (x) {}
    ["ga_t", "ga_i", "ga_m", "ga_c", "ga_d", "ga_b"].forEach(
      (i) => ($("#" + i).value = ""),
    );
    say("Catatan tersimpan.");
    lgp();
  };
if ($("#ga_x"))
  $("#ga_x").onclick = () => {
    const c = (x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
    dl(
      "log-penggunaan-ai.csv",
      [
        [
          "tanggal",
          "tugas",
          "pakai_ai",
          "interaksi",
          "prompt",
          "verifikasi",
          "cara",
          "dipakai_diubah_ditolak",
          "alasan_berhenti",
        ].join(","),
      ]
        .concat(
          lgs().map((x) =>
            [
              new Date(x.t).toISOString().slice(0, 10),
              x.tg,
              x.p,
              x.i,
              x.pr,
              x.v,
              x.c,
              x.d,
              x.b,
            ]
              .map(c)
              .join(","),
          ),
        )
        .join("\n"),
      "#ga_e",
    );
  };
function rk() {
  $("#ab").innerHTML =
    '<p>Tempel kode laporan siswa (satu atau banyak, dari email, WhatsApp, atau Classroom). Data diproses di perangkatmu dan tidak dikirim ke mana pun.</p><textarea id="rkt" rows="5" aria-label="Kode laporan siswa" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--ln);background:var(--sf);color:var(--ink);font:inherit"></textarea><div class="row"><button class="btn" id="rkb" type="button">Proses</button><select id="rkf" aria-label="Filter kelas"><option value="">Semua kelas</option></select><button class="btn o" id="rkx" type="button">Unduh CSV</button></div><div class="err" id="rke" role="alert"></div><div id="rkr" style="overflow-x:auto"></div>';
  let R = [],
    rows = [];
  const sm = (a) => (a ? a.reduce((x, y) => x + y, 0) : null),
    T = (o) => {
      const a = sm(o.L && o.L.akhir),
        b = sm(o.L && o.L.awal);
      return {
        Nama: o.n,
        Kelas: o.k,
        Misi: o.m + "/5",
        Bintang: o.p,
        Pelacak: o.N + "/14",
        "Literasi awal": b,
        "Literasi akhir": a,
        Selisih: a != null && b != null ? a - b : null,
        "Perilaku akhir": sm(o.B && o.B.akhir),
        "Log entri": o.g ? o.g[0] : 0,
        "Verifikasi %": o.g ? o.g[1] : 0,
        "Interaksi rata-rata": o.g ? o.g[2] : 0,
      };
    };
  const draw = () => {
    const f = $("#rkf").value;
    rows = R.filter((o) => !f || o.k === f).map(T);
    if (!rows.length) {
      $("#rkr").innerHTML = "";
      return;
    }
    const H = Object.keys(rows[0]),
      av = (h) => {
        const v = rows.map((r) => r[h]).filter((x) => typeof x === "number");
        return v.length
          ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
          : "-";
      };
    $("#rkr").innerHTML =
      "<table><tr>" +
      H.map((h) => "<th>" + h + "</th>").join("") +
      "</tr>" +
      rows
        .map(
          (r) =>
            "<tr>" +
            H.map(
              (h) => "<td>" + esc(r[h] == null ? "-" : r[h]) + "</td>",
            ).join("") +
            "</tr>",
        )
        .join("") +
      "<tr><th>Rata-rata</th>" +
      H.slice(1)
        .map((h) => "<th>" + (h === "Kelas" ? "" : av(h)) + "</th>")
        .join("") +
      "</tr></table>";
  };
  $("#rkb").onclick = () => {
    const ms = $("#rkt").value.match(/GAIL1:[A-Za-z0-9+\/=]+/g) || [],
      m = {};
    ms.forEach((x) => {
      try {
        const o = JSON.parse(decodeURIComponent(escape(atob(x.slice(6)))));
        m[o.n + "|" + o.k] = o;
      } catch (e) {}
    });
    R = Object.values(m);
    $("#rke").textContent = R.length
      ? R.length + " siswa terbaca."
      : "Tidak ada kode laporan yang valid.";
    const ks = [...new Set(R.map((o) => o.k).filter(Boolean))];
    $("#rkf").innerHTML =
      '<option value="">Semua kelas</option>' +
      ks.map((k) => "<option>" + esc(k) + "</option>").join("");
    draw();
  };
  $("#rkf").onchange = draw;
  $("#rkx").onclick = () => {
    if (!rows.length) {
      $("#rke").textContent = "Proses kode dulu.";
      return;
    }
    const H = Object.keys(rows[0]),
      c = (x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
    dl(
      "rekap-kelas-green-ai.csv",
      [H.map(c).join(",")]
        .concat(rows.map((r) => H.map((h) => c(r[h])).join(",")))
        .join("\n"),
      "#rke",
    );
  };
}
function pd() {
  let a = [];
  try {
    a = JSON.parse(localStorage.getItem("galck") || "[]");
  } catch (e) {}
  document.querySelectorAll("#p-panduan [data-c]").forEach((b) => {
    b.checked = !!a[+b.dataset.c];
    b.onchange = () => {
      a[+b.dataset.c] = b.checked;
      try {
        localStorage.setItem("galck", JSON.stringify(a));
      } catch (e) {}
    };
  });
}
function hr() {
  let S = {};
  try {
    S = JSON.parse(localStorage.getItem("galh") || "{}");
  } catch (e) {}
  const ds = (t) => new Date(t).toLocaleDateString("sv"),
    d = ds(Date.now()),
    q = HR[Math.floor(Date.now() / 864e5) % HR.length],
    el = $("#hr");
  if (S.d === d) {
    el.innerHTML =
      "<b>Misi harian selesai.</b> Streak: " +
      S.s +
      " hari. Kembali besok untuk misi baru.";
    return;
  }
  el.innerHTML =
    "<b>Misi harian</b> (streak " +
    (S.s || 0) +
    " hari)<p>" +
    q[0] +
    '</p><div class="row">' +
    q[1].map((x) => '<button class="opt">' + x + "</button>").join("") +
    '</div><div id="hro"></div>';
  el.querySelectorAll(".opt").forEach(
    (b) =>
      (b.onclick = () => {
        const n = { d, s: S.d === ds(Date.now() - 864e5) ? (S.s || 0) + 1 : 1 };
        try {
          localStorage.setItem("galh", JSON.stringify(n));
        } catch (e) {}
        el.querySelectorAll(".opt").forEach((x) => (x.disabled = true));
        $("#hro").innerHTML =
          '<div class="ok">' + q[2] + " Streak: " + n.s + " hari.</div>";
        say("Streak " + n.s + " hari!");
      }),
  );
}
function rvi() {
  const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  document
    .querySelectorAll(
      ".pg.on .stats div,.pg.on .tiles button,.pg.on .prod article,.pg.on .flow div,.pg.on .sr,.pg.on details,.pg.on .rm3>div",
    )
    .forEach((e, i) => {
      if (e.dataset.rv) return;
      e.dataset.rv = 1;
      e.classList.add("rv");
      e.style.transitionDelay = Math.min(i % 5, 4) * 70 + "ms";
      if (rm) e.classList.add("in");
      else if (window.nolReveal) window.nolReveal(e);
    });
}
function cv() {
  const c = $("#cv"),
    x = c.getContext("2d"),
    rm = matchMedia("(prefers-reduced-motion:reduce)").matches,
    r = devicePixelRatio || 1;
  let W,
    H,
    f = 0;
  const P = [],
    rz = () => {
      W = c.width = c.offsetWidth * r;
      H = c.height = c.offsetHeight * r;
    },
    col = () => {
      const s = getComputedStyle(document.documentElement);
      return ["--g", "--g2", "--g", "--b", "--b"].map(
        (k) => s.getPropertyValue(k).trim() || "#0b4a38",
      );
    };
  rz();
  addEventListener("resize", rz);
  let C = col();
  for (let i = 0; i < 70; i++)
    P.push({
      x: Math.random(),
      y: Math.random(),
      v: 0.0008 + Math.random() * 0.0016,
      r: 1 + Math.random() * 2.2,
      p: Math.random() * 6,
    });
  function fr() {
    f++;
    if (f % 90 === 0) C = col();
    x.clearRect(0, 0, W, H);
    if (
      $("#p-beranda").classList.contains("on") &&
      document.visibilityState === "visible"
    ) {
      for (let i = 0; i < 5; i++) {
        x.beginPath();
        x.strokeStyle = C[i];
        x.globalAlpha = 0.25;
        x.lineWidth = 2;
        x.arc(
          (i * 0.2 + 0.1) * W,
          H * 0.5,
          Math.max(0, H * 0.18 + Math.sin(f / 60 + i) * 6),
          0,
          7,
        );
        x.stroke();
      }
      P.forEach((p) => {
        if (!rm) p.x += p.v;
        if (p.x > 1) p.x = 0;
        const s = Math.min(4, Math.floor(p.x * 5)),
          y =
            (p.y * 0.6 + 0.2) * H + Math.sin(p.x * 9 + p.p + f / 80) * H * 0.08;
        x.globalAlpha = 0.7;
        x.fillStyle = C[s];
        x.beginPath();
        x.arc(p.x * W, y, p.r * r, 0, 7);
        x.fill();
      });
    }
    x.globalAlpha = 1;
    if (!rm) requestAnimationFrame(fr);
  }
  fr();
}
applyRole();
hr();
cv();
navs();
route(location.hash.slice(1) || "beranda");
addEventListener("popstate", () => {
  const h = location.hash.slice(1);
  if (PG.includes(h)) route(h);
});
