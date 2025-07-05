const port = process.env.PORT || 3000;
const app = require("./app");

// const http = require("http");
// const server = http.createServer(app);


app.listen(port, () =>{
    console.log(`Servidor rodando na porta ${port}`);
})


app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found!"
    })
})