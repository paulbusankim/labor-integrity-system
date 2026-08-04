/**
 * 노동 권익 설문조사 통계 (프리토타이핑용 수동 업데이트 데이터)
 * 구글 시트 결과를 바탕으로 주기적으로 퍼센티지(percentage)를 업데이트합니다.
 */
export const SURVEY_STATISTICS = [
  {
    id: "unpaidRest",
    label: "무급 휴게시간을 강요받았다",
    percentage: 45, // 여기에 구글 시트의 응답 비율을 수동 입력
    color: "bg-red-500", // Tailwind 색상 클래스
  },
  {
    id: "midtermResign",
    label: "교육생 및 중도 퇴사자라는 이유로 임금을 받지 못했다",
    percentage: 68,
    color: "bg-orange-500",
  },
  {
    id: "delayedAllowance",
    label: "주휴수당을 지급받지 못하거나 꼼수로 거부당했다",
    percentage: 82,
    color: "bg-yellow-500",
  },
];