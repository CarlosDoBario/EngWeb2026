const http = require('http');
const axios = require('axios');

function geraHeader(titulo) {
    return `
    <html>
    <head>
        <title>${titulo}</title>
        <meta charset="utf-8"/>
        <style>
            body { font-family: sans-serif; margin: 25px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #34495e; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .nav { margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>${titulo}</h1>
        <div class="nav"><a href="/">⬅ Voltar ao Menu</a></div>`;
}

// --- Rota /alunos ---
function routeAlunos(res) {
    axios.get('http://localhost:3000/alunos')
        .then(resp => {
            let html = geraHeader("Lista de Alunos");
            html += `<table>
                <tr><th>ID</th><th>Nome</th><th>Curso</th><th>Instrumento</th></tr>`;
            resp.data.forEach(a => {
                html += `<tr>
                    <td>${a.id}</td>
                    <td>${a.nome}</td>
                    <td>${a.curso}</td>
                    <td>${a.instrumento}</td>
                </tr>`;
            });
            html += "</table></body></html>";
            res.end(html);
        })
        .catch(err => {
            console.error(err);
            res.end("Erro ao obter alunos.");
        });
}

// --- Rota /cursos ---
function routeCursos(res) {
    axios.get('http://localhost:3000/cursos')
        .then(resp => {
            let html = geraHeader("Lista de Cursos");
            html += `<table>
                <tr><th>ID</th><th>Designação</th><th>Duração</th><th>Instrumento</th></tr>`;
            resp.data.forEach(c => {
                // Verificação segura: o instrumento aqui é um objeto com #text
                let instNome = c.instrumento && c.instrumento['#text'] ? c.instrumento['#text'] : "---";
                html += `<tr>
                    <td>${c.id}</td>
                    <td>${c.designacao}</td>
                    <td>${c.duracao}</td>
                    <td>${instNome}</td>
                </tr>`;
            });
            html += "</table></body></html>";
            res.end(html);
        })
        .catch(err => {
            console.error(err);
            res.end("Erro ao obter cursos.");
        });
}

// --- Rota /instrumentos ---
function routeInstrumentos(res) {
    axios.get('http://localhost:3000/instrumentos')
        .then(resp => {
            let html = geraHeader("Lista de Instrumentos");
            html += `<table>
                <tr><th>ID</th><th>Instrumento</th></tr>`;
            resp.data.forEach(i => {
                // No dataset de instrumentos, o nome está em #text
                let nome = i['#text'] ? i['#text'] : "---";
                html += `<tr>
                    <td>${i.id}</td>
                    <td>${nome}</td>
                </tr>`;
            });
            html += "</table></body></html>";
            res.end(html);
        })
        .catch(err => {
            console.error(err);
            res.end("Erro ao obter instrumentos.");
        });
}

// --- Servidor Principal ---
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    if (req.url === '/') {
        let home = geraHeader("Escola de Música");
        home += `
            <ul>
                <li><a href="/alunos">Alunos</a></li>
                <li><a href="/cursos">Cursos</a></li>
                <li><a href="/instrumentos">Instrumentos</a></li>
            </ul>
        </body></html>`;
        res.end(home);
    } 
    else if (req.url === '/alunos') routeAlunos(res);
    else if (req.url === '/cursos') routeCursos(res);
    else if (req.url === '/instrumentos') routeInstrumentos(res);
    else {
        res.end("Página não encontrada.");
    }
}).listen(7777);

console.log("Servidor rodando em http://localhost:7777");