/*
هذة فقط هى لكى تضع عنصر معين الى مكان معين 
*/

ngApp.directive('addNewElement', function ($compile) {
	return {

		restrict: 'E',
		template: $(`#addNewElementModel`).contents(),
		link: function ($scope, element, attrs) {
		},

	}
});

 