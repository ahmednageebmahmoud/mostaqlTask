/*
من اجل اضافة ازر الطباعة وتحميل الايكسل ومربع البحث وخلافة

*/
/*
<button class="btn btn-secondary buttons-print" 
type="button" onClick="SmsButtons.tablePrint('${attrs.ngSmsTableid}')"><span>Print</span></button>

*/
ngApp.directive('smsButtonsSearch', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function($scope, element, attrs) {
            let fopObjec = attrs.ngSmsFop;
            element.html(
                ` <div class="row">
                                <!--Search-->
                            <div class="col-3 ">
                                <div class="dataTables_filter">
                                        <input type="search" class="form-control form-control-sm" 
                                               placeholder="${LangIsEn ? "Search iin  ..." : "بحث فى البيانات المسجلة ..."}" aria-controls="kt_table_1" ng-model="${attrs.ngSmsSearchModel}"/>
                                </div>
                            </div>
                            <div class="col-5 "></div>
                            <!--Print And More-->
                            <div class="col-4 ">
                                <div class="btn-group float-right" role="group" >
                                    <button class="btn btn-outline-dark   "                       type="button" ng-click="tableButons(1)">Print</button>
                                    <button class="btn btn-outline-dark   ${attrs.ngSmsTableid}"  type="button" ng-click="tableButons(2)" data-clipboard-target="#${attrs.ngSmsTableid}">Copy</button>
                                    <button class="btn btn-outline-dark   "                       type="button" ng-click="tableButons(3)">CSV</button>
                                    <button class="btn btn-outline-dark   "                       type="button" ng-click="tableButons(4)">Excel</button>
                                    <button class="btn btn-outline-dark   "                       type="button" ng-click="tableButons(5)">JSON</button> 
                                </div>
                            </div>
                        </div>`);


            //-+-+-+-+-+-+ Pint / Copy / CSV / Excel / Json -+-+-+-+-+-+-+-+
            $scope.tableButons = ptnType => {
                let firstRow = document.getElementById(attrs.ngSmsTableid).querySelector('tbody tr');
                if (!firstRow) {
                    //Show Alert
                    alert("لا يوجد داتا بعد");
                    return;
                }
                var fopObjectName = firstRow.getAttribute('ng-repeat').split(':')[2];


                //حفظ الاوبجكت بشكل موقت
                let oldLimit = {...$scope[fopObjectName].paging.pagingLimt };

                //تغير قيم التقطيع بحيث يظر الكل
                $scope[fopObjectName].paging.pagingLimt.take = null;
                $scope[fopObjectName].paging.pagingLimt.skip = 0;

                //نترك مدة قصير بحيث يكون الانجل خلص سم فى الصفوف
                setTimeout(() => {
                    switch (ptnType) {
                        case 1:
                            //نقوم الان بـ الطباعة
                            SmsButtons.tablePrint(attrs.ngSmsTableid, () => {
                                $scope[fopObjectName].paging.pagingLimt.take = oldLimit.take;
                                $scope[fopObjectName].paging.pagingLimt.skip = oldLimit.skip;
                                $scope.$apply();
                            });
                            break;
                        case 2:
                            //نقوم الان بـ النسخ
                            SmsButtons.tableToClipboard(`${attrs.ngSmsTableid}`, () => {
                                //ALert
                                alert('تم النسخ بنجاح .. يمكنك ان تلصقة الان فى الورد او فى ماكن آخر');

                                $scope[fopObjectName].paging.pagingLimt.take = oldLimit.take;
                                $scope[fopObjectName].paging.pagingLimt.skip = oldLimit.skip;
                                $scope.$apply();
                            });
                            break;
                        case 3:
                            //نقوم الان بـ التحويل
                            SmsButtons.tableCSVDownlaod(attrs.ngSmsTableid, () => {
                                $scope[fopObjectName].paging.pagingLimt.take = oldLimit.take;
                                $scope[fopObjectName].paging.pagingLimt.skip = oldLimit.skip;
                                $scope.$apply();
                            });
                            break;
                        case 4:
                            //نقوم الان بـ التحويل الى الايكسيل
                            SmsButtons.tableToExcel(attrs.ngSmsTableid, () => {
                                $scope[fopObjectName].paging.pagingLimt.take = oldLimit.take;
                                $scope[fopObjectName].paging.pagingLimt.skip = oldLimit.skip;
                                $scope.$apply();
                            });
                            break;
                        case 5:
                            //نقوم الان بـ التحويل الى جيسون
                            SmsButtons.tableToJson(attrs.ngSmsTableid, () => {
                                $scope[fopObjectName].paging.pagingLimt.take = oldLimit.take;
                                $scope[fopObjectName].paging.pagingLimt.skip = oldLimit.skip;
                                $scope.$apply();
                            });
                            break;
                    }
                }, 200)
            };

            //الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
            $compile(element.contents())($scope)
        }

    }
});