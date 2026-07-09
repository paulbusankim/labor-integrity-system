var MASTER_DB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590";
var LOG_SHEET_NAME = "Log";
var USER_CHECKBOX_OPTION_MPA = {
  B10: "주말/야간 수당 옵션 클릭",
  B11: "30분 단위 절사 비교 옵션 클릭",
  B12: "고용노동부 리포트 옵션 클릭",
};

function saveLogFromUser(payload) {
  var event = payload.event;

  if (!event) return;

  var range = event.range;
  var sheet = range.getSheet();
  var cellAddress = range.getA1Notation();
  var selectedOptions = payload.data
    .filter((item) => item.values === true)
    .map((item) => USER_CHECKBOX_OPTION_MPA[item.cell]);

  if (hasUserSubmitTrue(event)) {
    if (selectedOptions.length > 0) {
      try {
        var masterFile = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);
        var logSheet = masterFile.getSheetByName(LOG_SHEET_NAME);
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
  }
}

function hasUserSubmitTrue(event) {
  var value = event.value;
  return value === "TRUE" || value === true ? true : false;
}
