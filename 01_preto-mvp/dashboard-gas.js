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

const CACHE_KEYS = {
  CONFIG: "Dashboard:config",
  CONTENT: "Dashboard:content",
};
// 캐시 만료 시간 상수화 (예: 6시간 = 21600초)
const CACHE_TTL = 21600;

const _putCache = (name, value) => {
  const tag = "Dashboard:_putCache";
  const cacheService = CacheService.getScriptCache();

  cacheService.put(name, JSON.stringify(value), CACHE_TTL);
  log("INFO", tag, `${name} 캐시 저장`, { name, value });
};

const _getCache = (name) => {
  const tag = "Dashboard:_getCache";
  const cacheService = CacheService.getScriptCache();

  const cache = cacheService.get(name);

  if (!cache) return null;
  log("INFO", tag, `${name} 캐시 로드`, { name });
  return JSON.parse(cache);
};

const _getOrFetchCache = (cacheKey, fetchCallback) => {
  let data = _getCache(cacheKey);
  if (data) return data;

  data = fetchCallback();

  if (data) {
    _putCache(cacheKey, data);
  }

  return data;
};

const _getCheckboxRange = (sheet, config) => {
  const row = config["CHECKBOX_RANGE_ROW"];
  const col = config["CHECKBOX_RANGE_COLUMN"];
  const numRows = config["CHECKBOX_RANGE_NUMBER_ROWS"];
  const numCols = config["CHECKBOX_RANGE_NUMBER_COLUMNS"];
  return sheet.getRange(row, col, numRows, numCols);
};

const _verifyCheckboxHasTrue = (values) =>
  values.flat().some((val) => val === true);

const _getA1NotationFromIndices = (row, col) => {
  var colLetter = String.fromCharCode(64 + col);
  return colLetter + row;
};

const _getMappedCheckboxes = (values, [startRow, startColumn]) => {
  const mapData = (row, index) => {
    var address = _getA1NotationFromIndices(startRow + index, startColumn);
    return {
      cell: address,
      value: row[0],
    };
  };

  try {
    return values.map(mapData);
  } catch (error) {
    console.log("error on _getMappedCheckboxes", error);
  }
};

const _resetCheckboxes = (range) => {
  range.setValue(false);
};

const _resetSubmission = (range) => {
  range.setValue(false);
};

const _resetContent = (sheet, cacheContent) => {
  const tag = "Dashboard:_resetContent";
  const entries = Object.entries(cacheContent);
  const totalCount = entries.length;
  let successCount = 0;
  let failCount = 0;

  log("INFO", tag, `총 ${totalCount}개의 셀 콘텐츠 리셋 시작`, { totalCount });

  entries.forEach(([address, value]) => {
    if (!value) return;

    try {
      sheet.getRange(address).setValue(value);
      successCount++;
    } catch (error) {
      failCount++;
      log("ERROR", tag, `${address}값 "${value}"로 리셋실패`, { error });
    }
  });

  log(
    "INFO",
    tag,
    `콘텐츠 리셋 작업 완료 | 성공: ${successCount}개, 실패: ${failCount}개`,
    { totalCount, successCount, failCount },
  );
};

function toast(msg, title) {
  var toastTitle = title ? title : "알림";
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, toastTitle);
}

/**
 * [트리거 설정 필수 안내]
 * 본 함수는 외부 DB 연동 및 권한 사용을 위해 '설치형 트리거'를 사용합니다.
 * * 1. 설정 방법: 앱스 스크립트 '트리거' 메뉴 -> '트리거 추가'
 * 2. 실행할 함수: handleUserSubmit
 * 3. 이벤트 소스: 스프레드시트에서
 * 4. 이벤트 유형: 수정 시 (반드시 선택!)
 * * [주의 사항]
 * - '변경 시(onChange)' 이벤트 유형은 셀의 값 외에도 필터/서식 변경 등 구조적 변화를 모두 감지합니다.
 * - '변경 시'로 설정할 경우, 이벤트 객체(e)가 없는 호출이 빈번하여 시스템 노이즈 및 오류가 발생합니다.
 * - 반드시 '수정 시(onEdit)'를 선택해야 정상적으로 작동합니다.
 */
function handleUserSubmit(e) {
  const tag = "Dashboard:handleUserSubmit";

  if (!e || !e.range) return;

  var lock = LockService.getUserLock();
  try {
    lock.waitLock(10000);
  } catch (error) {
    log("WARN", tag, `이전 작업이 진행 중. 잠금 획득 실패.`);
  }

  try {
    var range = e.range;
    var sheet = range.getSheet();
    var address = range.getA1Notation();
    var value = e.value;

    const cacheConfig = _getOrFetchCache(CACHE_KEYS.CONFIG, () => {
      return lib_labor_master_db.getConfig();
    });

    var isConfirmed =
      address === cacheConfig["SUBMISSION_CONFIRMED"] && value === "TRUE";

    if (isConfirmed === false) return;

    var rangeCheckboxes = _getCheckboxRange(sheet, cacheConfig);
    var valuesCheckboxes = rangeCheckboxes.getValues();
    if (_verifyCheckboxHasTrue(valuesCheckboxes) === false) return;

    var checkboxesData = _getMappedCheckboxes(valuesCheckboxes, [
      cacheConfig["CHECKBOX_RANGE_ROW"],
      cacheConfig["CHECKBOX_RANGE_COLUMN"],
    ]);

    var payload = {
      event: e,
      data: [...checkboxesData],
    };

    lib_labor_master_db.saveCheckboxStatus(payload);
    toast("데이터를 저장했습니다.", "저장 완료");
    SpreadsheetApp.flush();
    Utilities.sleep(1000);
    _resetCheckboxes(rangeCheckboxes);
    _resetSubmission(range);

    const cacheContent = _getOrFetchCache(CACHE_KEYS.CONTENT, () => {
      return lib_labor_master_db.getContent();
    });
    _resetContent(sheet, cacheContent);
  } catch (error) {
    log("ERROR", tag, `데이터 저장 실패`, { error });
  } finally {
    lock.releaseLock();
  }
}

/**
 * [관리자 전용]
 * 캐시를 강제로 삭제하여 다음번 사용자 요청 시
 * 외부 DB에서 최신 정보를 다시 가져오게 합니다.
 */
function adminClearCache() {
  const tag = "Dashboard:adminClearCache:Admin Action";
  try {
    var cacheService = CacheService.getScriptCache();

    Object.values(CACHE_KEYS).forEach((cacheKey) => {
      cacheService.remove(cacheKey);
      log("WARN", tag, `관리자 권한으로 ${cacheKey} 캐시 강제 삭제`, {
        cacheKey,
      });
    });
  } catch (error) {
    log("ERROR", tag, "관리자 권한으로 캐시 강제 삭제 중 오류 발생", { error });
    throw error;
  }
}
