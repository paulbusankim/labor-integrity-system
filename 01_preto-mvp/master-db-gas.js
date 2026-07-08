function saveLogFromUser(payload) {
  var event = payload.event

  console.log("=== [시작] saveLogFromUser 함수가 실행되었습니다 ===");

  if (!event) {
    console.log("❌ [중단] 이벤트 객체(event)가 누락되었습니다. 수동으로 실행 버튼을 누르셨거나 트리거 신호가 비어있습니다.");
    return;
  }
  
  var range = event.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var value = event.value;

  var cellAddress = range.getA1Notation();

  console.log("📋 [현재 입력 정보] 수정한 시트명: " + sheetName + " | 수정한 셀 주소: " + cellAddress + " | 입력된 값: " + value + " (데이터타입: " + typeof value + ")");

  if (sheetName !== "계산기") {
    console.log("⚠️ [종료] 수정한 시트가 '계산기'가 아니라 '" + sheetName + "' 이므로 로그를 기록하지 않고 종료합니다.");
    return;
  }

  if (value === "TRUE" || value === true) {
    console.log("✅ [확인] 체크박스가 켜진 것을 감지했습니다 (TRUE). 옵션 명칭 확인을 시작합니다.");

    var optionName = "";
    if (range.getA1Notation() === "B10") optionName = "주말/야간 수당 옵션 클릭";
    else if (range.getA1Notation() === "B11") optionName = "30분 단위 절사 비교 옵션 클릭";
    else if (range.getA1Notation() === "B12") optionName = "고용노동부 리포트 옵션 클릭";

    console.log("🔍 [분석 결과] 매칭된 옵션 명칭: " + (optionName === "" ? "없음(B10, B11, B12 외의 셀)" : optionName));

    if (optionName !== "") {
      try {
        var masterFile = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590");
        var logSheet = masterFile.getSheetByName("Log");
        var timestamp = new Date();
        logSheet.appendRow([timestamp, optionName]);
        console.log("🎉 [성공] 마스터 DB의 Log 탭에 행이 성공적으로 추가되었습니다!");

        // range.setValue(false); // ⬅️ 앞에 슬래시 두 개(//)를 붙여서 작동하지 못하게 막아버립니다.
        console.log("🔄 [패스] 즉시 해제하지 않고 새로고침할 때 초기화되도록 유도합니다.");
      } catch (error) {
        console.log("❌ [시스템 오류 발생] 상세 원인: " + error.toString());
      }
    }  else {
      console.log("⚠️ [종료] 수정한 셀 위치(" + cellAddress + ")가 B10, B11, B12가 아니므로 중단합니다.");
    }
  } else {
    console.log("⚠️ [종료] 입력된 값이 TRUE가 아닙니다. 체크박스가 해제되었거나 다른 값이 입력되어 종료합니다.");
  }
}