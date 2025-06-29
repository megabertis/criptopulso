import axios from "axios";

export default async function handler(req, res) {
  const { moeda } = req.query;

  if (!moeda) return res.status(400).json({ error: "Moeda não especificada" });

  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: moeda,
        vs_currencies: "brl",
        include_24hr_change: "true"
      }
    });
    return res.status(200).json(data);
  } catch (erro) {
    console.error("Erro ao buscar preço:", erro);
    return res.status(500).json({ error: "Erro ao buscar preço" });
  }
}
