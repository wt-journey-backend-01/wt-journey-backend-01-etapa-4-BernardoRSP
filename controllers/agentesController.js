const agentesRepository = require("../repositories/agentesRepository.js");
const intPos = /^\d+$/; // Regex para aceitar número inteiro positivo
const formatoData = /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/; // Regex para aceitar data no formato: YYYY-MM-DD

// Mostrar Todos os Agentes
async function listarAgentes(req, res) {
  try {
    const agentes = await agentesRepository.listar();

    res.status(200).json(agentes);
  } catch (error) {
    console.log("Erro referente a: listarAgentes\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// Mostrar Agente Referente ao ID
async function encontrarAgente(req, res) {
  try {
    const { id } = req.params;
    if (!intPos.test(id)) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: { id: "O ID deve ter um padrão válido" } });
    }

    const agente = await agentesRepository.encontrar(id);

    if (agente) {
      agente.dataDeIncorporacao = new Date(agente.dataDeIncorporacao).toISOString().split("T")[0];
    }

    if (!agente) {
      return res.status(404).json({ status: 404, message: "Agente não encontrado" });
    }

    res.status(200).json(agente);
  } catch (error) {
    console.log("Erro referente a: encontrarAgente\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// Adicionar Novo Agente
async function adicionarAgente(req, res) {
  try {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    const erros = {};
    const camposPermitidos = ["nome", "dataDeIncorporacao", "cargo"];
    const campos = Object.keys(req.body);

    if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      erros.geral = "O agente deve conter apenas os campos 'nome', 'dataDeIncorporacao' e 'cargo'";
    }

    if (!nome) erros.nome = "O campo 'nome' é obrigatório";
    if (!dataDeIncorporacao) erros.dataDeIncorporacao = "O campo 'dataDeIncorporacao' é obrigatório";
    if (!cargo) erros.cargo = "O campo 'cargo' é obrigatório";

    if (dataDeIncorporacao && !dataDeIncorporacao.match(formatoData)) {
      erros.dataDeIncorporacao = "A data de incorporação deve ser uma data válida no formato AAAA-MM-DD";
    } else if (new Date(dataDeIncorporacao) > new Date()) {
      erros.dataDeIncorporacao = "A data de incorporação não pode ser uma data futura";
    }

    if (Object.keys(erros).length > 0) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: erros });
    }

    const novoAgente = { nome, dataDeIncorporacao, cargo };

    const agenteCriado = await agentesRepository.adicionar(novoAgente);
    res.status(201).json(agenteCriado);
  } catch (error) {
    console.log("Erro referente a: adicionarAgente\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// Atualizar Informações do Agente
async function atualizarAgente(req, res) {
  try {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo, id: bodyId } = req.body;

    if (!intPos.test(id)) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: { id: "O ID na URL deve ter um padrão válido" } });
    }

    const erros = {};
    const camposPermitidos = ["nome", "dataDeIncorporacao", "cargo"];
    const campos = Object.keys(req.body);

    if (bodyId) {
      erros.id = "Não é permitido alterar o ID de um agente.";
    }

    if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      erros.geral = "O agente deve conter apenas os campos 'nome', 'dataDeIncorporacao' e 'cargo'";
    }

    if (!nome) erros.nome = "O campo 'nome' é obrigatório";
    if (!dataDeIncorporacao) erros.dataDeIncorporacao = "O campo 'dataDeIncorporacao' é obrigatório";
    if (!cargo) erros.cargo = "O campo 'cargo' é obrigatório";

    if (dataDeIncorporacao && !dataDeIncorporacao.match(formatoData)) {
      erros.dataDeIncorporacao = "A data de incorporação deve ser uma data válida no formato AAAA-MM-DD";
    } else if (new Date(dataDeIncorporacao) > new Date()) {
      erros.dataDeIncorporacao = "A data de incorporação não pode ser uma data futura";
    }

    if (Object.keys(erros).length > 0) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: erros });
    }

    const agenteAtualizado = await agentesRepository.atualizar({ nome, dataDeIncorporacao, cargo }, id);
    console.log(agenteAtualizado);

    if (!agenteAtualizado) {
      return res.status(404).json({ status: 404, message: "Agente não encontrado" });
    }

    res.status(200).json(agenteAtualizado);
  } catch (error) {
    console.log("Erro referente a: atualizarAgente\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// Atualizar Informações Parciais do Agente
async function atualizarAgenteParcial(req, res) {
  try {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo, id: bodyId } = req.body;

    if (!intPos.test(id)) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: { id: "O ID na URL deve ter um padrão válido" } });
    }

    const erros = {};
    //const camposPermitidos = ["nome", "dataDeIncorporacao", "cargo"];
    //const campos = Object.keys(req.body);

    /*if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      erros.geral = "Campos inválidos enviados. Permitidos: 'nome', 'dataDeIncorporacao' e 'cargo";
    }*/

    if (bodyId) {
      erros.id = "Não é permitido alterar o ID de um agente.";
    }

    if (dataDeIncorporacao && !dataDeIncorporacao.match(formatoData)) {
      erros.dataDeIncorporacao = "A data de incorporação deve ser uma data válida no formato AAAA-MM-DD";
    } else if (new Date(dataDeIncorporacao) > new Date()) {
      erros.dataDeIncorporacao = "A data de incorporação não pode ser uma data futura";
    }

    if (Object.keys(erros).length > 0) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: erros });
    }
    const dadosAtualizados = {};
    if (nome !== undefined) dadosAtualizados.nome = nome;
    if (dataDeIncorporacao !== undefined) dadosAtualizados.dataDeIncorporacao = dataDeIncorporacao;
    if (cargo !== undefined) dadosAtualizados.cargo = cargo;

    if (Object.keys(dadosAtualizados).length === 0) {
      return res.status(404).json({ status: 404, message: "Nenhum campo válido para atualização foi enviado." });
    }

    const agenteAtualizado = await agentesRepository.atualizar(dadosAtualizados, id);

    if (!agenteAtualizado) {
      return res.status(404).json({ status: 404, message: "Agente não encontrado" });
    }

    res.status(200).json(agenteAtualizado);
  } catch (error) {
    console.log("Erro referente a: atualizarAgenteParcial\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// Deletar Agente
async function deletarAgente(req, res) {
  try {
    const { id } = req.params;
    if (!intPos.test(id)) {
      return res.status(404).json({ status: 404, message: "Parâmetros inválidos", error: { id: "O ID deve ter um padrão válido" } });
    }
    const sucesso = await agentesRepository.deletar(id);
    if (sucesso === 0) {
      return res.status(404).json({ status: 404, message: "Agente não encontrado" });
    }
    res.status(204).end();
  } catch (error) {
    console.log("Erro referente a: deletarAgente\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

module.exports = {
  listarAgentes,
  encontrarAgente,
  adicionarAgente,
  atualizarAgente,
  atualizarAgenteParcial,
  deletarAgente,
};
