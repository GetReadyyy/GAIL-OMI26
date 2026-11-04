import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_dashboard_start = """            <div id="admin-dashboard" hidden>
              <div class="row admin-actions">
                <button class="btn o" id="admin-refresh" type="button">
                  Muat ulang
                </button>
                <button class="btn o" id="admin-logout" type="button">
                  Keluar
                </button>
              </div>
              <section class="admin-section">
                <h2 id="content-form-title">Tambah blok konten</h2>"""

new_dashboard_start = """            <div id="admin-dashboard" hidden>
              <div class="row admin-actions">
                <button class="btn o" id="admin-refresh" type="button">
                  Muat ulang
                </button>
                <button class="btn o" id="admin-logout" type="button">
                  Keluar
                </button>
              </div>
              <div class="stats admin-kpis" id="admin-kpis">
                <div><b id="kpi-feedback">0</b>masukan pengguna</div>
                <div><b id="kpi-content">0</b>blok konten terbit</div>
                <div><b id="kpi-research">0</b>hasil riset tersimpan</div>
                <div><b id="kpi-status" style="color:var(--g)">Online</b>koneksi Supabase</div>
              </div>
              <div class="tabs admin-tabs" role="tablist" id="admin-tabs">
                <button type="button" role="tab" class="admin-tab" data-tab="all" aria-selected="true">Semua Bagian</button>
                <button type="button" role="tab" class="admin-tab" data-tab="content" aria-selected="false">Kelola Konten</button>
                <button type="button" role="tab" class="admin-tab" data-tab="feedback" aria-selected="false">Masukan Pengguna</button>
                <button type="button" role="tab" class="admin-tab" data-tab="research" aria-selected="false">Hasil Riset</button>
              </div>
              <section class="admin-section" id="admin-section-content">
                <h2 id="content-form-title">Tambah blok konten</h2>"""

norm_html = html.replace('\r\n', '\n')
norm_old = old_dashboard_start.replace('\r\n', '\n')
assert norm_old in norm_html, "Old dashboard start not found"

norm_html = norm_html.replace(norm_old, new_dashboard_start.replace('\r\n', '\n'))

# Add live preview container & content filter dropdown after content-form closing </form>
old_form_end = """                  </div>
                </form>
                <div id="admin-content-list" class="admin-list"></div>
              </section>
              <section class="admin-section">
                <h2>Masukan pengguna</h2>
                <div id="admin-feedback-list" class="admin-list"></div>
              </section>
              <section class="admin-section">
                <h2>Tambah hasil riset</h2>"""

new_form_end = """                  </div>
                </form>
                <div id="content-preview-container" class="admin-preview-box" hidden>
                  <h3>Pratinjau Blok Konten</h3>
                  <article class="dynamic-content-item">
                    <h2 id="content-preview-title"></h2>
                    <p id="content-preview-body"></p>
                  </article>
                </div>
                <div class="admin-filter-bar">
                  <label for="content-filter-page" class="sr-only">Filter Halaman</label>
                  <select id="content-filter-page">
                    <option value="all">Semua halaman</option>
                    <option value="beranda">Beranda</option>
                    <option value="panduan">Panduan</option>
                    <option value="model">Model</option>
                    <option value="lab">Lab</option>
                    <option value="misi">Misi</option>
                    <option value="kartu">Kartu</option>
                    <option value="lacak">Pelacak</option>
                    <option value="log">Log AI</option>
                    <option value="asesmen">Asesmen</option>
                    <option value="riset">Riset</option>
                    <option value="saran">Saran</option>
                    <option value="tentang">Tentang</option>
                  </select>
                </div>
                <div id="admin-content-list" class="admin-list"></div>
              </section>
              <section class="admin-section" id="admin-section-feedback">
                <div class="admin-section-header">
                  <h2>Masukan pengguna</h2>
                  <div class="row admin-feedback-tools">
                    <input id="feedback-search" type="search" placeholder="Cari nama atau pesan..." />
                    <select id="feedback-filter-category" aria-label="Filter Kategori">
                      <option value="all">Semua kategori</option>
                      <option value="Konten">Konten</option>
                      <option value="Game">Game</option>
                      <option value="Tampilan">Tampilan</option>
                      <option value="Asesmen">Asesmen</option>
                      <option value="Teknis">Teknis</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <select id="feedback-filter-kind" aria-label="Filter Jenis">
                      <option value="all">Semua jenis</option>
                      <option value="Saran">Saran</option>
                      <option value="Masalah">Masalah</option>
                      <option value="Pujian">Pujian</option>
                    </select>
                    <button class="btn o" id="feedback-export-csv" type="button">Ekspor CSV</button>
                  </div>
                </div>
                <div id="admin-feedback-list" class="admin-list"></div>
              </section>
              <section class="admin-section" id="admin-section-research">
                <h2>Tambah hasil riset</h2>"""

norm_old_end = old_form_end.replace('\r\n', '\n')
assert norm_old_end in norm_html, "Old form end not found"

norm_html = norm_html.replace(norm_old_end, new_form_end.replace('\r\n', '\n'))

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(norm_html)

print("Updated index.html admin section successfully")

