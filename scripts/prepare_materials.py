"""Keep originals unchanged; produce clearly labelled lecture excerpts."""
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import hashlib, json

folder = Path('public/materials')
excerpts = [
    ('L4_Probability.pdf', 'lecture.pdf', 187, 228),
    ('L5_Discrete_Random_Variables.pdf', 'lecture.pdf', 229, 269),
    ('L6_Exam_Scope_Through_Normal.pdf', 'L6_Continuous_Random_Variables.pdf', 1, 18),
]
for name, source, first, last in excerpts:
    reader = PdfReader(folder / source)
    writer = PdfWriter()
    for page in reader.pages[first-1:last]:
        writer.add_page(page)
    writer.add_metadata({'/Title': f'LESE152 excerpt: {source}, pages {first}-{last}'})
    with (folder / name).open('wb') as stream:
        writer.write(stream)

manifest = []
for path in sorted(folder.glob('*.pdf')):
    item = dict(file=path.name, pages=len(PdfReader(path).pages), sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    excerpt = next((x for x in excerpts if x[0] == path.name), None)
    if excerpt:
        item.update(derivedFrom=excerpt[1], sourcePages=[excerpt[2], excerpt[3]])
    manifest.append(item)
Path('content/materials.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Materials:', [(m['file'],m['pages']) for m in manifest])
