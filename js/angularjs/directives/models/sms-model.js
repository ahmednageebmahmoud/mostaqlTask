/*
هذة فقط هى لكى تضع عنصر معين الى مكان معين 
*/


ngApp.directive('smsModel', function ($compile) {
    return {

        restrict: 'E',
        template: $(`#smsModel`).contents(),
        link: function ($scope, element, attrs) {
        },

    }
});


