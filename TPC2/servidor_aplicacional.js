const http = require('http');
const axios = require('axios');

function geraHeader(titulo) {
    return `
    <html>
    <head>
        <title>${titulo}</title>
        <meta charset="utf-8"/>
        <style>
            body { font-family: sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
    </head>
    <body>
        <h1>${titulo}</h1>`;
}

// 1. Rota /reparacoes
function routeReparacoes(res) {
    axios.get('http://localhost:3000/reparacoes')
        .then(resp => {
            let html = geraHeader("Listagem de Reparações");
            html += `<table><tr><th>Data</th><th>Nome</th><th>NIF</th><th>Viatura</th></tr>`;
            resp.data.forEach(r => {
                html += `<tr>
                    <td>${r.data}</td>
                    <td>${r.nome}</td>
                    <td>${r.nif}</td>
                    <td>${r.viatura.marca} ${r.viatura.modelo}</td>
                </tr>`;
            });
            html += "</table><p><a href='/'>Voltar</a></p></body></html>";
            res.end(html);
        })
        .catch(err => res.end("Erro: " + err));
}

// 2. Rota /intervencoes
function routeIntervencoes(res) {
    axios.get('http://localhost:3000/reparacoes')
        .then(resp => {
            let stats = {};
            resp.data.forEach(r => {
                r.intervencoes.forEach(i => {
                    if (!stats[i.codigo]) {
                        stats[i.codigo] = { nome: i.nome, count: 0 };
                    }
                    stats[i.codigo].count++;
                });
            });

            let html = geraHeader("Tipos de Intervenção");
            html += "<table><tr><th>Código</th><th>Nome</th><th>Frequência</th></tr>";
            for (let cod in stats) {
                html += `<tr><td>${cod}</td><td>${stats[cod].nome}</td><td>${stats[cod].count}</td></tr>`;
            }
            html += "</table><p><a href='/'>Voltar</a></p></body></html>";
            res.end(html);
        })
        .catch(err => res.end("Erro: " + err));
}

// 3. Rota /viaturas
function routeViaturas(res) {
    axios.get('http://localhost:3000/reparacoes')
        .then(resp => {
            let frotas = {};
            resp.data.forEach(r => {
                let chave = `${r.viatura.marca} ${r.viatura.modelo}`;
                frotas[chave] = (frotas[chave] || 0) + 1;
            });

            let html = geraHeader("Modelos de Viaturas");
            html += "<table><tr><th>Marca e Modelo</th><th>Nº de Reparações</th></tr>";
            Object.keys(frotas).sort().forEach(v => {
                html += `<tr><td>${v}</td><td>${frotas[v]}</td></tr>`;
            });
            html += "</table><p><a href='/'>Voltar</a></p></body></html>";
            res.end(html);
        })
        .catch(err => res.end("Erro: " + err));
}

// Servidor Principal
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    if (req.url === '/') {
        let home = geraHeader("Menu Principal");
        home += `<ul>
            <li><a href="/reparacoes">Reparações</a></li>
            <li><a href="/intervencoes">Intervenções</a></li>
            <li><a href="/viaturas">Viaturas</a></li>
        </ul></body></html>`;
        res.end(home);
    } 
    else if (req.url === '/reparacoes') routeReparacoes(res);
    else if (req.url === '/intervencoes') routeIntervencoes(res);
    else if (req.url === '/viaturas') routeViaturas(res);
    else {
        res.end("Rota não encontrada.");
    }
}).listen(7777);

console.log("Serviço à escuta na porta 7777...");