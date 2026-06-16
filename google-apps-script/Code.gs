// Google Apps Script: doPost handler to append form data to a sheet
// Replace SPREADSHEET_ID with your target spreadsheet ID.

function doPost(e) {
  try {
    var data = {};
    // Try to parse JSON body
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && Object.keys(e.parameter).length) {
      // Form-encoded or FormData
      data.first = e.parameter.first;
      data.last = e.parameter.last;
      data.email = e.parameter.email;
    } else if (e.postData && e.postData.contents) {
      // last resort: try parsing contents
      try { data = JSON.parse(e.postData.contents); } catch(err) { data = {}; }
    }

    var ss = SpreadsheetApp.openById('SPREADSHEET_ID');
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
    sheet.appendRow([new Date(), data.first || '', data.last || '', data.email || '']);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
