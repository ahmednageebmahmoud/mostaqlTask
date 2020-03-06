 

class BootstrapDateTimePickerService {
    //See More : /assets/app/custom/general/crud/forms/widgets/bootstrap-datepicker.js

    //genalral Format
    static get dateFormat() { return current_DateFormat.toLowerCase() }// LangIsEn ? "dd/mm/yyyy" : "yyyy/mm/dd" };


    /**
     * Initialize All Inputs
     */
    static init(timer) {
        setTimeout(() => {

            $('.datePicker').datepicker({
                format: this.dateFormat,
                todayHighlight: true,
                autoclose: true,
                startView: 0,
                minView: 2,
                forceParse: 0,
                pickerPosition: 'bottom-left',
            });

            $('.timePicker').timepicker({
                format: 'hh:mm',
                timeFormat: 'hh:mm',//LangIsEn ? "hh:mm" : "hh:mm",
                minuteStep: 1,
                defaultTime: '',
                showSeconds: false,
                showMeridian: false,
                snapToStep: true,

            });
        }, timer || 1000);
    }


    /**
     * Init Date Picker With Set Start Date
     * @param {any} timer
     * @param {any} startDate
     */
    static initDatePickerStartDate(timer, startDate) {
        setTimeout(() => {
            $('.datePicker').datepicker({
                format: this.dateFormat,
                todayHighlight: true,
                autoclose: true,
                startView: 0,
                minView: 2,
                forceParse: 0,
                startDate: startDate || '+1d',// 'd' (day), 'w' (week), 'm' (month), and 'y' (year).
                pickerPosition: 'bottom-left'
            });
        }, timer || 1000);
    }

    /**
    * Init Date Picker With Set End Date
    * @param {any} timer init after timer
    * @param {any} endDate
    */
    static initDatePickerEndDate(timer, endDate) {
        setTimeout(() => {
            $('.datePicker').datepicker({
                format: this.dateFormat,
                todayHighlight: true,
                autoclose: true,
                startView: 0,
                minView: 2,
                forceParse: 0,
                endDate: endDate || '+0d',// 'd' (day), 'w' (week), 'm' (month), and 'y' (year).
                pickerPosition: 'bottom-left',

            });
        }, timer || 1000);
    }

    /**
     * Initialize Date Picker For Specific Element
     * @param {any} elementId Elemnt Id For Jquery Selector
     * @param {any} timer Initialize After Timer Or One Second Default
     * @param {any} lang Calender Language
     * @param {any} endDate Cutom End Date Can Be Selected Or End Date Current Date
     */
    static initDatePickerDateSpecific(elementId, timer, lang, setDate, endDate) {
        setTimeout(() => {
            $(`#${elementId}`).datepicker({
                format: this.dateFormat,
                todayHighlight: (lang && lang != 'en') ? false : true,
                autoclose: true,
                startView: 0,
                minView: 2,
                forceParse: 0,
                endDate: endDate || '+0d',// 'd' (day), 'w' (week), 'm' (month), and 'y' (year).
                pickerPosition: 'bottom-left',
                language: lang || 'en',
            });
        }, timer || 1000);
    }


    static updateDatePickerDateSpecific(elementId,newDate)
    {
        $(`#${elementId}`).datepicker('update', newDate);
    }

    /**
     * Get Data Now as dd/mm/yyy
     */
    static getDateEnglishArNoe() {
        let fullDate = new Date();
        return `${fullDate.getFullYear()}/${fullDate.getMonth() + 1}/${fullDate.getDate()}`
    }

    /**
     * الحصول على التاريخ الميلادى بـ فورمات الاجنبى
    * dd/mm/yyyy
     * @param {any} fullDate
     */
    static getDateMeladyEn(fullDate, mothPluth) {
        if (!fullDate) return '';

        return `${fullDate.getDate()}/${fullDate.getMonth() + mothPluth}/${fullDate.getFullYear()}`
    }

    /**
     * الحصول على التاريخ الميلادى بـ فورمات العربى
    * yyyy/mm/dd
     * @param {any} fullDate
     */
    static getDateMeladyAr(fullDate) {
        if (!fullDate) return '';
        return `${fullDate.getFullYear()}/${fullDate.getMonth() + 1}/${fullDate.getDate()}`
    }

    /**
     * الحصول على التاريخ بـ الفورمات الانجليزى الاساسى
    * mm/dd/yyyy
     * @param {any} fullDate
     */
    static getDateMeladyBasicFormat(fullDate) {
        if (!fullDate) return '';
        return `${fullDate.getMonth() + 1}/${fullDate.getDate()}/${fullDate.getFullYear()}`
    }



    /**
     * اذا كان الموقع بـ الانجليز فان التاريخ يكون فى الديت بيكر  يوم/شهر/سنة اى مثلا 2020/1/16
     * فبذالك فان السيرفر لن يقرءه ويعتبر انة لم يتم ارسال تاريخ
    اذا يجب تحويل الى الفورمات الانجليزى الاساسسى
    * Full Demo ~\Scripts\angularJS\views\studentsAffairsReport\StudentStrength\controllert.js
     * @param {any} angularModalName اسم المودل فى الانجلر
     */
    static getDateBasicFormatForSavePassingToServer(angularModalName)
    {
        var date = $(`[ng-model="${angularModalName}"]`).datepicker("getDate");

        if (!date ) return "";

        if (LangIsEn)
            return BootstrapDateTimePickerService.getDateMeladyBasicFormat(date);
        else
            //فى حالة العربى ام نرجع الفيمة الحالية او نقوم بـ تحويلها الى الفورامت الذى يعرفة السيرفر فى الغة العربية 
            return BootstrapDateTimePickerService.getDateMeladyAr(date);

    }


}
