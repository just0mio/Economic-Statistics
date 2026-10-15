"""Author Korean study metadata while retaining Set4-5 source wording and keys."""
from pathlib import Path
import json, math

raw=json.loads(Path('content/extracted-practice.json').read_text())
result=json.loads(Path('src/data/originalSets.json').read_text())[:3]
topics={
4:['center','quantiles','addition','bayes','bernoulli','binomial','poisson','continuous-uniform','normal','linear-variance','center','pmf-cdf','bernoulli','binomial','independence','poisson','linearity','conditional','continuous-density','causality'],
5:['bayes','linear-variance','binomial','poisson','binomial','linear-variance','pmf-cdf','bernoulli','normal','exponential','independence','binomial','pmf-cdf','bernoulli','correlation','continuous-uniform','standardization','independence','poisson','binomial']}
translations={
4:['200개 농가 중 보조금 수령 60곳을 1, 나머지를 0으로 기록했다. 표본평균은?','Q1=14, Q3=22일 때 위쪽 1.5×IQR 경계는?','독립 A,B에 P(A)=.40, P(B)=.25일 때 합집합 확률은?','유병률 .20, 민감도 .90, 위양성률 .10일 때 양성 후 질병확률은?','X~Bernoulli(.30)의 분산은?','X~Binomial(5,.4)일 때 P(X=2)는?','트럭 도착이 시간당 Poisson(2)일 때 한 시간 0대일 확률은?','T~U(10,30)일 때 P(T>25)는?','T~N(50,5²)일 때 P(T<55)는?','sd(X)=6, Y=3X에 상수를 더하거나 뺀 값일 때 sd(Y)는? 원문에서 상수 4 앞의 부호가 누락되어 있으나 어느 경우든 표준편차는 같다.',
'0/1 변수의 평균은 1로 기록된 비율과 같다.','가능한 결과가 많으면 유효한 PMF의 확률합이 1을 넘을 수 있다.','Bernoulli(p)의 분산은 p=.5에서 최대다.','시행마다 성공확률이 달라도 통상적인 이항모형이 성립한다.','독립 사건 A,B에서는 P(A∩B)=P(A)P(B)다.','X~Poisson(λ)이면 평균은 λ이고 분산은 λ²이다.','상수를 더하면 기댓값은 바뀌지만 분산은 바뀌지 않는다.','P(A|B)와 P(B|A)는 항상 같다.','연속확률변수가 정확히 한 값을 취할 확률은 0이다.','양의 상관관계는 인과관계를 증명한다.'],
5:['유병률 .30, 민감도 .80, 비감염자의 위양성률 .10일 때 P(D|+)는? (원문의 여사건 표시 누락을 조건 설명으로 보완)','X~Bernoulli(.20), Y=5X에 상수를 더하거나 뺀 값일 때 Var(Y)는? 원문 상수 2 앞 부호는 누락되어 있다.','X~Binomial(10,.10)의 분산은?','시간당 도착률 2인 포아송 과정에서 30분 동안 도착 0회일 확률은? 원본 선택지의 지수 부호가 누락되어 자동채점을 보류한다.','X~Binomial(4,.5)일 때 P(X≥3)는?','독립 X,Y의 표준편차가 3,4일 때 Var(2X−Y)는? 원문 연산자 누락은 해설의 독립 분산합 52를 근거로 보완한다.','정수형 X에서 F(2)=.65, F(1)=.40이면 P(X=2)는?','Bernoulli 분산을 가장 크게 만드는 p는?','T~N(50,8²)일 때 P(T>62)는?','T~Exp(rate=.25/분)일 때 P(T>8)은? 이번 시험범위 밖 보충이다.',
'질병 상태에 조건부로 두 검사가 독립이어도 전체 표본에서는 독립이 아닐 수 있다.','성공확률이 다른 두 독립 Bernoulli의 합은 항상 어떤 p에 대한 Binomial(2,p)다.','CDF는 0과 1 사이에서 감소하지 않는 함수다.','Bernoulli(.5)의 분산은 .5다.','공분산 0이면 일반적으로 독립임이 증명된다.','연속균등 U(a,b)의 내부 한 점 c에 대해 P(X=c)=0이다.','평균이 0이면 변동계수는 일반적으로 문제가 있다.','D에 조건부로 독립인 동일한 두 검사는 P(+,+|D)=P(+|D)²을 만족한다.','Poisson(λ)의 표준편차는 λ다.','원문은 X~Binomial(5,.2)에서 P(X=5)=0.2라고 표시하지만 정답표는 TRUE다. 지수 누락으로 원문과 키가 맞지 않아 자동채점을 보류한다.']}
intros={
4:['농산물 시장의 일별 방문자 수(정렬): 12,14,15,17,19,21,23,39.','생산라인 1·2·3의 공급 비중은 .50,.30,.20, 불량률은 .02,.05,.10이다.','농가 주문 수 X=0,1,2,3의 확률은 .1,.2,.5,.2다.'],
5:['독립인 관개 제어기 12개를 점검한다. 각 고장확률은 .10이며 X는 고장 수다.','질병률 .04, 검사 민감도 .92, 비감염자 위양성률 .07. 두 검사는 질병 상태에 조건부로 독립이다. 원문 여사건 기호 누락은 설명으로 보완했다.','식품업체의 운영수익 X(천원)의 PMF: x=−30,10,50,90, p=.1,.4,.3,.2. Y=1.5X+10. 독립 비용 C의 평균8, SD6, Z=1.5X−C+10. [앱 보완: 원문 음수·차감 부호가 누락되어 원문 해설의 평균34 및 순이익53과 일치하도록 명시했다.]']}
subtexts={
4:[['평균·중앙값을 구하고 비교가 시사하는 바를 설명하시오.','p(n+1) 보간으로 Q1,Q3와 위쪽 1.5×IQR 경계를 구하시오.','표본분산·표준편차·변동계수를 계산하시오.'],['P(불량)를 구하시오.','불량일 때 생산라인3의 확률을 구하시오.','정상일 때 생산라인1의 확률을 구하시오.'],['E(X), E(X²), Var(X), sd(X)를 구하시오.','이익 Y=25X−8(천원)의 평균과 표준편차를 구하시오. [원문 연산자 누락: 해설의 평균37을 근거로 차감을 보완]','독립 고객4명 각각 지각 결제확률 .20이다. 적어도 한 명 지각할 확률은?','대기시간 T~Exp(.1/분)에서 P(T>20), P(T>30|T>10)를 구하시오. [시험범위 밖 보충]']],
5:[['P(X=2)를 구하시오.','P(X≥1)를 구하시오.','E(X), Var(X), sd(X)를 구하시오.'],['첫 검사 P(+)를 구하시오.','한 번 양성 후 P(D|+)를 구하시오.','두 번 양성 후 P(D|+,+)를 구하시오.'],['E(X), E(X²), Var(X), sd(X)를 구하시오.','E(Y), Var(Y), sd(Y)를 구하시오.','E(Z), Var(Z), sd(Z)를 구하고 독립성의 역할을 설명하시오.','P(X≥50)를 구하고 해석하시오.']]}
subtopics={4:[['center','quantiles','variance-sample'],['total-probability','bayes','conditional'],['variance-rv','linear-variance','binomial','exponential']],5:[['binomial']*3,['total-probability','bayes','bayes'],['variance-rv','linear-variance','linear-variance','pmf-cdf']]}
numeric={4:{'C2-a':.045,'C2-b':4/9,'C2-c':.49/.955,'C3-c':1-.8**4},5:{'C1-a':math.comb(12,2)*.1**2*.9**10,'C1-b':1-.9**12,'C2-a':.104,'C2-b':.0368/.104,'C2-c':.033856/.03856}}
checks={
4:{'MC2':'IQR=22−14=8, 상한=22+1.5×8=34.','MC3':'P(A∪B)=.4+.25−.4×.25=.55.','MC5':'p(1−p)=.3×.7=.21.','MC7':'P(0)=exp(−2)=.135335…','MC8':'(30−25)/(30−10)=.25.','MC9':'z=(55−50)/5=1, Φ(1)≈.8413447.','TF3':'p(1−p)=.25−(p−.5)².','C1-b':'Q1=14.25, Q3=22.5, IQR=8.25, 위 경계34.875. 39는 잠재적 이상치.','C1-c':'편차제곱합506, 표본분산506/7≈72.2857143, SD≈8.5021006, CV≈42.5105%.','C2-c':'P(정상)=.955, P(라인1∩정상)=.49, 후행확률=.49/.955≈.513089.','C3-a':'E(X)=1.8, E(X²)=4, Var(X)=4−1.8²=.76, SD≈.8717798.','C3-b':'Y=25X−8로 보완하면 E(Y)=37, SD(Y)=25√.76≈21.794495.','C3-c':'1−P(0)=1−.8⁴=.5904.','C3-d':'P(T>20)=exp(−.1×20)=exp(−2)≈.1353353. 무기억성으로 조건부확률도 같다.'},
5:{'MC2':'상수의 부호와 관계없이 Var(Y)=25×.2×.8=4.','MC4':'30분 평균λ=1, 올바른 확률은 exp(−1)≈.3678794. 원본 선택지에서 음수부호가 누락되어 원본키 C에 따른 자동 정답 처리를 하지 않는다.','MC6':'Var(2X−Y)=4×9+16=52 (독립으로 공분산0). +Y여도 분산은 같다.','MC7':'F(2)−F(1)=.65−.40=.25.','MC9':'z=(62−50)/8=1.5, 오른쪽꼬리≈.0668072.','MC10':'exp(−.25×8)=exp(−2)≈.1353353.','TF10':'정확한 항등식은 P(X=5)=C(5,5)×.2⁵×.8⁰=.2⁵=.00032이다. 원본 표기 .2는 이 값과 다르다. 원본키 TRUE를 보존하되 자동채점을 보류한다.','C1-a':'C(12,2)×.1²×.9¹⁰≈.230127770466.','C1-b':'1−.9¹²≈.717570463519.','C2-c':'두 경로 .04×.92²=.033856, .96×.07²=.004704. 후행확률≈.878008298755.','C3-a':'앱 보완 지지 −30,10,50,90: 평균34, 2차모멘트2500, 분산1344, SD≈36.6606056. 원문을 문자 그대로 +30으로 읽으면 평균40·분산900으로 해설과 달라진다.','C3-b':'평균61, 분산3024, SD≈54.9909083.','C3-c':'평균53, 분산3024+36−3Cov(X,C)=3060 (독립으로 Cov=0), SD≈55.3172667.'}}
chapter={1:['causality'],2:['center','quantiles','variance-sample','correlation','standardization'],4:['addition','bayes','independence','conditional','total-probability'],5:['bernoulli','binomial','poisson','linear-variance','pmf-cdf','linearity','variance-rv'],6:['continuous-uniform','continuous-density','normal','exponential']}
def ch(topic): return next(k for k,v in chapter.items() if topic in v)
for source in raw[3:]:
    n=source['number']; sid=f'original-{n}'; level='intermediate' if n==4 else 'advanced'; qs=[]
    def base(id,topic,part,points):
        return dict(questionId=f'{sid}-{id}',setId=sid,chapterId=ch(topic),topicId=topic,difficulty=level,part=part,points=points,source=source['filename'],sourceFile=source['filename'],explanation='',correctAnswer='')
    for i,item in enumerate(source['objective']):
        id=item['id']; q=base(id,topics[n][i],'A' if i<10 else 'B',2 if i<10 else 3)
        extra=checks[n].get(id)
        q.update(type='mcq' if i<10 else 'tf',question=translations[n][i],english=item['question'],options=item.get('options',['True · 참','False · 거짓']),correctAnswer=item['answer'],sourceAnswer=item['explanation'],explanation=item['explanation']+(('\n\n앱 검산·보완: '+extra) if extra else ''),sourcePage=item['page'],answerPage=item['answerPage'],requiresExplanation=i>=10)
        if n==5 and id in ('MC4','TF10'):
            q.update(autoGrade=False,sourceIssue='원본 PDF의 부호·지수 누락으로 제시문/선택지와 정답표가 일치하지 않습니다. 원본키는 보존하며 자동채점하지 않습니다. 앱 검산 후 필요하면 자가평가하세요.')
            q['rubric']=['원본 기호 누락으로 자동채점 보류. 원본키만으로 정답을 확정하지 않습니다.','앱 검산과 원본을 비교한 후 필요하면 직접 점수를 입력하세요. 입력 점수는 자가평가로 표시됩니다.']
        elif '누락' in q['question']:
            q['sourceIssue']='원본 화면에도 기호가 누락되어 있습니다. 영어 원문을 보존하고 한국어 설명에 앱의 해석·보완 근거를 표시했습니다.'
        qs.append(q)
    for j,item in enumerate(source['written']):
        topic=('binomial' if n==5 else 'quantiles') if j==0 else 'bayes' if j==1 else 'variance-rv'
        parent=base(item['id'],topic,'C',15 if j<2 else 20)
        parent.update(type='written',question=intros[n][j],english=item['question'],sourcePage=item['page'],answerPage=7 if n==4 else 8,explanation='원본 소문항 5점 배점과 해설을 보존했습니다. 앱 보완·검산 표시는 원본과 구분합니다.',subquestions=[])
        if n==5 and j==2: parent['sourceIssue']='원문 지지집합의 음수부호와 순이익 차감 부호가 누락되어 원문 해설의 계산을 근거로 보완한 모형입니다.'
        for k,sub in enumerate(item['subs']):
            id=f"{item['id']}-{sub['id']}"; q=base(id,subtopics[n][j][k],'C',sub['points']); value=numeric[n].get(id); extra=checks[n].get(id)
            q.update(type='numeric' if value is not None else 'written',question=subtexts[n][j][k],english=sub['question'],correctAnswer=value if value is not None else sub['answer'],sourceAnswer=sub['answer'],explanation=sub['answer']+(('\n\n앱 검산·보완: '+extra) if extra else ''),sourcePage=sub['page'],answerPage=sub['answerPage'])
            if value is not None: q['tolerance']=.00006
            else: q['rubric']=['원본 소문항 배점 5점. 교수자의 세부 부분점수표는 제공되지 않았습니다.','앱 보충 가이드: 공식·조건, 중간 계산, 요구된 결과·해석을 비교하여 0–5점에서 자가평가하세요.']
            if n==5 and j==2 or n==4 and id=='C3-b': q['sourceIssue']='원문에 부호 누락이 있어 앱의 한국어 조건·검산에서 보완 근거를 명시했습니다. 원본 PDF와 원본 해설은 수정하지 않았습니다.'
            parent['subquestions'].append(q)
        qs.append(parent)
    result.append(dict(id=sid,title=f'Practice Set {n}',description=('응용' if n==4 else '종합 심화')+' · 제공된 원본 PDF · 범위 밖/원문 기호 누락 별도 표시',difficulty=level,minutes=90,original=True,questions=qs))
Path('src/data/originalSets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print('Built 5 original practice sets; original keys preserved, Set5 MC4/TF10 automatic grading deferred.')
