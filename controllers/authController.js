const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosRepository = require("../repositories/usuariosRepository.js");
const intPos = /^\d+$/; // Regex para aceitar números inteiros positivos
const testeSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Regex para validar senha (mínimo 8 caracteres, pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial)

// Registrar um Usuário no Sistema
async function registrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    const erros = {};
    const camposPermitidos = ["nome", "email", "senha"];
    const campos = Object.keys(req.body);

    if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ status: 400, mensagem: "Parâmetros inválidos", erros: { geral: "Campos extras não são permitidos" } });
    }

    if (!nome || nome.trim() === "") erros.nome = "Nome obrigatório";
    if (!email || email.trim() === "") erros.email = "E-mail obrigatório";
    if (!senha || senha.trim() === "") erros.senha = "Senha obrigatória";
    else if (!testeSenha.test(senha)) erros.senha = "Senha inválida. Use uma combinação de letras maiúsculas e minúsculas, números e caracteres especiais";

    if (Object.values(erros).length > 0) {
      return res.status(400).json({ status: 400, mensagem: "Parâmetros inválidos", erros: erros });
    }

    if (await usuariosRepository.encontrar(email)) {
      return res.status(400).json({ status: 400, mensagem: "Parâmetros inválidos", erros: { email: "O usuário já está cadastrado" } });
    }

    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = { nome, email, senha: hashed };
    const [usuarioCriado] = await usuariosRepository.registrar(novoUsuario);
    return res.status(201).json(usuarioCriado);
  } catch (error) {
    console.log("Erro referente a: registrarUsuarios\n");
    console.log(error);
    res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}

// Logar um Usuário Cadastrado no Sistema
async function logarUsuario(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await usuariosRepository.encontrar(email);

    if (!usuario) return res.status(401).json({ status: 401, mensagem: "Senha e/ou E-mail inválidos" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) return res.status(401).json({ status: 401, mensagem: "Senha e/ou E-mail inválidos" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ acess_token: token });
  } catch (error) {
    console.log("Erro referente a: logarUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}

// Deletar a Conta de um Usuário
async function deletarUsuario(req, res) {
  try {
    const { id } = req.params;
    if (!intPos.test(id)) {
      return res.status(404).json({ status: 404, mensagem: "Parâmetros inválidos", erros: { id: "O ID deve ter um padrão válido" } });
    }
    const sucesso = await usuariosRepository.deletar(id);
    if (sucesso === 0) {
      return res.status(404).json({ status: 404, mensagem: "Usuário não encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    console.log("Erro referente a: deletarUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}

// Deslogar um Usuário Cadastrado no Sistema
async function deslogarUsuario(req, res) {
  try {
    return res.status(204).send();
  } catch (error) {
    console.log("Erro referente a: deslogarUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, mensagem: "Erro interno do servidor" });
  }
}

module.exports = {
  registrarUsuario,
  logarUsuario,
  deletarUsuario,
  deslogarUsuario,
};
