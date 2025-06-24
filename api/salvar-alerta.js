const db = require("../firebase");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const { moeda, variacao } = req.body;

  try {
    await db.collection("alertas").add({
      moeda,
      variacao,
      criadoEm: new Date(),
    });

    res.status(200).json({ status: "Alerta salvo com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar alerta." });
  }
};
