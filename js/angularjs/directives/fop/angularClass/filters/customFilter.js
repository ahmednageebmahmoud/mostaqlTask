/*
فى هذة الفيلتر نقوم  بعمل فيلتر فقط للعناصر المعروضة

*/
ngApp.filter('customFilter', function($filter) {

    return function(items, condetion, fop, fopObjectName, scope) {
        if (!items || !condetion || !fopObjectName || !scope) {
            //نقوم بتحديث الصففحات وعدد ترقيم الصفحات وخلاقة 
            try {
                fop.reFop(items.length);
            } catch (e) {

            }
            return items;
        }

        //جلب الحصول على الذى فيط تعرض فى الجدول 
        fildesUsed = scope[`fildes_${fopObjectName}`];

        //اذا لم يكن هناك حقول فـ نرجع لـ الداتا مباشرة
        if (!fildesUsed) return items;
        let result = $filter('filter')(items, condetion, fildesUsed);
        fop.reFop(result.length);
        return result;
    };
});