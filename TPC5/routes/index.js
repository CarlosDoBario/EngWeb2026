var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = "http://localhost:3000/filmes";

/* GET Home / Filmes */
router.get(['/', '/filmes'], function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    axios.get(api).then(resp => {
        // Usamos o índice do array como ID virtual
        let filmes = resp.data.map((f, i) => ({...f, id: i}));
        res.render('filmes', { list: filmes, date: d });
    }).catch(err => res.render('error', {message: "Erro no carregamento", error: err}));
});

/* GET Detalhe Filme */
router.get('/filmes/:id', function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    axios.get(api).then(resp => {
        let filme = resp.data[req.params.id];
        if(filme) res.render('filme', { record: filme, id: req.params.id, date: d });
        else res.render('error', {message: "Filme não encontrado", error: {status: 404}});
    });
});

/* GET Lista Atores */
router.get('/atores', function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    axios.get(api).then(resp => {
        let atoresMap = {};
        resp.data.forEach((f, i) => {
            if (f.cast) f.cast.forEach(a => {
                if(!atoresMap[a]) atoresMap[a] = [];
                atoresMap[a].push({title: f.title, id: i});
            });
        });
        let lista = Object.keys(atoresMap).sort().map(a => ({
            nome: a, 
            id: a.replace(/ /g, "_"), // ID para o URL
            count: atoresMap[a].length 
        }));
        res.render('atores', { list: lista, date: d });
    });
});

/* GET Detalhe Ator */
router.get('/atores/:id', function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    let nomeAtor = req.params.id.replace(/_/g, " ");
    axios.get(api).then(resp => {
        let filmesDoAtor = resp.data
            .map((f, i) => ({...f, id: i}))
            .filter(f => f.cast && f.cast.includes(nomeAtor));
        res.render('ator', { nome: nomeAtor, list: filmesDoAtor, date: d });
    });
});

/* GET Lista Géneros */
router.get('/generos', function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    axios.get(api).then(resp => {
        let generosMap = {};
        resp.data.forEach((f, i) => {
            if (f.genres) f.genres.forEach(g => {
                if(!generosMap[g]) generosMap[g] = [];
                generosMap[g].push({title: f.title, id: i});
            });
        });
        let lista = Object.keys(generosMap).sort().map(g => ({
            nome: g, 
            id: g.replace(/ /g, "_"),
            count: generosMap[g].length 
        }));
        res.render('generos', { list: lista, date: d });
    });
});

/* GET Detalhe Género */
router.get('/generos/:id', function(req, res) {
    var d = new Date().toISOString().substring(0, 16);
    let nomeGen = req.params.id.replace(/_/g, " ");
    axios.get(api).then(resp => {
        let filmesDoGen = resp.data
            .map((f, i) => ({...f, id: i}))
            .filter(f => f.genres && f.genres.includes(nomeGen));
        res.render('genero', { nome: nomeGen, list: filmesDoGen, date: d });
    });
});

module.exports = router;