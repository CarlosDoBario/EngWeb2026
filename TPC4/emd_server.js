var http = require('http')
var axios = require('axios')
var static = require('./static.js')
var templates = require('./templates.js')
const { parse } = require('querystring');

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });
        request.on('end', () => { callback(parse(body)); });
    } else { callback(null); }
}

var desportoServer = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url)

    if(static.staticResource(req)) return static.serveStaticResource(req, res)

    switch(req.method){
        case "GET":
            if(req.url == '/' || req.url == '/emd' || req.url.startsWith('/emd?')){
                let query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : "?_sort=dataEMD&_order=desc"
                axios.get("http://localhost:3000/emd" + query)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.end(templates.emdListPage(resp.data, d))
                    }).catch(err => res.end(templates.errorPage(err, d)))
            }
            else if(req.url == '/emd/registo'){
                res.end(templates.emdFormPage(d))
            }
            else if(req.url == '/emd/stats'){
                axios.get("http://localhost:3000/emd")
                    .then(resp => res.end(templates.emdStatsPage(resp.data, d)))
                    .catch(err => res.end(templates.errorPage(err, d)))
            }
            else if(/\/emd\/editar\/[0-9a-zA-Z]+$/.test(req.url)){
                var id = req.url.split("/")[3]
                axios.get("http://localhost:3000/emd/" + id)
                    .then(resp => res.end(templates.emdFormEditPage(resp.data, d)))
                    .catch(err => res.end(templates.errorPage(err, d)))
            }
            else if(/\/emd\/apagar\/[0-9a-zA-Z]+$/.test(req.url)){
                var id = req.url.split("/")[3]
                axios.delete("http://localhost:3000/emd/" + id)
                    .then(() => { res.writeHead(302, {'Location': '/'}); res.end(); })
                    .catch(err => res.end(templates.errorPage(err, d)))
            }
            else if(/\/emd\/[0-9a-zA-Z]+$/.test(req.url)){
                var id = req.url.split("/")[2]
                axios.get("http://localhost:3000/emd/" + id)
                    .then(resp => res.end(templates.emdDetailPage(resp.data, d)))
                    .catch(err => res.end(templates.errorPage(err, d)))
            }
            break;

        case "POST":
            let isEdit = req.url !== '/emd'
            let idParam = isEdit ? req.url.split("/")[2] : null

            collectRequestBodyData(req, result => {
                if(result){
                    let dadosFinal = {
                        id: isEdit ? idParam : result.id,
                        dataEMD: result.dataEMD,
                        nome: { primeiro: result.pnome, último: result.unome },
                        idade: parseInt(result.idade),
                        género: result.género,
                        modalidade: result.modalidade,
                        clube: result.clube,
                        federado: result.federado === 'on',
                        resultado: result.resultado === 'on'
                    }
                    
                    if(isEdit){
                        axios.put("http://localhost:3000/emd/" + idParam, dadosFinal)
                            .then(() => { res.writeHead(302, {'Location': '/'}); res.end(); })
                    } else {
                        axios.post("http://localhost:3000/emd", dadosFinal)
                            .then(() => { res.writeHead(302, {'Location': '/'}); res.end(); })
                    }
                }
            })
            break;
    }
})
desportoServer.listen(7777, () => console.log("Servidor à escuta na 7777..."));