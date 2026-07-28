"use client";

import { useState } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultDisplay from "@/components/ResultDisplay";
import { CalculationResult } from "@/types/calculator";
import { logger } from "@/utils/logger";

export default function Home() {
  const [wage, setWage] = useState<number | "">("");
  const [hours, setHours] = useState<number | "">("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateAllowance = () => {
    // 💡 계산 시작 시점 로깅 (디버그 모드에서는 입력값까지 상세히 출력)
    logger.info("Calculate", "주휴수당 계산 요청 발생");
    logger.debug("InputData", "현재 입력된 상태값", { wage, hours });

    const numWage = Number(wage);
    const numHours = Number(hours);

    if (!numWage || !numHours) {
      logger.warn("Validation", "입력값 누락으로 계산 중단됨");
      alert("시급과 일한 시간을 정확히 입력해 주세요.");
      return;
    }

    // 조건 1: 15시간 미만 (특이 케이스 Info 로그)
    if (numHours < 15) {
      logger.info("Result", "주 15시간 미만 - 지급 대상 아님");
      setResult({
        amount: 0,
        message:
          "주 15시간 미만 근무는 근로기준법상 주휴수당 지급 대상이 아닙니다.",
        isEligible: false,
      });
      return;
    }

    // 조건 2: 정상 계산 로직
    const validHours = numHours > 40 ? 40 : numHours;
    const allowance = (validHours / 40) * 8 * numWage;

    const finalResult = {
      amount: Math.floor(allowance),
      message: `주 ${numHours}시간 근무 기준, 법적으로 당연히 받아야 할 주휴수당입니다!`,
      isEligible: true,
    };

    setResult(finalResult);
    logger.info("Result", "주휴수당 계산 성공", finalResult);

    // GAS 연동 코드의 fetch 로직
    /*
    if (CONFIG.API.GOOGLE_SHEET_URL) {
      logger.debug("API", "구글 시트로 데이터 전송 시도", { url: CONFIG.API.GOOGLE_SHEET_URL });
      // fetch(CONFIG.API.GOOGLE_SHEET_URL, { ... })
    }
    */
  };

  // 3. UI 조립
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          내 주휴수당 3초 확인기 💸
        </h1>

        <CalculatorForm
          wage={wage}
          setWage={setWage}
          hours={hours}
          setHours={setHours}
          onCalculate={calculateAllowance}
        />

        <ResultDisplay result={result} />
      </div>
    </main>
  );
}
