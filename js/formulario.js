import { db } from "/js/firebase.js";
import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Usamos $(document).ready() para asegurar que el DOM está cargado 
// (igual que lo haces en main.js)
$(document).ready(function() {
    
    // TODAS LAS VARIABLES DEL DOM DEBEN DECLARARSE AQUÍ ADENTRO:
    // La variable 'form' se define AHORA aquí dentro, resolviendo el 'is not defined'.
    const form = document.getElementById("registroForm");
    const tablaRegistros = document.getElementById("tablaRegistros");
    const tablaBody = document.getElementById("tablaRegistrosBody");
    const verRegistrosBtn = document.getElementById("verRegistros");

    // ✔ Guardar datos
    if (form) { // Comprobamos que el elemento exista
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // CLAVE: Prevenir la recarga de la página

            const nombre = document.getElementById("nombre").value;
            const edad = document.getElementById("edad").value;
            const correo = document.getElementById("correo").value;
            const telefono = document.getElementById("telefono").value;
            const comentarios = document.getElementById("comentarios").value;

            try {
                await addDoc(collection(db, "registros"), {
                    nombre,
                    edad,
                    correo,
                    telefono,
                    comentarios
                });

                alert("Datos enviados correctamente.");
                form.reset();

            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Hubo un error al guardar.");
            }
        });
    }

    // ✔ Visualizar registros
    if (verRegistrosBtn) { 
        verRegistrosBtn.addEventListener("click", async () => {
            tablaBody.innerHTML = "";
            tablaRegistros.style.display = "block";

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
