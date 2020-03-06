
ngApp.directive('number', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                 

                ctrl.$parsers.push(function (input) {
                    if (input == undefined) return ''
                     
                    var inputNumber = input.toString().replace(/[^0-9]/g, '');
                    if (inputNumber != input) {
                        ctrl.$setViewValue(inputNumber);
                        ctrl.$render();
                    }
                    return inputNumber;
                });
            }
        };
    });

//app.directive('number', function () {
//    return {
//        restrict: 'A',
//        link: function (scope, elm, attrs, ctrl) {
//            elm.on('keydown', function (event) {
//                if ([110, 190].indexOf(event.which) > -1) {
//                    // dot and numpad dot
//                    event.preventDefault();
//                    return false;
//                }
//                else {
//                    return true;
//                }
//            });
//        }
//    }
//});

//app.directive("number", function () {
//    return {
//        restrict: "A",
//        link: function (scope, element, attrs) {
//            element.bind("keydown", function (event) {
//                if (event.keyCode == 8) {
//                    return false;
//                } else if (!(event.keyCode > 47 && event.keyCode < 58) || event.shiftKey) {
//                    event.preventDefault();
//                    return false;
//                }
//            });



//        }
//    }
//});