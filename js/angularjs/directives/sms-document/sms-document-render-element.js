
ngApp.directive('smsDocumentRenderElement', function ($compile) {
    return {
        restrict: 'E',
        //scope: {
        //    elements: '=ngSmsElements'
        //},
        replace: true,
        link: function ($scope, htmlElement, attrs) {
            let element = " ";

            //يتم النداء على هذة الوظيفةعند تحميل بيانات الطلب الى الصفخة 
            $scope.renderElement = () => {

                co("sms Document Render Element Calling", $scope.document.PageElements);
                if (!$scope.document.PageElements) return;

                //return if elemetns not found
                if (!$scope.document.PageElements) return;

                let take = 2, skip = 0;
                let onlyDispaly = attrs.smsIsDisabled || false;

                let elements = [];
                let elementsRichBox = [];

                //الان نضع الرتبة الاخاص بكل عنصر ونضعهم فى مكان جديد ليتم التعامل معة مباشرة
                $scope.document.PageElements.forEach((item, index) => {
                    item.index = index;

                    //فقط نضع العناصر العادية 
                    if (item.ElementTypeId != ElementTypesEnum.RichBox)
                        elements.push(item);
                    else //وهنا نضع عناصر الريتش بوكس
                        elementsRichBox.push(item);
                });

                //اولا نقوم بعرض العناصر العاديةوذالك لانها يمكن ن تقسم / 2
                {
                    // نحن نريد تقسيم العناصر /2 فلذاللك نقسم طول المصفوفة على 2 من اجل عملية التقطيع فيما بعد
                    let elementArrayLength = Math.ceil(elements.length / take);

                    for (var i = 1; i <= elementArrayLength; i++) {
                        if (onlyDispaly == 'true' || onlyDispaly == true)
                            element += drawElementsOnlyDispaly(elements.slice(skip, take));
                        else
                            element += drawElements(elements.slice(skip, take));

                        //نزيد قيمة التخطى بحيث نقفز الى مكان آخر عنصر تم تقطيعة
                        skip = take;
                        //نزيد قيمة التقطيع بـ الضعف لنحصل على وحدات جديدة
                        take += 2;
                    }
                }

                //الان نعرض العناصر الريتش بوكس وذالك لانها يجب ان تكون بعرض الصفحة 
                {
                    // نحن نريد تقسيم العناصر /2 فلذاللك نقسم طول المصفوفة على 2 من اجل عملية التقطيع فيما بعد
                    elementsRichBox.forEach(elm => {
                        if (onlyDispaly == 'true' || onlyDispaly == true)
                            element += drawElementsOnlyDispaly(elm, true);
                        else
                            element += drawElements(elm, true);
                    });
                }






                BootstrapDateTimePickerService.init();

                element += " ";
                // htmlElement.replaceWith(element)
                htmlElement.html(element)




                //الان نقوم نعطى امر للـ الانجلر لـ عمل كومبيل بشكل يدوى 
                $compile(htmlElement.contents())($scope);

                //من اجل تفعيل بوكس الكتابة 
                $('div[summernote]').summernote();


                //الان نضع القيم المسجلة من قبل داخل كل حقل
                $('div[document-element-index]')
                    .each((index, elm) => {

                        let lementIndex = Number($(elm).attr('document-element-index'));
                        $(elm).summernote('code', $scope.document.PageElements[lementIndex].Value)
                    });


            }//End Function



        }
    }
});








/**
 * render group elements
 * @param {Array} elements
 * @param {boolean} isElemetRichBox // for draw elemtn in col-lg-12

 */
function drawElements(elements, isElemetRichBox) {
    let pureElemets = "";


    if (isElemetRichBox) {
        pureElemets += `
				<!-- ${elements.ElementName} -->
				<label class="col-form-label  col-md-2">${elements.ElementName} ${elements.Properites.IsRequierd ? `<span class="red">*</span>` : ``} :</label>
					<div class="col-lg-10 col-md-10">${fillElementByElementType(elements)}</div>`;

    } else {

        /*
        الان ننشىء العناصر التى اتت لنا من اجل وضعها فى فورم جربو لوحدها
        */
        for (var elem of elements)
            pureElemets += `
				<!-- ${elem.ElementName} -->
				<label class="col-form-label  col-md-2">${elem.ElementName} ${elem.Properites.IsRequierd ? `<span class="red">*</span>` : ``} :</label>
					<div class="col-lg-4 col-md-4">${fillElementByElementType(elem)}</div>`;

    }
    return `<div class="form-group  row">${pureElemets}</div>`;
}


