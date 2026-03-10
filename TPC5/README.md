Tarefa 5 - 11/03/2026 - Carlos Daniel Lopes Cunha A106910 - Engenharia Web

Esta tarefa consistiu na transição de um servidor Node.js puro para a framework Express, com o objetivo de gerir um dataset de cinema. A aplicação permite navegar por uma lista de filmes, consultar detalhes individuais e explorar listagens agregadas de Atores e Géneros, extraídas a partir dos dados dos filmes.
A aplicação possui a estrutura seguinte, gerada pelo express-generator:

**bin/www**: Script de entrada que configura o servidor HTTP e define a porta de escuta (3007).

**app.js**: Configuração central da aplicação (middleware, motor de templates Pug e definição de pastas estáticas).

**routes/index.js**: Ficheiro principal daws rotas, que contém a lógica da extração de dados e comunicação com o json-server.

**views/**: Pasta que contém os templates Pug (filmes.pug, filme.pug, atores.pug, ator.pug, generos.pug, genero.pug) para a interface do utilizador.

**public/**: Recursos estáticos como o ficheiro w3.css e o favicon.png.

**Rotas Implementadas**

**GET /filmes**: Listagem de todos os filmes com ID, título e ano.
**GET /filmes/:id**: Detalhe completo de um filme.

**GET /atores**: Lista de todos os elementos presentes no campo cast (elenco).
**GET /atores/:id**: Filmografia associada a um ator específico.

**GET /generos**: Lista de todas as categorias únicas de filmes.
**GET /generos/:id**: Listagem de filmes pertencentes a um determinado género.

**Execução**
1. Instalar Dependências -> npm install 
2. Iniciar o Servidor de Dados -> json-server --watch cinema.json
3. Iniciar o Serviço Aplicacional -> npm start
4. http://localhost:3007/:
