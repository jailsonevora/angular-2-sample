angular.module("sgeApp").factory("SessionService", function (User, Labels) {

//    console.log(localStorage[User.id]);

    var store = {};

    if (localStorage[User.id] == null) {
        console.log('localStorage undefined');
        clearAll();
    } else
        load();

    function clearAll() {
        store = {
            menu: {
                profile: 0
            },
            labels: Labels
        };
        save(store);
    };

    function saveLabels(labels) {
//        console.log('saving labels');
//        console.log(labels);
        store.labels = labels;
        save();
    }
    function getLabels() {
        return store.labels;
    }
    function saveSelectedProfile(i) {
        store.menu.profile = i;
        save();
    }
    function getSelectedProfile() {
        return store.menu.profile;
    }

    function save() {
        localStorage[User.id] = angular.toJson(store);
    }
    function load() {
        store = angular.fromJson(localStorage[User.id]);
    }

    return {
        saveSelectedProfile: saveSelectedProfile,
        getSelectedProfile: getSelectedProfile,
        saveLabels: saveLabels,
        getLabels: getLabels,
        getUser: User,
        clearAll: clearAll
    };

});