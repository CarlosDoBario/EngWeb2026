const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const API_URL = process.env.API_URL || 'http://localhost:16025/repairs';

// 1. Página Principal
app.get('/', (req, res) => {
    axios.get(API_URL)
        .then(dados => res.render('index', { lista: dados.data }))
        .catch(err => res.render('error', { error: err }));
});

// Rota genérica para lidar com /:id ou /:marca
app.get('/:p', (req, res) => {
    const param = req.params.p;

    // Verifica se o parâmetro tem o formato de um ObjectId do MongoDB (24 caracteres hex)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);

    if (isObjectId) {
        // Trata como ID
        axios.get(`${API_URL}/${param}`)
            .then(dados => {
                if (dados.data) res.render('repair', { r: dados.data });
                else res.status(404).render('error', { message: "Registo não encontrado." });
            })
            .catch(err => res.render('error', { error: err }));
    } else {
        // Trata como Marca
        axios.get(`${API_URL}?marca=${param}`)
            .then(dados => {
                if (dados.data && dados.data.length > 0) {
                    const modelos = [...new Set(dados.data.map(r => r.viatura.modelo))];
                    res.render('brand', { marca: param, modelos, lista: dados.data });
                } else {
                    res.status(404).render('error', { message: "Marca não encontrada." });
                }
            })
            .catch(err => res.render('error', { error: err }));
    }
});

app.listen(16026, () => console.log("Interface na porta 16026..."));