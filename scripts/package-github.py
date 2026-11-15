"""Build a source-only handoff archive; never include local session/database state."""
import pathlib
import zipfile
import re
root=pathlib.Path(__file__).resolve().parents[1]
dirs={'app','components','db','drizzle','hooks','lib','public','scripts','speeches','vendor','worker','.openai'}
files={'.gitignore','.npmrc','cloudflare-env.d.ts','components.json','drizzle.config.ts','eslint.config.mjs','next.config.ts','package-lock.json','package.json','postcss.config.mjs','README.md','tsconfig.json','vite.config.ts'}
blocked={'.git','node_modules','.sites-runtime','.wrangler','.vinext','.next','dist','__pycache__'}
selected=[]
for item in sorted(root.rglob('*')):
    if not item.is_file(): continue
    rel=item.relative_to(root)
    if any(part in blocked for part in rel.parts): continue
    if rel.parts[0] not in dirs and str(rel) not in files: continue
    if item.name.startswith(('.env','.dev.vars')) or item.suffix in {'.sqlite','.pem','.pyc'}: continue
    if item.suffix in {'.ts','.tsx','.js','.mjs','.json','.md','.py','.txt'}:
        text=item.read_text(encoding='utf-8-sig')
        if re.search(r'(?:art_v2_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-proj-[A-Za-z0-9_-]{20,})',text):
            raise SystemExit(f'Possible credential detected in {rel}; packaging stopped.')
    selected.append(item)
destination=root.parent/'speech-studio-github.zip'
with zipfile.ZipFile(destination,'w',compression=zipfile.ZIP_DEFLATED,strict_timestamps=False) as archive:
    for item in selected: archive.write(item,item.relative_to(root).as_posix())
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert 'speeches/manifest.json' in archive.namelist()
    assert all(not any(part in blocked for part in pathlib.PurePosixPath(name).parts) for name in archive.namelist())
print(f'Prepared {len(selected)} source and speech files; {destination.stat().st_size} bytes; archive verified.')

