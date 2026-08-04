import { useState } from "react";
import { LaborIssueSurveyData } from "@/types/survey";

// 💡 표준 배열(Array) 구조로 변경하여 순서 제어 및 확장성 확보
interface SurveyItem {
  key: keyof LaborIssueSurveyData;
  label: React.ReactNode;
  title: string;
  law: React.ReactNode;
}

const LEGAL_ADVICE_LIST: SurveyItem[] = [
  {
    key: "midtermResign",
    label: (
      <>
        <strong>교육(수습) 기간</strong>이거나 중간에 그만뒀다는 이유로 급여를
        못 받았어요
      </>
    ),
    title: "교육생 및 단기·중도 퇴사자 임금 정산 팩트체크",
    law: (
      <>
        근로기준법 제36조(금품 청산) 및 제43조(임금 지급)에 따라, 사용자는
        근로자가 퇴직한 경우 14일 이내에 모든 임금을 지급해야 합니다. 단 하루를
        일했거나 <strong>교육·수습 기간</strong>이라 하더라도{" "}
        <strong className="underline decoration-red-400 decoration-2 underline-offset-2">
          근로를 제공한 시간에 대한 임금은 100% 지급될 의무
        </strong>
        가 있습니다. (단, 1년 이상 계약 시 수습 3개월 90% 적용 가능)
      </>
    ),
  },
  {
    key: "delayedAllowance",
    label: (
      <>
        당장 받아야 할 <strong>주휴수당</strong>을 나중에 준다며 미루거나
        얼버무려요
      </>
    ),
    title: "주휴수당 지급 기한 및 포괄임금 기준 가이드",
    law: (
      <>
        근로기준법 제43조(임금 전액 지급의 원칙)에 따라, 주휴수당은 조건(주
        15시간 이상 등) 충족 시{" "}
        <strong>해당 주휴일이 포함된 급여일에 전액 지급</strong>되는 것이
        원칙입니다. 사후 정산을 이유로 지급을 미루거나, 근로계약서에{" "}
        <strong className="underline decoration-red-400 decoration-2 underline-offset-2">
          명확한 산정 내역 없이 '주휴수당 포함'이라고만 명시하는 것은 법적 위반
          소지
        </strong>
        가 있습니다.
      </>
    ),
  },
  {
    key: "unpaidRest",
    label: (
      <>
        서류상으로만 <strong>휴게시간</strong>으로 처리되고, 실제로는 대기하거나
        일했어요
      </>
    ),
    title: "휴게시간 및 대기시간 산정 기준 가이드",
    law: (
      <>
        근로기준법 제54조 및 제50조 제3항에 따라, 사용자는 4시간 근로 시 30분
        이상의 자유로운 휴게시간을 주어야 합니다. 단, 서류상 휴게시간이더라도
        손님이 오면 언제든 일해야 하는 <strong>'대기 상태'</strong>였다면, 이는
        휴게시간이 아닌{" "}
        <strong className="underline decoration-red-400 decoration-2 underline-offset-2">
          근로시간으로 인정되어 임금 청구의 대상
        </strong>
        이 될 수 있습니다.
      </>
    ),
  },
];

interface LaborIssueSurveyProps {
  onSubmit: (data: LaborIssueSurveyData) => void;
}

export default function LaborIssueSurvey({ onSubmit }: LaborIssueSurveyProps) {
  const [surveyState, setSurveyState] = useState<LaborIssueSurveyData>({
    unpaidRest: false,
    midtermResign: false,
    delayedAllowance: false,
  });

  const [hasLogged, setHasLogged] = useState(false);

  const handleToggle = (key: keyof LaborIssueSurveyData) => {
    const newState = {
      ...surveyState,
      [key]: !surveyState[key],
    };

    setSurveyState(newState);

    // 최초 1회 체크 시 부모 컴포넌트로 데이터를 조용히 전송(구글 시트 기록용)
    if (!hasLogged && !surveyState[key]) {
      onSubmit(newState);
      setHasLogged(true);
    }
  };

  return (
    <div className="mt-6 p-5 border border-gray-200 bg-white rounded-xl shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-2 leading-snug">
        아래 항목 중 겪고 계신 상황이 있다면 체크해 주세요.
      </h3>
      <p className="text-sm text-gray-600 mb-4 break-keep">
        고용노동부 근로기준법에 따른 객관적인 권리 기준과 팩트체크 가이드를 즉시
        안내해 드립니다.
      </p>

      {/* 💡 배열 순회(map)를 통해 일관된 UI 렌더링 보장 */}
      <div className="space-y-4">
        {LEGAL_ADVICE_LIST.map((item) => (
          <div
            key={item.key}
            className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all"
          >
            <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={surveyState[item.key]}
                onChange={() => handleToggle(item.key)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>

            {/* 체크 시 활성화되는 인라인 아코디언 영역 */}
            {surveyState[item.key] && (
              <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
                <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                  {item.title}
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                  {item.law}
                </p>
                <a
                  href="https://www.moel.go.kr/minwon/apply/formApplyList.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  고용노동부 민원 접수 바로가기 ↗
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
