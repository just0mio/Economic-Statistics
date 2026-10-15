"""Extract supplied Practice Set text. PDF files remain byte-for-byte unchanged."""
from pathlib import Path
import re, json

out = []
for number in [1, 2, 3]:
    filename = f'LESE152_Practice_Set_{number}.pdf'
    raw = Path('content/source-text/' + filename + '.txt').read_text()
    pages = raw.split('\f')
    def clean(t):
        return '\n'.join(x.rstrip() for x in t.splitlines() if not x.startswith('LESE152 /') and not x.startswith('Original practice material')).strip()
    questions = '\n'.join(clean(x) for x in pages[:4])
    solutions = '\n'.join(clean(x) for x in pages[4:6])
    key = dict(re.findall(r'MC(\d+) ([ABCD])', solutions))
    qs = []
    for m in re.finditer(r'MC(\d+)\.\s*(.*?)(?=\n\s*MC\d+\.|\n\s*PART B)', questions, re.S):
        num, body = int(m[1]), m[2]
        prompt = body.split('(a)')[0].strip()
        opts = dict((k, ' '.join(v.split())) for k, v in re.findall(r'\(([abcd])\)\s*(.*?)(?=\([abcd]\)|$)', body, re.S))
        exp = re.search(rf'MC{num} · [ABCD] (.*?)(?=\n\s*MC\d+ ·|\n\s*PART B)', solutions, re.S)
        assert len(opts) == 4, (number, num, opts)
        qs.append({'id':f'MC{num}', 'question':' '.join(prompt.split()), 'options':[opts[k] for k in 'abcd'], 'answer':'ABCD'.index(key[str(num)]), 'explanation':' '.join(exp[1].split()), 'page':next(i+1 for i,p in enumerate(pages[:4]) if re.search(rf'MC{num}\.',p))})
    for m in re.finditer(r'TF(\d+)\.\s*(.*?)\n\s*Mark:', questions, re.S):
        num = int(m[1])
        exp = re.search(rf'TF{num} · (TRUE|FALSE) (.*?)(?=\n\s*TF\d+ ·|\n\s*PART C)', solutions, re.S)
        qs.append({'id':f'TF{num}', 'question':' '.join(m[2].split()), 'answer':exp[1]=='TRUE', 'explanation':' '.join(exp[2].split()), 'page':next(i+1 for i,p in enumerate(pages[:4]) if re.search(rf'TF{num}\.',p))})
    partc = questions.split('PART C · SHORT ANSWERS (50 points)')[1]
    csolutions = solutions.split('PART C · STEP-BY-STEP SOLUTIONS')[1].split('FINAL FORMULA')[0]
    cs = []
    for num in [1,2,3]:
        c = re.search(rf'C{num}\.\s*(.*?)(?=\n\s*C\d+\.|$)',partc,re.S)[1]
        s = re.search(rf'C{num}\.\s*(.*?)(?=\n\s*C\d+\.|$)',csolutions,re.S)[1]
        intro = c.split('(a)')[0]
        subs=[]
        for letter,pts,prompt in re.findall(r'\(([abcd])\) \[(\d+) pt\]\s*(.*?)(?=\n\s*\([abcd]\)|$)',c,re.S):
            sm=re.search(rf'\({letter}\)\s*(.*?)(?=\n\s*\([abcd]\)|$)',s,re.S)
            subs.append({'id':letter,'points':int(pts),'question':' '.join(prompt.split()),'answer':' '.join(sm[1].split())})
        assert len(subs)==(4 if num==3 else 3),(number,num,subs)
        cs.append({'id':f'C{num}','question':' '.join(intro.split()),'subs':subs})
    assert len(qs)==20,(number,len(qs))
    out.append({'number':number,'filename':filename,'objective':qs,'written':cs})
Path('content/extracted-practice.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print('Extracted:', [(s['number'],len(s['objective']),len(s['written'])) for s in out])
import subprocess
subprocess.run(['python3', 'scripts/extract_additional_practice.py'], check=True)
