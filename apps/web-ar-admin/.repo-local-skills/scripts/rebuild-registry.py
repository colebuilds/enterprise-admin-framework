#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'registry.json'

fm_re = re.compile(r'^---\n(.*?)\n---\n', re.S)

def parse_frontmatter(text: str):
    m = fm_re.match(text)
    if not m:
        return {}
    data = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            data[k.strip()] = v.strip()
    return data

items = []
for p in sorted(ROOT.rglob('SKILL.md')):
    rel = p.relative_to(ROOT)
    txt = p.read_text(encoding='utf-8', errors='ignore')
    fm = parse_frontmatter(txt)
    items.append({
        'path': str(rel),
        'name': fm.get('name', rel.parent.name),
        'description': fm.get('description', ''),
        'keywords': [x.strip() for x in fm.get('keywords', '').split(',') if x.strip()]
    })

OUT.write_text(json.dumps({'skills': items}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Wrote {OUT} with {len(items)} skills')
