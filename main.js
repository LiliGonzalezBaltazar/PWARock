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

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(reg => console.log("SW registrado:", reg.scope))
            .catch(err => console.error("Error al registrar SW:", err));
    });
}