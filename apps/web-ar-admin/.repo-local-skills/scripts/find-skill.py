#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / 'registry.json'

if not REGISTRY.exists():
    print('registry.json 不存在，请先运行: python3 .repo-local-skills/scripts/rebuild-registry.py')
    sys.exit(1)

query = ' '.join(sys.argv[1:]).strip().lower()
if not query:
    print('用法: python3 .repo-local-skills/scripts/find-skill.py <关键词...>')
    sys.exit(1)

terms = [t for t in query.split() if t]

data = json.loads(REGISTRY.read_text(encoding='utf-8'))
skills = data.get('skills', [])

scored = []
for s in skills:
    text = ' '.join([
        s.get('name', ''),
        s.get('description', ''),
        ' '.join(s.get('keywords', [])),
        s.get('path', ''),
    ]).lower()
    score = sum(1 for t in terms if t in text)
    if score > 0:
        scored.append((score, s))

scored.sort(key=lambda x: (-x[0], x[1].get('name', '')))

if not scored:
    print('未命中私有 skill。')
    sys.exit(0)

print(f'命中 {len(scored)} 个私有 skill:')
for score, s in scored:
    print(f"- [{score}] {s.get('name')} -> {s.get('path')}")
    print(f"  desc: {s.get('description','')}")
    kws = ', '.join(s.get('keywords', []))
    if kws:
        print(f"  keywords: {kws}")
