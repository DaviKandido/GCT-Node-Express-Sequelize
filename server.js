const port = process.env.PORT || 5000;
const {parse} = require("url");
const app = require("./app");

// const http = require("http");
// const server = http.createServer(app);


app.listen(port, () =>{
    console.log(`Servidor rodando na porta ${port}`);
})



// Catch-all para rotas não encontradas → envia para o middleware de erro
app.use((req, res, next) => {
    const error = new Error('Page not found!');
    error.status = 404;
    next(error); // passa para o middleware de erro
});

// Middleware de erro que trata 404 e demais erros
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        url: req.url,
        method: req.method,
        querystring: parse(req.url).query,
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body,
        error: err.stack // opcional, útil para debug
    });
});