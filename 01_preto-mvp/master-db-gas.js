var USER_CHECKBOX_OPTION_MPA = {
  B10: "주말/야간 수당 옵션 클릭",
  B11: "30분 단위 절사 비교 옵션 클릭",
  B12: "고용노동부 리포트 옵션 클릭",
};

function saveLogFromUser(payload) {
  var event = payload.event;

  if (!event) {
    console.log(
      "❌ [중단] 이벤트 객체(event)가 누락되었습니다. 수동으로 실행 버튼을 누르셨거나 트리거 신호가 비어있습니다.",
    );
    return;
  }

  var range = event.range;
  var sheet = range.getSheet();
  var value = event.value;
  var cellAddress = range.getA1Notation();
  var selectedOptions = payload.data
    .filter((item) => item.values === true)
    .map((item) => USER_CHECKBOX_OPTION_MPA[item.cell]);

  console.log(
    "📋 [현재 입력 정보] 수정한 시트명: " +
      cellAddress +
      " | 입력된 값: " +
      value +
      " (데이터타입: " +
      typeof value +
      ")",
  );

  if (value === "TRUE" || value === true) {
    if (selectedOptions.length > 0) {
      try {
        var masterFile = SpreadsheetApp.openByUrl(
          "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590",
        );
        var logSheet = masterFile.getSheetByName("Log");
        var timestamp = new Date();

        selectedOptions.forEach((option) => {
          logSheet.appendRow([timestamp, option]);
        });
        console.log(
          "🎉 [성공] 마스터 DB의 Log 탭에 행이 성공적으로 추가되었습니다!",
        );
      } catch (error) {
        console.log("❌ [시스템 오류 발생] 상세 원인: " + error.toString());
      }
    } else {
      console.log(
        "⚠️ [종료] 수정한 셀 위치(" +
          cellAddress +
          ")가 B10, B11, B12가 아니므로 중단합니다.",
      );
    }
  } else {
    console.log(
      "⚠️ [종료] 입력된 값이 TRUE가 아닙니다. 체크박스가 해제되었거나 다른 값이 입력되어 종료합니다.",
    );
  }
}
