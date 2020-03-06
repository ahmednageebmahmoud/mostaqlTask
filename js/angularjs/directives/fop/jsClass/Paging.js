/**
* هذة الكلاس هيا مهمتها القيام بعمليات التقسيم للعناصر والتنقل بين الصفح وخلافة من هذا القبيل
 *
 */
class Paging {

    //change count item displayed 
    changeCountItemDisplaying(countTake) {
        //if NaN or null means he wants to display all the items
        if (!countTake)
            countTake = this.itemsCount;

        this.takeItemsCount = countTake;
        //change limit items
        this.pagingLimt.skip = 0;
        this.pagingLimt.take = countTake;

        //reset pages number
        this.pagination(this.itemsCount, countTake);

        //got page number 1
        this.gotoPage(1, true);
    };

    //go to page by page number 
    gotoPage(pageNum, resetPages) {
        //Now we calculate and for limit items 
		/*
		The equation:
		vrtialTake =  pageNum * currentTake
		Skip =vrtialTake-  currentTake
		*/

        var vrtialTake = pageNum * this.takeItemsCount;
        this.pagingLimt.skip = vrtialTake - (this.takeItemsCount);

        //change paging lable
        this.resetPaging(pageNum, resetPages);
    };

    //change Paging numbers 
    resetPaging(pageNum, resetPages) {
        //reset page num to default if falsy
        if (!pageNum )
            pageNum = 1;


        var vrtialTo = pageNum * this.pagingLimt.take;

        //rewset showing for lable
        this.to = vrtialTo > this.itemsCount ? this.itemsCount : vrtialTo;
        if (this.itemsCount == 0)
            this.from = 0;
        else
        this.from = this.pagingLimt.skip + 1;

        //reset allow buttons newxt and Previous
        this.allowNextPage = pageNum + 1 <= this.pages.length;
        this.allowPreviousPage = pageNum - 1 >= 1;

        if (resetPages) {
            this.limitPageNumbersTake = 5;
            this.limitPageNumbersSkip = 0;
        }

        //reset showing pages number
        if (this.pages.length + 1 != this.limitPageNumbersTake) {

            //الغرض هوا جلب نفس مجموعة الصفح الذى تعرض الان
            var pagesVrtial = [...this.pages].splice(this.limitPageNumbersSkip, this.limitPageNumbersTake);
            //نتحقق هل الرقم الصفحة التى بعد بعد صفحة المستخدم موجود ام لاء وفى هذة الحالة هوا يذهب للامام 
            var findNextPageIndex = pagesVrtial.findIndex(p => p == pageNum + 1);
            //  نتحقق هل الرقم الصفحة التى قبل قبل صفحة المستخدم موجود ام لا وفى هذة الحالة هوا يرجع للخلف 
            var findPreviousIndex = pagesVrtial.findIndex(p => p == pageNum - 1);

            //اذا كانت ليست موجود والصفحة هى ليست آخر صفحة نزيد معدل الاخفاء عرض الصفح 
            if (findNextPageIndex == -1 && this.allowNextPage)
                this.limitPageNumbersSkip += 2;
            //اذا كانت الصفحة السابقة والصفحة هى ليست اول صفحة ليست موجودة ننقص معدل الاخفاء
            else if (findPreviousIndex == -1 && this.allowPreviousPage)
                this.limitPageNumbersSkip -= 2;
        }

        //set current page for active class
        this.currentPage = pageNum;

    };

    //Go next Page
    gotoNextPage() {
        if (this.allowNextPage)
            this.gotoPage(this.currentPage + 1);
    };

    //Go previous Page
    gotoPreviousPage() {
        if (this.allowPreviousPage)
            this.gotoPage(this.currentPage - 1);
    };


	/**
	* هذة الوظيفة من اجالة اعادة انشاء ترقيم الصفحات
	*  ستم النداء عليها فى حالة زيادة او نقصان عدد العناصر
	 * @param {Number} itemsCount عدد العناصر
	 * @param {Number} currentTake عدد العناصر المراد عرضها فى الصفحة الواحدة
	 */
    pagination(itemsCount, currentTake) {
    
		/*
	The equation:
	pagesCount= itemsCount / currentTake;
	*/
        this.itemsCount = itemsCount;
        if (!currentTake)
            currentTake = this.itemsCount;
        var pages = [];

        if (itemsCount == 0) {
            this.pages = pages;
            this.resetPaging(1);

        } else {
            var pagesCount = itemsCount / currentTake;
            for (var i = 0; i < pagesCount; i++) {
                pages.push(i + 1);
            }
            this.pages = pages;
            this.resetPaging(this.currentPage);
        }




    }

	/**
	 * هذة الكلاس هيا مهمتها القيام بعمليات التقسيم للعناصر والتنقل بين الصفح وخلافة من هذا القبيل
	 * @param {Number} from من
	 * @param {Number} to الى 
	 * @param {Number} countItems جميع عدد العناصر
	 * @param {Number} currentPage رقم الصفحة الحالية
	 * @param {bool} allowNextPage السماح بتفعيل زر الصفحة القادة
	 * @param {bool} allowPreviousPage السماح بتفعيل زر الصفحة السابقة
    	* @param {number} limitPageNumbersTakeC عدد ارقام الصفح التى سوف تعرض للمستخدم للتنقل بينهم
     * @param {number} limitPageNumbersSkipC عدد ارفام الصفحة التى سوف نتخطبها على المستخدم
	 * @param {Number[]} pages ارقام الصفح
	 * @param {PagingLimt} pagingLimt الحدود
		
	 */
    constructor(from, to, takeItemsCount, itemsCount, currentPage, allowNextPage,
        allowPreviousPage, limitPageNumbersTake, limitPageNumbersSkip) {
        this.from = from;
        this.to = to;
        this.takeItemsCount = takeItemsCount;
        this.itemsCount = itemsCount;
        this.currentPage = currentPage;
        this.allowNextPage = allowNextPage;
        this.allowPreviousPage = allowPreviousPage;
        this.limitPageNumbersTake = limitPageNumbersTake;
        this.limitPageNumbersSkip = limitPageNumbersSkip;
        this.pagingLimt = new PagingLimt(0, takeItemsCount, Resources.all);;
        this.pagination(itemsCount, takeItemsCount);

    }
}