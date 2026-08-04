import { useState } from "react";
import { LaborIssueSurveyData } from "@/types/survey";

const LEGAL_ADVICE = {
  splitShift: {
    title: "단시간 근로자 및 주휴수당 산정 기준 가이드",
    law: "근로기준법 제18조 및 제55조에 따라, 서류상 1주 15시간 미만으로 쪼개어 계약하더라도 실질적인 근로가 연속되거나 사업주의 지시에 의해 15시간 이상 근무했다면 주휴수당(유급휴일) 지급 대상이 될 수 있습니다. 형식적인 시간 쪼개기로 주휴수당을 배제하는 행위는 법적 위반 소지가 있습니다.",
  },
  noPayStub: {
    title: "임금명세서 교부 의무 팩트체크",
    law: "근로기준법 제48조 제2항에 따라, 2021년 11월부터 모든 사업장에서 임금명세서 교부가 의무화되었습니다. 근로시간, 기본급, 수당 등의 산정 방식이 반드시 포함되어야 하며, 교부하지 않을 시 사업주에게 과태료가 부과될 수 있습니다.",
  },
  unpaidRest: {
    title: "휴게시간 및 대기시간 산정 기준 가이드",
    law: "근로기준법 제54조 및 제50조 제3항에 따라, 사용자는 4시간 근로 시 30분 이상의 자유로운 휴게시간을 주어야 합니다. 단, 서류상 휴게시간이더라도 손님이 오면 언제든 일해야 하는 '대기 상태'였다면, 이는 휴게시간이 아닌 '근로시간'으로 인정되어 임금 청구의 대상이 될 수 있습니다.",
  },
};

interface LaborIssueSurveyProps {
  onSubmit: (data: LaborIssueSurveyData) => void;
}

export default function LaborIssueSurvey({ onSubmit }: LaborIssueSurveyProps) {
  const [surveyState, setSurveyState] = useState<LaborIssueSurveyData>({
    splitShift: false,
    noPayStub: false,
    unpaidRest: false,
  });

  const [hasLogged, setHasLogged] = useState(false);

  const handleToggle = (key: keyof LaborIssueSurveyData) => {
    const newState = {
      ...surveyState,
      [key]: !surveyState[key],
    };

    setSurveyState(newState);

    // 💡 UX를 위해 버튼을 없앴으므로, 최초 1회 체크 시 부모 컴포넌트로 데이터를 조용히 전송(구글 시트 기록용)
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

      <div className="space-y-4">
        {/* 1. 쪼개기 계약 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.splitShift}
              onChange={() => handleToggle("splitShift")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              주휴수당 지급을 피하기 위한 <strong>'쪼개기 계약'</strong>을
              강요받았어요
            </span>
          </label>

          {/* 체크 시 바로 아래에 나타나는 인라인 아코디언 영역 */}
          {surveyState.splitShift && (
            <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
              <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                {LEGAL_ADVICE.splitShift.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                {LEGAL_ADVICE.splitShift.law}
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

        {/* 2. 임금명세서 미교부 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.noPayStub}
              onChange={() => handleToggle("noPayStub")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              <strong>임금명세서</strong>를 받지 못했거나 급여가 밀린 경험이
              있어요
            </span>
          </label>

          {surveyState.noPayStub && (
            <div className="p-4 bg-white border-t border-gray-200 animate-fade-in">
              <h5 className="text-[14px] font-bold text-gray-800 mb-2">
                {LEGAL_ADVICE.noPayStub.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed break-keep mb-3">
                {LEGAL_ADVICE.noPayStub.law}
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

        {/* 3. 무급 휴게시간 */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all">
          <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={surveyState.unpaidRest}
              onChange={() => handleToggle("unpaidRest")}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              서류상으로만 <strong>휴게시간</strong>으로 처리되거나 추가 수당을
              못 받았어요
            </span>
          </label>

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
      </div>
    </div>
  );
}
