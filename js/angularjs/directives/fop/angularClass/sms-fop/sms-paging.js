/*
هذة الديركطتف هى المسؤلة عن ريم الفوتر الخاص بـ التصفح
وما يلى الاتربيوت المراد اضافتها فى الديركتيف

  
ng-sms-fop : هذة الكلاس التى تحمل كل الوظائف التى تستخدم فى الترتيب والفيلتر وخلافة 


Example full Elemnt
<sms-pageing ng-sms-fop="groupFOP"
ng-sms-display-m-func
></sms-pageing>

*/

ngApp.directive('smsPaging', function ($compile) {
		return {
			restrict: 'E',
			replace: true,
			link: function ($scope, element, attrs) {
				let fopObjec = attrs.ngSmsFop;
                let displayMoreFunction = attrs.ngSmsDisplayMFunc;
                element.html(`
                        <div class="dataTables_wrapper dt-bootstrap4 no-footer">
                            <div class="row">
                                <div class="col-sm-12 col-md-5">
                                    <div class="dataTables_info"
                                         id="kt_table_2_info" role="status"
                                         aria-live="polite">${Resources.showing} {{${fopObjec}.paging.from}} ${Resources.to} {{${fopObjec}.paging.to}} ${Resources.of} {{${fopObjec}.paging.itemsCount}} ${Resources.item}</div>
                                </div>
                                <div class="col-sm-12 col-md-7">
                                    <div class="dataTables_paginate paging_simple_numbers" id="kt_table_2_paginate">
                                        <ul class="pagination float-right">
                                            <li class="paginate_button  page-item previous prev"  ng-class="{'disabled':!${fopObjec}.paging.allowPreviousPage}" ng-click="${fopObjec}.paging.gotoPreviousPage()"><a href=javascript:void(0) aria-controls="kt_table_2" data-dt-idx="0" tabindex="0" class="page-link">
                                            <svg xmlns="http://www.w3.org/2000/svg" style=" width: 8px;"  viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>
                                          </a></li>
                                        	<li class="paginate_button page-item "
                                                ng-repeat="pag in ${fopObjec}.paging.pages | limitTo:${fopObjec}.paging.limitPageNumbersTake:${fopObjec}.paging.limitPageNumbersSkip track by $index" ng-class="{'active':pag==${fopObjec}.paging.currentPage}">
                                                <a href=javascript:void(0) class="page-link" ng-click="${fopObjec}.paging.gotoPage(pag)">{{pag}}</a></li>

                                            <li class="paginate_button page-item next" id="kt_table_2_next" ng-class="{'disabled':!${fopObjec}.paging.allowNextPage}" ng-click="${fopObjec}.paging.gotoNextPage()">
                                                        <a href=javascript:void(0)  class="page-link">
                                                        <svg  xmlns="http://www.w3.org/2000/svg" style=" width: 8px;" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg>
                                                        </a></li>
											${displayMoreFunction ? `<li class="paginate_button page-item " ng-click="${displayMoreFunction}"><a class="page-link"> ${Resources.displayMore}</a></li>` : ``}
                                    

                                          </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`);


				//الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
				$compile(element.contents())($scope)
			}

		}
	});