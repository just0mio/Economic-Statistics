"""Extract Sets 4-5 without silently repairing missing glyphs in the PDFs."""
from pathlib import Path
import re, json

out = json.loads(Path('content/extracted-practice.json').read_text())[:3]
for number in (4, 5):
    filename = f'LESE152_Practice_Set_{number}.pdf'
    pages = Path('content/source-text', filename+'.txt').read_text().split('\f')[:8]
    def clean(text):
        lines = []
        for line in text.splitlines():
            line = line.strip()
            if (line.startswith('LESE152 ') or line.startswith('Work:')
                    or re.fullmatch(r'_+', line)):
                continue
            lines.append(line)
        return '\n'.join(lines).strip()
    def compact(text): return ' '.join(text.split())
    questions = '\n'.join(clean(p) for p in pages[:5])
    solutions = '\n'.join(clean(p) for p in pages[5:])
    qs=[]
    for num in range(1, 11):
        m=re.search(rf'MC{num}\.\s*(.*?)(?=\n\s*MC\d+\.|\n\s*Part B|$)',questions,re.S|re.I)
        body=m[1]
        options=dict((k,compact(v)) for k,v in re.findall(r'\(([abcd])\)\s*(.*?)(?=\([abcd]\)|$)',body,re.S))
        answer=re.search(rf'MC{num}\s*·\s*([ABCD])\s+(.*?)(?=\n\s*MC\d+\s*·|\n\s*Part B|$)',solutions,re.S|re.I)
        assert len(options)==4,(number,num,options)
        qs.append(dict(id=f'MC{num}',question=compact(body.split('(a)')[0]),options=[options[k] for k in 'abcd'],answer='ABCD'.index(answer[1].upper()),explanation=compact(answer[2]),page=next(i+1 for i,p in enumerate(pages) if re.search(rf'MC{num}\.',p)),answerPage=next(i+1 for i,p in enumerate(pages) if re.search(rf'MC{num}\s*·',p))))
    for num in range(1,11):
        m=re.search(rf'TF{num}\.\s*(.*?)(?=\n\s*[○□])',questions,re.S)
        answer=re.search(rf'TF{num}\s*·\s*(TRUE|FALSE)\s+(.*?)(?=\n\s*TF\d+\s*·|\n\s*Part C|$)',solutions,re.S|re.I)
        assert m and answer,(number,num)
        qs.append(dict(id=f'TF{num}',question=compact(m[1]),answer=answer[1].upper()=='TRUE',explanation=compact(answer[2]),page=3,answerPage=next(i+1 for i,p in enumerate(pages) if re.search(rf'TF{num}\s*·',p))))
    partc=re.split(r'Part C\s*·\s*Short Answers[^\n]*',questions,flags=re.I)[1]
    csolutions=re.split(r'Part C\s*·[^\n]*',solutions,flags=re.I)[1].split('계산 점검:')[0]
    cs=[]
    for num in (1,2,3):
        body=re.search(rf'C{num}\.\s*(.*?)(?=\n\s*C\d+\.|$)',partc,re.S)[1]
        sol=re.search(rf'C{num}\s*·\s*(.*?)(?=\n\s*C\d+\s*·|$)',csolutions,re.S)[1]
        subs=[]
        for letter,pts,prompt in re.findall(r'\(([abcd])\)\s*\[(\d+) pt\]\s*(.*?)(?=\n\s*\([abcd]\)|$)',body,re.S):
            answer=re.search(rf'\({letter}\)\s*(.*?)(?=\n\s*\([abcd]\)|$)',sol,re.S)[1]
            page=4 if num<3 or (number==5 and letter=='a') else 5
            answer_page=7 if number==4 and (num<3 or letter=='a') else 8
            subs.append(dict(id=letter,points=int(pts),question=compact(prompt),answer=compact(answer),page=page,answerPage=answer_page))
        assert len(subs)==(4 if num==3 else 3),(number,num,subs)
        cs.append(dict(id=f'C{num}',question=compact(body.split('(a)')[0]),subs=subs,page=4 if num<3 or number==5 else 5))
    assert len(qs)==20
    out.append(dict(number=number,filename=filename,objective=qs,written=cs))
Path('content/extracted-practice.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print('Extracted original Sets 1-5; source glyph omissions preserved.')
