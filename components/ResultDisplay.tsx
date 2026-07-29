import { CalculationResult } from "@/types/calculator";

interface ResultDisplayProps {
  result: CalculationResult | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null; // 결과가 없으면 아무것도 렌더링하지 않음

  return (
    <div
      className={`mt-8 p-5 rounded-xl border ${
        result.isEligible
          ? "bg-blue-50 border-blue-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <p
        className={`text-sm font-semibold mb-2 ${
          result.isEligible ? "text-blue-800" : "text-red-800"
        }`}
      >
        {result.message}
      </p>
      {result.isEligible && (
        <div className="text-center">
          <div className="text-3xl font-black text-blue-900 tracking-tight">
            {result.amount.toLocaleString()}{" "}
            <span className="text-xl font-bold">원</span>
          </div>
          {(result as any).isTaxDeducted && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              ※ 3.3% 사업소득세가 공제된 예상 실수령액입니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
