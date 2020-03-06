ngApp.directive('uploadFiles', function($compile) {
            return {
                restrict: 'E',
                replace: true,
                link: function($scope, element, attrs) {
                        element.html(
                                `
               <button  class="btn btn-dark btn-elevate btn-elevate-air" id="lastFileName"
                    style="width: 250px;"
                    onClick="$('#upFile').click()">
                    <i class="fa fa-file"></i>  ${Resources.chooesFile} 
               </button>
                        <input type="file"  
                                    id="upFile"
                                    class="custom-file-input ${attrs.ngUpClass}" 
                                    hidden
                                    accept="${attrs.ngUpAccept}" ${attrs.ngUpFilesCount > 1 ? `multiple` : ``}  
                                    onchange="updateFileName(this);angular.element(this).scope().upalodFiles(this.files,${attrs.ngUpData})"/>
`);
            //الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
            $compile(element.contents())($scope)
            window.updateFileName = function (elm) {
                var btn = document.getElementById("lastFileName");
                if (elm.files && elm.files.length == 0)
                    btn.innerHTML = '<i class="fa fa-file"></i> ' + Resources.chooesFile;
                else {
                    let name = elm.files[elm.files.length - 1].name;
                    btn.innerHTML = '<i class="fa fa-file"></i> ' + Resources.chooesFile + " " + name;

                }

            }
        },
    }
});