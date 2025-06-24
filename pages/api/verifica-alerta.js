const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const { moeda, variacaoAlvo } = req.body;

  try {
    const resposta = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: moeda,
          vs_currencies: "usd",
          include_24hr_change: true,
        },
      }
    );

    const variacaoAtual = resposta.data[moeda].usd_24h_change;
    const atingido = Math.abs(variacaoAtual) >= Math.abs(variacaoAlvo);

    res.status(200).json({ atingido, variacaoAtual });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao verificar alerta." });
  }
};
