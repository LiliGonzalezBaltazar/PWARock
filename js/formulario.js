import { db } from "/js/firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* --------------------------------------------------
   ENVÍO DE NOTIFICACIÓN A TU BACKEND EN VERCEL
-------------------------------------------------- */
async function notificarEnvio() {
    try {
        const res = await fetch("/api/notificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: "📩 ¡Nuevo formulario enviado!" })
        });

        const data = await res.json();
        console.log("Respuesta servidor:", data);
    } catch (err) {
        console.error("Error en notificarEnvio:", err);
    }
}

/* --------------------------------------------------
   GUARDAR PLAYER ID CORRECTAMENTE
   (cuando OneSignal realmente esté listo)
-------------------------------------------------- */
OneSignalDeferred.push(async function(OneSignal) {

    console.log("Esperando evento de OneSignal...");

    // Detecta cuando cambia la suscripción (cuando se genera el Player ID)
    OneSignal.User.PushSubscription.addEventListener("change", async () => {

        const playerId = OneSignal.User.PushSubscription.id;

        if (playerId) {
            console.log("🔥 Player ID listo:", playerId);

            try {
                await addDoc(collection(db, "tokens_suscripcion"), {
                    token: playerId
                });

                console.log("Player ID guardado en Firestore:", playerId);
            } catch (error) {
                console.error("Error guardando Player ID:", error);
            }
        }
    });

});

/* --------------------------------------------------
   LÓGICA DEL FORMULARIO
-------------------------------------------------- */

$(document).ready(function () {

    const form = document.getElementById("registroForm");
    const tablaBody = document.getElementById("tablaRegistrosBody");
    const verRegistrosBtn = document.getElementById("verRegistros");

    /* ------------------------------
        ENVIAR FORMULARIO
    ------------------------------ */
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const edad = document.getElementById("edad").value;
            const correo = document.getElementById("correo").value;
            const telefono = document.getElementById("telefono").value;
            const comentarios = document.getElementById("comentarios").value;

            try {
                // Guardar datos del formulario
                await addDoc(collection(db, "registros"), {
                    nombre,
                    edad,
                    correo,
                    telefono,
                    comentarios
                });

                alert("Datos enviados correctamente.");

                // Enviar notificación
                await notificarEnvio();

                form.reset();

            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Hubo un error al guardar.");
            }
        });
    }

    /* ------------------------------
        MOSTRAR REGISTROS
    ------------------------------ */
    if (verRegistrosBtn) {
        verRegistrosBtn.addEventListener("click", async () => {

            tablaBody.innerHTML = "";
            document.getElementById("tablaRegistros").style.display = "table";

            const querySnapshot = await getDocs(collection(db, "registros"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const row = `
                    <tr>
                        <td>${data.nombre}</td>
                        <td>${data.edad}</td>
                        <td>${data.correo}</td>
                        <td>${data.telefono}</td>
                        <td>${data.comentarios}</td>
                    </tr>
                `;

                tablaBody.innerHTML += row;
            });
        });
    }
});
