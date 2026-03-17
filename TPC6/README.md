Tarefa 6 - 18/03/2026 - Carlos Daniel Lopes Cunha A106910 - Engenharia Web

Esta tarefa consistiu na colocação de uma aplicação em contentores, de gestão de um dataset de cinema utilizando Docker. A solução foi dividida em três camadas: persistência (MongoDB), servidor de dados (API) e interface de utilizador (Express/Pug). A aplicação permite navegar por filmes, atores e géneros com contagens dinâmicas de relações entre eles.

**Estrutura**

**docker-compose.yml:** Orquestrador que gere os três serviços (mongoEW, api_cinema e interface_cinema) e a rede comum cinema-network.

**myServer.js:** API em Express que comunica com o MongoDB usando Mongoose. Contém a lógica de agregação para contar filmes por ator e por género.

**Dockerfile:** Define a imagem Node.js para o serviço de dados.

**app_interface.js:** Servidor Express que consome a API e renderiza as vistas.

**views/:** Pasta com templates Pug (filmes.pug, filme.pug, atores.pug, ator.pug, generos.pug) seguindo o padrão W3.CSS.

**Dockerfile.interface:** Define a imagem Node.js para a interface.

**Persistência (mongoEW):** Contentor Docker oficial de MongoDB onde os dados do cinema.json foram importados e organizados em coleções de filmes, atores e generos.

**Rotas Implementadas**
**GET /filmes:** Tabela com ID, título, ano, nº de atores e nº de géneros. Cada linha liga ao detalhe do filme.

**GET /filmes/:id:** Detalhe completo de um filme (elenco, géneros e metadados).

**GET /atores:** Lista de atores únicos com o número total de filmes em que cada um participou.

**GET /atores/:id:** Página individual do ator com a sua filmografia completa.

**GET /generos:** Lista de géneros únicos e a contagem de filmes associados a cada género.

**Execução e Instalação**

**Criar e iniciar o contentor MongoDB**
docker run -d --name mongoEW -p 27017:27017 mongo
**Importar o dataset**
docker cp cinema.json mongoEW:/tmp/cinema.json
docker exec -it mongoEW mongoimport --db cinema --collection filmes --file /tmp/cinema.json --jsonArray
**Iniciar**
docker-compose up --build
**Acesso**
Interface: http://localhost:7790

API de Dados: http://localhost:7789
