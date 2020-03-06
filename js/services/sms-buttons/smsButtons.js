class SmsButtons {


    /**
     * Direc Downlaod File
     * @param {any} encodedUri
     * @param {any} fileName
     */
    static downlaod(encodedUri, fileName) {
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        link.click()
    }

    /**
    * Print Table As CSV
    * @param {string} tableId معرف الجدول
    k*/
    static tablePrint(tableId, callBack) {
        let table = document.getElementById(tableId); // id of table
        if (!table) {
            console.error(`Print ==>> Table Is Not Found`)
            callBack();
            return;
        }

        let newWin = window.open("");
        newWin.document.write(LangIsEn ? SmsButtons.cssEn : SmsButtons.cssAr + table.outerHTML);
        setTimeout(() => {
            newWin.print();
            newWin.close();
        }, 500)
        callBack();

    }

    /**
     * Downlaod Table As Excel
     * @param {string} tableId  معرف الجدول
     */
    static tableToExcel(tableId, callBack) {
        let table = document.getElementById(tableId); // id of table

        if (!table) {
            console.error(`Downlod Excel==>> Table Is Not Found`);
            callBack();
            return;
        }

        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j = 0;

        for (j = 0; j < table.rows.length; j++) {
            tab_text = tab_text + table.rows[j].innerHTML + "</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        callBack();


        //Direct Download
        var encodedUri = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
        var fileName = `${document.title}_${BootstrapDateTimePickerService.getDateMeladyAr(new Date())}_Execl.xls`;
        this.downlaod(encodedUri, fileName);
    }

    /**
    * Downlaod Table As PDF
     * @param {any} tableId
     */
    static tablePDFDownlaod(tableId, callBack) {
        let table = document.getElementById(tableId); // id of table
        if (!table) {
            console.error(`Downlod PDF==>> Table Is Not Found`)
            callBack();
            return;
        }

        var jsonExportArray = this.toJson(table);
        callBack();

        var doc = new jsPDF('p', 'pt');
        doc.addFont('ArialMS', 'Arial', 'normal');
        doc.setFont('Arial');

        doc.autoTable(jsonExportArray.header, jsonExportArray.data);
        doc.save(`${document.title}_${BootstrapDateTimePickerService.getDateMeladyAr(new Date())}_PDF.pdf`);
    }


    /**
     * Downlaod Table As Json
     * @param {any} tableId
     */
    static tableToJson(tableId, callBack) {
        let table = document.getElementById(tableId); // id of table
        callBack();
        if (!table) {
            console.error(`Downlod JSON==>> Table Is Not Found`)
            return;
        }
        var jsonExportArray = this.toJson(table);

        var jsonContent = JSON.stringify(jsonExportArray);

        //Direct Download
        var encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(jsonContent);
        var fileName = `${document.title}_${BootstrapDateTimePickerService.getDateMeladyAr(new Date())}_JSON.json`;
        this.downlaod(encodedUri, fileName);

    }

    /**
     * Downlaod Table As CSV
     * @param {string} tableId
     */
    static tableCSVDownlaod(tableId, callBack) {
        var table = $(`#${tableId}`);

        if (table.length <= 0) {
            console.error(`Downlod CSV==>> Table Is Not Found`)
            callBack();
            return;
        }
        var cvsContent = this.toCsv(table);
        callBack();
        //Direct Download
        var encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(cvsContent);
        var fileName = `${document.title}_${BootstrapDateTimePickerService.getDateMeladyAr(new Date())}_CSV.csv`;
        this.downlaod(encodedUri, fileName);
    }


    static tableToClipboard(tableId, callBack) {
        let table = document.getElementById(tableId);
        if (!table)
        {
            console.error(`Copy ==>> Table Is Not Found`)
            callBack();
            return;
        }

        // create a Range object
        let range = document.createRange();
        // set the Node to select the "range"
        range.selectNode(table);
        // add the Range to the set of window selections
        window.getSelection().addRange(range);

        // execute 'copy', can't 'cut' in this case
        document.execCommand('copy');
        document.execCommand('copy');

        callBack();
        setTimeout(() => {
            window.getSelection().empty();
        }, 500);
    }

    /**
     * Convierte la tabla enviada a csv o texto
     * @param table
     * @returns {string}
     */
    static toCsv(table) {
        var output = "";


        //For If Arabic Content
        output += '\ufeff';

        var rows = table.find('tr').not('');

        var numCols = rows.first().find("td,th").not('').length;

        rows.each(function () {
            $(table).find("td,th").not('')
                .each(function (i, col) {
                    var column = $(col);

                    // Strip whitespaces
                    var content = $.trim(column.text());

                    output += SmsButtons.quote(content);
                    if (i !== numCols - 1) {
                        output += ',';
                    } else {
                        output += '\r\n';
                    }
                });
        });

        return output;
    }

    /**
            * Convierte la tabla enviada a json
            * @param el
            * @returns {{header: *, data: Array}}
            */
    static toJson(el) {

        var jsonHeaderArray = [];
        $(el).find('thead').find('tr').not('').each(function () {
            var tdData = "";
            var jsonArrayTd = [];

            $(this).find('th').not('').each(function (index, data) {
                if ($(this).css('display') != 'none') {
                    jsonArrayTd.push(SmsButtons.parseString($(this)));
                }
            });
            jsonHeaderArray.push(jsonArrayTd);

        });

        var jsonArray = [];
        $(el).find('tbody').find('tr').not('').each(function () {
            var tdData = "";
            var jsonArrayTd = [];

            $(this).find('td').not('').each(function (index, data) {
                if ($(this).css('display') != 'none') {
                    //jsonArrayTd.push(SmsButtons.parseString($(this)));
                    jsonArrayTd.push(SmsButtons.parseString($(this)));
                }
            });
            jsonArray.push(jsonArrayTd);
        });
        return { header: jsonHeaderArray[0], data: jsonArray };
    }

    /**
     * Replace Text
     * @param {any} text
     */
    static quote(text) {
        return '"' + text.replace('"', '""') + '"';
    }

    static parseString(data) {

        //if (defaults.htmlContent) {
        //    content_data = data.html().trim();
        //} else {
        var content_data = data.text().trim();
        // }
        return content_data;
    }

}//end class

SmsButtons.cssAr =
    `<style >
    html, body {
    font - size: 20px !important;
    font - weight: 600!important;
    direction: rtl  
}

</style >
    <link href="/assets/vendors/general/owl.carousel/dist/assets/owl.carousel.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/dropzone/dist/dropzone.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/summernote/dist/summernote.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/header/base/light.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/header/menu/light.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/brand/dark.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/aside/dark.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/assets/DEV_CSS/dev_AR.css" rel="stylesheet" type="text/css" />    <link href="/assets/vendors/custom/jstree/jstree.bundle.rtl.css" rel="stylesheet" />
    <link href="/assets/demo/default/base/style.bundle.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/Content/Site.ar.css" rel="stylesheet" />
`;
SmsButtons.cssEn = `<style >
    html, body {
    font - size: 20px !important;
    font - weight: 600!important;
    direction: ltr  
}

</style >
    <link href="/assets/vendors/general/owl.carousel/dist/assets/owl.carousel.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/dropzone/dist/dropzone.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/summernote/dist/summernote.css" rel="stylesheet" type="text/css" />
    <link href="/assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/header/base/light.ltr.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/header/menu/light.ltr.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/brand/dark.ltr.css" rel="stylesheet" type="text/css" />
    <link href="/assets/demo/default/skins/aside/dark.ltr.css" rel="stylesheet" type="text/css" />
    <link href="/assets/DEV_CSS/dev_En.css" rel="stylesheet" type="text/css" />    <link href="/assets/vendors/custom/jstree/jstree.bundle.rtl.css" rel="stylesheet" />
    <link href="/assets/demo/default/base/style.bundle.rtl.css" rel="stylesheet" type="text/css" />
    <link href="/Content/Site.en.css" rel="stylesheet" />
`;;