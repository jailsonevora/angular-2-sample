setTimeout(function () {
    importScripts();
    profileMenuInteractions();

//    $('.datepicker').datepicker({
//        format: 'yyyy-mm-dd'
//    });

    $('.slimScrollDiv').slimScroll({
        height: 'auto'
    });

}, 500);

function importScripts() {

    filenames = ['app'];

    $.each(filenames, function (k, v) {
        var imported = document.createElement('script');
        imported.src = 'vendor/' + v + '.js';
        document.body.appendChild(imported);

    });
}

function profileMenuInteractions() {

    $('.profile-menu .ti-close').click(function () {
        $('.btn-profile').click();
    });
    $('.profile-menu a').click(function () {
        $('.profile-menu a.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    $('.btn-profile').click(function () {

        $(this).toggleClass('active');

        if ($(this).hasClass('ti-angle-right'))
            $(this).removeClass('ti-angle-right').addClass('ti-angle-left');
        else
            $(this).removeClass('ti-angle-left').addClass('ti-angle-right');
        $('.overlay').fadeToggle();

        if ($(this).hasClass('active')) {
            $('.profile-menu').toggleClass('hide').animate({"left": "+=400px"}, "fast");
        } else {
            $('.profile-menu').animate({"left": "-=400px"}, "fast", 'linear', function () {
                $(this).toggleClass('hide');
            });
        }
    });
}

