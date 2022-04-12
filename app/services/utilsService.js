angular.module("sgeApp").factory("UtilsService", function () {

    var _checkedDataMapping = function (data, checkedData) {
        var result = [];
        angular.forEach(data, function (v, k) {
            result[k] = false;
        });
        angular.forEach(data, function (d, k) {
            angular.forEach(checkedData, function (cd, mk) {
                if (d.cod == cd.cod)
                    result[k] = true;
            });
        });
        return result;
    };

    var _applyReferences = function (models, struct) {
        angular.forEach(models, function (model, k) {
            angular.forEach(struct, function (vv, kk) {
                if (kk.indexOf('.') != -1)
                    model[kk] = eval('model.' + kk);
            });
        });
//        console.log(models);
        return models;
    };

    var _tableStructure = function (label, model) {
//        console.log('TABLE STRUCTURE');
//        console.log(model);
        order = [];
        ref = [];
        result = {};
        angular.forEach(label, function (v, k) {
            if (k.indexOf('.') != -1)
                ref.push(k);
            else {
                i = 0;
                angular.forEach(model, function (mv, mk) {
                    if (k == mk)
                        order[i] = mk;
                    i++;
                });
            }
        });
//        console.log(order);
        angular.forEach(order, function (v, k) {
            result[v] = null;
        });
        angular.forEach(ref, function (v, k) {
            result[v] = null;
        });
        console.log('----');
        console.log(result);
        console.log('----');

        return result;
    };

    var _prepareSelectObj = function (arr, field) {
        angular.forEach(arr, function (objs, k) {
            angular.forEach(objs, function (v, kk) {
                if (kk == field) {
                    arr[k]['name'] = arr[k][kk];
                    delete arr[k][kk];
                } else if (kk != 'id')
                    delete arr[k][kk];
            });
        });
//        console.log(arr);
        return arr;
    };

    var _getQueryObj = function (obj) {
//        console.log(obj);
        query = {};
        angular.forEach(obj, function (collection, k) {
//            console.log(k);
            if (k == 'selectFields' && !angular.equals(collection, {}))
                angular.forEach(collection, function (v, kk) {
                    query[kk] = v.val;
                });
            else if (k == 'numericFields' && !angular.equals(collection, {}))
                angular.forEach(collection, function (v, kk) {
                    if (v.more != null)
                        query[kk_more] = v.more;
                    if (v.less != null)
                        query[kk_less]= v.less;
                    if (v.equal != null)
                        query[kk_equal]= v.equal;
                });
            else if (k == 'dateFields' && !angular.equals(collection, {}))
                angular.forEach(collection, function (v, kk) {
                    if (v.min != null)
                        query[kk_min]= v.min;
                    if (v.max != null)
                        query[kk_max]= v.max;
                });
            else if ((k == 'referenceFields' || k == 'referenceFieldsBig') && !angular.equals(collection, {}))
                angular.forEach(collection, function (v, kk) {
                    query[kk] = v.id;
                });
            else if (!angular.equals(collection, {}) && !angular.equals(collection, []))
                query[k] = collection;
        });
//        console.log(query);
        return query;
    };

    var _dateDisplay = function (dateStr, format) {
        date = new Date(dateStr);
        monthStr = (date.getMonth() + 1).toString();
        dayStr = date.getDate().toString();
        month = monthStr.length == 1 ? '0' + monthStr : monthStr;
        day = dayStr.length == 1 ? '0' + dayStr : dayStr;
        slashPos = format.indexOf('/');
        hyphenPos = format.indexOf('-');
        if (slashPos != -1) {
            join = '/';
            format = format.split('/');
        } else if (hyphenPos != -1) {
            join = '-';
            format = format.split('-');
        }
        result = [];
        angular.forEach(format, function (v, k) {
            if (v == 'yyyy')
                result.push(date.getFullYear());
            else if (v == 'mm')
                result.push(month);
            else if (v == 'dd')
                result.push(day);
        });

//        console.log(result.join(join));
        return result.join(join);
    };

    return {
        checkedDataMapping: _checkedDataMapping,
        tableStructure: _tableStructure,
        prepareSelectObj: _prepareSelectObj,
        getQueryObj: _getQueryObj,
        dateDisplay: _dateDisplay,
        applyReferences: _applyReferences
    };

});