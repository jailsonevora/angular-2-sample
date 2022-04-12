angular.module("sgeApp").directive("tableExport", function () {
    return {
        templateUrl: "views/layout/tableExport.html",
        scope: {
            models: '<',
            labels: '<',
            structure: '<'
        },
        link: function (scope, element, attrs) {
            $(element).find('#btn-export').click(function () {
//                console.log(scope.fieldsToPrint);
//                console.log(scope.models);

                if (scope.exportFormat == 'pdf') {
                    var date = new Date();
                    var monthStr = (date.getMonth() + 1).toString();
                    var dayStr = date.getDate().toString();
                    var hourStr = date.getHours().toString();
                    var minuteStr = date.getMinutes().toString();
                    var month = monthStr.length == 1 ? '0' + monthStr : monthStr;
                    var day = dayStr.length == 1 ? '0' + dayStr : dayStr;
                    var hours = hourStr.length == 1 ? '0' + hourStr : hourStr;
                    var minutes = minuteStr.length == 1 ? '0' + minuteStr : minuteStr;

                    var url = window.location.protocol + '//' + window.location.hostname;

                    var par = '\n\nImprimido em ' + day + '/' + month + '/' + date.getFullYear()
                            + ' ás ' + hours + ':' + minutes + ' através do website ' + url + '\n\n\n';

                    var docDefinition = {
                        pageSize: 'A4',
                        pageOrientation: scope.pageOrientation,
                        footer: function (currentPage, pageCount) {
                            return {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'right',
                                margin: [30, 0]
                            };
                        },
                        header: {
                            text: 'Instituto Nacional de Estatísticas de Angola',
                            alignment: 'center',
                            margin: [35, 20]
                        },
                        content: [
                            {text: 'INE Angola', style: 'header'},
                            {text: par, style: 'paragraph'},
                            {
                                table: {
                                    headerRows: 1,
                                    body: [
                                    ]
                                }
                            }
                        ],
                        styles: {
                            header: {
                                fontSize: 20,
                                bold: true,
                                alignment: 'center',
                                marginTop: 40
                            },
                            paragraph: {

                            }
                        }
                    };

                    var headers = [];
                    angular.forEach(scope.fieldsToPrint, function (v, k) {
                        if (v)
                            headers.push(scope.labels[k][0]);
                    });

                    var values = [];
                    angular.forEach(scope.fieldsToPrint, function (f, kf) {
                        angular.forEach(scope.models, function (m, km) {
                            angular.forEach(m, function (v, ka) {
                                if (ka == kf && f) {
                                    if (values[km] == null)
                                        values[km] = [];
                                    if (v == null)
                                        v = '';
                                    else if (!isNaN(v))
                                        v = v.toString();
                                    values[km].push(v);
                                }
                            });
                        });
                    });
                    docDefinition.content[2].table.body.push(headers);
                    angular.forEach(values, function (v, k) {
                        docDefinition.content[2].table.body.push(v);
                    });

//                console.log(docDefinition.content[0].table.body);

//                // open the PDF in a new window
//                pdfMake.createPdf(docDefinition).open();
//                // print the PDF
//                pdfMake.createPdf(docDefinition).print();
//                // download the PDF
                    pdfMake.createPdf(docDefinition).download('export.pdf');
                } else if (scope.exportFormat == 'excel' || scope.exportFormat == 'csv') {

                    var data = [];
                    angular.forEach(scope.fieldsToPrint, function (f, kf) {
                        angular.forEach(scope.models, function (m, km) {
                            angular.forEach(m, function (v, ka) {
                                if (ka == kf && f) {
                                    if (data[km] == null)
                                        data[km] = {};
                                    if (v == null)
                                        v = '';
                                    else if (!isNaN(v))
                                        v = v.toString();
                                    data[km][scope.labels[kf][0]] = v;
                                }
                            });
                        });
                    });

//                    console.log(data);

                    var xls = new XlsExport(data);
                    if (scope.exportFormat == 'excel')
                        xls.exportToXLS('export.xls');
                    else if (scope.exportFormat == 'csv')
                        xls.exportToCSV('export.csv');
                }
            });
        }

    };



});