import { Dispatch, SetStateAction } from "react";

interface CalculatorFormProps {
  wage: number | "";
  setWage: Dispatch<SetStateAction<number | "">>;
  hours: number | "";
  setHours: Dispatch<SetStateAction<number | "">>;
  onCalculate: () => void;
}

export default function CalculatorForm({
  wage,
  setWage,
  hours,
  setHours,
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
          placeholder="예: 9860"
          className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* 근무시간 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          1주일 총 근무시간 (시간)
        </label>
        <input
          type="number"
          value={hours}
          onChange={(e) =>
            setHours(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="예: 20"
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
