var DASHBOARD_TAB_NAME = "계산기";
var DATA_CHECKBOX_RANGE_START = "B10";
var DATA_CHECKBOX_RANGE_END = "B12";
var SUBMIT_CELL = "B14";
var CONFIG = null;

function handleOpenSheet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(DASHBOARD_TAB_NAME);
  if (!sheet) {
    console.error("❌ [초기화 실패] 대시보드 시트를 찾을 수 없습니다.");
    return;
  }

  try {
    if (!CONFIG) CONFIG = lib_labor_master_db.getConfig();
    resetCheckboxesFromConfig(sheet, CONFIG);
    console.info("✅ [초기화 완료] 체크박스 리셋 성공");
  } catch (error) {
    console.error("❌ [초기화 오류] 원인: " + error.message);
    toast("초기화 실패! 관리자에게 문의하세요.", "오류");
  }
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
  if (!e || !e.range) return;

  var lock = LockService.getUserLock();
  try {
    lock.waitLock(10000);
  } catch (error) {
    console.warn("이전 작업이 진행 중입니다. 잠금 획득 실패.");
  }

  try {
    if (!CONFIG) CONFIG = lib_labor_master_db.getConfig();

    var isSubmitConfirmed = isSubmitRequested(e);
    var sheet = e.range.getSheet();
    var hasTrueUserCheckbox = verifyUserCheckboxHasTrue(
      sheet,
      joinCellRange(DATA_CHECKBOX_RANGE_START, DATA_CHECKBOX_RANGE_END),
    );

    if (isSubmitConfirmed === false) return;
    if (hasTrueUserCheckbox === false) return;

    var userSelectedRange = sheet.getRange(
      joinCellRange(DATA_CHECKBOX_RANGE_START, DATA_CHECKBOX_RANGE_END),
    );

    var startRow = userSelectedRange.getRow();
    var startColumn = userSelectedRange.getColumn();

    var userSelectedValues = userSelectedRange.getValues();
    var mappedData = getMappedData(sheet, userSelectedValues, [
      startRow,
      startColumn,
    ]);

    var payload = {
      event: e,
      data: mappedData,
    };

    lib_labor_master_db.saveLogFromUser(payload);
    toast("데이터를 저장했습니다.", "저장 완료");
  } catch (error) {
    console.error(`[오류] 데이터 저장 실패 | 원인: ${error.message}`);
  } finally {
    lock.releaseLock();
  }
}

function isSubmitRequested(e) {
  var range = e.range;
  var cellAddress = range.getA1Notation();
  var cellValue = e.value;
  return cellAddress === SUBMIT_CELL && cellValue === "TRUE" ? true : false;
}

function verifyUserCheckboxHasTrue(sheet, cellRange) {
  var checkboxRange = sheet.getRange(cellRange);
  var values = checkboxRange.getValues();
  return values.flat().some((val) => val === true);
}

function resetCheckboxesFromConfig(sheet, config) {
  getValuesOfCheckboxes(sheet, config).setValue(false);
}

function getMappedData(sheet, values, [startRow, startColumn]) {
  try {
    return values.map(mapData);
  } catch (error) {
    console.log("error on getMappedData", error);
  }

  function mapData(row, index) {
    var cellAddress = sheet
      .getRange(startRow + index, startColumn)
      .getA1Notation();
    return {
      cell: cellAddress,
      values: row[0],
    };
  }
}

function joinCellRange(start, end) {
  if (!end) return start;
  return start + ":" + end;
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
