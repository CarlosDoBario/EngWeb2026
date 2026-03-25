const Repair = require('../models/repair');

module.exports.list = () => {
    return Repair.find().exec();
};

module.exports.findById = id => {
    return Repair.findById(id).exec(); 
};

module.exports.findByYear = year => {
    return Repair.find({ data: { $regex: "^" + year } }).exec();
};

module.exports.findByBrand = brand => {
    return Repair.find({ "viatura.marca": brand }).exec();
};

module.exports.listPlates = () => {
    return Repair.distinct("viatura.matricula").then(l => l.sort());
};

module.exports.listInterventions = () => {
    return Repair.aggregate([
        { $unwind: "$intervencoes" },
        { $group: { 
            _id: "$intervencoes.codigo", 
            nome: { $first: "$intervencoes.nome" }, 
            descricao: { $first: "$intervencoes.descricao" } 
        }},
        { $sort: { _id: 1 } },
        { $project: { _id: 0, codigo: "$_id", nome: 1, descricao: 1 } }
    ]).exec();
};

module.exports.insert = repair => {
    return Repair.create(repair);
};

module.exports.remove = id => {
    return Repair.deleteOne({ _id: id });
};