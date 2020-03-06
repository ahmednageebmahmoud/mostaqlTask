/*

هذة الديركتيف هى من اجل انشاء حقول الهيدر الخاص بـ الجداول من اجل عمل الترتيب
وفيما يلى المتطلبات المطلوبة لكى تعمل بشكل جيد

ng-sms-field-name : وهو اسم الحقل الذى هو موجود فى الاوبجكت من اجل عمل الترتيب
ng-sms-resource : اسم الحقل من المصادر 
ng-sms-class : css classes
ng-sms-fop : هذة الكلاس التى تحمل كل الوظائف التى تستخدم فى الترتيب والفيلتر وخلافة


Example full element
<sms-sort ng-sms-fop="groupFOP"
		  ng-sms-field-name="NameAr"
		  ng-sms-resource="@Resource.NameAr">
</sms-sort>
*/


ngApp.directive('smsSort', function ($compile) {
	return {
		restrict: 'E',
		replace: true,
		link: function ($scope, element, attrs) {
			let fopObjec = attrs.ngSmsFop;
			element.html(
				`<div class="sms-sort-field ${attrs.ngSmsClass}" 
			         ng-click="${fopObjec}.sort.sortBy('${attrs.ngSmsFieldName}')">${attrs.ngSmsResource} 
						<i class="sms-sort-arrow" ng-class="{'flaticon2-arrow-down':${fopObjec}.sort.ifSortClass('${attrs.ngSmsFieldName}',true),'flaticon2-arrow-up':${fopObjec}.sort.ifSortClass('${attrs.ngSmsFieldName}',false)}"></i>
				  </div>
				`);

            /*
            الان حتى نقوم بـ عملية فيلتر صحيحة .. فيجب تحديد الحقول فقط الذى سوف يحدث فبها الفيلتر فى الفيلتر الخاص بنا

            */
            if (!$scope[`fildes_${attrs.ngSmsFop}`])
                $scope[`fildes_${attrs.ngSmsFop}`] = [];
            if (attrs.ngSmsFieldName)
            $scope[`fildes_${attrs.ngSmsFop}`].push(attrs.ngSmsFieldName)
            
			//الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
			$compile(element.contents())($scope)
		}

	}
});