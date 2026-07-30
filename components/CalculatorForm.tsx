import { Dispatch, SetStateAction, useState } from "react";
import { MIN_WAGE } from "@/constants/labor";

interface CalculatorFormProps {
  wage: number | "";
  setWage: Dispatch<SetStateAction<number | "">>;
  dailyHours: number | "";
  setDailyHours: Dispatch<SetStateAction<number | "">>;
  workingDays: number | "";
  setWorkingDays: Dispatch<SetStateAction<number | "">>;
  isTaxDeducted: boolean;
  setIsTaxDeducted: Dispatch<SetStateAction<boolean>>;
  onCalculate: () => void;
}

export default function CalculatorForm({
  wage,
  setWage,
  dailyHours,
  setDailyHours,
  workingDays,
  setWorkingDays,
  isTaxDeducted,
  setIsTaxDeducted,
  onCalculate,
}: CalculatorFormProps) {
  const [wageError, setWageError] = useState(false);

  const handleWageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setWage("");
      setWageError(false);
      return;
    }

    const numValue = Number(value);
    setWage(numValue);

    if (numValue < MIN_WAGE) {
      setWageError(true);
    } else {
      setWageError(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 시급 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          시급 - 2026년 최저시급 10,320원
        </label>
        <input
          type="number"
          value={wage}
          onChange={handleWageChange}
          placeholder="예: 11500"
          className={`w-full border rounded-lg p-3 text-lg outline-none transition ${
            wageError
              ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {wageError && (
          <p className="text-xs text-red-500 mt-1.5 font-medium animate-shake">
            ⚠️ 2026년 최저시급(10,320원)보다 낮은 금액은 입력할 수 없습니다.
          </p>
        )}
      </div>

      {/* 1일 근무시간 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          1일 근무시간 (시간)
        </label>
        <input
          type="number"
          value={dailyHours}
          onChange={(e) =>
            setDailyHours(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="예: 8"
          className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* 1주 근무일수 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          1주 근무일수 (일)
        </label>
        <input
          type="number"
          value={workingDays}
          onChange={(e) =>
            setWorkingDays(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="예: 5"
          className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div className="flex items-center pt-1 pb-1">
        <input
          id="tax-checkbox"
          type="checkbox"
          checked={isTaxDeducted}
          onChange={(e) => setIsTaxDeducted(e.target.checked)}
          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="tax-checkbox"
          className="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none"
        >
          3.3% 세금 떼고 받기 (실수령액)
        </label>
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={onCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-colors mt-4 shadow-md"
      >
        주휴수당 계산하기
      </button>
    </div>
  );
}
