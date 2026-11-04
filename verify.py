import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

ids_html = set(re.findall(r'id=["\']([^"\']+)["\']', html))
ids_js = set(re.findall(r'#([a-zA-Z0-9_\-]+)', js))

# IDs created dynamically in JS:
# o, pool, ch, e, r, rs, sv, fx, fv, fb, fr, p1, p2, p3, p4, m1, m2, m3
dynamically_created = {'o', 'pool', 'ch', 'e', 'r', 'rs', 'sv', 'fx', 'fv', 'fb', 'fr', 'p1', 'p2', 'p3', 'p4', 'm1', 'm2', 'm3'}
missing = [i for i in ids_js if i not in ids_html and i not in dynamically_created and not i.startswith('research-pre-') and not i.startswith('research-post-')]
print("Total IDs in HTML:", len(ids_html))
print("Missing IDs:", missing)

