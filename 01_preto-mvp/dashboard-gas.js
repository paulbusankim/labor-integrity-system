var DASHBOARD_TAB_NAME = "계산기";
var DATA_CHECKBOX_RANGE_START = "B10";
var DATA_CHECKBOX_RANGE_END = "B12";

// 시트 파일이 열릴 때 자동으로 실행되는 구글 예약 함수입니다.
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(DASHBOARD_TAB_NAME);

  if (!sheet) return;
  resetAllCheckbox(sheet);
}

function onEdit(e) {
  // 등록한 라이브러리 이름(app_Labor_Master_DB)을 통해 마스터 엔진의 함수를 호출하면서 이벤트 매개변수(e)를 안전하게 전달
  app_Labor_Master_DB.saveLogFromUser(e);
}

function resetAllCheckbox(sheet) {
  sheet
    .getRange(joinCellRange(DATA_CHECKBOX_RANGE_START, DATA_CHECKBOX_RANGE_END))
    .setValue(false);
}

function joinCellRange(start, end) {
  return start + ":" + end;
}
