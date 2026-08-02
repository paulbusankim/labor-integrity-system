"use client";

import { useState, useEffect } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultDisplay from "@/components/ResultDisplay";
import LaborIssueSurvey from "@/components/LaborIssueSurvey";
import SurveyResultChart from "@/components/SurveyResultChart";
import Disclaimer from "@/components/Disclaimer";
import { CalculationResult } from "@/types/calculator";
import { logger } from "@/utils/logger";
import {
  sendToGoogleSheet,
  sendSurveyToGoogleSheet,
} from "@/utils/sheetLogger";
import { LaborIssueSurveyData } from "@/types/survey";
import { MIN_WAGE } from "@/constants/labor";

export default function Home() {
  const [wage, setWage] = useState<number | "">("");
  const [weeklyHours, setWeeklyHours] = useState<number | "">("");
  const [isTaxDeducted, setIsTaxDeducted] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("set-tester") === "true") {
      localStorage.setItem("isMyTesterDevice", "true");
      alert("이 브라우저는 이제 '테스터 기기'로 영구 설정되었습니다!");
    }
  }, []);

  const getUserType = () => {
    if (typeof window === "undefined") return "👤 일반 유저";
    const isSavedTester = localStorage.getItem("isMyTesterDevice") === "true";
    const isUrlTester =
      new URLSearchParams(window.location.search).get("tester") === "true";

    return isSavedTester || isUrlTester ? "🧪 본인(테스트)" : "👤 일반 유저";
  };

  const calculateAllowance = () => {
    const numWage = Number(wage);
    const numHours = Number(weeklyHours);

    if (!numWage || !numHours) {
      alert("시급과 1주 총 근무시간을 모두 정확히 입력해 주세요.");
      return;
    }

    if (numWage < MIN_WAGE) {
      alert(
        "2026년 최저시급(10,320원)보다 낮은 금액으로는 계산할 수 없습니다.",
      );
      return;
    }

    const isMaxHoursExceeded = numHours > 40; // 💡 40시간 초과 여부 판단
    const validHours = isMaxHoursExceeded ? 40 : numHours;

    let basicPay = numHours * numWage; // 일한 시간만큼의 기본 주급
    let allowance = 0;

    if (numHours >= 15) {
      allowance = (validHours / 40) * 8 * numWage;
    }

    if (isTaxDeducted) {
      allowance = allowance * 0.967;
    }

    let totalPay = basicPay + allowance;

    if (isTaxDeducted) {
      totalPay = totalPay * 0.967;
    }

    let resultMessage = "";
    if (numHours < 15) {
      resultMessage = `주 ${numHours}시간 근무 기준 총급여입니다. (15시간 미만으로 주휴수당 미발생 😢)`;
    } else {
      resultMessage = `주 ${numHours}시간 근무 기준 총급여(기본급+주휴수당)입니다! 🎉`;
    }

    const finalResult = {
      amount: Math.floor(totalPay),
      message: resultMessage,
      isEligible: true,
      isTaxDeducted,
      isMaxHoursExceeded,
    };

    setResult(finalResult);

    sendToGoogleSheet({
      wage: numWage,
      hours: numHours,
      amount: finalResult.amount,
      message: finalResult.message,
      userType: getUserType(),
    });
  };

  const handleSurveySubmit = (surveyData: LaborIssueSurveyData) => {
    logger.info("Survey", "노동 이슈 설문 데이터 제출", surveyData);

    sendSurveyToGoogleSheet({
      wage: Number(wage),
      hours: Number(weeklyHours),
      userType: getUserType(),
      ...surveyData,
    });

    setIsSurveySubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          알바비 3초 확인기 💸
        </h1>

        <CalculatorForm
          wage={wage}
          setWage={setWage}
          weeklyHours={weeklyHours}
          setWeeklyHours={setWeeklyHours}
          isTaxDeducted={isTaxDeducted}
          setIsTaxDeducted={setIsTaxDeducted}
          onCalculate={calculateAllowance}
        />

        <ResultDisplay result={result} />

        <LaborIssueSurvey onSubmit={handleSurveySubmit} />

        {isSurveySubmitted && <SurveyResultChart />}

        <Disclaimer />
      </div>
    </main>
  );
}
