const express = require('express');
const router = express.Router();
const Repair = require('../controllers/repair');

router.get('/', (req, res) => {
    if (req.query.ano) {
        Repair.findByYear(req.query.ano)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro));
    } else if (req.query.marca) {
        Repair.findByBrand(req.query.marca)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro));
    } else {
        Repair.list()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro));
    }
});

router.get('/matriculas', (req, res) => {
    Repair.listPlates()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro));
});

router.get('/interv', (req, res) => {
    Repair.listInterventions()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro));
});

router.get('/:id', (req, res) => {
    Repair.findById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro));
});

router.post('/', (req, res) => {
    Repair.insert(req.body)
        .then(dados => res.status(201).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro));
});

router.delete('/:id', (req, res) => {
    Repair.remove(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;