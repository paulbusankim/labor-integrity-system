let MASTER_FILE = null;

const MASTER_DB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590";

const LOG_SHEET_NAME = "Log";

const _makeConfig = (masterFile) => {
  const sheet = masterFile.getSheetByName("Config");
  const data = sheet.getDataRange().getValues();
  const addCell = (acc, row) => {
    const address = row[0];
    const value = row[1];
    if (address && value) acc[address] = value;
    return acc;
  };

  return data.reduce(addCell, {});
};

/**
 * 설정 파일로부터 매핑 정보를 가져오는 인터페이스 함수입니다.
 * 보안을 위해 실제 설정 시트의 위치를 직접 노출하지 않고 래핑된 형태로 제공합니다.
 * @returns {Object} 셀 주소와 옵션 이름이 매핑된 객체
 */
const _loadMasterFile = () => {
  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);
  return _makeConfig(MASTER_FILE);
};

function _saveLogFromUser(payload) {
  const TAG = "[MasterDB:saveLog]";

  if (!payload || !payload.event) {
    console.error(`${TAG} 필수 데이터 누락: payload 또는 event가 없습니다.`);
    return;
  }
  const { event } = payload;
  const { value } = event;
  if (!value) {
    console.warn(
      `${TAG} 입력값 유효성 검사 실패: event.value가 비어있습니다.`,
      { payload },
    );
    return;
  }

  const { range } = event;
  if (!range) {
    console.warn(`${TAG} 입력값 유효성 검사 실패: range가 올바르지 않습니다.`, {
      event,
    });
    return;
  }

  const address = range.getA1Notation();
  if (!address) {
    console.warn(`${TAG} 입력값 유효성 검사 실패: range가 올바르지 않습니다.`);
    return;
  }

  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);

  const mappingConfig = _makeConfig(MASTER_FILE);

  const selectedOptions = payload.data
    .filter((item) => item.value === true)
    .map((item) => {
      const option = mappingConfig[item.cell];
      if (!option) return null;
      return option;
    })
    .filter((option) => option !== null);

  if (selectedOptions.length === 0) return;

  if (hasUserSubmitTrue(event)) {
    try {
      const logSheet = MASTER_FILE.getSheetByName(LOG_SHEET_NAME);
      const timestamp = new Date();

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

const MasterDB = {
  saveCheckboxStatus: _saveLogFromUser,
  getConfig: _loadMasterFile,
};

function getConfig() {
  return MasterDB.getConfig();
}

function saveCheckboxStatus(payload) {
  return MasterDB.saveCheckboxStatus(payload);
}
