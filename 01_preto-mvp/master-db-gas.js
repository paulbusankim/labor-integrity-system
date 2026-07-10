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
    .filter((item) => item.values === true)
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
