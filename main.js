//service worker

if ('serviceWorker' in navigator) {
    console.log('Puedes usar los serviceWorker del navegador');

    navigator.serviceWorker.register('/sw-custom/sw.js', {
        scope: '/sw-custom/'
    });
} else {
    console.log('NO puedes usar los serviceWorker del navegador');
}


//scroll suavizado
$(document).ready(function () {

    $("#menu a").click(function (e) {
        e.preventDefault();

        $("html, body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
});