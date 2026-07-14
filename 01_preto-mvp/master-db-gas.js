var MASTER_DB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590";
var MASTER_FILE = null;
var LOG_SHEET_NAME = "Log";

function saveLogFromUser(payload) {
  var event = payload.event;

  if (!event) return;
  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);

  var mappingConfig = getMappingConfig(MASTER_FILE);

  var selectedOptions = payload.data
    .filter((item) => item.value === true)
    .map((item) => {
      var option = mappingConfig[item.cell];
      if (!option) return null;
      return option;
    })
    .filter((option) => option !== null);

  if (selectedOptions.length === 0) return;

  if (hasUserSubmitTrue(event)) {
    try {
      var logSheet = MASTER_FILE.getSheetByName(LOG_SHEET_NAME);
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
  }
}

function hasUserSubmitTrue(event) {
  var value = event.value;
  return value === "TRUE" || value === true ? true : false;
}

function getMappingConfig(masterFile) {
  var sheet = masterFile.getSheetByName("Config");
  var data = sheet.getDataRange().getValues();
  return data.reduce(function (acc, row) {
    var cellAddress = row[0];
    var optionName = row[1];
    if (cellAddress && optionName) acc[cellAddress] = optionName;
    return acc;
  }, {});
}

/**
 * 설정 파일로부터 매핑 정보를 가져오는 인터페이스 함수입니다.
 * 보안을 위해 실제 설정 시트의 위치를 직접 노출하지 않고 래핑된 형태로 제공합니다.
 * @returns {Object} 셀 주소와 옵션 이름이 매핑된 객체
 */
function getConfig() {
  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);
  return getMappingConfig(MASTER_FILE);
}
