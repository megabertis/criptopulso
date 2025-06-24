const db = require("../firebase");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { moeda, variacao } = req.body;

      if (!moeda || isNaN(variacao)) {
        return res.status(400).json({ status: "Dados inválidos" });
      }

      await db.collection("alertas").add({
        moeda,
        variacao,
        criadoEm: new Date()
      });

      return res.status(200).json({ status: "Alerta salvo com sucesso" });
    } catch (error) {
      console.error("Erro ao salvar alerta:", error);
      return res.status(500).json({ status: "Erro interno" });
    }
  } else {
    return res.status(405).json({ status: "Método não permitido" });
  }
}
