/**
 *Must Be Imported
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/jszip.js"></script>
source code => https://www.aspsnippets.com/Articles/Read-Excel-File-using-AngularJS-and-HTML5-File-API.aspx
 */
class ExcelReader {
    processExcel(data, sucessCallBack, errorCallBack) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

        //Display the data from Excel file in Table.
        sucessCallBack(excelRows)
    };

    read(file, successCallBack, errorCallBack) {

        var regex = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet| application\/vnd.ms-excel/;

        if (!regex.test(file.type.toLowerCase())) {

            errorCallBack('File Is Not Excel');
            return;
        } else
        if (typeof(FileReader) == "undefined") {
            errorCallBack("This browser does not support HTML5.");
            return;
        }

        var reader = new FileReader();
        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function(e) {
                new ExcelReader().processExcel(e.target.result, successCallBack, errorCallBack);
            };
            reader.readAsBinaryString(file);
        } else {
            //For IE Browser.
            reader.onload = function(e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                new ExcelReader().processExcel(data, successCallBack, errorCallBack);
            };
            reader.readAsArrayBuffer(file);
        }
    }

}