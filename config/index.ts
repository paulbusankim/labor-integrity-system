/**
 * @fileoverview 전역 설정 및 환경 변수 매핑 파일
 * @description 앱 전체에서 공통으로 사용하는 상수와 외부 API(GAS) 엔드포인트를 관리합니다.
 */
export const CONFIG = {
  APP: {
    NAME: "Labor Integrity System",
    VERSION: "1.0.0",
  },
  API: {
    // 💡 내일 GAS 웹 앱으로 배포한 뒤 나오는 URL을 여기에 넣을 예정입니다.
    GOOGLE_SHEET_URL:
      process.env.NEXT_PUBLIC_GAS_URL ||
      "https://script.google.com/macros/s/AKfycbxICZdFXzj78FlT-saW3Mw0tufbeG6IWzyMH28ynRh8uAAzDAxyQXSghHC4bUUxNb5DuA/exec",
  },
  IS_DEV: process.env.NODE_ENV === "development",
};
