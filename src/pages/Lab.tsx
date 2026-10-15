import { Link } from "react-router-dom";
import { DistributionLab } from "../components/DistributionLab";
import { SourceNote } from "../components/ui";
import { NormalDecisionCalculator } from "../components/NormalDecisionCalculator";
export function LabPage() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">LESS MEMORIZATION, MORE INTUITION</span>
          <h1>분포 실험실</h1>
          <p>모수를 바꾸고, 그래프를 관찰하고, 수식 속 관계를 발견하세요.</p>
        </div>
        <span className="pill">범위 내 5가지 분포 · 지수는 별도 보충</span>
      </div>
      <DistributionLab />
      <NormalDecisionCalculator />
      <div className="lab-guide-grid">
        <Link to="/learn/bernoulli">
          <span>01 · BERNOULLI</span>
          <h3>한 번의 성공과 실패</h3>
          <p>성공확률에 따라 불확실성은 어떻게 변할까요?</p>
        </Link>
        <Link to="/learn/binomial">
          <span>02 · BINOMIAL</span>
          <h3>여러 번의 시행, 성공의 횟수</h3>
          <p>n이 커질 때 평균과 분산을 비교해 보세요.</p>
        </Link>
        <Link to="/learn/poisson">
          <span>03 · POISSON</span>
          <h3>일정 구간의 사건 수</h3>
          <p>평균과 분산이 같다는 의미를 확인해 보세요.</p>
        </Link>
      </div>
      <SourceNote />
    </div>
  );
}
