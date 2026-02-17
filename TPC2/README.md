Tarefa 2 - 18/02/2026 - Carlos Daniel Lopes Cunha A106910 - Engenharia Web

Esta tarefa foi desenvolvida para a unidade curricular de Engenharia Web. O objetivo é criar um ecossistema dinâmico onde um servidor de dados (API) é consumido por um serviço aplicacional para gerar visualizações em tempo real.

**Estrutura** 
**dataset_reparacoes.json**: Base de dados em formato JSON com o histórico de intervenções.

**servico_aplicacional.js**: Servidor Node.js que consome a API e gera as páginas HTML dinamicamente.

**Funcionamento**

**Data Server**: Executado pelo json-server na porta 3000, servindo o ficheiro dataset_reparacoes.json.

**App Server (Front-end)**: Executado em Node.js na porta 7777, que processa a lógica de negócio (contagens, agrupamentos) e entrega o HTML ao utilizador.

**Execução**
1. Instalar Dependências -> npm install axios json-server
2. Iniciar o Servidor de Dados -> json-server --watch dataset_reparacoes.json
3. Iniciar o Serviço Aplicacional -> node servidor_aplicacional.js
4. http://localhost:7777/:

http://localhost:7777/reparacoes: Listagem completa de intervenções.

http://localhost:7777/intervencoes: Estatísticas por tipo de serviço (sem duplicados e com contagem).

http://localhost:7777/viaturas: Agrupamento por marca/modelo com o número de reparações efetuadas.
