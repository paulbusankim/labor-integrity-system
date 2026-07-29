"use client";

import { useState } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultDisplay from "@/components/ResultDisplay";
import LaborIssueSurvey from "@/components/LaborIssueSurvey";
import { CalculationResult } from "@/types/calculator";
import { logger } from "@/utils/logger";
import {
  sendToGoogleSheet,
  sendSurveyToGoogleSheet,
} from "@/utils/sheetLogger";
import { LaborIssueSurveyData } from "@/types/survey";

export default function Home() {
  // 상태 변경: hours 대신 dailyHours와 workingDays로 분리
  const [wage, setWage] = useState<number | "">("");
  const [dailyHours, setDailyHours] = useState<number | "">("");
  const [workingDays, setWorkingDays] = useState<number | "">("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateAllowance = () => {
    logger.info("Calculate", "주휴수당 계산 요청 발생");
    logger.debug("InputData", "현재 입력된 상태값", {
      wage,
      dailyHours,
      workingDays,
    });

    const numWage = Number(wage);
    const numDailyHours = Number(dailyHours);
    const numWorkingDays = Number(workingDays);

    // 유효성 검사 강화
    if (!numWage || !numDailyHours || !numWorkingDays) {
      logger.warn("Validation", "입력값 누락으로 계산 중단됨");
      alert("시급, 1일 근무시간, 근무일수를 모두 정확히 입력해 주세요.");
      return;
    }

    // 💡 총 근무시간 계산 (하루 근무시간 * 근무일수)
    const numHours = numDailyHours * numWorkingDays;

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

    // 🚀 구글 시트 전송 (기존 구조 유지를 위해 계산된 총 시간인 numHours를 hours에 전달)
    sendToGoogleSheet({
      wage: numWage,
      hours: numHours,
      amount: finalResult.amount,
      message: finalResult.message,
    });
  };

  const handleSurveySubmit = (surveyData: LaborIssueSurveyData) => {
    logger.info("Survey", "노동 이슈 설문 데이터 제출", surveyData);

    sendSurveyToGoogleSheet({
      wage: Number(wage),
      hours: Number(dailyHours) * Number(workingDays),
      ...surveyData,
    });
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
          dailyHours={dailyHours}
          setDailyHours={setDailyHours}
          workingDays={workingDays}
          setWorkingDays={setWorkingDays}
          onCalculate={calculateAllowance}
        />

        {/* 결과 컴포넌트는 변경 없이 그대로 사용 */}
        <ResultDisplay result={result} />

        {result && <LaborIssueSurvey onSubmit={handleSurveySubmit} />}
      </div>
    </main>
  );
}
