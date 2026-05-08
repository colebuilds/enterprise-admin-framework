#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / 'registry.json'

if len(sys.argv) < 2:
    print('用法: python3 .repo-local-skills/scripts/load-skill.py <skill-name|path>')
    sys.exit(1)

target = ' '.join(sys.argv[1:]).strip().lower()

if not REGISTRY.exists():
    print('registry.json 不存在，请先运行: python3 .repo-local-skills/scripts/rebuild-registry.py')
    sys.exit(1)

data = json.loads(REGISTRY.read_text(encoding='utf-8'))
skills = data.get('skills', [])

matched = None
for s in skills:
    name = (s.get('name') or '').lower()
    path = (s.get('path') or '').lower()
    if target == name or target == path or target in name or target in path:
        matched = s
        break

if not matched:
    print('未找到匹配 skill。可先执行: python3 .repo-local-skills/scripts/find-skill.py <关键词>')
    sys.exit(0)

skill_path = ROOT / matched['path']
if not skill_path.exists():
    print(f"匹配到但文件不存在: {matched['path']}")
    sys.exit(1)

text = skill_path.read_text(encoding='utf-8', errors='ignore')
print(f"# name: {matched.get('name','')}\n# path: {matched.get('path','')}\n# description: {matched.get('description','')}\n")
print(text)
