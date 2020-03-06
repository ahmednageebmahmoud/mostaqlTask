
var currentControler = getcurrentController().toLocaleLowerCase();
var windwoPathName = window.location.pathname;

var breadcrumbConfig = Object.assign({
    pageParentId: null,//For Pages Not Not Inserted In Menu Like ~/SMSERP/Views/Student/Create.cshtml
    pageParentUrl: null,  //For Pages Not Not Inserted In Menu He Have GrandFather Like ~/SMSERP/Views/OnlineExams/GeneralExam.cshtml
  
    activePage: null,
    activeSubMenu: null,
    activeMenu: null,
}, breadcrumbConfig);

ngApp.directive('smsDrawMenu', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function ($scope, element, attrs) {
            $scope.$watch('menus', function () {
                if (!Array.isArray($scope.menus))
                    return;

                //Load Page And Menu And Sub Menu Actice
                laodPageAndMenueAndSubMenuForActive();

                //Draw Menu
                let menu = "";
                $scope.menus.forEach(men => {
                    menu += drawMenu(men);
                });

                //Draw Breadcrumbs
                drawBreadcrumbs();


                element.replaceWith(menu.replace("\n", ""));
                $compile(element.contents())($scope);

            });
        },
    }
});

/**
 * هنا نقوم برسم جميع القوائم
 * @param {any} menus
 */
function drawMenu(menu, isSub) {

    let subMenus = [];
    if (Array.isArray(menu.SubMenus)) {
        menu.SubMenus.forEach(subMenu => subMenus.push(drawMenu(subMenu, true)));

    }
    var subMeusString = "";
    var cssClass = menu.SubMenus.length > 0 ? "kt-menu__item--parent" : "kt-menu__item--submenu";

    if (menu.SubMenus.length > 0)
        subMeusString = `<div class="kt-menu__submenu "><span class="kt-menu__arrow"></span> <ul class="kt-menu__subnav">${subMenus.join('')}</ul></div>`;


    var pureMenu = `<li class="kt-menu__item ${cssClass} ${getMenuActivClass(menu.Id)}"
                        aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                        <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                          <span class="kt-menu__link-icon">
                              <i class="${menu.CssClass}"></i>
                          </span>
                           <span class="kt-menu__link-text">${menu.Name}</span>
                          ${menu.Counter > 0 ? `<span class="kt-menu__link-badge"><span class="kt-badge kt-badge--rounded kt-badge--brand">${menu.Counter}</span></span>` : ``}
                           <i class="kt-menu__ver-arrow la la-angle-right"></i>
                        </a>
                          ${subMeusString}
                        ${drawPages(menu.Pages)}
                    </li>
           `;


    return pureMenu;

}


/**
 * هذة الدالة لرسم الصفح
 * @param {any} pages
 */
function drawPages(menusPages) {
    if (!Array.isArray(menusPages))
        return;

    var pages = "";
    menusPages.forEach(pg => {
        pages += `
                 <li class="kt-menu__item ${getPageActivClass(pg.Id)} " aria-haspopup="true">
                     <a href="${pg.Url}" class="kt-menu__link ">
                         <i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                         <span class="kt-menu__link-text">${pg.Name}</span>
                     </a>
                 </li>
        `;
    });

    return `
            <div class="kt-menu__submenu ">
                 <span class="kt-menu__arrow"></span>
                 <ul class="kt-menu__subnav">${pages}</ul>
            </div>
            `;
}


/**
 * الحصول على كلاس الاكتيف اذا كانت المنيو مفعلة
 * @param {any} menuId
 */
function getMenuActivClass(menuId) {

    if ((breadcrumbConfig.activeMenu && breadcrumbConfig.activeMenu.Id == menuId) || (breadcrumbConfig.activeSubMenu && breadcrumbConfig.activeSubMenu.Id == menuId))
        return 'kt-menu__item--open';
    else
        return "";
}

/**
 * الحصول على كلاس الاكتيف للصفح
 * @param {any} pageId
 */
function getPageActivClass(pageId) {
    if (breadcrumbConfig.activePage && breadcrumbConfig.activePage.Id == pageId)
        return 'kt-menu__item--open';
    else
        return "";
}


/**
 * رسم مسار الصفحة

 */
function drawBreadcrumbs() {
    //Check If No Active Menu ... check if this page not static
    if (!breadcrumbConfig.activeMenu)
        return;

    let breadcrumb = document.querySelector('#kt_subheader .kt-subheader__breadcrumbs');
    let childrenCopy = [...breadcrumb.children];
    let newBreadcrumbs = "";

    //Remove All Children
    breadcrumb.innerHTML = "";


    //Append Basic Element (Home Page)
    newBreadcrumbs = `
        <a href= "/" class="kt-subheader__breadcrumbs-home" > <i class="flaticon-home"></i></a>
            <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="/" class="kt-subheader__breadcrumbs-link">${Resources.homePage}</a>
         `;

    //Add Menu  
    newBreadcrumbs += `
        <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="javascript:void(0)" class="kt-subheader__breadcrumbs-link">${breadcrumbConfig.activeMenu.Name}</a>
        `;

    //Add Sub Menu  
    if (breadcrumbConfig.activeSubMenu)
        newBreadcrumbs += `
        <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="javascript:void(0)" class="kt-subheader__breadcrumbs-link">${breadcrumbConfig.activeSubMenu.Name}</a>
        `;

    //Add Page
    if (breadcrumbConfig.activePage)
    newBreadcrumbs += `
        <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="${breadcrumbConfig.activePage.Url}" class="kt-subheader__breadcrumbs-link">${breadcrumbConfig.activePage.Name}</a>
        `;

    //Append Basic Element (Home Page)
    breadcrumb.insertAdjacentHTML('afterbegin', newBreadcrumbs);

    //Check If We Must Be Ad Last Breadcrumb
    if (breadcrumbConfig.pageParentId) {
        breadcrumb.insertAdjacentHTML('beforeend', '<span class="kt-subheader__breadcrumbs-separator"></span>');

        breadcrumb.appendChild(childrenCopy[childrenCopy.length - 2]);
        breadcrumb.appendChild(childrenCopy[childrenCopy.length - 1]);
    }

    //Active Last Breadcrumb
    activeLastBreadcrumb();

}

