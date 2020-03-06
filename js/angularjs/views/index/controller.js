ngApp.controller('indexController', ['$scope', '$filter', function(s, filter) {

    const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
        "يوليو", "اغسطس", "سبتمبر", "اوكتوبر", "نوفمبر", "ديسمبر"
    ];

    //عدد الساعات الرسمية
    s.houresRequierd = 234;
    s.month = monthNames[new Date().getMonth()];
    s.employees = [];
    s.errors = [];

    //Upalod Files
    s.upalodFiles = files => {
        if (!files || files.length == 0) {
            s.employees = [];
            s.$apply();
        } else {
            s.selectedFile = files[0];
            document.title = s.selectedFile.name;
            new ExcelReader().read(s.selectedFile, (rows) => {
                s.fileRowsGrouped = s.groupBy(rows, 'Qrger - ورديات الموظفين');
                s.employees = [];

                //هنا سوف نخرج الاسماء منفردة لان كل اسم يكون بداخلة مصفوفة من حركات الدخول والخروج
                //تبداء تسجيل الموظفين من اول الرتبة 4
                Object.getOwnPropertyNames(s.fileRowsGrouped).
                forEach((name, index) => {

                    if (index < 4) return;
                    try {

                        let newEmp = {
                            employeeName: name,
                            branch: "",
                            hours: 0,
                            minutes: 0,
                            hourSalary: 0,
                            discount: 0,
                            totalBasicSalary: 0,
                            basicSalary: 0,
                            alternativeFoodSalary: 0,
                            totalOverHoursSalary: 0,
                        };


                        //Cult Hours And Minutes
                        s.fileRowsGrouped[name].forEach(v => {
                            newEmp.branch = v.__EMPTY;
                            newEmp.hours += +v.__EMPTY_4.split(':')[0];
                            newEmp.minutes += +v.__EMPTY_4.split(':')[1];
                        });

                        //Cult Minutes
                        newEmp.minutes = parseInt(newEmp.minutes / 60);
                        newEmp.totalBasicHours = newEmp.hours + newEmp.minutes;
                        newEmp.totalOverHours = s.toFixed(newEmp.totalBasicHours > s.houresRequierd ? newEmp.totalBasicHours - s.houresRequierd : 0);
                        // newEmp.totalOverHoursSalary = s.toFixed(newEmp.totalOverHours * newEmp.hourSalary);
                        // newEmp.totalBasicSalary = s.toFixed((newEmp.totalBasicHours - newEmp.totalOverHours) * newEmp.hourSalary);
                        newEmp.netSalry = s.toFixed((newEmp.totalOverHoursSalary + newEmp.totalBasicSalary) - newEmp.discount);
                        //Add Employee Details Now
                        s.employees.push(newEmp);
                    } catch (error) {
                        s.errors.push(`حدث خطاء ما عند محاولة الحساب للموظف ${name}`);
                    }


                });

                s.employeeSalariesFop = new FOP(s.employees.length);
                s.$apply();
            }, (error) => {
                alert(error)
            });
        }
    };

    //Re Calculate
    s.reCalculate = () => {
        s.employees.forEach(emp => {
            emp.totalOverHours = s.toFixed(emp.totalBasicHours > s.houresRequierd ? emp.totalBasicHours - s.houresRequierd : 0);
            emp.totalOverHoursSalary = s.toFixed(emp.totalOverHours * emp.hourSalary);
            emp.totalBasicSalary = s.toFixed(emp.basicSalary + emp.alternativeFoodSalary);
            emp.netSalry = s.toFixed((emp.totalOverHoursSalary + emp.totalBasicSalary) - emp.discount);
        });
    };


    //Group By
    s.groupBy = (xs, key) => {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    //Convert Big Decimal To Small Deciaml
    s.toFixed = decimalNumber => {
        return parseFloat(decimalNumber.toFixed(2))
    };

    //حساب سعر الساعة
    //سعر الساعة نحسبه كالتالي:(الراتب الأساسي/30 يوم)/8 ساعات في اليوم

    s.cultHoureSalary = emp => {
        emp.hourSalary = s.toFixed((emp.basicSalary / 30) / 8);
        s.reCalculate(emp);
    };


    //Print Employee Information
    s.print = employeePrinting => {

        SmsButtons.tablePrintV2(`
        <div class="container p-2" id="employeeInformation">
        <div class="jumbotron jumbotron-fluid" >
            <div class="container">
                <h1 class="display-4">راتب شهر ${s.month}</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-6">
                <p><b>اسم الموظف:</b> ${employeePrinting.employeeName}</p>
            </div>
            <div class="col-6">
                <p><b>الفرع:</b> ${employeePrinting.branch}</p>
            </div>
            <div class="col-6">
                <p><b>	الساعات:</b> ${employeePrinting.hours}</p>
            </div>
            <div class="col-6">
                <p><b>الدقائق:</b> ${employeePrinting.minutes}</p>
            </div>

            <div class="col-6">
                <p><b>اجمالى الساعات:</b> ${employeePrinting.totalBasicHours}</p>
            </div>
            <div class="col-6">
                <p><b>اجمالى ساعات الوقت الاضافى:</b> ${employeePrinting.totalOverHours}</p>
            </div>
            <div class="col-6">
                <p><b>	راتب الساعة:</b> ${filter('currency')(employeePrinting.hourSalary,'')}</p>
            </div>
            <div class="col-6">
                <p><b>راتب الساعات الاضافية:</b> ${filter('currency')(employeePrinting.totalOverHoursSalary,'')}</p>
            </div>
            <div class="col-6">
                <p><b>راتب الساعات الاساسية:</b> ${      filter('currency')(employeePrinting.totalBasicSalary,'')}</p>
            </div>
            <div class="col-6">
                <p><b>	خصم المكتب:</b> ${      filter('currency')(employeePrinting.discount,'')}</p>
            </div>
            <div class="col-6">
                <p><b>	الراتب المستحق:</b> ${      filter('currency')(employeePrinting.netSalry,'')}</p>
            </div>
        </div>
    </div>`)
    }


}]);