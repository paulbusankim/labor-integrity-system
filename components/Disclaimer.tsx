export default function Disclaimer() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="text-xs font-bold text-gray-500 mb-2">
        [면책 조항 (Disclaimer)]
      </h4>
      <p className="text-[11px] leading-relaxed text-gray-400 break-keep">
        본 서비스는 근로자가 자발적으로 근로 시간을 기록하고 예상 임금을
        참고용으로 계산해 보는 도구입니다. 본 서비스가 제공하는 계산 결과는 법적
        효력이 없으며, 정확한 임금 체불 진정 및 노무 상담은 고용노동부(국번없이
        1350) 또는 공인노무사를 통해 확인하시기 바랍니다. 본 서비스의 이용으로
        인해 발생하는 결과에 대해 개발자는 법적 책임을 지지 않습니다.
      </p>
    </div>
  );
}
