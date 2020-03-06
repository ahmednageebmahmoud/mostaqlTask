class DateTimeService {
    /**
     * سوف تقوم بتحويل التاريخ على حسب اللغة الحالية .... بمعنى اذا اللغة عربى سوف يكون التاريخ هجرى
     * @param {any} date
     */
    static getDate(date) {
        date = date || new Date();
        if (LangIsEn) {
            return date.toLocaleDateString('us-en')

        } else {
            return date.toLocaleDateString('ar-sa');
        }
    }

    /**
     * سوف تقوم بتحويل التاريخ على حسب اللغة   .... بمعنى اذا اللغة عربى سوف يكون التاريخ هجرى
     * @param {any} date التاريخ المراد تحويلة واذا لم يكن فسوف يكون التاريخ الحالى
     * @param {any} isEn اللغة
     */
    static getDateByCulture(date, isEn) {
        date = date || new Date();
        if (isEn) {
            return date.toLocaleDateString('us-en')
        } else {
            return date.toLocaleDateString('ar-sa');
        }
    }

    /**
     * نقوم بـ ارجاع التاريخ بـ الفورمات النجليزى على اى حال
     * @param {any} javascriptDate
     */
    static getEnglishDate(javascriptDate) {
        var date = new Date(javascriptDate);
        return date.toLocaleDateString('ar-sa');
    }

    /**
     * تحويل التاريخ ال هجرى بواسطة السيرفر
     * @param {any} date
     * @param {any} format
     * @param {any} callBack
     */
    static convertToHijriOrContrary(date, format, isFromMeladyToHijri, callBack) {
        $.ajax({
            type: "Get",
            url: "/DateConfigure/ConvertToHijriOrContrary",
            data: {
                'dateTarget': date,
                'formatInOut': format,
                'isFromMeladyToHijri': isFromMeladyToHijri,
            },
            success: function (data) {
                callBack(data);
            }
        });
    }

 
    ToHijri


}