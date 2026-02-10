import json, os, shutil

# Funções de Utilidade
def open_json(filename):
    with open(filename, encoding="utf-8") as f:
        return json.load(f)

def mk_dir(relative_path):
    if os.path.exists(relative_path):
        shutil.rmtree(relative_path)
    os.makedirs(relative_path)

def new_file(filename, content):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

# Processamento de Dados
data = open_json("dataset_reparacoes.json")
reparacoes = data["reparacoes"]

# Dicionários para indexação
intervencoes_dict = {}  # codigo -> {nome, descricao, lista_reparacoes}
marcas_modelos_dict = {} # (marca, modelo) -> {lista_reparacoes}

for i, rep in enumerate(reparacoes):
    rep_id = f"rep_{i}"
    rep['id'] = rep_id # ID interno para facilitar links

    # Processar Intervenções
    for inter in rep["intervencoes"]:
        cod = inter["codigo"]
        if cod not in intervencoes_dict:
            intervencoes_dict[cod] = {
                "nome": inter["nome"],
                "descricao": inter["descricao"],
                "reps": []
            }
        intervencoes_dict[cod]["reps"].append(rep)

    # Processar Marcas/Modelos
    m_m = (rep["viatura"]["marca"], rep["viatura"]["modelo"])
    if m_m not in marcas_modelos_dict:
        marcas_modelos_dict[m_m] = []
    marcas_modelos_dict[m_m].append(rep)

# Ordenação
intervencoes_ordenadas = dict(sorted(intervencoes_dict.items()))
marcas_ordenadas = dict(sorted(marcas_modelos_dict.items()))

# Geração do Website
output_dir = "website"
mk_dir(output_dir)
mk_dir(f"{output_dir}/reparacoes")
mk_dir(f"{output_dir}/intervencoes")
mk_dir(f"{output_dir}/marcas")

# Página Principal (index.html)
index_html = f"""
<html>
<head><title>Oficina Automóvel</title><meta charset="utf-8"/></head>
<body>
    <h1>Oficina Automóvel: Exploração de Dados</h1>
    <ul>
        <li><a href="listagem_reparacoes.html">Listagem das Reparações</a></li>
        <li><a href="listagem_intervencoes.html">Tipos de Intervenção</a></li>
        <li><a href="listagem_marcas.html">Marcas e Modelos</a></li>
    </ul>
</body>
</html>
"""
new_file(f"{output_dir}/index.html", index_html)

# Listagem das Reparações 
rep_rows = ""
for rep in reparacoes:
    rep_rows += f"""
    <tr>
        <td>{rep['data']}</td>
        <td>{rep['nif']}</td>
        <td><a href="reparacoes/{rep['id']}.html">{rep['nome']}</a></td>
        <td>{rep['viatura']['marca']}</td>
        <td>{rep['viatura']['modelo']}</td>
        <td>{rep['nr_intervencoes']}</td>
    </tr>"""

reparacoes_html = f"""
<html>
<head><title>Listagem de Reparações</title><meta charset="utf-8"/></head>
<body>
    <h1>Reparações Realizadas</h1>
    <table border="1">
        <tr><th>Data</th><th>NIF</th><th>Nome</th><th>Marca</th><th>Modelo</th><th>Intervenções</th></tr>
        {rep_rows}
    </table>
    <p><a href="index.html">Voltar ao Início</a></p>
</body>
</html>
"""
new_file(f"{output_dir}/listagem_reparacoes.html", reparacoes_html)

# Listagem de Intervenções (Alfabética)
inter_rows = ""
for cod, info in intervencoes_ordenadas.items():
    inter_rows += f"<li><a href='intervencoes/{cod}.html'><b>{cod}</b></a>: {info['nome']}</li>"

intervencoes_html = f"""
<html>
<head><title>Tipos de Intervenção</title><meta charset="utf-8"/></head>
<body>
    <h1>Catálogo de Intervenções</h1>
    <ul>{inter_rows}</ul>
    <p><a href="index.html">Voltar ao Início</a></p>
</body>
</html>
"""
new_file(f"{output_dir}/listagem_intervencoes.html", intervencoes_html)

# Listagem de Marcas e Modelos
marcas_rows = ""
for (marca, modelo), reps in marcas_ordenadas.items():
    safe_name = f"{marca}_{modelo}".replace(" ", "_")
    marcas_rows += f"<li><a href='marcas/{safe_name}.html'>{marca} - {modelo}</a> ({len(reps)} reparações)</li>"

marcas_html = f"""
<html>
<head><title>Marcas e Modelos</title><meta charset="utf-8"/></head>
<body>
    <h1>Veículos Intervencionados</h1>
    <ul>{marcas_rows}</ul>
    <p><a href="index.html">Voltar ao Início</a></p>
</body>
</html>
"""
new_file(f"{output_dir}/listagem_marcas.html", marcas_html)

# Páginas Individuais: Reparação 
for rep in reparacoes:
    inters_list = "".join([f"<li>{i['nome']} ({i['codigo']})</li>" for i in rep['intervencoes']])
    content = f"""
    <html><head><meta charset="utf-8"/><title>Reparação {rep['id']}</title></head>
    <body>
        <h1>Detalhes da Reparação</h1>
        <p><b>Cliente:</b> {rep['nome']} (NIF: {rep['nif']})</p>
        <p><b>Data:</b> {rep['data']}</p>
        <p><b>Viatura:</b> {rep['viatura']['marca']} {rep['viatura']['modelo']} ({rep['viatura']['matricula']})</p>
        <h3>Intervenções:</h3>
        <ul>{inters_list}</ul>
        <a href="../listagem_reparacoes.html">Voltar à lista</a>
    </body></html>"""
    new_file(f"{output_dir}/reparacoes/{rep['id']}.html", content)

# Páginas Individuais: Intervenção 
for cod, info in intervencoes_ordenadas.items():
    reps_list = "".join([f"<li><a href='../reparacoes/{r['id']}.html'>{r['data']} - {r['nome']}</a></li>" for r in info['reps']])
    content = f"""
    <html><head><meta charset="utf-8"/><title>{cod}</title></head>
    <body>
        <h1>{info['nome']} ({cod})</h1>
        <p><b>Descrição:</b> {info['descricao']}</p>
        <h3>Reparações onde foi realizada:</h3>
        <ul>{reps_list}</ul>
        <a href="../listagem_intervencoes.html">Voltar à lista</a>
    </body></html>"""
    new_file(f"{output_dir}/intervencoes/{cod}.html", content)

# Páginas Individuais: Marcas/Modelos 
for (marca, modelo), reps in marcas_ordenadas.items():
    safe_name = f"{marca}_{modelo}".replace(" ", "_")
    reps_list = "".join([f"<li><a href='../reparacoes/{r['id']}.html'>{r['data']} - {r['nome']}</a></li>" for r in reps])
    content = f"""
    <html><head><meta charset="utf-8"/><title>{marca} {modelo}</title></head>
    <body>
        <h1>{marca} {modelo}</h1>
        <h3>Histórico de Reparações:</h3>
        <ul>{reps_list}</ul>
        <a href="../listagem_marcas.html">Voltar à lista</a>
    </body></html>"""
    new_file(f"{output_dir}/marcas/{safe_name}.html", content)

print("Website gerado com sucesso na pasta 'website'!")