/**
 * fill elemtn by elemt type
 * @param {Object} elem
 */
function fillElementByElementType(elem) {
    let elemen = "",
        validtion = {

            isRequierd: elem.Properites.IsRequierd,
            minimumLength: elem.Properites.MinimumLength ? elem.Properites.MinimumLength : false,
            maximumLength: elem.Properites.MaximumLength ? elem.Properites.MaximumLength : false,
            valuesCount: elem.Properites.ValuesCount ? elem.Properites.ValuesCount : false,
            elementVlaidarionName: `smsElement_${elem.Id}`
        };

    switch (elem.ElementTypeId) {
        case ElementTypesEnum.text:
            {
                if (validtion.maximumLength >= 50 || (!validtion.minimumLength && !validtion.maximumLength))
                    elemen = `<textarea class="form-control input-small" style="height: 146px"
							name="${validtion.elementVlaidarionName}"
							placeholder="${Resources.enter} ${elem.ElementName}"
							ng-model="document.PageElements[${elem.index}].Value" 

							${validtion.minimumLength ? `ng-minlength="${validtion.minimumLength}"` : ``}	
							${validtion.maximumLength ? `maxlength="${validtion.maximumLength}" ng-maxlength="${validtion.maximumLength}"` : ``}	
							ng-required="${validtion.isRequierd}"
						></textarea>
						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}
							`;
                else
                    elemen = `<input type="text" class="form-control input-small" 
							name="${validtion.elementVlaidarionName}"
							placeholder="${Resources.enter} ${elem.ElementName}"
							ng-model="document.PageElements[${elem.index}].Value" 


								${validtion.minimumLength ? `ng-minlength="${validtion.minimumLength}"` : ``}	
							${validtion.maximumLength ? `maxlength="${validtion.maximumLength}" ng-maxlength="${validtion.maximumLength}"` : ``}	
							ng-required="${validtion.isRequierd}"
						/>
						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}
`
            } break;
        case ElementTypesEnum.number: {
            elemen = `<input type="number" class="form-control input-small"
							name="${validtion.elementVlaidarionName}"
							placeholder="${Resources.enter} ${elem.ElementName}"
							ng-model="document.PageElements[${elem.index}].Value" 
						 
							${validtion.minimumLength ? `min="${validtion.minimumLength}"` : ``}	
							${validtion.maximumLength ? `max="${validtion.maximumLength}"` : ``}	
							ng-required="${validtion.isRequierd}"
						/>
						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}
`
        } break;
        case ElementTypesEnum.select: {
            elemen =
                `<select  class="form-control input-small"  
							name="${validtion.elementVlaidarionName}" 
							ng-model="document.PageElements[${elem.index}].Value" 
							ng-options="gr.Id as gr.Name for gr in document.PageElements[${elem.index}].Items"
								ng-required="${validtion.isRequierd}"></select>
						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}

`;
        } break;
        case ElementTypesEnum.RichBox: {
            elemen =
                `<div id="summernote${elem.index}" name="${validtion.elementVlaidarionName}" summernote document-element-index="${elem.index}" ></div>`;
        } break;
        case ElementTypesEnum.chekcBox: {
            elemen =
                `
						
                        <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
                           <input type="checkbox"
							    name="${validtion.elementVlaidarionName}" 
								ng-model="document.PageElements[${elem.index}].Value"
								ng-required="${validtion.isRequierd}"
									/>
                            <span></span>
                        </label>
						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}

`;
        } break;
        case ElementTypesEnum.date: {
            elemen =
                `
	                        <div class="input-group date">
<div class="input-group-append">
														<span class="input-group-text">
															<i class="la la-calendar glyphicon-th"></i>
														</span>
													</div>
				            <input type="text" class="form-control datePicker" readonly="readonly" 
                            name="${validtion.elementVlaidarionName}"
							ng-model="document.PageElements[${elem.index}].Value" 
							ng-required="${validtion.isRequierd}"/>
													
												</div>


						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}

`



        } break;
        case ElementTypesEnum.time: {
            elemen = `<div class="input-group timepicker">
							<div class="input-group-prepend">
								<span class="input-group-text">
									<i class="la la-clock-o"></i>
								</span>
							</div>
							<input class="form-control timePicker" 
                                    readonly  type="text"
                                name="${validtion.elementVlaidarionName}"
						    	ng-model="document.PageElements[${elem.index}].Value" 
						    	ng-required="${validtion.isRequierd}" />
						</div>

						${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion)}
`
        } break;
        case ElementTypesEnum.file: {
            var fileType = FileTypesEnum.listFileTypes.find(c => c.Id == elem.Properites.FileTypeId);

            elemen = `<sms-upload-files 
						ng-sms-data="${elem.index}"
						ng-sms-class="form-control input-small" 
						ng-sms-files-count="${elem.Properites.ValuesCount}"
						ng-sms-accept="${FileTypesEnum.listFileTypes.find(c => c.Id == elem.Properites.FileTypeId).Extensions}"></sms-upload-files>


                    ${fillMeaagesValidation(elem.ElementName, elem.ElementTypeId, validtion, elem.index)}
						 
                            <div class="kt-portlet__body">
                                <div class="kt-section" ng-show="document.PageElements[${elem.index}].DocumentFiles.length>0&&documentIsUpdate">
									<span class="kt-section__info">
									</span>
									<div class="kt-section__content kt-section__content--solid">
										<p  ng-repeat="dFi in document.PageElements[${elem.index}].DocumentFiles"> <a href="/{{dFi.FileUrl}}" 
                                                       class="kt-link" 
                                           >${fileType.Name}</a></p>
									</div>
								</div>
               				 </div>
                     `
        } break;
    }
    return elemen;
}



