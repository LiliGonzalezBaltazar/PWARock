export default async function handler(req, res) {
  const { mensaje } = req.body;

  const resp = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ["All"],
      contents: { "es": mensaje }
    })
  });

  const data = await resp.json();
  res.status(200).json({ data });
}
