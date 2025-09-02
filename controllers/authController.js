const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosRepository = require("../repositories/usuariosRepository.js");
const intPos = /^\d+$/; // Regex para aceitar números inteiros positivos
const testeSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Regex para validar senha (mínimo 8 caracteres, pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial)

// ----- Registrar um Usuário no Sistema -----
async function registrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    const erros = {};
    const camposPermitidos = ["nome", "email", "senha"];
    const campos = Object.keys(req.body);

    if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", error: { CamposNãoPermitidos: "Campos extras não são permitidos" } });
    }

    if (!nome || nome.trim() === "") erros.nome = "Nome obrigatório";
    if (!email || email.trim() === "") erros.email = "E-mail obrigatório";
    if (!senha || senha.trim() === "") erros.senha = "Senha obrigatória";
    else if (!testeSenha.test(senha)) erros.senha = "Senha inválida. Use uma combinação de letras maiúsculas e minúsculas, números e caracteres especiais";

    if (Object.values(erros).length > 0) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", error: erros });
    }

    if (await usuariosRepository.encontrar(email)) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", error: { email: "O usuário já está cadastrado" } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(senha, salt);

    const novoUsuario = { nome, email, senha: hashed };
    const usuarioCriado = await usuariosRepository.registrar(novoUsuario);
    return res.status(201).json({ nome: usuarioCriado.nome, email: usuarioCriado.email });
  } catch (error) {
    console.log("Erro referente a: registrarUsuarios\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// ----- Logar um Usuário Cadastrado no Sistema -----
async function logarUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const erros = {};
    const camposPermitidos = ["email", "senha"];
    const campos = Object.keys(req.body);

    if (campos.some((campo) => !camposPermitidos.includes(campo))) {
      erros.geral = "Campos não permitidos enviados";
    }
    if (!email || email.trim() === "") {
      erros.email = "E-mail é obrigatório";
    }
    if (!senha || senha.trim() === "") {
      erros.senha = "Senha é obrigatória";
    }
    if (Object.keys(erros).length > 0) {
      return res.status(400).json({ status: 400, message: "Dados não enviados corretamente", error: erros });
    }

    // Busca usuário
    const usuario = await usuariosRepository.encontrar(email);

    if (!usuario) {
      return res.status(401).json({ status: 401, message: "Credenciais inválidas" });
    }
    // Valida senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        status: 401,
        message: "Credenciais inválidas",
      });
    }

    // Gera token
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    const refreshToken = jwt.sign({ email: usuario.email }, process.env.JWT_REFRESH_SECRET || "refreshsecret", { expiresIn: "7d" });

    res.cookie("access_token", token, { httpOnly: true, secure: false, sameSite: "strict" });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: false, sameSite: "strict" });

    return res.status(200).json({ access_token: token, refresh_token: refreshToken });
  } catch (error) {
    console.error("Erro referente a: logarUsuario\n", error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// ----- Deletar a Conta de um Usuário -----
async function deletarUsuario(req, res) {
  try {
    const { id } = req.params;
    if (!intPos.test(id)) {
      return res.status(400).json({ status: 400, message: "Parâmetros inválidos", error: { id: "O ID deve ter um padrão válido" } });
    }
    const sucesso = await usuariosRepository.deletar(id);

    if (sucesso === 0) {
      return res.status(404).json({ status: 404, message: "Usuário não encontrado" });
    }
    return res.status(204).end();
  } catch (error) {
    console.log("Erro referente a: deletarUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// ----- Deslogar um Usuário Cadastrado no Sistema -----
async function deslogarUsuario(req, res) {
  try {
    res.user = null;
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(204).end();
  } catch (error) {
    console.log("Erro referente a: deslogarUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// ----- Mostrar informações do Usuário Logado -----
async function exibirUsuario(req, res) {
  try {
    const email = req.user.email;
    const usuario = await usuariosRepository.encontrar(email);

    if (!usuario) return res.status(404).json({ status: 404, message: "Usuário não encontrado" });

    return res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (error) {
    console.log("Erro referente a: exibirUsuario\n");
    console.log(error);
    res.status(500).json({ status: 500, message: "Erro interno do servidor" });
  }
}

// ----- Aumentar a duração do Tempo de Login -----
async function refreshToken(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.refresh_token;
    const headerToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = cookieToken || headerToken;

    if (!refreshToken) return res.status(401).json({ message: "Refresh token não fornecido" });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refreshsecret");

    const usuario = await usuariosRepository.encontrar(payload.email);
    if (!usuario) return res.status(401).json({ message: "Usuário inválido" });

    const novoAccessToken = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, process.env.JWT_SECRET || "secret", { expiresIn: "15m" });

    res.cookie("access_token", novoAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.json({ access_token: novoAccessToken });
  } catch (erro) {
    console.error("Erro ao atualizar access token:", erro);
    return res.status(401).json({ message: "Refresh token inválido ou expirado" });
  }
}

// ----- Exports -----
module.exports = {
  registrarUsuario,
  logarUsuario,
  deletarUsuario,
  deslogarUsuario,
  exibirUsuario,
  refreshToken,
};
