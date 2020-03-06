var Defaults={
    takeForDisPlayItemsInTable:10
};

/**
	 * FOP : Filter OrderBy Paging
 *
 */
class FOP {

    reFop(itemsCount, takeItemsCount) {
        this.itemsCount = itemsCount >= 0 ? itemsCount : this.itemsCount;
        this.takeItemsCount = takeItemsCount || this.takeItemsCount;
        this.paging.pagination(this.itemsCount, this.takeItemsCount);
    }


    /**
     * 
     * @param {any} itemsCount
     * @param {any} currentPageNumber
     */
    reFopV2(itemsCount, currentPageNumber) {
        this.paging.currentPage = currentPageNumber;
        this.itemsCount = itemsCount;
        this.paging.pagination(this.itemsCount, this.takeItemsCount);
        this.paging.gotoPage(currentPageNumber, true);
    }
    

/**
 *  FOP : Filter OrderBy Paging
 * @param {number} itemsCount  عدد العناصر
 * @param {number} currentPageNumber عدد العناصر المراد عرضها فى الصفحة الواحدة
 * @param {number} limitPageNumbersTakeC عدد ارقام الصفح التى سوف تعرض للمستخدم للتنقل بينهم 
 * @param {number} limitPageNumbersSkipC عدد ارفام الصفحة التى سوف نتخطبها على المستخدم
*@param {takeItemsCount} takeItemsCount عدد العناصر المراد عرضعا فى الجدول لكل مرة

 */
     
    constructor(itemsCount, currentPageNumber, limitPageNumbersTakeC, limitPageNumbersSkipC, takeItemsCount) {
        //نقوم بـ التالى بحيث عند تزويد الداتا لا نرحع الى اول صفحة لا نثق عند آخر صفحة وايضا نظهر نفس مجموعة ارقام الصفح
        let currentPageNo = currentPageNumber || 1;
        let limitPageNumbersTake = limitPageNumbersTakeC || 5;
        let limitPageNumbersSkip = limitPageNumbersSkipC || 0;



        //count item show to in one page
        this.takeItemsCount = takeItemsCount|| Defaults.takeForDisPlayItemsInTable;
        //items count(length of array)
        this.itemsCount = itemsCount;
        //Paging
        this.paging = new Paging(1, this.takeItemsCount, this.takeItemsCount , itemsCount, currentPageNo, true, false, limitPageNumbersTake, limitPageNumbersSkip);
        //sort
        this.sort = new Sort(null, null);
    }
}
FOP.culonms = [];