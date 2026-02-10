**Estrutura da Tarefa**

**dataset_reparacoes.json:** O ficheiro de dados original com o histórico de intervenções.

**gerador_site.py:** Script Python que processa o JSON e gera automaticamente as páginas HTML.

**website/:** Pasta gerada pelo script que contém a estrutura completa do site:

**index.html:** **Portal principal.

**listagem_reparacoes.html:** Tabela com o resumo de todas as reparações.

**intervencoes/:** Páginas detalhadas por tipo de serviço (ex: R024).

**marcas/:** Páginas com o histórico por marca e modelo de viatura.

**Executar o script Python:**

Bash
python3 gerar_website.py
Abrir o ficheiro website/index.html
