with open('theme.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = """.admin-entry p,
.dynamic-content-item p {
  white-space: pre-wrap;
  color: var(--mu);
}"""

addition = """.admin-entry p,
.dynamic-content-item p {
  white-space: pre-wrap;
  color: var(--mu);
}

.admin-kpis {
  margin-block: 1.5rem;
}

.admin-tabs {
  margin-block: 1rem 2rem;
  width: 100%;
}

.admin-tabs .admin-tab {
  flex: 1;
  text-align: center;
}

.admin-preview-box {
  margin-block: 1.5rem;
  padding: 1.5rem;
  border-radius: var(--r-md);
  border: 1px dashed var(--g);
  background: var(--lm);
}

.admin-preview-box h3 {
  font-size: 1rem;
  color: var(--g);
  margin-bottom: 0.75rem;
}

.admin-section-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.admin-section-header h2 {
  margin-bottom: 0;
}

.admin-feedback-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
}

.admin-feedback-tools input[type="search"] {
  min-height: 2.45rem;
  padding: 0.45rem 0.85rem;
  min-width: 14rem;
  border-radius: var(--r-sm);
}

.admin-feedback-tools select,
.admin-filter-bar select {
  min-height: 2.45rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--r-sm);
}

.admin-filter-bar {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.badge-published,
.badge-draft,
.badge-kind {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: var(--r-full);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.badge-published {
  background: var(--lm);
  color: var(--g);
  border: 1px solid color-mix(in srgb, var(--g) 25%, transparent);
}

.badge-draft {
  background: var(--sf-muted);
  color: var(--mu);
  border: 1px solid var(--ln);
}

.badge-kind.saran {
  background: var(--lm);
  color: var(--g);
}

.badge-kind.masalah {
  background: var(--tint-amber);
  color: var(--b);
}

.badge-kind.pujian {
  background: color-mix(in srgb, var(--g2) 15%, var(--sf));
  color: var(--g2);
}

.research-dim-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 0.65rem;
  margin-block: 1rem;
}

.research-dim-card {
  padding: 0.85rem;
  border-radius: var(--r-sm);
  background: var(--bg);
  border: 1px solid var(--ln-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dim-name {
  font-size: 0.78rem;
  color: var(--mu);
  font-weight: 600;
}

.dim-scores {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
}

.delta-pos {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--g);
}

.delta-neg {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--b);
}

.admin-research-notes {
  margin-top: 0.75rem;
  font-style: italic;
}"""

norm_css = css.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
assert norm_target in norm_css, "Target not found in theme.css"

updated = norm_css.replace(norm_target, addition.replace('\r\n', '\n'))
with open('theme.css', 'w', encoding='utf-8') as f:
    f.write(updated)

print("Updated theme.css with admin styles")

