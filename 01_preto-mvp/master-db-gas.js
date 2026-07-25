let MASTER_FILE = null;
const MASTER_DB_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Egi76V4st202iYPAaQqjqHppV0Ej1Wc01FBPsqNVFSc/edit?gid=920517590#gid=920517590";

const LOG_SHEET_NAME = "Log";
const CONFIG_SHEET_NAME = "Config";
const CONTENT_SHEET_NAME = "Content";
const SHEET_NAMES = {
  CHECKBOX_CONFIG: "Config_Checkbox",
};
const CACHE_KEYS = {
  CONFIG: "config-cache",
  CONTENT: "content-cache",
  CHECKBOX_CONFIG: "checkbox-config-cache",
};
// 캐시 만료 시간 상수화 (예: 6시간 = 21600초)
const CACHE_TTL = 21600;

const log = (level, tag, message, data = null) => {
  const formats = {
    INFO: { icon: "ℹ️", method: console.info },
    WARN: { icon: "⚠️", method: console.warn },
    ERROR: { icon: "❌", method: console.error },
    DEBUG: { icon: "🐛", method: console.debug || console.log },
  };

  const current = formats[level] || formats.INFO;
  const timestamp = new Date().toISOString();

  current.method(
    `[${timestamp}] ${current.icon} [${level}] [${tag}] ${message}`,
    data ? data : "",
  );
};

const _setCache = (name, value, callback) => {
  const tag = "[MasterDB:_setCache]";

  const cacheService = CacheService.getScriptCache();
  cacheService.put(name, JSON.stringify(value), CACHE_TTL);

  log("INFO", tag, `${name} 캐시 저장`, { name, value });

  if (callback) callback();
};

const _getCache = (name) => {
  const tag = "[MasterDB:_getCache]";
  const cacheService = CacheService.getScriptCache();
  const cache = cacheService.get(name);
  if (!cache) return null;

  log("INFO", tag, `${name} 캐시 로드`, { name });
  return JSON.parse(cache);
};

const _getValuesSheetContent = (masterFile, sheetName) => {
  const sheet = masterFile.getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) return [];

  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const values = range.getValues();
  return values;
};

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

const _appendRow = (sheet) => (value) => {
  const timestamp = new Date();
  sheet.appendRow([timestamp, value]);
};

const _getOrFetchCache = (cacheKey, fetchCallback) => {
  let data = _getCache(cacheKey);
  if (data) return data;

  data = fetchCallback();

  if (data) {
    _setCache(cacheKey, data);
  }

  return data;
};

function _saveLogFromUser(payload) {
  const TAG = "[MasterDB:saveLog]";

  if (!payload || !payload.event) {
    console.error(`${TAG} 필수 데이터 누락: payload 또는 event가 없습니다.`);
    return;
  }

  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);

  const valuesSheetContent = _getValuesSheetContent(
    MASTER_FILE,
    CONTENT_SHEET_NAME,
  );
  if (valuesSheetContent.length === 0) {
    return {
      status: false,
      message: `Master-db-sheet:${CONTENT_SHEET_NAME}시트가 비어있습니다.`,
      data: {
        sheetName: CONTENT_SHEET_NAME,
      },
    };
  }

  const content = _getOrFetchCache(CACHE_KEYS.CONTENT, () => {
    return _mapSheet(MASTER_FILE, CONTENT_SHEET_NAME);
  });
  if (!content) {
    console.warn(
      `${TAG} 시트 맵핑 실패: Content 시트 맵핑 데이터가 유효하지 않습니다.`,
      { content },
    );
    return;
  }

  const valueCheckboxes = payload.data.filter((item) => item.value === true);

  const selectedOptions = valueCheckboxes
    .map((item) => {
      const value = content[item.cell];
      if (!value) return null;
      return value;
    })
    .filter((value) => value !== null);

  if (selectedOptions.length === 0) {
    return {
      status: false,
      message: `모든 체크박스 값이 FALSE입니다.`,
      data: {
        valueCheckboxes: JSON.stringify(valueCheckboxes),
        selectedOptions,
      },
    };
  }

  try {
    const logSheet = MASTER_FILE.getSheetByName(LOG_SHEET_NAME);
    const addRow = _appendRow(logSheet);

    selectedOptions.forEach(addRow);

    console.log(
      "🎉 [성공] 마스터 DB의 Log 탭에 행이 성공적으로 추가되었습니다!",
    );
  } catch (error) {
    console.log("❌ [시스템 오류 발생] 상세 원인: " + error.toString());
  }
}

const _exportSheetValues = (sheetName, cacheKey) => {
  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);
  return _getOrFetchCache(cacheKey, () => {
    return _mapSheet(MASTER_FILE, sheetName);
  });
};

const _exportSheetTable = (sheetName, cacheKey) => {
  if (!MASTER_FILE) MASTER_FILE = SpreadsheetApp.openByUrl(MASTER_DB_SHEET_URL);

  return _getOrFetchCache(cacheKey, () => {
    const sheet = MASTER_FILE.getSheetByName(sheetName);
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow === 0 || lastCol === 0) return [];

    const range = sheet.getRange(1, 1, lastRow, lastCol);
    const values = range.getValues();
    return values;
  });
};

const MasterDB = {
  saveCheckboxStatus: _saveLogFromUser,
  getConfig: () => {
    return _exportSheetValues(CONFIG_SHEET_NAME, CACHE_KEYS.CONFIG);
  },
  getContent: () => {
    return _exportSheetValues(CONTENT_SHEET_NAME, CACHE_KEYS.CONTENT);
  },
  getCheckboxConfig: () =>
    _exportSheetTable(SHEET_NAMES.CHECKBOX_CONFIG, CACHE_KEYS.CHECKBOX_CONFIG),
};

function getCheckboxConfig() {
  return MasterDB.getCheckboxConfig();
}

function getConfig() {
  return MasterDB.getConfig();
}

function getContent() {
  return MasterDB.getContent();
}

function saveCheckboxStatus(payload) {
  return MasterDB.saveCheckboxStatus(payload);
}
/**
 * [관리자 전용]
 * 캐시를 강제로 삭제하여 다음번 사용자 요청 시
 * 외부 DB에서 최신 정보를 다시 가져오게 합니다.
 */
function adminRemoveAllCache() {
  const tag = "Master-DB:_removeAllCache:Admin ACtion";
  const cacheService = CacheService.getScriptCache();
  const list = Object.keys(CACHE_KEYS);

  if (list.length === 0) return;

  list.forEach((key) => {
    const name = CACHE_KEYS[key];
    const cache = cacheService.get(name);
    if (!cache) return;
    cacheService.remove(name);
    log("WARN", tag, `관리자 권한으로 ${key} 캐시 강제 삭제`, {
      key,
    });
  });
}
