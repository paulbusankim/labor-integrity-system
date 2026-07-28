/**
 * @fileoverview 구글 시트 이벤트 로거 유틸리티
 * @description 계산 결과를 백그라운드 웹훅 형태로 구글 시트에 전송합니다.
 */

import { CONFIG } from "@/config";
import { logger } from "@/utils/logger";

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
