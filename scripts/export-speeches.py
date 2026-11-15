"""Export authored speeches from the local app database without account/session data."""
import json
import pathlib
import sqlite3
import argparse

root = pathlib.Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--database', required=True)
args = parser.parse_args()
database = pathlib.Path(args.database).resolve()
connection = sqlite3.connect(database.as_uri() + '?mode=ro', uri=True)
rows = {key: json.loads(data) for key, data in connection.execute('SELECT user_id, data FROM practice')}
libraries = [(key, data) for key, data in rows.items() if data.get('kind') == 'library']
if len(libraries) != 1:
    raise SystemExit('Expected one local speech library; choose the intended account before export.')
library_key, library = libraries[0]
account = library_key.removesuffix(':library')
output = root / 'speeches'
output.mkdir(exist_ok=True)
manifest = []
for meta in library['speeches']:
    if meta['title'].startswith('匯入流程測試'):
        continue
    identifier = meta['id']
    data = rows.get(account if identifier == 'leadership' else f'{account}:{identifier}')
    if not data:
        raise SystemExit(f'Missing speech data for {identifier}; export stopped.')
    safe_meta = {k: meta[k] for k in ['id', 'title', 'projectId', 'date', 'deletedAt'] if k in meta}
    bundle = {**safe_meta, **{k: data[k] for k in ['sections', 'versions', 'history', 'done', 'lastEditedAt'] if k in data}}
    folder = output / identifier
    folder.mkdir(exist_ok=True)
    (folder / 'speech.json').write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding='utf-8')
    english = '\n\n'.join(s['en'] for s in data['sections'])
    (folder / 'english.txt').write_text(english + '\n', encoding='utf-8')
    bilingual = '\n\n'.join(f"## {s['title']}\nEN:\n{s['en']}\nZH:\n{s['zh']}" for s in data['sections'])
    (folder / 'bilingual.md').write_text(bilingual + '\n', encoding='utf-8')
    manifest.append({**safe_meta, 'lastEditedAt':data.get('lastEditedAt'), 'file': f'{identifier}/speech.json'})
(output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'exported':len(manifest), 'titles':[s['title'] for s in manifest]}, ensure_ascii=False))
