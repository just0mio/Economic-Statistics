"""Join lossless source text with explicitly authored Korean translations and study metadata."""
from pathlib import Path
import json
raw=json.loads(Path('content/extracted-practice.json').read_text())
topics=[
['data-types','center','quantiles','axioms','continuous-uniform','conditional','expectation','binomial','poisson','normal','data-types','center','variance-sample','independence','independence','pmf-cdf','linearity','linear-variance','continuous-uniform','exponential'],
['data-types','bounds','addition','poisson','continuous-uniform','quantiles','binomial','correlation','normal','linear-variance','population','independence','conditional','variance-rv','standardization','linearity','continuous-uniform','poisson','exponential','binomial'],
['exponential','conditional','linear-variance','binomial','poisson','continuous-uniform','total-expectation','shape','bayes','linear-variance','correlation','linearity','exponential','continuous-uniform','linear-variance','causality','conditional','poisson','pmf-cdf','linear-variance']]
translations=[
['서열형 변수는 어느 것인가?','4, 6, 8, 10의 표본평균은?','Q1=10, Q3=18일 때 위쪽 1.5×IQR 경계는?','P(A)=.35일 때 P(A의 여사건)는?','배송시간 T~Uniform(20,50)분이다. P(T>35)는?','유기농 농가 60개 중 24개가 보조금을 받는다. P(보조금 | 유기농)는?','X=0,1,2의 확률이 .2,.5,.3이다. E(X)는?','X~Binomial(4,.25)의 분산은?','X~Poisson(1)에서 P(X=0)의 근삿값은?','T~Normal(100,10²)에서 P(T>110)는?',
'우편번호는 수량적 측정값이므로 평균이 의미 있다.','표본 중앙값은 보통 표본평균보다 극단 관측값에 강건하다.','통상적인 불편 표본분산은 편차제곱합을 n으로 나눈다.','P(A∩B)=P(A)P(B)이면 A와 B는 독립이다.','양의 확률을 가진 두 배타적 사건은 독립이기도 하다.','유효한 이산 PMF의 확률 합은 1이다.','확률변수 X에 대해 E(2X+5)=2E(X)+5다.','X에 10을 더하면 분산이 변한다.','연속분포의 밀도 f(x)는 1보다 클 수 없다.','지수 대기시간은 무기억성을 가진다: 이미 기다린 시간은 일정한 추가 시간의 대기확률을 바꾸지 않는다.'],
['100개 농가의 연간 생산량을 5년 추적했다. 자료 구조는?','체비쇼프 부등식에서 2표준편차 이내의 최소 비율은?','독립 사건 A,B의 확률 .5,.4일 때 P(A∪B)는?','시간당 Poisson(3) 대의 트럭이 도착한다. 정확히 1대의 확률은?','T~Uniform(12,36)분일 때 P(T<20)는?','정렬된 자료 10,20,30,40,50,60,70에서 p(n+1) 규칙의 75백분위수는?','X~Binomial(10,.2)의 E(X)는?','표본상관 −.9의 해석은?','T~Normal(80,5²)에서 P(T>90)는?','수익 R과 비용 C는 독립이며 표준편차가 3,4다. sd(R−C)는?',
'유한 평균을 갖는 모집단의 무작위 표본에서 표본평균은 모평균의 불편추정량이다.','양의 확률을 가진 두 사건이 배타적이면 반드시 독립이다.','정의 가능한 경우 P(A|B)는 항상 P(B|A)와 같다.','E(X)=4, E(X²)=21이면 Var(X)=5다.','모든 관측값에 같은 양의 상수를 더하면 변동계수는 변하지 않는다.','X,Y가 독립이면 E(XY)=E(X)E(Y)다.','연속 PDF는 일부 점에서 1보다 클 수 있다.','포아송 확률변수는 음의 정수 값을 취할 수 있다.','지수 확률변수에는 무기억성이 있다.','0<p<1인 X~Binomial(n,p)의 분산은 np다.'],
['분당 발생률 .25인 지수 대기시간 T에서 P(T>8)은?','P(A)=.3, P(B)=.4, P(A∩B)=.12일 때 P(B|A)는?','독립 X,Y의 표준편차는 3,4다. Var(2X−Y)는?','X~Binomial(6,.5)에서 P(X≥5)는?','30분당 발생률 2인 포아송 도착에서 1시간 동안 0회일 확률은?','X~Uniform(2,6)에서 P(3<X<5)는?','P(좋은 날씨)=.2, E(Y|좋음)=30, E(Y|나쁨)=10일 때 E(Y)는?','소득분포의 긴 오른쪽 꼬리는 보통 무엇을 시사하는가?','유병률 .05, 민감도 .90, 위양성률 .05일 때 P(질병|양성)는?','Z=(X−μ)/σ이며 0<σ<∞다. sd(Z)는?',
'X,Y의 공분산이 0이면 항상 독립이 증명된다.','E(X+Y)=E(X)+E(Y)는 X,Y의 독립을 요구한다.','지수 T에 대해 P(T>30|T>10)=P(T>20)다.','연속 확률변수에서 P(X=3)은 양수일 수 있다.','유한 분산인 X에 대해 Var(2X−7)=4Var(X)다.','양의 표본상관은 X를 바꾸면 Y가 인과적으로 증가한다는 충분한 증거다.','A가 B의 부분집합이고 P(B)>0이면 P(A|B)=P(A)/P(B)다.','X~Poisson(4)이면 P(X=0)=e⁻⁴이다.','CDF F가 x=3에서 연속이면 P(X=3)=0이다.','유한 분산인 X,Y가 독립이면 Var(X−Y)=Var(X)+Var(Y)다.']]
introductions=[
['농산물 시장 방문객: 8일간 방문자 수는 10,12,14,16,18,20,22,40이다.','해충 경보 검사: 감염률 20%, 감염 농지의 경보확률 .80, 깨끗한 농지의 경보확률 .10이다.','케이터링 주문과 대기시간: X=0,1,2,3의 PMF는 .1,.4,.4,.1이다.'],
['주간 시장 판매량: 8개 관측값(상자)은 15,18,20,22,25,27,30,43이다.','두 해충 검사: 감염률 12%. 감염 여부에 조건부로 두 검사는 독립이다. 각 검사 민감도 .85, 위양성률 .10이다.','배달 주문·이익·준비: X=0,1,2,3의 PMF는 .15,.35,.35,.15이다.'],
['드문 고매출일: 정렬된 판매량(만원)은 11,12,13,13,15,16,18,19,21,48이다.','엇갈린 검사: 감염률 5%, 각 검사 민감도 .95, 위양성률 .08. 감염 또는 비감염에 조건부로 두 결과는 독립이다.','농가 수익과 독립 비용: 에이커당 X(천원)는 −20,0,40,100이고 확률은 .2,.3,.4,.1이다.']]
c_text=[
[['평균과 중앙값을 구하고 왜도에 관해 해석하시오.','Lp=(p/100)(n+1)과 보간법으로 Q1,Q3를 구하고 1.5×IQR 이상치를 확인하시오.','표본표준편차와 변동계수(%)를 구하시오.'],['P(+)를 구하시오.','P(D|+)를 구하시오.','P(D|경보 없음)를 구하시오.'],['E(X), Var(X), sd(X)를 구하시오.','이익 Y=20X−5(천원)의 E(Y), sd(Y)를 구하시오.','독립 고객 3명의 지각 결제확률이 각각 .10이다. 정확히 1명의 지각 결제확률은?','준비시간 T~Uniform(10,50)분이다. P(T>40)과 75백분위수를 구하시오.']],
[['평균과 중앙값을 구하고 분포를 해석하시오.','(n+1) 보간법으로 Q1,Q3와 위쪽 이상치 경계를 구하시오.','표본표준편차와 변동계수를 구하시오.'],['첫 검사가 양성일 확률은?','양성 1회에서 P(D|+)는?','양성 2회에서 P(D|+,+)를 구하고 조건부 독립이 사용되는 위치를 설명하시오.'],['E(X), Var(X), sd(X)를 구하시오.','이익 Y=30X−12(천원)의 E(Y), sd(Y)를 구하시오.','독립 청구서 4개의 지각확률이 각각 .2다. 정확히 2개 지각확률은?','준비시간 T~Normal(50,8²)분이다. P(T>62)와 90백분위수를 구하시오.']],
[['평균과 중앙값을 구하고 큰 관측값의 영향을 설명하시오.','Lp=(p/100)(n+1)로 Q1,Q3와 위쪽 이상치 경계를 구하시오.','표본표준편차와 CV를 구하고 CV가 높을 수 있는 이유를 설명하시오.'],['첫 검사가 양성일 확률은?','양성 1회에서 P(D|+)는?','첫 검사 양성, 둘째 검사 음성일 때 P(D|+,−)는?'],['E(X), E(X²), Var(X), sd(X)를 구하시오.','Y=2X−15의 E(Y), sd(Y)를 구하시오.','독립 비용 C의 평균 10, 표준편차 12다. Z=2X−C−15의 E(Z), sd(Z)는?','배송시간 T~Normal(40,6²)분이다. P(T>49)와 95백분위수를 구하시오.']]]
chapter={1:['population','causality'],2:['data-types','center','quantiles','variance-sample','bounds','correlation','standardization','shape'],4:['axioms','conditional','independence','addition','bayes'],5:['expectation','binomial','poisson','pmf-cdf','linearity','linear-variance','variance-rv','total-expectation'],6:['continuous-uniform','normal','exponential']}
def ch(topic): return next(k for k,v in chapter.items() if topic in v)
result=[]
for i,s in enumerate(raw[:3]):
    sid=f'original-{i+1}';level=['basic','intermediate','advanced'][i];qs=[]
    def base(id,topic,part,points):
        return dict(questionId=f'{sid}-{id}',setId=sid,chapterId=ch(topic),topicId=topic,difficulty=level,points=points,part=part,source=s['filename'],sourceFile=s['filename'],sourcePage=None,answerPage=5,explanation='',correctAnswer='')
    for j,item in enumerate(s['objective']):
        q=base(item['id'],topics[i][j],'A' if j<10 else 'B',2 if j<10 else 3)
        q.update(type='mcq' if j<10 else 'tf',question=translations[i][j],english=item['question'],options=item.get('options',['True · 참','False · 거짓']),correctAnswer=item['answer'],sourceAnswer=item['explanation'],explanation=item['explanation'],sourcePage=item['page'],requiresExplanation=j>=10)
        qs.append(q)
    for j,item in enumerate(s['written']):
        topic=['quantiles','bayes','variance-rv'][j]
        q=base(item['id'],topic,'C',15 if j<2 else 20)
        q.update(type='written',question=introductions[i][j],english=item['question'],sourcePage=3 if j<2 else 4,answerPage=6,explanation='소문항별 원본 해설을 확인하세요. 원문 대문항 배점과 소문항 5점 배점을 유지했습니다.',subquestions=[])
        for k,sub in enumerate(item['subs']):
            subtopic=topic if j<2 or k<2 else ('linear-variance' if i==2 and k==2 else 'binomial' if k==2 else 'continuous-uniform' if i==0 else 'normal')
            child=base(f"{item['id']}-{sub['id']}",subtopic,'C',sub['points'])
            numeric=None
            if j==1:
                numeric=[[.24,2/3,.04/.76],[.19,.102/.19,None],[.1235,.0475/.1235,.002375/.072295]][i][k]
            if j==2 and k==2 and i<2:numeric=[.243,.1536][i]
            child.update(type='numeric' if numeric is not None else 'written',question=c_text[i][j][k],english=sub['question'],correctAnswer=numeric if numeric is not None else sub['answer'],sourceAnswer=sub['answer'],explanation=sub['answer'],sourcePage=4 if j==2 or (j==1 and k==2) else 3,answerPage=6)
            if numeric is not None: child['tolerance']=.00006
            else: child['rubric']=['원본 소문항 배점: 5점. 원문에는 세부 부분점수 기준이 없습니다.','앱 보충 가이드: 공식 선택, 중간 계산, 단위와 요구된 해석을 비교하고 0–5점 범위에서 직접 평가하세요.']
            q['subquestions'].append(child)
        qs.append(q)
    result.append(dict(id=sid,title=f'Practice Set {i+1}',description=['기초 · 제공된 원본 PDF','실전 · 제공된 원본 PDF','심화 · 제공된 원본 PDF'][i],difficulty=level,minutes=90,original=True,questions=qs))
Path('src/data/originalSets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print('Built original sets:',[(s['id'],len(s['questions']),sum(q['points'] for q in s['questions'])) for s in result])
import subprocess
subprocess.run(['python3','scripts/build_additional_sets.py'],check=True)
