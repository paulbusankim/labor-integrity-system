import { useState } from "react";
import { LaborIssueSurveyData } from "@/types/survey";

const LEGAL_ADVICE = {
  splitShift: {
    title: "쪼개기 계약 (주휴수당 회피)",
    law: "근로기준법 제18조 및 제55조: 1주 15시간 미만으로 쪼개어 계약하더라도, 실질적인 근로가 연속되거나 지시에 의해 15시간 이상 근무했다면 주휴수당 지급 대상이 될 수 있습니다.",
    template:
      "사장님, 제 근로계약은 주 14시간으로 되어 있으나 실제로는 지시에 따라 매주 15시간 이상 근무를 수행하고 있습니다. 실 근로시간을 기준으로 한 주휴수당 지급을 정중히 요청드립니다.",
  },
  noPayStub: {
    title: "임금명세서 미교부",
    law: "근로기준법 제48조 제2항: 2021년 11월부터 모든 사업장에서 임금명세서 교부가 의무화되었습니다. 위반 시 사업주에게 500만 원 이하의 과태료가 부과될 수 있습니다.",
    template:
      "사장님, 근로기준법 제48조에 따라 이번 달 급여에 대한 임금명세서(근로시간, 기본급, 수당 등 산정 방식 포함) 교부를 요청드립니다. 확인 부탁드립니다.",
  },
  unpaidRest: {
    title: "휴게시간 미보장 (대기시간)",
    law: "근로기준법 제54조 및 제50조 제3항: 4시간 근로 시 30분 이상의 휴게시간을 주어야 합니다. 단, 손님이 오면 언제든 일해야 하는 '대기 상태'는 휴게시간이 아닌 근로시간으로 인정됩니다.",
    template:
      "사장님, 제게 부여된 휴게시간 동안 실제로는 손님 응대 및 대기 상태로 근무하고 있습니다. 이는 근로기준법상 근로시간에 해당하므로, 해당 시간에 대한 임금 지급을 요청드립니다.",
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleToggle = (key: keyof LaborIssueSurveyData) => {
    setSurveyState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    onSubmit(surveyState);
    setIsSubmitted(true);
  };

  // 💡 2. 클립보드 복사 핸들러
  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000); // 2초 후 복사 완료 상태 초기화
    } catch (err) {
      alert("복사에 실패했습니다. 직접 드래그하여 복사해 주세요.");
    }
  };

  if (isSubmitted) {
    // 선택한 항목이 있는지 확인
    const hasSelectedIssues = Object.values(surveyState).some((val) => val);

    return (
      <div className="mt-6 animate-fade-in">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center mb-4">
          <p className="text-sm font-semibold text-green-800">
            소중한 경험을 공유해 주셔서 감사합니다! 🙌
          </p>
          <p className="text-xs text-green-600 mt-1">
            보내주신 데이터는 더 나은 노동 환경을 만드는 데 활용됩니다.
          </p>
        </div>

        {/* 💡 3. 부당 대우를 체크한 사용자에게만 법적 근거와 대응 문구 제공 */}
        {hasSelectedIssues && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800 px-1">
              🚨 체크하신 항목에 대한 대응 가이드
            </h4>
            {(
              Object.keys(surveyState) as Array<keyof LaborIssueSurveyData>
            ).map((key) => {
              if (!surveyState[key]) return null;
              const advice = LEGAL_ADVICE[key];

              return (
                <div
                  key={key}
                  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                  <h5 className="text-[15px] font-bold text-red-600 mb-2">
                    {advice.title}
                  </h5>
                  <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-md leading-relaxed">
                    <strong>[법적 근거]</strong> {advice.law}
                  </p>
                  <div className="relative">
                    <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg border border-blue-100 pr-20 whitespace-pre-wrap">
                      {advice.template}
                    </p>
                    <button
                      onClick={() => handleCopy(advice.template, key)}
                      className="absolute right-2 top-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors"
                    >
                      {copiedKey === key ? "복사 완료!" : "복사하기"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 p-5 border border-gray-200 bg-white rounded-xl shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-2 leading-snug">
        아래의 부당한 경험이 있다면 법적 조항 및 대응 문구를 생성해 드려요.
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        체크하신 항목에 맞춰 <strong>사장님께 바로 보낼 수 있는 메시지</strong>
        를 제공합니다.
      </p>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={surveyState.splitShift}
            onChange={() => handleToggle("splitShift")}
            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            주휴수당 지급을 피하기 위한 <strong>'쪼개기 계약'</strong>을
            강요받았어요
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={surveyState.noPayStub}
            onChange={() => handleToggle("noPayStub")}
            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            <strong>임금명세서</strong>를 받지 못했거나 급여가 밀린 경험이
            있어요
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={surveyState.unpaidRest}
            onChange={() => handleToggle("unpaidRest")}
            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            서류상으로만 <strong>휴게시간</strong>으로 처리되거나 추가 수당을 못
            받았어요
          </span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-5 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg text-sm transition-colors"
      >
        법적 근거 및 맞춤형 대응 문구 생성
      </button>
    </div>
  );
}
