/**
 * @fileoverview Google Apps Script (GAS) Web App - 주휴수당 계산 및 설문 로그 수집 백엔드
 * @description Next.js 프론트엔드로부터 HTTP POST 요청을 받아 주휴수당 계산 결과 및 노동 권익 설문 데이터를 구글 시트에 기록합니다.
 * 
 * [사용 예시 및 페이로드 데이터 구조]
 * 1. 주휴수당 계산 로그 (기본)
 *    - 엔드포인트로 전송되는 JSON Body: 
 *      { wage: 11500, hours: 40, amount: 926400, message: "주 40시간 근무 기준..." }
 * 
 * 2. 노동 권익 설문 로그 (type: "survey")
 *    - 엔드포인트로 전송되는 JSON Body: 
 *      { type: "survey", wage: 11500, hours: 40, splitShift: true, noPayStub: true, unpaidRest: false }
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 💡 1. 원하는 시트(탭)의 이름을 지정합니다 (예: "주휴수당로그")
    var sheetName = "주휴수당로그";
    var sheet = ss.getSheetByName(sheetName);

    // 만약 지정한 이름의 시트가 존재하지 않는다면 에러를 방지하기 위해 첫 번째 시트를 쓰거나 새로 만들 수도 있습니다.
    if (!sheet) {
      sheet = ss.insertSheet(sheetName); // 시트가 없으면 자동으로 생성!
    }

    // 들어온 페이로드 파싱
    var data = JSON.parse(e.postData.contents);

    var timestamp = new Date();
    var wage = data.wage || 0;
    var hours = data.hours || 0;
    var amount = data.amount || 0;
    var message = data.message || "";

    // 지정한 시트의 맨 아래 줄에 데이터 추가
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
