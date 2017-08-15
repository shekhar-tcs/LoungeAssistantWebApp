
var when = require('when');
var XLSX = require('xlsx');


exports.ingestExcelFileAndExtractData = function (file) {
    var defer = when.defer();
    var workBook = XLSX.readFile(file.path);
    var extractedData = extractDataFromWorkBook(workBook);
    var workBookData = {
        sheetNames: workBook.SheetNames,
        data: extractedData
    }

    if (extractedData.length) {
        defer.resolve(workBookData);
    } else {
        defer.reject();
    }
    return defer.promise;
};

function extractDataFromWorkBookWithPromise(workBook) {
    var defer = when.defer();
    var workBookData = extractDataFromWorkBook(workBook);
    if (workBookData.length) {
        defer.resolve(workBookData);
    } else {
        defer.reject();
    }

    return defer.promise;
}

function extractDataFromWorkBook(workBook) {

    var sheetNameList = workBook.SheetNames;
    var workBookData = [];

    sheetNameList.forEach(function(y) {
        var workSheet = workBook.Sheets[y];
        var workSheetData = extractDataFromSheet(workSheet);
        if (workSheetData.length) workBookData.push(workSheetData);

    });
    return workBookData;
}

function extractDataFromSheet(workSheet) {
    //var defer = when.defer();

    var headers = {};
    var workSheetData = [];
    for(var z in workSheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = workSheet[z].v;

        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if(!workSheetData[row]) workSheetData[row]={};
        workSheetData[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    workSheetData.shift();
    workSheetData.shift();
    return workSheetData;
   // return defer.promise;
}

function extractDataFromSheetWithPromise(workSheet) {
    var defer = when.defer();
    var workSheetData = extractDataFromSheet(workSheet);
    if (workSheetData) {
        defer.resolve(workSheetData);
    } else {
        defer.reject('error');
    }

    return defer.promise;
}

exports.extractDataFromSheetWithPromise = extractDataFromSheetWithPromise;
exports.extractDataFromWorkBookWithPromise = extractDataFromWorkBookWithPromise;