/**
 * هذة الوظيفة تقوم بـ ارجاع عناصر التحققات  بـ الانجلر
 * @param {string} elementVlaidarionName

 */
function fillMeaagesValidation(elementName, elemTypeId, validtion, elmIndex) {
    switch (elemTypeId) {
        case ElementTypesEnum.text:
            return `
						<!--Errors:${elementName}-->
						<div>
							${validtion.isRequierd ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.required&&documentFrmErrorSubmit">${Resources.fieldIsRequierd}</small>
							`: ``}

							${validtion.minimumLength ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.minlength&&documentFrmErrorSubmit">${Resources.minLengthCharIs} ${validtion.minimumLength}</small>
							`: ``}

							${validtion.maximumLength ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.maxlength&&documentFrmErrorSubmit">${Resources.maxLengthCharIs} ${validtion.maximumLength}</small>
							`: ``}
						</div>
							`;

        case ElementTypesEnum.number:
            return `
						<!--Errors:${elementName}-->
						<div>
							${validtion.isRequierd ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.required&&documentFrmErrorSubmit">${Resources.fieldIsRequierd}</small>
							`: ``}

							${validtion.minimumLength ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.min&&documentFrmErrorSubmit">${Resources.minNumberIs} ${validtion.minimumLength}</small>
							`: ``}

							${validtion.maximumLength ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.max&&documentFrmErrorSubmit">${Resources.maxNumberIs} ${validtion.maximumLength}</small>
							`: ``}
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.number&&documentFrmErrorSubmit">${Resources.invalidData}</small>
						</div>
							`;
        case ElementTypesEnum.chekcBox:
            return `
						${validtion.isRequierd ? `
						<br>
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.required&&documentFrmErrorSubmit">${Resources.fieldIsRequierd}</small>

							`: ``}
`;

        case ElementTypesEnum.select:
        case ElementTypesEnum.date:
        case ElementTypesEnum.time:
            return `
						<!--Errors:${elementName}-->
						<div>
							${validtion.isRequierd ? `
							<small class="help-block" ng-if="documentFrm.${validtion.elementVlaidarionName}.$error.required&&documentFrmErrorSubmit">${Resources.fieldIsRequierd}</small>
							`: ``}
                            </div>
							`;

        case ElementTypesEnum.file:
            return `
						${validtion.isRequierd ? `
							<small class="help-block" ng-if="(!document.PageElements[${elmIndex}].DocumentFiles||document.PageElements[${elmIndex}].DocumentFiles.length==0)&&documentFrmErrorSubmit">${Resources.fieldIsRequierd}</small>
							`: ``}
                        ${validtion.valuesCount ? `
							<small class="help-block" ng-if="document.PageElements[${elmIndex}].DocumentFiles.length>${validtion.valuesCount}&&documentFrmErrorSubmit">${Resources.maxCountValues} ${validtion.valuesCount}</small>` : ``}
`;
        default: return "";
    }




}


/**
 * فقط من اجل عرض الحقول بدون امكانية التعديل
 * @param {any} elements
 */
