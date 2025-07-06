import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "node:path";

const app = express();
const distPath = path.resolve("dist");

app.use(cors()); // Libera CORS para todas as rotas

app.use(express.static(distPath));

// Rota fallback para SPA
// app.get("*", (_, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
