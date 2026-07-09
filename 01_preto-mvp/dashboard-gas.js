var DASHBOARD_TAB_NAME = "계산기";
var DATA_CHECKBOX_RANGE_START = "B10";
var DATA_CHECKBOX_RANGE_END = "B12";
var SUBMIT_CELL = "B14";

// 시트 파일이 열릴 때 자동으로 실행되는 구글 예약 함수입니다.
function onOpen(e) {
  var sheet = getSheetFromEvent(e);

  if (!sheet) return;

  var reset = resetCheckbox(sheet);

  reset([
    joinCellRange(DATA_CHECKBOX_RANGE_START, DATA_CHECKBOX_RANGE_END),
    SUBMIT_CELL,
  ]);
}

function onEdit(e) {
  var sheet = getSheetFromEvent(e);
  var range = e.range;
  var cellAddress = range.getA1Notation();
  var cellValue = e.value;
  var hasTrueUserCheckbox = verifyUserCheckboxHasTrue(
    sheet,
    joinCellRange(DATA_CHECKBOX_RANGE_START, DATA_CHECKBOX_RANGE_END),
  );

  if (cellAddress === SUBMIT_CELL && cellValue === "FALSE") return;

  if (hasTrueUserCheckbox === false) return;

  if (
    cellAddress === SUBMIT_CELL &&
    cellValue === "TRUE" &&
    hasTrueUserCheckbox === true
  ) {
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

    app_Labor_Master_DB.saveLogFromUser(payload);
    toast("데이터를 저장했습니다.", "저장 완료");
  }
}

function verifyUserCheckboxHasTrue(sheet, cellRange) {
  var checkboxRange = sheet.getRange(cellRange);
  var values = checkboxRange.getValues();
  return values.flat().some((val) => val === true);
}

function getSheetFromEvent(e) {
  if (!e || !e.range) return null;
  return e.range.getSheet();
}

function resetCheckbox(sheet) {
  return function (ranges) {
    sheet.getRangeList(ranges).setValue(false);
  };
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
