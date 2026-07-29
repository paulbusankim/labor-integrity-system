/**
 * @fileoverview Google Apps Script (GAS) Web App - 주휴수당 계산 및 설문 로그 수집 백엔드
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();

    // 1. [설문 데이터 처리 블록] type이 "survey"인 경우 여기서 완벽히 차단하고 종료
    if (data.type === "survey") {
      var sheet = ss.getSheetByName("SurveyLogs");
      if (!sheet) {
        sheet = ss.insertSheet("SurveyLogs");
      }

      sheet.appendRow([
        timestamp,
        data.wage || 0,
        data.hours || 0,
        data.splitShift ? "O" : "X",
        data.noPayStub ? "O" : "X",
        data.unpaidRest ? "O" : "X",
      ]);

      // 반드시 성공 응답을 리턴하며 여기서 함수를 완전히 끝냅니다.
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success" }),
      )
        .setHeader("Access-Control-Allow-Origin", "*")
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. [기본 주휴수당 계산 로그 처리 블록] (설문이 아닌 경우에만 이 아래 코드가 실행됨)
    var sheetName = "주휴수당로그";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    var wage = data.wage || 0;
    var hours = data.hours || 0;
    var amount = data.amount || 0;
    var message = data.message || "";

    sheet.appendRow([timestamp, wage, hours, amount, message]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" }),
    )
      .setHeader("Access-Control-Allow-Origin", "*")
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() }),
    )
      .setHeader("Access-Control-Allow-Origin", "*")
      .setMimeType(ContentService.MimeType.JSON);
  }
}