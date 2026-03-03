const pug = require('pug');

function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (list, d) => renderPug('emdList', { emds: list, date: d });
exports.emdFormPage = (d) => renderPug('emdForm', { date: d });
exports.emdFormEditPage = (item, d) => renderPug('emdForm', { emd: item, date: d });
exports.emdDetailPage = (item, d) => renderPug('emdDetail', { emd: item, date: d });
exports.errorPage = (err, d) => renderPug('error', { message: err, date: d });

exports.emdStatsPage = (list, d) => {
    const stats = { sexo: {}, modalidade: {}, clube: {}, resultado: {Apto: 0, NãoApto: 0} };
    list.forEach(e => {
        if(e.género) stats.sexo[e.género] = (stats.sexo[e.género] || 0) + 1;
        if(e.modalidade) stats.modalidade[e.modalidade] = (stats.modalidade[e.modalidade] || 0) + 1;
        if(e.clube) stats.clube[e.clube] = (stats.clube[e.clube] || 0) + 1;
        e.resultado === true || e.resultado === 'on' ? stats.resultado.Apto++ : stats.resultado.NãoApto++;
    });
    return renderPug('emdStats', { stats, date: d });
}