"""Independent reference calculations using Python's standard library, not app utilities."""
import json, math, statistics
from pathlib import Path

def percentile(x,p):
    x=sorted(x);h=p*(len(x)+1);k=int(h);d=h-k
    if h<=1:return x[0]
    if h>=len(x):return x[-1]
    return x[k-1]+d*(x[k]-x[k-1])
def describe(x):
    q1,q3=percentile(x,.25),percentile(x,.75)
    return dict(mean=statistics.mean(x),median=statistics.median(x),Q1=q1,Q3=q3,IQR=q3-q1,lower=q1-1.5*(q3-q1),upper=q3+1.5*(q3-q1),variance=statistics.variance(x),sd=statistics.stdev(x),CV=100*statistics.stdev(x)/statistics.mean(x))
def moments(x,p):
    m=sum(a*b for a,b in zip(x,p));m2=sum(a*a*b for a,b in zip(x,p));v=m2-m*m
    return dict(mean=m,secondMoment=m2,variance=v,sd=math.sqrt(v))
def binom(k,n,p):return math.comb(n,k)*p**k*(1-p)**(n-k)
def bayes(d,s,f):return d*s/(d*s+(1-d)*f)
def fmt(d):return ', '.join(f'{k}={v:.10g}' for k,v in d.items())
refs={}; datasets=[[10,12,14,16,18,20,22,40],[15,18,20,22,25,27,30,43],[11,12,13,13,15,16,18,19,21,48]]
for i,x in enumerate(datasets,1):
    v=describe(x)
    for part,keys in [('a',['mean','median']),('b',['Q1','Q3','IQR','lower','upper']),('c',['variance','sd','CV'])]:refs[f'original-{i}-C1-{part}']={k:v[k] for k in keys}
for i,(d,s,f) in enumerate([(.2,.8,.1),(.12,.85,.1),(.05,.95,.08)],1):
    refs[f'original-{i}-C2-a']={'probability':d*s+(1-d)*f}
    refs[f'original-{i}-C2-b']={'probability':bayes(d,s,f)}
    refs[f'original-{i}-C2-c']={'probability':bayes(d,1-s,1-f) if i==1 else bayes(d,s*s,f*f) if i==2 else bayes(d,s*(1-s),f*(1-f))}
for i,(x,p,a,b) in enumerate([([0,1,2,3],[.1,.4,.4,.1],20,-5),([0,1,2,3],[.15,.35,.35,.15],30,-12),([-20,0,40,100],[.2,.3,.4,.1],2,-15)],1):
    v=moments(x,p);refs[f'original-{i}-C3-a']=v;refs[f'original-{i}-C3-b']={'mean':a*v['mean']+b,'sd':abs(a)*v['sd']}
    refs[f'original-{i}-C3-c']={'probability':binom(1,3,.1)} if i==1 else {'probability':binom(2,4,.2)} if i==2 else {'mean':2*v['mean']-10-15,'variance':4*v['variance']+144,'sd':math.sqrt(4*v['variance']+144)}
    refs[f'original-{i}-C3-d']={'probability':.25,'quantile':40} if i==1 else {'probability':1-statistics.NormalDist().cdf(1.5),'quantile':(50+8*statistics.NormalDist().inv_cdf(.9)) if i==2 else (40+6*statistics.NormalDist().inv_cdf(.95)),'pdfTableProbability':.0668,'pdfTableQuantile':60.2528 if i==2 else 49.87}
ps1={
 'C1':describe([30,32,35,38,40,42,45,78]),
 'C2':{'positive':.1*.8+.9*.15,'posteriorOne':bayes(.1,.8,.15),'posteriorTwoConditionalIndependence':bayes(.1,.8**2,.15**2)},
 'C3':{**moments([0,1,2,3],[.2,.4,.3,.1]),'profitMean':42,'profitSD':36,'oneLate':binom(1,3,.2),'normalTail':1-statistics.NormalDist().cdf(2),'normalQ90':45+6*statistics.NormalDist().inv_cdf(.9),'pdfTableTail':.0228,'pdfTableQ90':52.6896}}
lecture={
 'correlation':{'crossDeviationSum':-63,'covariance':-15.75,'sdY':statistics.stdev([100,95,88,82,75]),'correlation':statistics.correlation([10,11,12,13,14],[100,95,88,82,75])},
 'returningPlanes':{'givenJoint':.1*.8,'minimumJoint':.6+.8-1,'consistent':False},
 'bayesianRice':{'frequentistOneSidedP':sum(binom(k,10,.5) for k in range(7,11)),'posteriorBetterUniformPrior':sum(binom(k,11,.5) for k in range(8))},
 'handwritten242':{'mean':160,'conditionalGood':175,'conditionalBad':150},
 'handwritten247':moments([50,100,200,400],[.2,.4,.3,.1])}
