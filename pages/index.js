import { useEffect, useState } from "react";

export default function Home() {
  const [precos, setPrecos] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [moeda, setMoeda] = useState("bitcoin");
  const [variacao, setVariacao] = useState("");

  const moedas = ["bitcoin", "ethereum", "solana"];
  const cores = {
    bitcoin: "text-green-300",
    ethereum: "text-indigo-300",
    solana: "text-yellow-300"
  };

  async function buscarPreco(m) {
    try {
      const res = await fetch(`/api/preco?moeda=${m}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const dados = await res.json();
      setPrecos(prev => ({
        ...prev,
        [m]: {
          preco: dados[m].brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
          variacao: dados[m].brl_24h_change.toFixed(2)
        }
      }));
    } catch (erro) {
      console.error("Erro ao buscar preço:", erro);
      setPrecos(prev => ({
        ...prev,
        [m]: { preco: "Erro", variacao: "--" }
      }));
    }
  }

  useEffect(() => {
    moedas.forEach(buscarPreco);
  }, []);

  async function salvarAlerta(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/salvar-alerta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moeda, variacao: parseFloat(variacao) })
      });
      const dados = await res.json();
      setMensagem(dados.status || "Erro ao salvar.");
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      setMensagem("Erro ao salvar.");
    }
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: "linear-gradient(to bottom right, #0A1128, #1E1E24)",
      fontFamily: "'Orbitron', sans-serif",
      color: "white"
    }}>
      <h1 className="text-4xl font-bold mb-6 text-center text-green-400">💹 CriptoPulso</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moedas.map((m) => (
          <div key={m} className="crypto-card bg-gray-900 p-4 rounded-xl text-center hover:translate-y-[-4px] hover:shadow-lg transition-all">
            <h2 className={`text-xl font-semibold ${cores[m]}`}>
              {m.charAt(0).toUpperCase() + m.slice(1)} ({m.slice(0, 3).toUpperCase()})
            </h2>
            <p className="text-2xl mt-2">
              {precos[m]?.preco || "R$ --"}
            </p>
            <p className="text-sm text-gray-400">
              24h: {precos[m]?.variacao || "--"}%
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-black/30 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-green-200">🔔 Criar alerta personalizado</h3>
        <form onSubmit={salvarAlerta} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-1">Moeda</label>
            <select
              value={moeda}
              onChange={e => setMoeda(e.target.value)}
              className="w-full p-2 rounded text-black"
            >
              {moedas.map(m => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Variação (%)</label>
            <input
              type="number"
              value={variacao}
              onChange={e => setVariacao(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="Ex: 5"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
            Salvar Alerta
          </button>
        </form>
        {mensagem && <p className="mt-4 text-sm text-green-400">{mensagem}</p>}
      </div>

      <footer className="mt-10 text-center text-gray-500 text-sm">
        Feito com 💚 por Rodrigo & Copilot
      </footer>
    </div>
  );
}
