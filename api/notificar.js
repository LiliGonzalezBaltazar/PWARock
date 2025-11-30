import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { mensaje } = req.body;

  try {
    const tokensSnap = await admin
      .firestore()
      .collection("tokens_suscripcion")
      .get();

    const tokens = tokensSnap.docs.map((doc) => doc.data().token);

    console.log("TOKENS ENCONTRADOS:", tokens);

    if (tokens.length === 0) {
      return res.status(200).json({ ok: true, msg: "No hay tokens registrados" });
    }

    const payload = {
      notification: {
        title: "Nuevo formulario recibido",
        body: mensaje,
      }
    };

    await admin.messaging().sendToDevice(tokens, payload);

    return res.status(200).json({ ok: true, enviados: tokens.length });

  } catch (error) {
    console.error("ERROR BACKEND:", error);
    return res.status(500).json({ error: "Falló el envío", detalle: error.message });
  }
}