/**
 * Active Last Breadcrumb
 */
function activeLastBreadcrumb() {
    $(".kt-subheader__breadcrumbs a").last().addClass('kt-subheader__breadcrumbs-link--active')
}


/**
 * Laod Page And Menue And Sub Menu For Active By Url or Page Paretn Id
*وهناك صفح غير موضوعة فى المنيو مثل صفحةاضافة طالب لانها تفتح من شاشة الطلاب وليس من المنيو
* اذا يجب مع هذةالصفحات رسم مسار الشاشة بنائ على الشاشة الرئيسية
 */
function laodPageAndMenueAndSubMenuForActive() {

    
    if (breadcrumbConfig.pageParentUrl) {
        //Load By Page Parent Id For Pages Not Imported In Menu
        //Load Page And Menu And Sub Menu
        LocalStorageService.menus.forEach(menu => {
            //Check If We Fined Page ...Must Be Sope 
            if (breadcrumbConfig.activePage)
                return;

            //Load Page From Sub Menu Fro This Menu
            if (menu.SubMenus)
                menu.SubMenus.forEach(sbMenu => {
                    if (breadcrumbConfig.activePage)
                        return;
                    //Load Page
                    breadcrumbConfig.activePage = sbMenu.Pages.find(page => page.Url == breadcrumbConfig.pageParentUrl);
                    //If Fined Page .. Must be Loaed Current Meun And Sub Menu
                    if (breadcrumbConfig.activePage) {
                        breadcrumbConfig.activeMenu = menu;
                        breadcrumbConfig.activeSubMenu = sbMenu;
                    }
                });

            //Load Menu Fom Direct Pages
            if (!breadcrumbConfig.activePage) {
                //Load Page
                breadcrumbConfig.activePage = menu.Pages.find(page => page.Url == breadcrumbConfig.pageParentUrl);
                //If Fined Page .. Must be Loaed Current Meun
                if (breadcrumbConfig.activePage)
                    breadcrumbConfig.activeMenu = menu;
            }
        });
    } else
    if (breadcrumbConfig.pageParentId) {
        //Load By Page Parent Id For Pages Not Imported In Menu
        //Load Page And Menu And Sub Menu
        LocalStorageService.menus.forEach(menu => {
            //Check If We Fined Page ...Must Be Sope 
            if (breadcrumbConfig.activePage)
                return;

            //Load Page From Sub Menu Fro This Menu
            if (menu.SubMenus)
                menu.SubMenus.forEach(sbMenu => {
                    if (breadcrumbConfig.activePage)
                        return;
                    //Load Page
                    breadcrumbConfig.activePage = sbMenu.Pages.find(page => page.Id == +breadcrumbConfig.pageParentId);
                    //If Fined Page .. Must be Loaed Current Meun And Sub Menu
                    if (breadcrumbConfig.activePage) {
                        breadcrumbConfig.activeMenu = menu;
                        breadcrumbConfig.activeSubMenu = sbMenu;
                    }
                });

            //Load Menu Fom Direct Pages
            if (!breadcrumbConfig.activePage) {
                //Load Page
                breadcrumbConfig.activePage = menu.Pages.find(page => page.Id == +breadcrumbConfig.pageParentId);
                //If Fined Page .. Must be Loaed Current Meun
                if (breadcrumbConfig.activePage)
                    breadcrumbConfig.activeMenu = menu;
            }
        });
    } else {
        //Load By Page Url

        //Load Page And Menu And Sub Menu
        LocalStorageService.menus.forEach(menu => {
            //Check If We Fined Page ...Must Be Sope 
            if (breadcrumbConfig.activePage)
                return;

            //Load Page From Sub Menu Fro This Menu
            if (menu.SubMenus)
                menu.SubMenus.forEach(sbMenu => {
                    if (breadcrumbConfig.activePage)
                        return;
                    //Load Page
                    breadcrumbConfig.activePage = sbMenu.Pages.find(page => page.Url == windwoPathName);
                    //If Fined Page .. Must be Loaed Current Meun And Sub Menu
                    if (breadcrumbConfig.activePage) {
                        breadcrumbConfig.activeMenu = menu;
                        breadcrumbConfig.activeSubMenu = sbMenu;
                    }
                });

            //Load Menu Fom Direct Pages
            if (!breadcrumbConfig.activePage) {
                //Load Page
                breadcrumbConfig.activePage = menu.Pages.find(page => page.Url == windwoPathName);
                //If Fined Page .. Must be Loaed Current Meun
                if (breadcrumbConfig.activePage)
                    breadcrumbConfig.activeMenu = menu;
            }
        });
    }
}
 