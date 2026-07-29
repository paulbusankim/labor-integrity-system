/**
 * 노동 권익 설문조사 통계 (프리토타이핑용 수동 업데이트 데이터)
 * 구글 시트 결과를 바탕으로 주기적으로 퍼센티지(percentage)를 업데이트합니다.
 */
export const SURVEY_STATISTICS = [
  {
    id: "splitShift",
    label: "쪼개기 계약을 경험했다",
    percentage: 68, // 여기에 구글 시트의 응답 비율을 수동 입력
    color: "bg-red-500", // Tailwind 색상 클래스
  },
  {
    id: "noPayStub",
    label: "임금명세서를 받지 못했다",
    percentage: 82,
    color: "bg-orange-500",
  },
  {
    id: "unpaidRest",
    label: "휴게시간을 보장받지 못했다",
    percentage: 45,
    color: "bg-yellow-500",
  },
];