/**
 * @fileoverview 구글 시트 이벤트 로거 유틸리티
 * @description 계산 결과를 백그라운드 웹훅 형태로 구글 시트에 전송합니다.
 */

import { CONFIG } from "@/config";
import { logger } from "@/utils/logger";
import { SurveyLogPayload } from "@/types/survey";

interface SheetLogPayload {
  wage: number | "";
  hours: number | "";
  amount: number;
  message: string;
}

export const sendToGoogleSheet = async (payload: SheetLogPayload) => {
  const url = CONFIG.API.GOOGLE_SHEET_URL;

  if (!url || url.includes("YOUR_GAS_DEPLOY_ID")) {
    logger.warn(
      "SheetLogger",
      "구글 시트 URL이 설정되지 않아 로깅을 건너뜁니다.",
    );
    return;
  }

  try {
    logger.info("SheetLogger", "구글 시트로 이벤트 전송 중...", payload);

    // GAS 웹 앱은 브라우저에서 직접 fetch할 때 CORS 제약이 걸릴 수 있으므로
    // no-cors 모드를 사용하거나, 백그라운드 큐 형태로 쏩니다.
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    logger.info("SheetLogger", "구글 시트 전송 요청 완료 (Fire-and-Forget)");
  } catch (error) {
    logger.error("SheetLogger", "구글 시트 전송 중 에러 발생", error);
  }
};

// 기존 파일에 있던 구글 시트 웹앱 URL (예시 상수명, 환경에 맞게 조정하세요)
// const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

/**
 * 노동 권익 설문 데이터를 구글 시트로 비동기 전송합니다.
 * @param payload 시급, 총 시간 및 설문 체크박스 상태 객체
 */
export const sendSurveyToGoogleSheet = async (
  payload: SurveyLogPayload,
): Promise<void> => {
  const url = CONFIG.API.GOOGLE_SHEET_URL;

  // 1. URL 환경 변수 검증 (방어적 프로그래밍)
  if (!url) {
    logger.warn(
      "SheetLogger",
      "구글 시트 URL이 설정되지 않아 설문 데이터 전송이 취소되었습니다.",
    );
    return;
  }

  // 2. 백그라운드 데이터 전송 (UI 블로킹 방지)
  try {
    // GAS(Google Apps Script) 구분을 위해 type 파라미터를 주입하여 전송
    const dataToSend = {
      type: "survey", // GAS 쪽에서 분기 처리하기 위한 플래그
      ...payload,
    };

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      // 구글 앱스 스크립트는 기본적으로 외부 도메인의 POST 요청 시 CORS 에러를 뱉으므로,
      // 응답값을 프론트에서 읽을 필요가 없는 로깅 용도라면 no-cors를 사용하는 것이 표준입니다.
      mode: "no-cors",
    });

    logger.info("SheetLogger", "설문 데이터 구글 시트 전송 성공", dataToSend);
  } catch (error) {
    // 로깅 실패가 사용자의 앱 사용 경험(UX)을 망치지 않도록 catch 블록 내에서 삼킵니다.
    logger.error("SheetLogger", "설문 데이터 구글 시트 전송 실패", error);
  }
};
