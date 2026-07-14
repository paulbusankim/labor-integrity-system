var DASHBOARD_TAB_NAME = "계산기";
var DATA_CHECKBOX_RANGE_START = "B10";
var DATA_CHECKBOX_RANGE_END = "B12";
var SUBMIT_CELL = "B14";
var CONFIG = null;

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
  if (!e || !e.range) return;

  var lock = LockService.getUserLock();
  try {
    lock.waitLock(10000);
  } catch (error) {
    console.warn("이전 작업이 진행 중입니다. 잠금 획득 실패.");
  }

  try {
    if (!CONFIG) CONFIG = getCachedConfig();
    var range = e.range;
    var sheet = range.getSheet();
    var address = range.getA1Notation();
    var value = e.value;

    var submitRequestedStatus = isSubmitRequested(
      address,
      value,
      CONFIG["SUBMISSION_CONFIRMED"],
    );
    if (submitRequestedStatus === false) return;

    var rangeCheckboxes = getCheckboxRange(sheet, CONFIG);
    var valuesCheckboxes = rangeCheckboxes.getValues();
    var hasTrueUserCheckbox = verifyUserCheckboxHasTrue(valuesCheckboxes);
    if (hasTrueUserCheckbox === false) return;

    var checkboxesData = getMappedCheckboxes(valuesCheckboxes, [
      CONFIG["CHECKBOX_RANGE_ROW"],
      CONFIG["CHECKBOX_RANGE_COLUMN"],
    ]);

    var payload = {
      event: e,
      data: [...checkboxesData],
    };

    lib_labor_master_db.saveLogFromUser(payload);
    toast("데이터를 저장했습니다.", "저장 완료");
    SpreadsheetApp.flush();
    Utilities.sleep(1000);
    resetCheckboxes(rangeCheckboxes);
    resetSubmissionCheckbox(range);
  } catch (error) {
    console.error(`[오류] 데이터 저장 실패 | 원인: ${error.message}`);
  } finally {
    lock.releaseLock();
  }
}

function isSubmitRequested(address, value, targetCellAddress) {
  return address === targetCellAddress && value === "TRUE";
}

function verifyUserCheckboxHasTrue(values) {
  return values.flat().some((val) => val === true);
}

function resetCheckboxes(range) {
  range.setValue(false);
}

function resetSubmissionCheckbox(range) {
  range.setValue(false);
}

function getMappedCheckboxes(values, [startRow, startColumn]) {
  const mapData = (row, index) => {
    var address = getA1NotationFromIndices(startRow + index, startColumn);
    return {
      cell: address,
      value: row[0],
    };
  };

  try {
    return values.map(mapData);
  } catch (error) {
    console.log("error on getMappedCheckboxes", error);
  }
}

function toast(msg, title) {
  var toastTitle = title ? title : "알림";
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, toastTitle);
}

function getCheckboxRange(sheet, config) {
  const row = CONFIG["CHECKBOX_RANGE_ROW"];
  const col = CONFIG["CHECKBOX_RANGE_COLUMN"];
  const numRows = CONFIG["CHECKBOX_RANGE_NUMBER_ROWS"];
  const numCols = CONFIG["CHECKBOX_RANGE_NUMBER_COLUMNS"];
  return sheet.getRange(row, col, numRows, numCols);
}

function getA1NotationFromIndices(row, col) {
  var colLetter = String.fromCharCode(64 + col);
  return colLetter + row;
}

function getCachedConfig() {
  try {
    var cache = CacheService.getScriptCache();
    var cachedData = cache.get("MASTER_CONFIG");

    if (cachedData) {
      console.info("✅ [Cache Hit] 설정 정보를 캐시에서 로드합니다.");
      return JSON.parse(cachedData);
    }

    console.info("⚠️ [Cache Miss] 외부 DB에서 설정을 로드합니다.");
    var freshConfig = lib_labor_master_db.getConfig();
    cache.put("MASTER_CONFIG", JSON.stringify(freshConfig), 1800);
    return freshConfig;
  } catch (error) {
    console.error("❌ [Cache Error] 원인: " + error.message);
    throw error;
  }
}

/**
 * [관리자 전용]
 * 캐시를 강제로 삭제하여 다음번 사용자 요청 시
 * 외부 DB에서 최신 정보를 다시 가져오게 합니다.
 */
function forceReset() {
  try {
    var cache = CacheService.getScriptCache();
    cache.remove("MASTER_CONFIG");
    console.warn(
      "🛡️ [Admin Action] MASTER_CONFIG 캐시가 강제로 삭제되었습니다.",
    );
  } catch (error) {
    console.error(
      "❌ [Admin Action Failed] 캐시 삭제 중 오류 발생: " + error.message,
    );
    throw error;
  }
}
