const port = 3000;

const express = require('express');
const fs = require('fs').promises;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.render("codigoindex");
});
app.get("/index", (req, res) => {
    res.render("codigoindex");
});
app.get("/produtos", (req, res) => {
    res.render("codigoprodutos");
});
app.get("/fotos", (req, res) => {
    res.render("codigofotos");
});
app.get("/detalhes", (req, res) => {
    res.render("codigodetalhes");
});
app.get("/contato", (req, res) => {
    res.render("codigocontato");
});
app.post("/respostas", async(req, res) => {
    console.log(req)
    try{
        const dados = req.body;
        console.log(dados)
        await fs.appendFile('app.json', JSON.stringify(dados) + '\n', 'utf-8');
        console.log("Funcionou", { ...dados });
    } catch(err){
        console.error("Nao foi", err);
    }
    res.redirect("/contatorespostas")
});
app.get("/respostas", async (req, res) => {
    try {
        const conteudo = await fs.readFile("app.json", "utf-8");
        const linhas = conteudo.trim().split("\n");
        const dados = linhas.map(linha => JSON.parse(linha));

        res.render("codigorespostas", { dados });
    } catch (err) {
        console.error("Erro ao ler o arquivo", err);
        res.send("Erro ao carregar perguntas");
    }
});
app.listen(port, () => {
    console.log(`Servidor funcionando na porta: ${port}`);
}); 
