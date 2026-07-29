"use client";

import React, { useEffect, useState } from "react";
import { SURVEY_STATISTICS } from "@/constants/survey"; // 경로에 맞게 수정하세요

export default function SurveyResultChart() {
  // 마운트 시 애니메이션 효과를 주기 위한 상태
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 직후 상태를 변경하여 CSS transition을 트리거합니다.
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 my-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          알바생 노동 권익 침해 현황
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          현재까지 설문에 참여한 알바생들의 응답 비율입니다.
        </p>
      </div>

      <div className="space-y-5">
        {SURVEY_STATISTICS.map((item) => (
          <div key={item.id} className="w-full">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {item.percentage}%
              </span>
            </div>
            {/* 배경 막대 */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              {/* 색상 채워지는 막대 (width가 0에서 퍼센티지까지 서서히 늘어남) */}
              <div
                className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                style={{ width: isMounted ? `${item.percentage}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
