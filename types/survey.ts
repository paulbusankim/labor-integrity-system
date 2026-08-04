// UI 항목에 맞춰 완전히 새로고침된 설문 데이터 타입
export interface LaborIssueSurveyData {
  unpaidRest: boolean; // 무급 휴게시간 / 대기시간 인정 여부
  midtermResign: boolean; // 교육생 및 중도 퇴사자 급여 미지급
  delayedAllowance: boolean; // 주휴수당 지연 및 포괄임금 꼼수
}

// 설문과 기존 계산 데이터를 함께 시트로 전송할 때 사용할 페이로드 타입
// (extends를 사용했으므로 위 3개 속성이 자동으로 포함됩니다)
export interface SurveyLogPayload extends LaborIssueSurveyData {
  wage: number;
  hours: number;
  userType?: string;
}