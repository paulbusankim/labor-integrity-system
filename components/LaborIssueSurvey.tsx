import { useState } from "react";
import { LaborIssueSurveyData } from "@/types/survey";

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

  if (isSubmitted) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="text-sm font-semibold text-green-800">
          소중한 경험을 공유해 주셔서 감사합니다! 🙌
        </p>
        <p className="text-xs text-green-600 mt-1">
          보내주신 데이터는 더 나은 노동 환경을 만드는 데 활용됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-5 border border-gray-200 bg-white rounded-xl shadow-sm">
      <h3 className="text-[15px] font-bold text-gray-800 mb-2">
        혹시 이런 부당한 경험이 있으신가요? (선택)
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        알바생들의 현실을 파악하기 위한 익명 통계로만 사용됩니다.
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
        경험 공유하기
      </button>
    </div>
  );
}