function drawElementsOnlyDispaly(elements, isElemetRichBox) {

    let pureElemets = "";
    if (isElemetRichBox) {
        pureElemets += `
				<!-- ${elements.ElementName} -->
				<label class="col-form-label  col-lg-2 col-md-2">${elements.ElementName} :</label>
					<div class="col-lg-10 col-md-10">${fillElementByElementTypeOnlyDispaly(elements)}</div>`;
    } else {

        /*
        الان ننشىء العناصر التى اتت لنا من اجل وضعها فى فورم جربو لوحدها
        */
        for (var elem of elements)
            pureElemets += `
				<!-- ${elem.ElementName} -->
				<label class="col-form-label  col-lg-2 col-md-2">${elem.ElementName} :</label>
					<div class="col-lg-4 col-md-4">${fillElementByElementTypeOnlyDispaly(elem)}</div>`;
    }

    return `<div class="form-group  row">${pureElemets}</div>`;
}



/**
 * عرض الحقول بدون تعيدل اى لا نضع اى تحققات لـ الانجلر
 * @param {Object} elem
 */
function fillElementByElementTypeOnlyDispaly(elem) {
    let elemen = "",
        validtion = {
            maximumLength: elem.Properites.MaximumLength ? elem.Properites.MaximumLength : false,
            elementVlaidarionName: `smsElement_${elem.Id}`
        };

    switch (elem.ElementTypeId) {
        case ElementTypesEnum.text:
            {
                if (validtion.maximumLength >= 50 || (!validtion.minimumLength && !validtion.maximumLength))
                    elemen = `<textarea class="form-control input-small input-disabled" style="height: 146px"
							ng-model="document.PageElements[${elem.index}].Value" 
								disabled	
						></textarea>
							`;
                else
                    elemen = `<input type="text" class="form-control input-small input-disabled" 
							ng-model="document.PageElements[${elem.index}].Value" 
								disabled
						/>
`
            } break;
        case ElementTypesEnum.RichBox: {
            elemen = `${elem.Value}`
        } break;
        case ElementTypesEnum.number: {
            elemen = `<input type="number" class="form-control input-small input-disabled"
							ng-model="document.PageElements[${elem.index}].Value" 
								disabled
						/>
`
        } break;

        case ElementTypesEnum.select: {
                elemen =
                    `<input type="text" class="form-control input-small input-disabled"
							ng-model="document.PageElements[${elem.index}].ValueSelectDisplay" 
								disabled
						/>
                    `;
        } break;
        case ElementTypesEnum.chekcBox: {
            elemen =
                `
                      <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
                      <input type="checkbox" class="input-disabled"
			            					ng-model="${validtion.elementVlaidarionName}"
			            					ng-checked="document.PageElements[${elem.index}].Value"
			            					disabled
			            						/>
			            				 {{gr.GroupItemName}} 

                          <span></span>
                      </label>
   `;
        } break;
        case ElementTypesEnum.date: {
            elemen =
                ` 
	                        <div class="input-group date">
                            <div class="input-group-append">
														<span class="input-group-text">
															<i class="la la-calendar glyphicon-th"></i>
														</span>
													</div>
				            <input type="text" class="form-control datePicker" readonly="readonly" 
disabled
                            name="${validtion.elementVlaidarionName}"
							ng-model="document.PageElements[${elem.index}].Value" 
							ng-required="${validtion.isRequierd}"/>
													
												</div>



`

        } break;
        case ElementTypesEnum.time: {
            elemen = `<div class="input-group timepicker">
							<div class="input-group-prepend">
								<span class="input-group-text">
									<i class="la la-clock-o"></i>
								</span>
							</div>
							<input class="form-control timePicker" 
                               disabled     readonly  type="text"
                                name="${validtion.elementVlaidarionName}"
						    	ng-model="document.PageElements[${elem.index}].Value" 
						    	ng-required="${validtion.isRequierd}" />
						</div>

`
        } break;
        case ElementTypesEnum.file: {
            var fileType = FileTypesEnum.listFileTypes.find(c => c.Id == elem.Properites.FileTypeId);
            elemen = `
                        <div class="kt-portlet__body">
                            <div class="kt-portlet__body">
                                <div class="kt-section" ng-show="document.PageElements[${elem.index}].DocumentFiles.length>0">
									<span class="kt-section__info">
										
									</span>
									<div class="kt-section__content kt-section__content--solid">
										<p  ng-repeat="dFi in document.PageElements[${elem.index}].DocumentFiles"><a href="/{{dFi.FileUrl}}" 
                                                       class="kt-link" 
                                                      >${fileType.Name}</a></p>
									</div>
								</div>
               				 </div>
            			</div>
`
        } break;
    }
    return elemen;
}


//ng-model="document.PageElements[${elem.index}].DocumentElementGroupValues[0].GroupItemId"
