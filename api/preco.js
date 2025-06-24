const axios = require("axios");

module.exports = async (req, res) => {
  const moeda = req.query.moeda || "bitcoin";

  try {
    const resposta = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: moeda,
          vs_currencies: "usd,brl",
          include_24hr_change: "true",
        },
      }
    );

    res.status(200).json(resposta.data);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar preço da cripto." });
  }
};
