#!/bin/bash

# Esperar que o MongoDB esteja pronto para aceitar ligações
until mongosh --host localhost --port 27017 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "A aguardar pelo MongoDB..."
  sleep 2
done

echo "MongoDB está pronto. A iniciar a importação dos dados..."

# 1. Importar o ficheiro cinema.json para a coleção temporária
mongoimport --host localhost --port 27017 --db cinema --collection filmes_tmp --file /docker-entrypoint-initdb.d/cinema.json --jsonArray

# 2. Executar script JS no mongosh para separar os dados em coleções (filmes, atores, generos)
mongosh --host localhost --port 27017 cinema <<EOF
// Criar coleção de filmes (limpando a estrutura se necessário)
db.filmes.insertMany(db.filmes_tmp.find().toArray());

// Extrair géneros únicos
var generosSet = new Set();
db.filmes.find().forEach(f => {
    if(f.genres) f.genres.forEach(g => generosSet.add(g));
});
var generosLista = Array.from(generosSet).map(g => ({ id: g, designacao: g }));
if(generosLista.length > 0) db.generos.insertMany(generosLista);

// Extrair atores únicos
var atoresSet = new Set();
db.filmes.find().forEach(f => {
    if(f.cast) f.cast.forEach(a => atoresSet.add(a));
});
var atoresLista = Array.from(atoresSet).map(a => ({ id: a, nome: a }));
if(atoresLista.length > 0) db.atores.insertMany(atoresLista);

// Limpar coleção temporária
db.filmes_tmp.drop();

echo "Importação concluída com sucesso!";
EOF