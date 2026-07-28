# Labor Integrity System: 기획부터 개발까지의 기록

Labor standards-based wage integrity verification and worker rights protection system (근로기준법 기반 급여 무결성 검증 및 노동 권리 보호 시스템)

## 🔄 Architecture Evolution (기술 스택 전환의 기록)

**Phase 1: Google Sheets & Apps Script (Legacy)**
- **목적:** 알바생들의 근로 기록을 구글 시트에서 직접 입력하고, Apps Script로 자동 계산하는 시스템 기획.
- **한계점:** 다중 사용자 접속 시 발생하는 '공유된 상태(Global State)' 충돌, UI/UX 디자인의 구조적 한계, 그리고 데이터 처리와 뷰(View)가 강하게 결합되어 유지보수가 불가능해지는 문제 직면.
- *참고: 초기 구글 시트 기획안과 GAS 코드는 `archive/gas-version` 브랜치에 영구 보존되어 있습니다.*

**Phase 2: Vercel + Next.js + TypeScript (Current)**
- **해결책:** '관심사의 분리(SoC)' 원칙을 적용하여 프론트엔드와 백엔드(데이터)를 완벽히 분리.
- **기술 스택:** 
  - **Framework:** Next.js 16 (App Router)
  - **Language:** TypeScript 5 (런타임 에러 방지 및 타입 안정성 확보)
  - **Styling:** Tailwind CSS v4
  - **Deployment:** Vercel (빠른 CI/CD 및 무중단 배포)
- **효과:** 독립된 클라이언트 상태 관리(`useState`)를 통해 유저 간 데이터 충돌을 원천 차단하고, 빠른 MVP(Minimum Viable Product) 검증 사이클 구축.