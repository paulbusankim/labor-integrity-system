/**
 * 노동 권익 설문조사 통계 (프리토타이핑용 수동 업데이트 데이터)
 * 구글 시트 결과를 바탕으로 주기적으로 퍼센티지(percentage)를 업데이트합니다.
 */
export const SURVEY_STATISTICS = [
  {
    id: "delayedAllowance",
    label: "교육(수습) 기간 또는 중도 퇴사 시 미정산 발생",
    percentage: 82,
    color: "bg-red-500",
  },
  {
    id: "midtermResign",
    label: "서류상 휴게시간이나 실제로는 대기·근무함",
    percentage: 68,
    color: "bg-orange-500",
  },
  {
    id: "unpaidRest",
    label: "주휴수당 지급 지연 또는 누락 경험",
    percentage: 45,
    color: "bg-yellow-500",
  },
];
