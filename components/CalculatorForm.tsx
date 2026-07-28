import { Dispatch, SetStateAction } from "react";

interface CalculatorFormProps {
  wage: number | "";
  setWage: Dispatch<SetStateAction<number | "">>;
  dailyHours: number | "";
  setDailyHours: Dispatch<SetStateAction<number | "">>;
  workingDays: number | "";
  setWorkingDays: Dispatch<SetStateAction<number | "">>;
  onCalculate: () => void;
}

export default function CalculatorForm({
  wage,
  setWage,
  dailyHours,
  setDailyHours,
  workingDays,
  setWorkingDays,
  onCalculate,
}: CalculatorFormProps) {
  return (
    <div className="space-y-4">
      {/* 시급 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          기본 시급 (원)
        </label>
        <input
          type="number"
          value={wage}
          onChange={(e) =>
            setWage(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="예: 11500"
          className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
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
