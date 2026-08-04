import { useState } from "react";
import { LaborIssueSurveyData } from "@/types/survey";

// 💡 1. 3대 페인 포인트 적용 및 JSX(볼드, 밑줄) 하이라이트가 포함된 객관적 가이드
const LEGAL_ADVICE = {
  unpaidRest: {
    title: "휴게시간 및 대기시간 산정 기준 가이드",
    law: (
      <>
        근로기준법 제54조 및 제50조 제3항에 따라, 사용자는 4시간 근로 시 30분 이상의 자유로운 휴게시간을 주어야 합니다. 단, 서류상 휴게시간이더라도 손님이 오면 언제든 일해야 하는 <strong>'대기 상태'</strong>였다면, 이는 휴게시간이 아닌 <strong className="underline decoration-red-400 decoration-2 underline-offset-2">근로시간으로 인정되어 임금 청구의 대상</strong>이 될 수 있습니다.
      </>
    ),
  },
  midtermResign: {
    title: "교육생 및 단기·중도 퇴사자 임금 정산 팩트체크",
    law: (
      <>
        근로기준법 제36조(금품 청산) 및 제43조(임금 지급)에 따라, 사용자는 근로자가 퇴직한 경우 14일 이내에 모든 임금을 지급해야 합니다. 단 하루를 일했거나 <strong>교육·수습 기간</strong>이라 하더라도 <strong className="underline decoration-red-400 decoration-2 underline-offset-2">근로를 제공한 시간에 대한 임금은 100% 지급될 의무</strong>가 있습니다. (단, 1년 이상 계약 시 수습 3개월 90% 적용 가능)
      </>
    ),
  },
  delayedAllowance: {
    title: "주휴수당 지급 기한 및 포괄임금 기준 가이드",
    law: (
      <>
        근로기준법 제43조(임금 전액 지급의 원칙)에 따라, 주휴수당은 조건(주 15시간 이상 등) 충족 시 <strong>해당 주휴일이 포함된 급여일에 전액 지급</strong>되는 것이 원칙입니다. 사후 정산을 이유로 지급을 미루거나, 근로계약서에 <strong className="underline decoration-red-400 decoration-2 underline-offset-2">명확한 산정 내역 없이 '주휴수당 포함'이라고만 명시하는 것은 법적 위반 소지</strong>가 있습니다.
      </>
    ),
  },
};

interface LaborIssueSurveyProps {
  onSubmit: (data: LaborIssueSurveyData) => void;
}

export default function LaborIssueSurvey({ onSubmit }: LaborIssueSurveyProps) {
  // 💡 2. 변경된 3가지 이슈에 맞춰 초기 State 세팅
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
        고용노동부 근로기준법에 따른 객관적인 권리 기준과 팩트체크 가이드를 즉시 안내해 드립니다.
      </p>

      <div className="space-y-4">
        {/* 1. 무급 휴게시간 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.unpaidRest}
              onChange={() => handleToggle("unpaidRest")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              서류상으로만 <strong>휴게시간</strong>으로 처리되고, 실제로는 대기하거나 일했어요
            </span>
          </label>

          {/* 인라인 아코디언 영역 */}
          {surveyState.unpaidRest && (
            <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
              <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                {LEGAL_ADVICE.unpaidRest.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                {LEGAL_ADVICE.unpaidRest.law}
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

        {/* 2. 교육생/중도 퇴사자 급여 미지급 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.midtermResign}
              onChange={() => handleToggle("midtermResign")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              <strong>교육(수습) 기간</strong>이거나 중간에 그만뒀다는 이유로 급여를 못 받았어요
            </span>
          </label>

          {surveyState.midtermResign && (
            <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
              <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                {LEGAL_ADVICE.midtermResign.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                {LEGAL_ADVICE.midtermResign.law}
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

        {/* 3. 주휴수당 지연 및 꼼수 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.delayedAllowance}
              onChange={() => handleToggle("delayedAllowance")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              당장 받아야 할 <strong>주휴수당</strong>을 나중에 준다며 미루거나 얼버무려요
            </span>
          </label>

          {surveyState.delayedAllowance && (
            <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
              <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                {LEGAL_ADVICE.delayedAllowance.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                {LEGAL_ADVICE.delayedAllowance.law}
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
      </div>
    </div>
  );
}