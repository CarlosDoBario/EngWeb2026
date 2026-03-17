const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// URL da API de dados (usando o nome do serviço definido no docker-compose)
const apiURL = process.env.API_URL || 'http://api:7789';

// --- ROTAS ---

// GET /filmes
app.get('/filmes', (req, res) => {
    axios.get(`${apiURL}/filmes`)
        .then(response => {
            res.render('filmes', { lista: response.data });
        })
        .catch(err => res.render('error', { error: err }));
});

// GET /filmes/:id
app.get('/filmes/:id', (req, res) => {
    axios.get(`${apiURL}/filmes/${req.params.id}`)
        .then(response => {
            res.render('filme', { f: response.data });
        })
        .catch(err => res.render('error', { error: err }));
});

// GET /atores
app.get('/atores', (req, res) => {
    axios.get(`${apiURL}/atores`)
        .then(response => {
            res.render('atores', { lista: response.data });
        })
        .catch(err => res.render('error', { error: err }));
});

// GET /atores/:id
app.get('/atores/:id', (req, res) => {
    // O id aqui é o nome do ator (ex: Craig Robinson)
    axios.get(`${apiURL}/atores/${req.params.id}`)
        .then(response => {
            // A API envia { info: ..., filmes: ... }
            res.render('ator', { 
                a: response.data.info, 
                filmes: response.data.filmes 
            });
        })
        .catch(err => res.render('error', { error: err }));
});

// GET /generos
app.get('/generos', (req, res) => {
    axios.get(`${apiURL}/generos`)
        .then(response => {
            res.render('generos', { lista: response.data });
        })
        .catch(err => res.render('error', { error: err }));
});

// Rota padrão (Redirect para filmes)
app.get('/', (req, res) => {
    res.redirect('/filmes');
});

// Porta onde a interface corre (dentro do contentor)
app.listen(7790, () => {
    console.log('Interface Cinema a correr na porta 7790');
});