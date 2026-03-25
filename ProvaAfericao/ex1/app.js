const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const repairRouter = require('./routes/repair');

const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/autoRepair';
mongoose.connect(mongoURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', () => console.log('Conexão ao MongoDB realizada com sucesso'));

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use('/repairs', repairRouter);

const PORT = 16025;
app.listen(PORT, () => console.log(`Servidor à escuta na porta ${PORT}...`)); 