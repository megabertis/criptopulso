const { db } = require("../firebase");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { moeda, variacao } = req.body;
    await db.collection("alertas").add({
      moeda,
      variacao,
      criadoEm: new Date()
    });
    res.status(200).json({ status: "Alerta salvo com sucesso" });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
