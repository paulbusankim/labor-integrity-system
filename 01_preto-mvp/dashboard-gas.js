function onEdit(e) {
  // 등록한 라이브러리 이름(app_Labor_Master_DB)을 통해 마스터 엔진의 함수를 호출하면서 이벤트 매개변수(e)를 안전하게 전달
  app_Labor_Master_DB.saveLogFromUser(e);
}

// 시트 파일이 열릴 때 자동으로 실행되는 구글 예약 함수입니다.
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("계산기");
  
  // 만약 계산기 탭이 존재한다면, B10부터 B12까지의 체크박스를 전부 false(꺼짐)로 만듭니다.
  if (sheet) {
    sheet.getRange("B10:B12").setValue(false);
  }
}