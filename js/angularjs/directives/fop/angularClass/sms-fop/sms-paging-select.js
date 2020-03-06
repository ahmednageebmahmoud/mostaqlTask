




/*
هذة الديركطتف هى المسؤلة عن ريم الفوتر الخاص بـ التصفح
وما يلى الاتربيوت المراد اضافتها فى الديركتيف

  
ng-sms-fop : هذة الكلاس التى تحمل كل الوظائف التى تستخدم فى الترتيب والفيلتر وخلافة 



example full element :
<sms-pageing-select ng-sms-fop="groupFOP"></sms-pageing-select>

*/

ngApp.directive('smsPagingSelect', function ($compile) {
	return {
		restrict: 'E',
		replace: true,
		link: function ($scope, element, attrs) {
			let fopObjec = attrs.ngSmsFop;
			element.html(
				`<div class="dataTables_length">
									<label>
										<select class="form-control input-sm" ng-model="${fopObjec}.takeItemsCount"
												ng-options="li.limit as li.name for li in ${fopObjec}.paging.pagingLimt.limitOptions"
												ng-change="${attrs.ngSmsFop}.paging.changeCountItemDisplaying(${fopObjec}.takeItemsCount)"></select>
									</label>
								</div>`);

			//الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
			$compile(element.contents())($scope)
		}

	}
});


 























































