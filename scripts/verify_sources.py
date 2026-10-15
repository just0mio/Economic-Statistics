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
payload={'method':'Python statistics/NormalDist/math; independent of src/lib/math.ts','originalC':refs,'PS1':ps1,'lecture':lecture}
Path('content/verification.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2))
print(f'Independent references: {len(refs)} original short-answer subquestions; PS1 C1–C3; lecture corrections.')
