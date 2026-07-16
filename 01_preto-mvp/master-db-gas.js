let MASTER_FILE = null;

const MASTER_DB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590";

const LOG_SHEET_NAME = "Log";
const CONFIG_SHEET_NAME = "Config";

const _mapSheet = (masterFile, name) => {
  const sheet = masterFile.getSheetByName(name);
  const data = sheet.getDataRange().getValues();
  const addCell = (acc, row) => {
    const address = row[0];
    const value = row[1];
    if (address && value) acc[address] = value;
    return acc;
  };

  return data.reduce(addCell, {});
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
  const config = _mapSheet(MASTER_FILE, CONFIG_SHEET_NAME);
  if (!config) {
    console.warn(`${TAG} Config 로드 실패: 불러온 config가 올바르지 않습니다.`);
    return;
  }

  const isConfirmed =
    value === "TRUE" && address === config["SUBMISSION_CONFIRMED"];
  if (!isConfirmed) {
    console.warn(
      `${TAG} 제출 데이터 유효성 검사 실패: 제출한 데이터의 정보가 올바르지 않습니다.`,
      {
        value,
        address,
      },
    );
    return;
  }

  const selectedOptions = payload.data
    .filter((item) => item.value === true)
    .map((item) => {
      const option = config[item.cell];
      if (!option) return null;
      return option;
    })
    .filter((option) => option !== null);

  if (selectedOptions.length === 0) {
    console.warn(
      `${TAG} 제출 체크박스 검사 실패: 제출한 체크박스가 모두 false입니다.`,
      { selectedOptions },
    );

    return;
  }

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

const MasterDB = {
  saveCheckboxStatus: _saveLogFromUser,
  getConfig: () => {
    if (!MASTER_FILE)
      MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);
    return _mapSheet(MASTER_FILE, CONFIG_SHEET_NAME);
  },
};

function getConfig() {
  return MasterDB.getConfig();
}

function saveCheckboxStatus(payload) {
  return MasterDB.saveCheckboxStatus(payload);
}