assert lecture['correlation']['crossDeviationSum']==-63
assert lecture['returningPlanes']['givenJoint']<lecture['returningPlanes']['minimumJoint']
v=describe([12,14,15,17,19,21,23,39])
for part,keys in [('a',['mean','median']),('b',['Q1','Q3','IQR','upper']),('c',['variance','sd','CV'])]:
    refs[f'original-4-C1-{part}']={k:v[k] for k in keys}
for part,p in [('a',.5*.02+.3*.05+.2*.1),('b',.2*.1/.045),('c',.5*.98/.955)]:
    refs[f'original-4-C2-{part}']={'probability':p}
v=moments([0,1,2,3],[.1,.2,.5,.2])
refs['original-4-C3-a']=v
refs['original-4-C3-b']={'mean':25*v['mean']-8,'sd':25*v['sd']}
refs['original-4-C3-c']={'probability':1-.8**4}
refs['original-4-C3-d']={'tail':math.exp(-2),'conditionalTail':math.exp(-3)/math.exp(-1)}
refs['original-5-C1-a']={'probability':binom(2,12,.1)}
refs['original-5-C1-b']={'probability':1-binom(0,12,.1)}
refs['original-5-C1-c']={'mean':1.2,'variance':1.08,'sd':math.sqrt(1.08)}
for part,p in [('a',.04*.92+.96*.07),('b',bayes(.04,.92,.07)),('c',bayes(.04,.92**2,.07**2))]:
    refs[f'original-5-C2-{part}']={'probability':p}
v=moments([-30,10,50,90],[.1,.4,.3,.2])
refs['original-5-C3-a']=v
refs['original-5-C3-b']={'mean':1.5*v['mean']+10,'variance':2.25*v['variance'],'sd':1.5*v['sd']}
refs['original-5-C3-c']={'mean':1.5*v['mean']-8+10,'variance':2.25*v['variance']+36,'sd':math.sqrt(2.25*v['variance']+36)}
refs['original-5-C3-d']={'probability':.3+.2}
normal=statistics.NormalDist()
stock=500+60*normal.inv_cdf(.98)
l6={'weeklyRevenue':{'below20000':normal.cdf(-1.25),'above30000':1-normal.cdf(1.25),'between22000and28000':normal.cdf(.75)-normal.cdf(-.75)},
    'uniform':{'mean':3.5,'variance':.75,'sd':math.sqrt(.75),'quantile90':4.7,'deliveryQuantile90':108},
    'normalLinear':{'mean':1,'variance':36,'sd':6,'tailAbove7':1-normal.cdf(1)},
    'stock':{'continuous':stock,'minimumInteger':math.ceil(stock),'shortage550':1-normal.cdf(50/60),'shortage623':1-normal.cdf(123/60),'shortage624':1-normal.cdf(124/60)},
    'normalQuantile':{'q90':100+15*normal.inv_cdf(.9),'z90':normal.inv_cdf(.9),'central90z':normal.inv_cdf(.95)},
    'inverseReferences':{str(p):normal.inv_cdf(p) for p in [1e-10,.00001,.001,.02,.025,.1,.5,.9,.95,.975,.98,.999,.99999,1-1e-10]}}
objective={
    '4':{'MC':[.3,34,.4+.25-.4*.25,bayes(.2,.9,.1),.3*.7,binom(2,5,.4),math.exp(-2),.25,normal.cdf(1),18], 'TF':[True,False,True,False,True,False,True,False,True,False]},
    '5':{'MC':[bayes(.3,.8,.1),4,.9,math.exp(-1),binom(3,4,.5)+binom(4,4,.5),52,.25,.5,1-normal.cdf(1.5),math.exp(-2)],'TF':[True,False,True,False,False,True,True,True,False,False]},
}
issues={'original-5-MC4':'Original options lose exponent signs; correct probability exp(-1), source key C preserved, auto grading deferred.',
    'original-5-TF10':'Printed P(X=5)=.2 conflicts with TRUE key; actual .2**5=.00032. Key preserved, auto grading deferred.',
    'original-5-C3':'Source minus signs missing; verification assumes -30 and subtracts C to match original worked mean 34 and profit 53.',
    'L6-p18':'623 is rounded; exact 98th percentile about 623.2249, minimum integer meeting 2% shortage is 624.'}
assert l6['stock']['shortage623']>.02 and l6['stock']['shortage624']<.02
payload={'method':'Python statistics/NormalDist/math; independent of src/lib/math.ts','originalC':refs,'PS1':ps1,'lecture':lecture,'lecture6':l6,'objective45':objective,'sourceIssues':issues}
Path('content/verification.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2))
print(f'Independent references: {len(refs)} original short-answer subquestions; PS1 C1–C3; lecture corrections.')
