const mongoose = require('mongoose');

const intervencaoSchema = new mongoose.Schema({
    codigo: String,
    nome: String,
    descricao: String
});

const repairSchema = new mongoose.Schema({ 
    nome: String,
    nif: Number,
    data: String,
    viatura: {
        marca: String,
        modelo: String,
        matricula: String
    },
    nr_intervencoes: Number,
    intervencoes: [intervencaoSchema]
}, { collection: 'repairs', versionKey: false });

module.exports = mongoose.model('repair', repairSchema);