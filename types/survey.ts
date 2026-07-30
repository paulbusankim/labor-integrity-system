export interface LaborIssueSurveyData {
  splitShift: boolean; // 쪼개기 근무
  noPayStub: boolean; // 명세서 미발급 / 임금 체불
  unpaidRest: boolean; // 휴게시간 미보장 / 수당 미지급
}

// 설문과 기존 계산 데이터를 함께 시트로 전송할 때 사용할 페이로드 타입
export interface SurveyLogPayload extends LaborIssueSurveyData {
  wage: number;
  hours: number;
  userType?: string;
}
