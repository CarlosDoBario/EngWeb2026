Tarefa 4 - 03/03/2026 - Carlos Daniel Lopes Cunha A106910 - Engenharia Web

Esta tarefa consistiu no desenvolvimento de um sistema completo (CRUD) para a gestão de registos de Exames Médicos Desportivos. O sistema utiliza um servidor aplicacional em Node.js que comunica com uma base de dados persistida num ficheiro JSON através do `json-server`. A interface foi construída utilizando o motor de templates **Pug**.

**Estrutura** 
**emd.json**: Base de dados em formato JSON com o histórico de .

**emd_server.js**: Servidor Node.js. Contém a lógica de encaminhamento (routing) das rotas HTTP, a comunicação com a API do json-server via axios e o tratamento de dados dos formulários (POST).

**templates_js**: Módulo intermédio que faz a ponte entre o servidor e os motores de template.

**Funcionamento**

**Data Server**: Executado pelo json-server na porta 3000, servindo o ficheiro emd.json.

**App Server (Front-end)**: Executado em Node.js na porta 7777, que processa a lógica de negócio (contagens, agrupamentos) e entrega o HTML ao utilizador.

**Execução**
1. Instalar Dependências -> npm install axios pug
2. Iniciar o Servidor de Dados -> json-server --watch emd.json
3. Iniciar o Serviço Aplicacional -> node emd_server.js
4. http://localhost:7777/:
